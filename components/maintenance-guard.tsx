"use client"

import React, { useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import MaintenanceScreen from "@/components/maintenance-screen"
import {
  DEFAULT_MAINTENANCE_CONFIG,
  MaintenanceConfig,
  ADMIN_COOKIE_NAME,
} from "@/lib/maintenance-config"
import { ShieldAlert, ArrowRight, EyeOff } from "lucide-react"
import Link from "next/link"

interface MaintenanceGuardProps {
  children: React.ReactNode
}

export default function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const pathname = usePathname()
  const [config, setConfig] = useState<MaintenanceConfig>(DEFAULT_MAINTENANCE_CONFIG)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check admin authorization locally
  const checkAdminAuth = useCallback(() => {
    if (typeof window === "undefined") return false
    const inLocal = localStorage.getItem(ADMIN_COOKIE_NAME) === "true"
    const inCookie = document.cookie.includes(`${ADMIN_COOKIE_NAME}=true`)
    return inLocal || inCookie
  }, [])

  // Fetch status from API
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/maintenance", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      if (res.ok) {
        const data = await res.json()
        setConfig(data)
      }
    } catch (err) {
      console.warn("Could not fetch maintenance status:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setIsAdmin(checkAdminAuth())
    fetchStatus()

    // Poll periodically every 25 seconds or on window focus
    const interval = setInterval(fetchStatus, 25000)
    const handleFocus = () => {
      setIsAdmin(checkAdminAuth())
      fetchStatus()
    }
    window.addEventListener("focus", handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [checkAdminAuth, fetchStatus])

  // Admin routes like /admin12 are NEVER blocked
  if (pathname?.startsWith("/admin12")) {
    return <>{children}</>
  }

  // Still checking initial state on first page load
  if (loading && !isAdmin) {
    // Return children with opacity to prevent flash of content, or render smoothly
    return (
      <div className="min-h-screen">
        {children}
      </div>
    )
  }

  // If Maintenance is Active and User is NOT Admin:
  // Show 3D Maintenance Screen to all regular users
  if (config.isMaintenance && !isAdmin) {
    return (
      <MaintenanceScreen
        title={config.title}
        message={config.message}
        estimatedEndTime={config.estimatedEndTime}
        contactInfo={config.contactInfo}
        onStatusChanged={(isLive) => {
          if (isLive) {
            setConfig((prev) => ({ ...prev, isMaintenance: false }))
          }
        }}
      />
    )
  }

  // If User is Admin and Maintenance is Active:
  // Allow admin to use site, but show sleek floating badge warning that visitors see maintenance mode
  return (
    <>
      {config.isMaintenance && isAdmin && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-full bg-rose-950/90 border border-rose-500/50 backdrop-blur-xl shadow-2xl flex items-center gap-3 text-xs text-rose-200 animate-in fade-in slide-in-from-top-4">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
          <span>
            <strong>Admin Bypass Active:</strong> Website is currently <strong>OFF</strong> for external visitors.
          </span>
          <Link
            href="/admin12"
            className="flex items-center gap-1 font-semibold text-rose-300 hover:text-white underline underline-offset-2 ml-1"
          >
            <span>Open Admin Panel</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
      {children}
    </>
  )
}
