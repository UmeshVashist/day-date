"use client"

import React, { useState, useEffect } from "react"
import {
  Power,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  ExternalLink,
  Save,
  RefreshCw,
  Sparkles,
  Server,
  Clock,
  MessageSquare,
  Mail,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import MaintenanceScreen from "@/components/maintenance-screen"
import {
  DEFAULT_MAINTENANCE_CONFIG,
  MaintenanceConfig,
  ADMIN_DEFAULT_PASSCODE,
  ADMIN_COOKIE_NAME,
} from "@/lib/maintenance-config"
import Link from "next/link"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Maintenance form state
  const [config, setConfig] = useState<MaintenanceConfig>(DEFAULT_MAINTENANCE_CONFIG)
  const [storageSource, setStorageSource] = useState<string>("local")

  // Check existing session
  useEffect(() => {
    const isAuth =
      localStorage.getItem(ADMIN_COOKIE_NAME) === "true" ||
      document.cookie.includes(`${ADMIN_COOKIE_NAME}=true`)

    if (isAuth) {
      setIsAuthenticated(true)
      loadConfig()
    } else {
      setLoading(false)
    }
  }, [])

  // Load configuration from API
  const loadConfig = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/maintenance", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      })
      if (res.ok) {
        const data = await res.json()
        setConfig(data)
        if (data._source) {
          setStorageSource(data._source)
        }
      }
    } catch {
      toast.error("Failed to load maintenance status")
    } finally {
      setLoading(false)
    }
  }

  // Handle Login / Unlock
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = passcode.trim()
    if (!code) {
      toast.error("Please enter the admin passcode")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: code, validateOnly: true }),
      })

      if (res.ok) {
        localStorage.setItem(ADMIN_COOKIE_NAME, "true")
        document.cookie = `${ADMIN_COOKIE_NAME}=true; path=/; max-age=2592000; SameSite=Lax`
        setIsAuthenticated(true)
        toast.success("Owner access verified!")
        await loadConfig()
      } else {
        toast.error("Incorrect passcode. Access denied.")
      }
    } catch {
      toast.error("Network error while verifying passcode.")
    } finally {
      setSaving(false)
    }
  }

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem(ADMIN_COOKIE_NAME)
    document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; max-age=0;`
    setIsAuthenticated(false)
    setPasscode("")
    toast.info("Logged out from admin session.")
  }

  // Toggle Website Status (ON = Live / Working for users, OFF = Maintenance screen)
  const handleToggleStatus = async () => {
    // Current isMaintenance: true means website is OFF.
    // If we toggle:
    // If website is LIVE (isMaintenance = false), clicking turns it OFF (isMaintenance = true).
    // If website is OFF (isMaintenance = true), clicking turns it ON (isMaintenance = false).
    const newMaintenanceState = !config.isMaintenance

    setToggling(true)
    try {
      const activePasscode = passcode.trim() || ADMIN_DEFAULT_PASSCODE

      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: activePasscode,
          isMaintenance: newMaintenanceState,
          title: config.title,
          message: config.message,
          estimatedEndTime: config.estimatedEndTime,
          contactInfo: config.contactInfo,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setConfig(data.config)
        if (newMaintenanceState) {
          toast.warning("Website turned OFF! Maintenance screen is now visible to all visitors.")
        } else {
          toast.success("Website is now LIVE! All users can access the website normally.")
        }
      } else {
        toast.error("Failed to update status. Please verify your passcode.")
      }
    } catch {
      toast.error("Error connecting to maintenance API.")
    } finally {
      setToggling(false)
    }
  }

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const activePasscode = passcode.trim() || ADMIN_DEFAULT_PASSCODE

      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: activePasscode,
          isMaintenance: config.isMaintenance,
          title: config.title,
          message: config.message,
          estimatedEndTime: config.estimatedEndTime,
          contactInfo: config.contactInfo,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setConfig(data.config)
        toast.success("Maintenance announcement settings saved successfully!")
      } else {
        toast.error("Failed to save settings.")
      }
    } catch {
      toast.error("Error saving settings.")
    } finally {
      setSaving(false)
    }
  }

  // If Preview is opened
  if (showPreview) {
    return (
      <MaintenanceScreen
        title={config.title}
        message={config.message}
        estimatedEndTime={config.estimatedEndTime}
        contactInfo={config.contactInfo}
        isPreview={true}
        onExitPreview={() => setShowPreview(false)}
      />
    )
  }

  // Login Screen if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 text-white relative overflow-hidden bg-slate-950">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-cyan-400 p-[1px] shadow-[0_0_25px_rgba(0,229,255,0.4)] mb-4">
              <div className="w-full h-full bg-[#1e2235] rounded-[23px] flex items-center justify-center">
                <Lock className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400">
              Admin & Owner Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Manage website live status and maintenance screen for{" "}
              <span className="text-cyan-300 font-mono">day-date.vercel.app</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-1.5">
                Owner Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="pl-9 bg-slate-950/70 border-white/15 text-white placeholder:text-slate-500 focus:border-cyan-400"
                  autoFocus
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full h-11 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
            >
              {saving ? "Authenticating..." : "Enter Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] text-slate-400 font-mono">
              Protected Administrator Area &bull; Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Master Dashboard Screen
  return (
    <div className="min-h-screen w-full text-white bg-slate-950 flex flex-col justify-between relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Decorative Gradients */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/75 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <div className="w-full h-full bg-[#1e2235] rounded-[11px] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400">
                  Day & Date MS
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ADMIN / OWNER
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Control Center: <code className="text-cyan-400">/admin12</code>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-medium text-slate-200 transition-all flex items-center gap-1.5"
              title="Open live site with admin bypass"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1">
        {/* HERO: ON / OFF MASTER SWITCH */}
        <section className="mb-8">
          <div
            className={`relative rounded-3xl p-6 sm:p-10 border transition-all duration-500 overflow-hidden shadow-2xl ${
              config.isMaintenance
                ? "bg-gradient-to-br from-rose-950/60 via-slate-900/90 to-amber-950/40 border-rose-500/40 shadow-rose-900/20"
                : "bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-cyan-950/40 border-emerald-500/40 shadow-emerald-900/20"
            }`}
          >
            {/* Ambient Lighting in Card */}
            <div
              className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${
                config.isMaintenance ? "bg-rose-500/15" : "bg-emerald-500/15"
              }`}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Column: Detailed Status explanation */}
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${
                      config.isMaintenance
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full animate-pulse ${
                        config.isMaintenance ? "bg-rose-400" : "bg-emerald-400"
                      }`}
                    />
                    {config.isMaintenance ? "Website Status: OFF (Maintenance Mode)" : "Website Status: ON (Live & Working)"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
                  {config.isMaintenance
                    ? "Maintenance Mode is ACTIVE"
                    : "Website is LIVE for All Users"}
                </h2>

                <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-light">
                  {config.isMaintenance ? (
                    <>
                      All visitors going to{" "}
                      <code className="text-cyan-300 font-mono font-semibold">https://day-date.vercel.app</code>{" "}
                      will see <strong className="text-rose-300">ONLY the Modern 3D Maintenance Screen</strong>.
                      The live website and calculators are completely hidden.
                    </>
                  ) : (
                    <>
                      All visitors going to{" "}
                      <code className="text-cyan-300 font-mono font-semibold">https://day-date.vercel.app</code>{" "}
                      can access all calculators (Day Count, Date Fine, Time Count, etc.) normally with zero restrictions.
                    </>
                  )}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Server className="w-3.5 h-3.5 text-cyan-400" /> Storage Engine:{" "}
                    <strong className="text-slate-200 capitalize">{storageSource}</strong>
                  </span>
                  <span>&bull;</span>
                  <span>Updated: {new Date(config.updatedAt).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Right Column: Giant Clickable Toggle Button */}
              <div className="flex flex-col items-center sm:items-end justify-center">
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  disabled={toggling}
                  className={`group relative flex items-center gap-4 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl border-2 transition-all duration-300 shadow-xl cursor-pointer ${
                    config.isMaintenance
                      ? "bg-slate-900/90 border-rose-500 hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                      : "bg-slate-900/90 border-emerald-500 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  }`}
                  title="Click to toggle website status"
                >
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                      config.isMaintenance
                        ? "bg-rose-500/20 text-rose-400 group-hover:scale-110"
                        : "bg-emerald-500/20 text-emerald-400 group-hover:scale-110"
                    }`}
                  >
                    <Power className={`w-7 h-7 ${toggling ? "animate-spin" : ""}`} />
                  </div>

                  <div className="text-left">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                      Master Switch
                    </div>
                    <div
                      className={`text-xl sm:text-2xl font-black ${
                        config.isMaintenance ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {toggling ? "Switching..." : config.isMaintenance ? "TURN ON (Go Live)" : "TURN OFF (Maintenance)"}
                    </div>
                  </div>
                </button>

                <div className="mt-3 text-[11px] text-slate-400 font-mono text-center sm:text-right">
                  {config.isMaintenance
                    ? "Click above to make website LIVE again"
                    : "Click above to activate Maintenance Mode"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECOND ROW: QUICK ACTIONS & PREVIEWS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Card 1: Live 3D Preview */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
                <Eye className="w-4 h-4" />
                <span>3D Maintenance Screen</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test and inspect the modern 3D Three.js maintenance experience as regular users will see it.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="mt-4 w-full bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold"
            >
              Open 3D Live Preview
            </Button>
          </div>

          {/* Card 2: Full Lock Mode */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-fuchsia-400 font-semibold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Full Lock Protection</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When turned OFF, the entire site is 100% blocked and shows only the 3D screen. No admin banners or paths are leaked.
              </p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="mt-4 w-full inline-flex items-center justify-center h-8 rounded-md bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-500/20 text-xs font-semibold"
            >
              Open Site (Current View)
            </Link>
          </div>

          {/* Card 3: Refresh Sync */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                <RefreshCw className="w-4 h-4" />
                <span>Sync & Reload State</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fetch the latest server state or check global synchronization across Vercel serverless nodes.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadConfig}
              disabled={loading}
              className="mt-4 w-full bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Status
            </Button>
          </div>
        </section>

        {/* THIRD ROW: CUSTOMIZE MAINTENANCE MESSAGE & DETAILS */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Maintenance Screen Customization</h3>
                <p className="text-xs text-slate-400">
                  Update the text and estimated completion time displayed on the 3D maintenance screen.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-1.5">
                  Screen Headline
                </label>
                <Input
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="System Maintenance in Progress"
                  className="bg-slate-950 border-white/15 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-1.5">
                  Estimated Downtime / Return Time
                </label>
                <Input
                  value={config.estimatedEndTime}
                  onChange={(e) => setConfig({ ...config, estimatedEndTime: e.target.value })}
                  placeholder="e.g. 30-45 Minutes or 11:30 PM"
                  className="bg-slate-950 border-white/15 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-1.5">
                Notice Description Message
              </label>
              <Textarea
                rows={3}
                value={config.message}
                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                placeholder="Describe why the system is under maintenance..."
                className="bg-slate-950 border-white/15 text-white leading-relaxed resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-1.5">
                Support / Contact Info
              </label>
              <Input
                value={config.contactInfo}
                onChange={(e) => setConfig({ ...config, contactInfo: e.target.value })}
                placeholder="e.g. support@day-date.com or @telegram_handle"
                className="bg-slate-950 border-white/15 text-white"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-semibold text-xs px-6 shadow-[0_0_20px_rgba(0,229,255,0.25)] flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving Changes..." : "Save Announcement Details"}
              </Button>
            </div>
          </form>
        </section>

        {/* INFO NOTICE: GLOBAL VERCEL PERSISTENCE */}
        <section className="mt-8 p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 font-mono">
          <div className="flex items-start gap-3">
            <Server className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-cyan-300 font-bold mb-1">
                Zero-Config Ready & Multi-Region Cloud Sync:
              </div>
              <p className="text-slate-400 leading-relaxed">
                Maintenance mode is fully operational right now via built-in server storage & cookies.
                To sync across all international Vercel edge nodes instantly, you can optionally connect a free
                Upstash Redis instance by adding <code className="text-cyan-300">UPSTASH_REDIS_REST_URL</code> and{" "}
                <code className="text-cyan-300">UPSTASH_REDIS_REST_TOKEN</code> in your Vercel Project Environment Variables.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 text-center text-xs text-slate-500 font-mono border-t border-white/5">
        Day & Date System &bull; Owner Administration Dashboard &bull; All changes apply live to <span className="text-slate-400">day-date.vercel.app</span>
      </footer>
    </div>
  )
}
