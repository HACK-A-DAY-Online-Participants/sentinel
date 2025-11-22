"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import SentinelEmblem from "./sentinel-emblem"

export default function Hero() {
  const containerRef = useRef(null)

  return (
    <section className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 w-full h-screen">
        <SentinelEmblem />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgb(0,0,0)" strokeWidth="1" />
            </pattern>
            <pattern id="gridLarge" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgb(0,0,0)" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridLarge)" />
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Left Content */}
      <div className="relative z-10 max-w-7xl w-full px-4 py-20 flex items-center justify-start h-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-sm text-primary"
          >
            AI Security First
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
            Sentinel
            <br />
            <span className="text-primary">LLM Safety Gateway</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            A real-time safety gateway that detects, sanitizes, and blocks harmful prompts before they reach your AI
            system.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold neon-glow hover:shadow-lg transition-all duration-300"
            >
              Try Live Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-transparent border border-accent text-accent rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/50 transition-all duration-300"
            >
              View GitHub
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-transparent border border-muted text-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Download Whitepaper
            </motion.button>
          </div>

          <p className="text-sm text-muted-foreground pt-2">
            Built for AI teams, enterprises, and developers who ship LLM-powered applications.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
