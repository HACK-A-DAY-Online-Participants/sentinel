"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function Features() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const features = [
    {
      title: "Heuristics-based Attack Detection",
      description: "Detects known jailbreak patterns instantly using rule-based scanning.",
    },
    {
      title: "ML-Powered Risk Scoring",
      description: "Lightweight classifier predicts malicious intent in real-time on CPU.",
    },
    {
      title: "Real-Time Sanitization",
      description: "Cleans risky segments while preserving user intent.",
    },
    {
      title: "Dynamic Risk Policy",
      description: "Configurable thresholds for allow, sanitize, or block decisions.",
    },
    {
      title: "Vendor-Agnostic Gateway",
      description: "Works with OpenAI, Claude, Gemini, local LLMs, and custom APIs.",
    },
    {
      title: "Observability & Logging Ready",
      description: "Designed to log risk scores, matched rules, and latency for analysis.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section ref={ref} className="py-24 px-4 bg-card/50 border-t border-primary/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">Key Capabilities</h2>
          <p className="text-muted-foreground text-lg">Enterprise-grade security with developer-friendly APIs</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className="p-6 glass-panel group cursor-pointer overflow-hidden relative"
            >
              {/* Animated background effect */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(99,102,241,0)",
                    "0 0 20px rgba(99,102,241,0.3)",
                    "0 0 0px rgba(99,102,241,0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: idx * 0.3 }}
                className="absolute inset-0"
              />

              <div className="relative z-10">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: idx * 0.4 }}
                  className="w-10 h-10 rounded-lg bg-primary/30 border border-primary/50 mb-4 flex items-center justify-center"
                >
                  <span className="text-lg text-primary">✦</span>
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
