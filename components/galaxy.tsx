"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const Galaxy = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    /**
     * Base
     */
    // Canvas
    const canvas = document.createElement("canvas")
    canvas.className = "webgl"
    mountRef.current.appendChild(canvas)

    // Scene
    const scene = new THREE.Scene()

    // Galaxy parameters from user code
    const parameters = {
      count: 100000,
      size: 0.01,
      radius: 2.15,
      branches: 3,
      spin: 3,
      randomness: 5,
      randomnessPower: 4,
      insideColor: "#ff6030",
      outsideColor: "#0949f0",
    }

    let material: THREE.PointsMaterial | null = null
    let geometry: THREE.BufferGeometry | null = null
    let points: THREE.Points | null = null

    const generateGalaxy = () => {
      if (points !== null) {
        geometry?.dispose()
        material?.dispose()
        scene.remove(points)
      }

      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      })

      geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(parameters.count * 3)
      const colors = new Float32Array(parameters.count * 3)

      const colorInside = new THREE.Color(parameters.insideColor)
      const colorOutside = new THREE.Color(parameters.outsideColor)

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        const radius = Math.pow(Math.random() * parameters.randomness, Math.random() * parameters.radius)
        const spinAngle = radius * parameters.spin
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2

        const negPos = [1, -1]
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * negPos[Math.floor(Math.random() * negPos.length)]
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * negPos[Math.floor(Math.random() * negPos.length)]
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * negPos[Math.floor(Math.random() * negPos.length)]

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, (Math.random() * radius) / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

      points = new THREE.Points(geometry, material)
      scene.add(points)
    }

    generateGalaxy()

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const handleResize = () => {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener("resize", handleResize)

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 3
    camera.position.y = 3
    camera.position.z = 3
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true, // Make background transparent if needed
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Animate
     */
    const clock = new THREE.Clock()
    let animationId: number

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      // Update controls
      controls.update()

      // Camera animation from user code
      camera.position.x = Math.cos(elapsedTime * 0.05) * 3 // Multiplied by 3 to maintain distance
      camera.position.z = Math.sin(elapsedTime * 0.05) * 3
      camera.lookAt(0, 0, 0)

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      animationId = window.requestAnimationFrame(tick)
    }

    tick()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      geometry?.dispose()
      material?.dispose()
      renderer.dispose()
      if (mountRef.current && canvas.parentNode === mountRef.current) {
        mountRef.current.removeChild(canvas)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden"
      style={{ background: "transparent" }}
    />
  )
}

export default Galaxy
