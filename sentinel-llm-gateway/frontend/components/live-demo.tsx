"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function LiveDemo() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <section ref={ref} className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">See Sentinel in Action</h2>
          <p className="text-muted-foreground text-lg">
            Test real-time threat detection and sanitization with your own prompts
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Left explanation */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Interactive Demo</h3>
              <p className="text-muted-foreground">
                Enter any prompt to see how Sentinel analyzes it for security threats. Watch the detection engine
                identify patterns, calculate risk scores, and determine the appropriate action in real-time.
              </p>
            </div>
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 15px rgba(99,102,241,0.2)",
                  "0 0 30px rgba(99,102,241,0.4)",
                  "0 0 15px rgba(99,102,241,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="p-6 glass-panel rounded-lg border border-primary/30"
            >
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <span>Real-time heuristic detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">→</span>
                  <span>ML risk scoring and classification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <span>Recommended actions: allow, sanitize, block</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Right: Demo iframe placeholder */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(34,211,238,0.15)",
                "0 0 40px rgba(34,211,238,0.3)",
                "0 0 20px rgba(34,211,238,0.15)",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="glass-panel rounded-lg border-2 border-cyan-500/30 h-96 flex flex-col items-center justify-center"
          >
            <div className="text-center space-y-4">
              <svg
                className="w-16 h-16 mx-auto text-cyan-400 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
              <p className="text-foreground font-semibold">Live Demo</p>
              <p className="text-sm text-muted-foreground">Embed your deployed Streamlit or React demo here</p>
              <code className="text-xs text-cyan-400 bg-black/40 px-3 py-1 rounded">
                {"<iframe src='your-demo-url' />"}
              </code>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
