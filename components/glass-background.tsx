'use client'

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GlassBackground({ children }: { children: React.ReactNode }) {
  const mountRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.pointerEvents = "none";

    // ⭐ STAR TEXTURE (BIGGER + BRIGHTER)
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(32, 32, 14, 0, Math.PI * 2); // 🔥 bigger core
      ctx.fill();

      const grad = ctx.createRadialGradient(32, 32, 14, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);

    // ⭐ CREATE STAR LAYER
    function createStars(size: number, count: number, spread: number) {
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const material = new THREE.PointsMaterial({
        map: texture,
        size,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      return new THREE.Points(geometry, material);
    }

    // 🔥 MULTI SIZE (REAL LOOK)
    const bigStars = createStars(20, 1500, 4000);
    const midStars = createStars(12, 3000, 7000);
    const smallStars = createStars(6, 5000, 10000);

    scene.add(bigStars, midStars, smallStars);

    camera.position.z = 2000;

    // 🎮 MOUSE
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (glowRef.current) {
        (glowRef.current as HTMLElement).style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 🎥 ANIMATION
    let time = 0;

    function animate() {
      requestAnimationFrame(animate);

      time += 0.01;

      // 🎥 cinematic float
      camera.position.x = Math.sin(time) * 200;
      camera.position.y = Math.cos(time) * 200;

      // 🎮 parallax
      scene.rotation.y += 0.0002 + mouseX * 0.0015;
      scene.rotation.x += mouseY * 0.0015;

      // ✨ twinkle
      (bigStars.material as THREE.PointsMaterial).opacity =
        0.85 + Math.sin(Date.now() * 0.002) * 0.15;

      renderer.render(scene, camera);
    }

    animate();

    // resize fix
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {/* 🎨 BACKGROUND - Fixed */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e3a8a]" />

      {/* ⭐ STARS - Fixed */}
      <div ref={mountRef} className="fixed inset-0 pointer-events-none" />

      {/* 💡 CURSOR GLOW - Fixed */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed w-[300px] h-[300px] rounded-full bg-blue-400/20 blur-3xl"
      />

      {/* UI - Scrollable Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
