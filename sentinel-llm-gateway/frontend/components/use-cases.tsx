"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function UseCases() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const useCases = [
    "AI Customer Support Bots",
    "Enterprise Document Assistants",
    "Autonomous Agents & Tool-Use",
    "RAG Pipelines & Internal Knowledge Bases",
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
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
          <h2 className="text-4xl md:text-5xl font-bold">Designed for Real-World AI Systems</h2>
          <p className="text-muted-foreground text-lg">
            Sentinel protects LLMs across diverse applications and industries
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-wrap gap-4 justify-center"
        >
          {useCases.map((useCase, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-full border-2 border-accent/40 bg-accent/5 hover:bg-accent/10 hover:border-accent/60 transition-all duration-300 group cursor-pointer"
            >
              <span className="text-base font-semibold text-foreground">{useCase}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
