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

// Temporary file location for Next.js serverless execution
const TMP_FILE_PATH = path.join(process.platform === "win32" ? process.cwd() : "/tmp", "daydate_maintenance.json")

// Global in-memory fallback for hot serverless instances
declare global {
  // eslint-disable-next-line no-var
  var __daydate_maintenance_state: MaintenanceConfig | undefined
}

/**
 * Read configuration from Upstash / Vercel KV if available,
 * otherwise fall back to local file and memory cache.
 */
async function getStoredConfig(): Promise<{ config: MaintenanceConfig; source: string }> {
  // 1. Try Upstash Redis REST / Vercel KV REST
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/get/daydate_maintenance_config`, {
        headers: {
          Authorization: `Bearer ${redisToken}`,
        },
        cache: "no-store",
      })
      if (res.ok) {
        const data = await res.json()
        if (data && data.result) {
          const parsed = typeof data.result === "string" ? JSON.parse(data.result) : data.result
          return {
            config: { ...DEFAULT_MAINTENANCE_CONFIG, ...parsed },
            source: "redis",
          }
        }
      }
    } catch (err) {
      console.warn("Failed reading from Redis KV, falling back to local file:", err)
    }
  }

  // 2. Try in-memory cache
  if (globalThis.__daydate_maintenance_state) {
    return {
      config: globalThis.__daydate_maintenance_state,
      source: "memory",
    }
  }

  // 3. Try filesystem (/tmp or project folder)
  try {
    if (fs.existsSync(TMP_FILE_PATH)) {
      const content = fs.readFileSync(TMP_FILE_PATH, "utf-8")
      const parsed = JSON.parse(content)
      const config = { ...DEFAULT_MAINTENANCE_CONFIG, ...parsed }
      globalThis.__daydate_maintenance_state = config
      return { config, source: "file" }
    }
  } catch (err) {
    console.warn("Failed reading maintenance file:", err)
  }

  // 4. Default state
  return { config: DEFAULT_MAINTENANCE_CONFIG, source: "default" }
}

/**
 * Save configuration to Redis, file, and in-memory cache.
 */
async function saveConfig(config: MaintenanceConfig): Promise<{ success: boolean; redisSaved: boolean }> {
  let redisSaved = false

  // 1. Upstash Redis / Vercel KV REST
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/set/daydate_maintenance_config`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(config)),
      })
      if (res.ok) {
        redisSaved = true
      }
    } catch (err) {
      console.warn("Failed writing to Redis KV:", err)
    }
  }

  // 2. Memory
  globalThis.__daydate_maintenance_state = config

  // 3. Filesystem
  try {
    fs.writeFileSync(TMP_FILE_PATH, JSON.stringify(config, null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed writing maintenance file to disk:", err)
  }

  return { success: true, redisSaved }
}

export async function GET() {
  const { config, source } = await getStoredConfig()

  return NextResponse.json(
    {
      ...config,
      _source: source,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
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
    } = body

    const expectedPasscode = process.env.ADMIN_SECRET_KEY || ADMIN_DEFAULT_PASSCODE

    // Check passcode
    if (!passcode || passcode.trim() !== expectedPasscode.trim()) {
      return NextResponse.json(
        { error: "Invalid Admin Passcode" },
        { status: 401 }
      )
    }

    // If only verifying passcode
    if (validateOnly) {
      const response = NextResponse.json({ success: true, authorized: true })
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

    const { redisSaved } = await saveConfig(updatedConfig)

    const response = NextResponse.json({
      success: true,
      config: updatedConfig,
      redisSaved,
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
