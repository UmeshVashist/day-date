"use client"

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import {
  Wrench,
  Clock,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Cpu,
  Activity,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface MaintenanceScreenProps {
  title?: string
  message?: string
  estimatedEndTime?: string
  contactInfo?: string
  isPreview?: boolean
  onExitPreview?: () => void
  onStatusChanged?: (isLive: boolean) => void
}

export default function MaintenanceScreen({
  title = "System Maintenance in Progress",
  message = "We are currently upgrading the Day & Date System to deliver enhanced calculation speed, higher precision, and new features.",
  estimatedEndTime = "30-45 Minutes",
  contactInfo = "support@day-date.com",
  isPreview = false,
  onExitPreview,
  onStatusChanged,
}: MaintenanceScreenProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [checking, setChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<string>("Just now")
  const [progress, setProgress] = useState(88)

  // Subtle progress pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 92
        return prev + 1
      })
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // 3D Three.js Interactive Holographic Scene
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 6

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Group for mouse interaction
    const coreGroup = new THREE.Group()
    scene.add(coreGroup)

    // 1. Central Icosahedron Wireframe
    const outerGeo = new THREE.IcosahedronGeometry(1.7, 1)
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
      metalness: 0.8,
    })
    const outerMesh = new THREE.Mesh(outerGeo, outerMat)
    coreGroup.add(outerMesh)

    // 2. Inner Glowing Core
    const innerGeo = new THREE.OctahedronGeometry(1.0, 2)
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0xd946ef,
      emissive: 0x86198f,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    coreGroup.add(innerMesh)

    // 3. Orbital Ring 1 (Cyan)
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.025, 16, 100)
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.8,
    })
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1.rotation.x = Math.PI / 3
    coreGroup.add(ring1)

    // 4. Orbital Ring 2 (Fuchsia)
    const ring2Geo = new THREE.TorusGeometry(2.6, 0.02, 16, 100)
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.7,
    })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.x = -Math.PI / 4
    ring2.rotation.y = Math.PI / 6
    coreGroup.add(ring2)

    // 5. Star / Energy Particle Cloud
    const particleCount = 700
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    const color1 = new THREE.Color("#00f0ff")
    const color2 = new THREE.Color("#f43f5e")

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const radius = 3.2 + Math.random() * 4.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      particlePositions[i3 + 2] = radius * Math.cos(phi)

      const mixed = color1.clone().lerp(color2, Math.random())
      particleColors[i3] = mixed.r
      particleColors[i3 + 1] = mixed.g
      particleColors[i3 + 2] = mixed.b
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x00f0ff, 3, 20)
    pointLight1.position.set(4, 3, 4)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xf43f5e, 3, 20)
    pointLight2.position.set(-4, -3, 3)
    scene.add(pointLight2)

    // Mouse Tracking for Parallax
    let targetX = 0
    let targetY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2
      const windowHalfY = window.innerHeight / 2
      targetX = (e.clientX - windowHalfX) * 0.0008
      targetY = (e.clientY - windowHalfY) * 0.0008
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Resize
    const handleResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    // Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Smooth inertia rotation
      coreGroup.rotation.y += 0.008
      coreGroup.rotation.x += 0.004

      // Parallax easing
      coreGroup.rotation.y += (targetX - coreGroup.rotation.y) * 0.05
      coreGroup.rotation.x += (targetY - coreGroup.rotation.x) * 0.05

      // Internal rings spin opposite
      ring1.rotation.z += 0.012
      ring2.rotation.z -= 0.015

      // Gentle pulsing of inner mesh
      const scale = 1 + Math.sin(elapsed * 2.5) * 0.08
      innerMesh.scale.set(scale, scale, scale)

      // Particles slow drift
      particles.rotation.y = elapsed * 0.02
      particles.rotation.x = elapsed * 0.01

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animId)
      outerGeo.dispose()
      outerMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      ring1Geo.dispose()
      ring1Mat.dispose()
      ring2Geo.dispose()
      ring2Mat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Check if owner turned site back ON
  const handleCheckStatus = async () => {
    setChecking(true)
    try {
      const res = await fetch("/api/maintenance", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setLastChecked(new Date().toLocaleTimeString())
        if (!data.isMaintenance) {
          toast.success("Site is now LIVE! Redirecting...")
          if (onStatusChanged) {
            onStatusChanged(true)
          } else {
            window.location.reload()
          }
          return
        } else {
          toast.info("System is still in maintenance. We'll be back shortly!")
        }
      }
    } catch {
      toast.error("Could not reach server. Please try again.")
    } finally {
      setChecking(false)
    }
  }


  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between text-white overflow-hidden bg-slate-950 select-none">
      {/* 3D Three.js Background Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 pointer-events-auto"
        aria-hidden="true"
      />

      {/* Radial Glow Underlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[650px] h-[650px] bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Preview Bar (if viewed from admin dashboard) */}
      {isPreview && (
        <div className="relative z-20 w-full bg-amber-500/20 backdrop-blur-md border-b border-amber-500/40 py-2.5 px-4 flex items-center justify-between text-amber-200 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Admin Preview Mode &mdash; Regular visitors see this screen when site is OFF</span>
          </div>
          {onExitPreview && (
            <Button
              size="sm"
              variant="outline"
              onClick={onExitPreview}
              className="h-7 text-xs bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/40 text-amber-100"
            >
              Exit Preview
            </Button>
          )}
        </div>
      )}

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            <div className="w-full h-full bg-[#1e2235] rounded-[11px] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-spin" style={{ animationDuration: "10s" }} />
            </div>
          </div>
          <div>
            <span className="font-black text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400">
              Day & Date MS
            </span>
            <div className="text-[10px] text-cyan-300/70 font-mono tracking-widest uppercase">
              Core Engine 2.0
            </div>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold">
            Upgrading Matrix
          </span>
        </div>
      </header>

      {/* Main Glassmorphic Card Hero */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center text-center">
        {/* Futuristic Icon Badge */}
        <div className="mb-6 relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-70 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
          <div className="relative px-5 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 flex items-center gap-3">
            <Wrench className="w-5 h-5 text-cyan-400 animate-bounce" style={{ animationDuration: "2s" }} />
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-200">
              Scheduled System Enhancement
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-2xl bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-md">
          {title}
        </h1>

        {/* Message */}
        <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 max-w-xl leading-relaxed font-light">
          {message}
        </p>

        {/* Interactive Diagnostics Matrix Box */}
        <div className="mt-8 w-full max-w-xl p-5 sm:p-6 rounded-2xl bg-slate-900/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> System Diagnostics
            </span>
            <span className="text-cyan-400 font-semibold">{progress}% Complete</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-400 rounded-full transition-all duration-700 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Micro Status Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 text-left font-mono">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Core Calcs</div>
                <div className="text-xs text-white font-medium">Upgrading</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Est. Finish</div>
                <div className="text-xs text-white font-medium">{estimatedEndTime}</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-fuchsia-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Security</div>
                <div className="text-xs text-white font-medium">100% Safe</div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400 font-mono">
              Last status ping: <span className="text-slate-200">{lastChecked}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheckStatus}
                disabled={checking}
                className="bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 font-medium text-xs transition-all flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin text-cyan-400" : ""}`} />
                {checking ? "Checking..." : "Check Status"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer & Owner Unlock Link */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono border-t border-white/5">
        <div>
          &copy; {new Date().getFullYear()} Day & Date System. All calculations secured.
        </div>

        <div className="flex items-center gap-4">
          {contactInfo && (
            <span className="text-slate-400 hover:text-cyan-400 transition-colors">
              Contact: {contactInfo}
            </span>
          )}
        </div>
      </footer>
    </div>
  )
}
