"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function ArchitectureDiagram() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  const flowItems = [
    { label: "User", icon: "👤" },
    { label: "Application", icon: "⚙️" },
    { label: "Sentinel Gateway", icon: "🛡️" },
    { label: "LLM", icon: "🤖" },
  ]

  const defenseLayer = ["Heuristic Rule Engine", "ML Classifier", "Sanitization & Risk Policy"]

  return (
    <section ref={ref} className="py-24 px-4 bg-card/50 border-t border-b border-primary/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">Sentinel Architecture</h2>
          <p className="text-muted-foreground text-lg">Hybrid Defense: Heuristics + ML + Risk Engine</p>
        </motion.div>

        {/* Flow Diagram */}
        <div className="glass-panel p-8 md:p-12 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-12">
            {flowItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center text-2xl neon-glow">
                  {item.icon}
                </div>
                <span className="text-sm font-semibold text-center text-foreground">{item.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Defense Layers */}
          <div className="mt-12 pt-12 border-t border-primary/20">
            <h3 className="text-xl font-semibold mb-8 text-center text-accent">Sentinel Defense Layers</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {defenseLayer.map((layer, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-center hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                >
                  <p className="text-sm font-semibold">{layer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Flow visualization */}
        <div className="hidden md:block relative h-32 glass-panel p-8">
          <svg className="w-full h-full opacity-60" viewBox="0 0 800 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(99,102,241)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="rgb(139,92,246)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="rgb(34,211,238)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path d="M 0 50 Q 200 20, 400 50 T 800 50" stroke="url(#flowGrad)" strokeWidth="3" fill="none" />
            <circle cx="200" cy="50" r="6" fill="rgb(99,102,241)" opacity="0.7" />
            <circle cx="400" cy="50" r="6" fill="rgb(139,92,246)" opacity="0.7" />
            <circle cx="600" cy="50" r="6" fill="rgb(34,211,238)" opacity="0.7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
