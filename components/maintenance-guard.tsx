"use client"

import React, { useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import MaintenanceScreen from "@/components/maintenance-screen"
import {
  DEFAULT_MAINTENANCE_CONFIG,
  MaintenanceConfig,
} from "@/lib/maintenance-config"

interface MaintenanceGuardProps {
  children: React.ReactNode
}

export default function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const pathname = usePathname()
  const [config, setConfig] = useState<MaintenanceConfig>(DEFAULT_MAINTENANCE_CONFIG)
  const [loading, setLoading] = useState(true)

  // Fetch status from API
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/maintenance?_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
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
    fetchStatus()

    // Poll periodically every 20 seconds or when user focuses window
    const interval = setInterval(fetchStatus, 20000)
    const handleFocus = () => {
      fetchStatus()
    }
    window.addEventListener("focus", handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [fetchStatus])

  // Admin routes like /admin12 are NEVER blocked so the owner can always manage the site
  if (pathname?.startsWith("/admin12")) {
    return <>{children}</>
  }

  // If website is turned OFF (Maintenance is Active):
  // Show ONLY the modern 3D Maintenance Screen!
  // Absolutely no live calculator UI or admin bypass banners are shown.
  if (config.isMaintenance) {
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

  // If website is LIVE (Maintenance is OFF):
  return <>{children}</>
}
