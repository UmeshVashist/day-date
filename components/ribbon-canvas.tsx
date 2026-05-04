"use client"

import { useEffect, useRef } from "react"

const CONFIG = {
  SPEED_X: 0.15,
  SPEED_Y: 0.15,
  MAX_LENGTH: 120,
  RED_STEP: 0.02,
  GREEN_STEP: 0.015,
  BLUE_STEP: 0.025,
  SPREAD_LIMIT: 20,
}

export default function RibbonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animation: number
    const points: any[] = []

    const mouse = { x: 0, y: 0 }
    const prevMouse = { x: 0, y: 0 }
    const colorState = { red: 0, green: 255, blue: 255, size: 0 }

    function resize() {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    function spreadPoint(p: any) {
      p.x += p.dx
      p.y += p.dy
    }

    function drawLines() {
      const total = points.length
      if (total < 3) return

      for (let i = total - 1; i > 1; i--) {
        const p0 = points[i]
        const p1 = points[i - 1]
        const p2 = points[i - 2]

        if (!ctx) continue
        ctx.beginPath()
        ctx.strokeStyle = p0.color
        ctx.lineWidth = p0.size
        ctx.globalAlpha = i / total

        ctx.moveTo((p1.x + p0.x) / 2, (p1.y + p0.y) / 2)
        ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2)

        ctx.stroke()
        spreadPoint(p0)
      }
    }

    function draw() {
      const dx = Math.max(-CONFIG.SPREAD_LIMIT, Math.min(CONFIG.SPREAD_LIMIT, (mouse.x - prevMouse.x) * CONFIG.SPEED_X))

      const dy = Math.max(-CONFIG.SPREAD_LIMIT, Math.min(CONFIG.SPREAD_LIMIT, (mouse.y - prevMouse.y) * CONFIG.SPEED_Y))

      prevMouse.x = mouse.x
      prevMouse.y = mouse.y

      colorState.size += 0.125
      colorState.red += CONFIG.RED_STEP
      colorState.green += CONFIG.GREEN_STEP
      colorState.blue += CONFIG.BLUE_STEP

      const size = Math.abs(Math.sin(colorState.size) * 10) + 1
      const r = Math.floor(Math.sin(colorState.red) * 128 + 128)
      const g = Math.floor(Math.sin(colorState.green) * 128 + 128)
      const b = Math.floor(Math.sin(colorState.blue) * 128 + 128)

      points.push({
        x: mouse.x,
        y: mouse.y,
        dx,
        dy,
        size,
        color: `rgb(${r}, ${g}, ${b})`,
      })

      if (points.length > CONFIG.MAX_LENGTH) points.shift()

      if (!ctx || !canvas) return
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1
      ctx.fillStyle = "rgba(0,0,0,0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = "lighter"
      drawLines()
      drawLines()
      drawLines()

      animation = requestAnimationFrame(draw)
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function handleTouchMove(e: TouchEvent) {
      if (!e.touches[0]) return
      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    mouse.x = window.innerWidth / 2
    mouse.y = window.innerHeight / 2
    prevMouse.x = mouse.x
    prevMouse.y = mouse.y

    draw()

    return () => {
      cancelAnimationFrame(animation)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
}
