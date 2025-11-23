"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import SentinelEmblem from "./sentinel-emblem"

export default function Hero() {
  const containerRef = useRef(null)

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-background">
      {/* Full-page 3D emblem background */}
      <div className="absolute inset-0 w-full h-full">
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

      {/* Text content overlay - positioned on left side only */}
      <div className="relative z-10 w-full h-screen flex items-center justify-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-2xl pl-8 md:pl-16"
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
            <motion.a
  href="https://livedemo-brown.vercel.app/"
  target="_blank"
  rel="noopener noreferrer"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold neon-glow hover:shadow-lg transition-all duration-300 cursor-pointer"
>
  Try Live Demo
</motion.a>

            <motion.a
  href="https://github.com/HACK-A-DAY-Online-Participants/sentinel/tree/main/sentinel-llm-gateway "
  target="_blank"
  rel="noopener noreferrer"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold neon-glow hover:shadow-lg transition-all duration-300 cursor-pointer"
>
  Git hub Repo
</motion.a>
            
          </div>

          <p className="text-sm text-muted-foreground pt-2">
            Built for AI teams, enterprises, and developers who ship LLM-powered applications.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
