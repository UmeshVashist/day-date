"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  title = "This site is under maintenance. Soon back.",
  isPreview = false,
  onExitPreview,
}: MaintenanceScreenProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  // 3D Three.js Interactive Scene matching App Launcher Maintenance Screen
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 7.5

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Master Group for mouse interaction
    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    // 1. Central Golden Wireframe Sphere / Polyhedron
    const innerGeo = new THREE.IcosahedronGeometry(1.45, 2)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Golden amber
      wireframe: true,
      transparent: true,
      opacity: 0.88,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    masterGroup.add(innerMesh)

    // 2. Outer Cyan/Sky-Blue Wireframe Diamond / Octahedron
    const outerGeo = new THREE.OctahedronGeometry(2.35, 0)
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Sky blue / cyan
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    })
    const outerMesh = new THREE.Mesh(outerGeo, outerMat)
    masterGroup.add(outerMesh)

    // 3. Tilted Golden Elliptical Ring
    const goldRingGeo = new THREE.TorusGeometry(3.0, 0.032, 16, 120)
    const goldRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24, // Bright golden amber
      transparent: true,
      opacity: 0.9,
    })
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat)
    goldRing.rotation.x = Math.PI / 2.7
    goldRing.rotation.y = -Math.PI / 7.5
    masterGroup.add(goldRing)

    // 4. Outer Emerald Green Circular Ring
    const greenRingGeo = new THREE.TorusGeometry(4.1, 0.022, 16, 140)
    const greenRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Emerald green
      transparent: true,
      opacity: 0.8,
    })
    const greenRing = new THREE.Mesh(greenRingGeo, greenRingMat)
    greenRing.rotation.x = Math.PI / 14
    masterGroup.add(greenRing)

    // 5. Diagonal Cyan/Blue Laser Beam (cutting across from top-left to bottom-right)
    const beamGroup = new THREE.Group()
    const beamGeo = new THREE.CylinderGeometry(0.028, 0.028, 16, 16)
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9, // Cyan-blue laser
      transparent: true,
      opacity: 0.95,
    })
    const beamMesh = new THREE.Mesh(beamGeo, beamMat)

    // Outer soft glow sleeve for laser beam
    const glowBeamGeo = new THREE.CylinderGeometry(0.065, 0.065, 16, 16)
    const glowBeamMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7, // Deep cyan glow
      transparent: true,
      opacity: 0.35,
    })
    const glowBeamMesh = new THREE.Mesh(glowBeamGeo, glowBeamMat)

    beamGroup.add(glowBeamMesh)
    beamGroup.add(beamMesh)

    // Diagonal tilt across the center
    beamGroup.rotation.z = -Math.PI / 3.7
    beamGroup.rotation.x = Math.PI / 10
    masterGroup.add(beamGroup)

    // 6. Floating Star Particles (Squares / Diamonds in Space)
    const particleCount = 280
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    const colorsPalette = [
      new THREE.Color("#f59e0b"), // Amber
      new THREE.Color("#38bdf8"), // Cyan
      new THREE.Color("#10b981"), // Green
      new THREE.Color("#fbbf24"), // Gold
    ]

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // Distributed widely around screen
      particlePositions[i3] = (Math.random() - 0.5) * 16
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 11
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 8

      const chosenColor = colorsPalette[Math.floor(Math.random() * colorsPalette.length)]
      particleColors[i3] = chosenColor.r
      particleColors[i3 + 1] = chosenColor.g
      particleColors[i3 + 2] = chosenColor.b
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    })
    const particlePoints = new THREE.Points(particleGeo, particleMat)
    scene.add(particlePoints)

    // Mouse Tracking for Parallax
    let targetX = 0
    let targetY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2
      const windowHalfY = window.innerHeight / 2
      targetX = (e.clientX - windowHalfX) * 0.0006
      targetY = (e.clientY - windowHalfY) * 0.0006
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

      // Slow smooth rotation of geometric structures
      innerMesh.rotation.y = elapsed * 0.15
      innerMesh.rotation.x = elapsed * 0.08

      outerMesh.rotation.y = -elapsed * 0.12
      outerMesh.rotation.z = elapsed * 0.06

      goldRing.rotation.z = elapsed * 0.08
      greenRing.rotation.z = -elapsed * 0.04

      // Parallax easing
      masterGroup.rotation.y += (targetX - masterGroup.rotation.y) * 0.04
      masterGroup.rotation.x += (targetY - masterGroup.rotation.x) * 0.04

      // Slow particle float
      particlePoints.rotation.y = elapsed * 0.015

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animId)
      innerGeo.dispose()
      innerMat.dispose()
      outerGeo.dispose()
      outerMat.dispose()
      goldRingGeo.dispose()
      goldRingMat.dispose()
      greenRingGeo.dispose()
      greenRingMat.dispose()
      beamGeo.dispose()
      beamMat.dispose()
      glowBeamGeo.dispose()
      glowBeamMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Ticker text item
  const marqueeItems = [
    { text: "SITE IS UNDER MAINTENANCE", color: "text-[#f59e0b]" },
    { text: "SOON BACK", color: "text-[#f59e0b]" },
    { text: "✦", color: "text-[#38bdf8]" },
    { text: "UPGRADING SYSTEM CORE", color: "text-[#67e8f9]" },
    { text: "✦", color: "text-[#f59e0b]" },
    { text: "⚡ THIS SITE IS UNDER MAINTENANCE", color: "text-[#f59e0b]" },
    { text: "SOON BACK", color: "text-[#f59e0b]" },
    { text: "✦", color: "text-[#38bdf8]" },
    { text: "UPGRADING SYSTEM CORE", color: "text-[#67e8f9]" },
    { text: "✦", color: "text-[#f59e0b]" },
  ]

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center text-white overflow-hidden bg-[#000000] select-none">
      {/* 3D Three.js Background Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 pointer-events-auto"
        aria-hidden="true"
      />

      {/* Subtle Space Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Admin Preview Header if opened inside /admin12 */}
      {isPreview && (
        <div className="relative z-30 w-full bg-amber-500/20 backdrop-blur-md border-b border-amber-500/40 py-2.5 px-4 flex items-center justify-between text-amber-200 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Admin Preview Mode &mdash; Regular visitors see this screen when site is OFF</span>
          </div>
          {onExitPreview && (
            <Button
              size="sm"
              variant="outline"
              onClick={onExitPreview}
              className="h-7 text-xs bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/40 text-amber-100 cursor-pointer"
            >
              Exit Preview
            </Button>
          )}
        </div>
      )}

      {/* TOP PILL BADGE: SYSTEM MAINTENANCE */}
      <header className="relative z-10 w-full pt-8 sm:pt-12 flex justify-center">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#0a0f1d]/90 border border-[#f59e0b]/50 shadow-[0_0_20px_rgba(245,158,11,0.22)] backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase text-[#fbbf24]">
            SYSTEM MAINTENANCE
          </span>
        </div>
      </header>

      {/* CENTER HEADLINE */}
      <main className="relative z-10 w-full max-w-5xl px-4 py-8 flex flex-col items-center justify-center text-center my-auto">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-[#fef3c7] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] max-w-4xl">
          {title}
        </h1>
      </main>

      {/* BOTTOM TICKER / MARQUEE RIBBON */}
      <footer className="relative z-10 w-full bg-[#02050f]/95 border-y border-white/10 py-3 sm:py-3.5 overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="animate-maintenance-marquee flex items-center gap-8 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase select-none">
          {/* Render duplicated list for seamless infinite loop */}
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={index} className={`flex items-center gap-2 whitespace-nowrap ${item.color}`}>
              {item.text}
            </span>
          ))}
        </div>
      </footer>
    </div>
  )
}
