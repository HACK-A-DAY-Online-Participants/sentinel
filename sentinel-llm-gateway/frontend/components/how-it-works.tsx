"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function HowItWorks() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const steps = [
    {
      number: 1,
      title: "User prompt enters the Sentinel gateway",
      description: "Real-time interception before reaching your LLM",
    },
    {
      number: 2,
      title: "Heuristic rules scan for jailbreak patterns",
      description: "Rule-based detection of known attack vectors",
    },
    {
      number: 3,
      title: "ML classifier predicts malicious intent",
      description: "Advanced machine learning threat identification",
    },
    {
      number: 4,
      title: "Risk engine decides: allow / sanitize / block",
      description: "Dynamic policy-based mitigation decisions",
    },
    {
      number: 5,
      title: "Safe prompt is forwarded to the target LLM",
      description: "Clean delivery with full transparency",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section ref={ref} className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">How Sentinel Works</h2>
          <p className="text-muted-foreground text-lg">
            Real-time multi-layered defense against prompt injection attacks
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative p-6 glass-panel group hover:border-accent/60 transition-all duration-300"
            >
              {/* Step number - improved centering and sizing */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(99,102,241,0.3)",
                    "0 0 20px rgba(139,92,246,0.5)",
                    "0 0 10px rgba(99,102,241,0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 border border-primary/60 text-xl font-bold text-primary mb-4"
              >
                {step.number}
              </motion.div>

              <h3 className="text-sm font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
