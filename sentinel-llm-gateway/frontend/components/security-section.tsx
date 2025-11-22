"use client"

import { motion } from "framer-motion"

export default function SecuritySection() {
  const commitments = [
    "End-to-end encryption for all data in transit and at rest",
    "Zero-knowledge architecture with no prompt storage or logging",
    "SOC 2 Type II certified with annual third-party audits",
    "GDPR, HIPAA, FedRAMP, and ISO 27001 compliance",
    "Automated incident response with 99.99% uptime SLA",
    "Regular penetration testing and security assessments",
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold mb-6 text-balance"
          >
            Security & Privacy First
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-secondary max-w-2xl mx-auto"
          >
            Enterprise-grade security with zero-knowledge architecture.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {commitments.map((commitment, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-start gap-4 p-6 glass-panel rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <p className="text-secondary leading-relaxed">{commitment}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
