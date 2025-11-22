"use client"

import { motion } from "framer-motion"

export default function PipelineSection() {
  const pipeline = [
    {
      title: "Heuristics & Rules",
      description: "Pattern-based detection for known injection techniques.",
      number: "01",
    },
    {
      title: "ML Risk Scoring",
      description: "Neural networks evaluate semantic threat indicators.",
      number: "02",
    },
    {
      title: "Prompt Sanitization",
      description: "Automatic threat neutralization while preserving intent.",
      number: "03",
    },
  ]

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
    <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-accent/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold mb-16 text-center text-balance"
        >
          Three-Layer Architecture
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pipeline.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)" }}
              className="relative p-8 rounded-xl border border-accent/20 bg-background/40 backdrop-blur-sm group overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 to-accent/10" />

              <div className="relative z-10">
                <div className="text-5xl font-bold text-accent/20 mb-4">{item.number}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-secondary">{item.description}</p>
              </div>

              {index < pipeline.length - 1 && (
                <div className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 text-accent/40 text-3xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
