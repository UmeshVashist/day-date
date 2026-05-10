'use client'

import { useEffect, useRef } from "react";

export default function GlassBackground({ children }: { children: React.ReactNode }) {
  const glowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        (glowRef.current as HTMLElement).style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {/* 🎨 BACKGROUND - Fixed */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e3a8a] -z-20" />

      {/* 💡 CURSOR GLOW - Fixed */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed w-[300px] h-[300px] rounded-full bg-blue-400/20 blur-3xl z-0"
      />

      {/* UI - Scrollable Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
