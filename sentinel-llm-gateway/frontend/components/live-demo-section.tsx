"use client"

import { motion } from "framer-motion"

export default function LiveDemoSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold mb-6 text-balance"
          >
            Try It Now
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-secondary max-w-2xl mx-auto"
          >
            Experience Sentinel's threat detection in real-time. No signup required.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="glass-panel rounded-2xl overflow-hidden border-accent/40"
        >
          {/* Demo placeholder with gradient background */}
          <div className="aspect-video bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-16 h-16 mx-auto rounded-full border-2 border-primary border-t-accent"
                />
              </div>
              <p className="text-lg text-secondary">Interactive demo loading...</p>
              <p className="text-sm text-muted-foreground mt-2">
                <a href="#" className="text-primary hover:underline">
                  Launch Full Demo →
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Requests Analyzed", value: "2.4B+" },
            { label: "Threats Blocked", value: "156M+" },
            { label: "Average Latency", value: "<2ms" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel rounded-lg p-8 text-center"
            >
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
