"use client"

import { motion } from "framer-motion"

export default function UseCasesSection() {
  const useCases = [
    {
      title: "Customer Support Chatbots",
      description:
        "Protect customer service AI from adversarial prompts attempting to leak company policies or bypass guidelines.",
    },
    {
      title: "Content Generation APIs",
      description:
        "Safeguard content generation services from prompt injection attacks that could generate harmful or policy-violating content.",
    },
    {
      title: "Enterprise AI Assistants",
      description:
        "Secure internal AI tools accessing sensitive databases from injection attacks attempting unauthorized data access.",
    },
    {
      title: "Financial & Healthcare AI",
      description:
        "Ensure compliance and security for regulated industries with high-stakes AI decision making systems.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <motion.div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold mb-6 text-balance"
          >
            Real-World Use Cases
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-secondary max-w-2xl mx-auto"
          >
            Sentinel protects diverse AI applications across industries.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass-panel rounded-xl p-8 border-accent/30 hover:border-accent/60 transition-colors"
            >
              <h3 className="text-xl font-bold mb-3 text-primary">{useCase.title}</h3>
              <p className="text-secondary leading-relaxed">{useCase.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
