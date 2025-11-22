"use client"

import { motion } from "framer-motion"

export default function FeaturesSection() {
  const features = [
    {
      title: "Real-Time Detection",
      description: "Analyze prompts instantly with sub-millisecond latency using hybrid ML + heuristics.",
      icon: "⚡",
    },
    {
      title: "Smart Sanitization",
      description: "Automatically neutralize threats while preserving legitimate intent and functionality.",
      icon: "🛡️",
    },
    {
      title: "Enterprise API",
      description: "REST, gRPC, and webhook integrations with comprehensive monitoring and analytics.",
      icon: "🔌",
    },
    {
      title: "Risk Scoring",
      description: "Detailed threat assessment with confidence scores and attack vector identification.",
      icon: "📊",
    },
    {
      title: "Model Updates",
      description: "Continuously updated ML models trained on the latest injection attack patterns.",
      icon: "🔄",
    },
    {
      title: "Compliance Ready",
      description: "SOC 2 Type II certified with GDPR, HIPAA, and FedRAMP compliance support.",
      icon: "✅",
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold mb-6 text-balance"
          >
            Product Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-secondary max-w-2xl mx-auto"
          >
            Everything you need to protect your LLM applications from prompt injection attacks.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="glass-panel rounded-xl p-8 group overflow-hidden hover-lift"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 to-accent/10" />

              <div className="relative z-10">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
