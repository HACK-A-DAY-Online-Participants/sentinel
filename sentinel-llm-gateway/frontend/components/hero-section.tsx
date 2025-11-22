"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import ShieldScene from "./shield-scene"

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20

      const bg = container.querySelector("[data-parallax]")
      if (bg) {
        ;(bg as HTMLElement).style.transform = `translate(${x}px, ${y}px)`
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen pt-24 pb-20 overflow-hidden flex items-center">
      {/* Animated background */}
      <div
        data-parallax
        className="absolute inset-0 opacity-30 transition-transform duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Copy */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
              Sentinel – Protect LLMs from{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Prompt Injection
              </span>
            </h1>
            <p className="text-lg text-secondary mb-8 text-balance leading-relaxed">
              A real-time safety gateway that detects, sanitizes, and blocks harmful prompts before they reach your AI
              system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 bg-primary text-background font-semibold rounded-lg transition-all text-center"
              >
                Try Live Demo
              </motion.a>
              <motion.a
                href="https://github.com"
                whileHover={{ scale: 1.05, borderColor: "rgb(6, 182, 212)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 border border-accent text-accent font-semibold rounded-lg hover:bg-accent/5 transition-all text-center"
              >
                View GitHub
              </motion.a>
            </div>
          </motion.div>

          {/* Right side - 3D Shield */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-96 lg:h-full min-h-96"
          >
            <ShieldScene />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-secondary"
      >
        <div className="text-sm mb-2">Scroll to explore</div>
        <div className="w-6 h-10 border-2 border-secondary rounded-full mx-auto flex justify-center pt-1">
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-1 h-2 bg-secondary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
