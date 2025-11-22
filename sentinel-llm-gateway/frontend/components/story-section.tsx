"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

export default function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section ref={sectionRef} className="min-h-screen bg-background py-20 px-4 md:px-8 flex items-center">
      <div className="w-full max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground"
        >
          Understanding the Threat Landscape
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg bg-secondary/50 border border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-3 text-primary">Prompt Injection Attacks</h3>
            <p className="text-foreground/80">
              Malicious inputs designed to manipulate LLM behavior and bypass safety guidelines
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg bg-secondary/50 border border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-3 text-primary">Model Poisoning</h3>
            <p className="text-foreground/80">Training data contamination leading to compromised model outputs</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg bg-secondary/50 border border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-3 text-primary">Jailbreaks & Exploits</h3>
            <p className="text-foreground/80">
              Techniques to bypass security constraints and access restricted capabilities
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg bg-secondary/50 border border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-3 text-primary">Data Extraction</h3>
            <p className="text-foreground/80">Attempts to extract sensitive training data or system information</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
