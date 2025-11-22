"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function TerminalSimulation() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    const terminalLines = [
      '$ sentinel --analyze "I\'m a helpful AI assistant..."',
      "",
      "[SYSTEM] Analyzing prompt injection vectors...",
      "[SCAN] Heuristic rules: PASSED ✓",
      "[ML_SCORE] Risk level: 2.3% (LOW)",
      "[SANITIZE] No malicious patterns detected",
      "",
      "✓ Prompt approved - Safe to process",
      "Output: User query processed securely",
    ]

    let lineIndex = 0

    const interval = setInterval(() => {
      if (lineIndex < terminalLines.length) {
        setLines((prev) => [...prev, terminalLines[lineIndex]])
        lineIndex++
      } else {
        clearInterval(interval)
      }
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold mb-12 text-center text-balance"
        >
          Live Threat Detection
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="rounded-lg overflow-hidden border border-accent/30 bg-[#0a0e27]/80 backdrop-blur-sm"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 p-3 bg-accent/10 border-b border-accent/20">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-secondary ml-4">sentinel-terminal.sh</span>
          </div>

          {/* Terminal content */}
          <div ref={terminalRef} className="p-6 font-mono text-sm text-green-400 h-64 overflow-y-auto">
            {lines.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`${line && line.includes("✓") ? "text-green-500" : ""} ${line && line.includes("[ERROR]") ? "text-red-500" : ""}`}
              >
                {line || "\u00A0"}
              </motion.div>
            ))}
            {lines.length < 9 && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              >
                █
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
