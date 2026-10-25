import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import {
  DEFAULT_MAINTENANCE_CONFIG,
  MaintenanceConfig,
  ADMIN_DEFAULT_PASSCODE,
  ADMIN_COOKIE_NAME,
  MAINTENANCE_COOKIE_NAME,
} from "@/lib/maintenance-config"

// Next.js App Router dynamic configuration:
// Disables ALL caching so state updates instantly across all Vercel edge instances and browsers
export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"

const REDIS_KEY = "daydate_maintenance_config"

// Temporary file location for local development or fallback
const TMP_FILE_PATH = path.join(
  process.platform === "win32" ? process.cwd() : "/tmp",
  "daydate_maintenance.json"
)

// In-memory fallback
declare global {
  // eslint-disable-next-line no-var
  var __daydate_maintenance_state: MaintenanceConfig | undefined
  // eslint-disable-next-line no-var
  var __daydate_custom_redis: { url: string; token: string } | undefined
}

/**
 * Clean & extract Redis credentials from environment or runtime
 */
function getRedisCredentials() {
  const custom = globalThis.__daydate_custom_redis

  const rawUrl =
    custom?.url ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_URL ||
    ""

  const rawToken =
    custom?.token ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_TOKEN ||
    ""

  let url = rawUrl.trim().replace(/^["']|["']$/g, "")
  const token = rawToken.trim().replace(/^["']|["']$/g, "")

  // Ensure url has https:// protocol
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, "")

  return { url, token, hasCredentials: Boolean(url && token) }
}

interface StoredConfigResult {
  config: MaintenanceConfig
  source: "redis" | "memory" | "file" | "default"
  redisConnected: boolean
  redisError?: string
}

/**
 * Read configuration from Upstash Redis REST
 */
async function getStoredConfig(): Promise<StoredConfigResult> {
  const { url: redisUrl, token: redisToken, hasCredentials } = getRedisCredentials()

  if (hasCredentials) {
    try {
      // Upstash REST API command endpoint: POST / with ["GET", key]
      const res = await fetch(redisUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["GET", REDIS_KEY]),
        cache: "no-store",
      })

      if (res.ok) {
        const data = await res.json()
        if (data && data.result !== null && data.result !== undefined) {
          const parsed = typeof data.result === "string" ? JSON.parse(data.result) : data.result
          return {
            config: { ...DEFAULT_MAINTENANCE_CONFIG, ...parsed },
            source: "redis",
            redisConnected: true,
          }
        }
        // If key doesn't exist yet in Redis, Redis connection was successful!
        return {
          config: DEFAULT_MAINTENANCE_CONFIG,
          source: "redis",
          redisConnected: true,
        }
      } else {
        const errorText = await res.text()
        console.warn(`Upstash Redis error (${res.status}):`, errorText)
        return {
          config: globalThis.__daydate_maintenance_state || DEFAULT_MAINTENANCE_CONFIG,
          source: "default",
          redisConnected: false,
          redisError: `HTTP ${res.status}: ${errorText.slice(0, 120)}`,
        }
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.warn("Failed fetching from Upstash Redis:", errMsg)
      return {
        config: globalThis.__daydate_maintenance_state || DEFAULT_MAINTENANCE_CONFIG,
        source: "default",
        redisConnected: false,
        redisError: errMsg,
      }
    }
  }

  // Fallback 1: Memory
  if (globalThis.__daydate_maintenance_state) {
    return {
      config: globalThis.__daydate_maintenance_state,
      source: "memory",
      redisConnected: false,
    }
  }

  // Fallback 2: Filesystem
  try {
    if (fs.existsSync(TMP_FILE_PATH)) {
      const content = fs.readFileSync(TMP_FILE_PATH, "utf-8")
      const parsed = JSON.parse(content)
      const config = { ...DEFAULT_MAINTENANCE_CONFIG, ...parsed }
      globalThis.__daydate_maintenance_state = config
      return { config, source: "file", redisConnected: false }
    }
  } catch (err) {
    console.warn("Failed reading maintenance file:", err)
  }

  // Fallback 3: Default
  return {
    config: DEFAULT_MAINTENANCE_CONFIG,
    source: "default",
    redisConnected: false,
  }
}

/**
 * Save configuration to Redis & local cache
 */
async function saveConfig(config: MaintenanceConfig): Promise<{ success: boolean; redisSaved: boolean; redisError?: string }> {
  const { url: redisUrl, token: redisToken, hasCredentials } = getRedisCredentials()
  let redisSaved = false
  let redisError: string | undefined

  if (hasCredentials) {
    try {
      // Upstash REST API command endpoint: POST / with ["SET", key, value]
      const res = await fetch(redisUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["SET", REDIS_KEY, JSON.stringify(config)]),
        cache: "no-store",
      })

      if (res.ok) {
        const data = await res.json()
        if (data && (data.result === "OK" || data.result)) {
          redisSaved = true
        }
      } else {
        const errorText = await res.text()
        redisError = `HTTP ${res.status}: ${errorText.slice(0, 100)}`
        console.error("Upstash Redis SET failed:", redisError)
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      redisError = errMsg
      console.error("Upstash Redis SET exception:", errMsg)
    }
  }

  // Memory
  globalThis.__daydate_maintenance_state = config

  // Filesystem
  try {
    fs.writeFileSync(TMP_FILE_PATH, JSON.stringify(config, null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed writing local file:", err)
  }

  return { success: true, redisSaved, redisError }
}

export async function GET() {
  const { config, source, redisConnected, redisError } = await getStoredConfig()
  const { hasCredentials, url } = getRedisCredentials()

  return NextResponse.json(
    {
      ...config,
      _source: source,
      _redisConnected: redisConnected,
      _hasCredentials: hasCredentials,
      _redisEndpoint: url ? url.replace(/^https?:\/\//, "").slice(0, 25) + "..." : null,
      _redisError: redisError || null,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      isMaintenance,
      title,
      message,
      estimatedEndTime,
      contactInfo,
      passcode,
      validateOnly,
      customRedisUrl,
      customRedisToken,
    } = body

    const expectedPasscode = process.env.ADMIN_SECRET_KEY || ADMIN_DEFAULT_PASSCODE

    // Check passcode
    if (!passcode || passcode.trim() !== expectedPasscode.trim()) {
      return NextResponse.json(
        { error: "Invalid Admin Passcode" },
        { status: 401 }
      )
    }

    // If setting custom Redis credentials from admin panel
    if (customRedisUrl && customRedisToken) {
      globalThis.__daydate_custom_redis = {
        url: String(customRedisUrl).trim(),
        token: String(customRedisToken).trim(),
      }
    }

    // If only verifying passcode / testing Redis
    if (validateOnly) {
      const { redisConnected, redisError } = await getStoredConfig()
      const response = NextResponse.json({
        success: true,
        authorized: true,
        redisConnected,
        redisError: redisError || null,
      })
      response.cookies.set(ADMIN_COOKIE_NAME, "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      })
      return response
    }

    const { config: currentConfig } = await getStoredConfig()

    const updatedConfig: MaintenanceConfig = {
      ...currentConfig,
      isMaintenance: typeof isMaintenance === "boolean" ? isMaintenance : currentConfig.isMaintenance,
      title: typeof title === "string" && title.trim() ? title.trim() : currentConfig.title,
      message: typeof message === "string" && message.trim() ? message.trim() : currentConfig.message,
      estimatedEndTime: typeof estimatedEndTime === "string" ? estimatedEndTime.trim() : currentConfig.estimatedEndTime,
      contactInfo: typeof contactInfo === "string" ? contactInfo.trim() : currentConfig.contactInfo,
      updatedAt: new Date().toISOString(),
      updatedBy: "Owner via /admin12",
    }

    const { redisSaved, redisError } = await saveConfig(updatedConfig)

    const response = NextResponse.json({
      success: true,
      config: updatedConfig,
      redisSaved,
      redisError: redisError || null,
      message: updatedConfig.isMaintenance
        ? "Maintenance Mode ACTIVATED. Regular visitors will see the 3D Maintenance Screen."
        : "Website is now LIVE and working for all users.",
    })

    // Set cookie on client response
    response.cookies.set(MAINTENANCE_COOKIE_NAME, updatedConfig.isMaintenance ? "1" : "0", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })

    response.cookies.set(ADMIN_COOKIE_NAME, "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("Maintenance API error:", error)
    return NextResponse.json(
      { error: "Failed to update maintenance settings" },
      { status: 500 }
    )
  }
}
