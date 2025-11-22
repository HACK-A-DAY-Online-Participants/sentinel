"use client"

import { motion } from "framer-motion"

export default function DeveloperSection() {
  const features = [
    "Real-time attack detection",
    "Sub-millisecond latency",
    "ML model updates included",
    "Webhook & REST API",
    "Detailed threat reports",
    "Enterprise SLA",
  ]

  return (
    <section id="developers" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Code panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-lg overflow-hidden border border-accent/30 bg-[#0a0e27]/80 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 p-3 bg-accent/10 border-b border-accent/20">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-secondary ml-4">api-example.ts</span>
            </div>

            <div className="p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-green-400">{`import { Sentinel } from '@sentinel/ai';

const sentinel = new Sentinel({
  apiKey: process.env.SENTINEL_API_KEY,
});

export async function POST(req) {
  const { prompt } = await req.json();
  
  const analysis = await sentinel.analyze(prompt);
  
  if (analysis.isSafe) {
    return Response.json({ 
      data: await llm.complete(prompt) 
    });
  }
  
  return Response.json({ 
    error: 'Potential injection detected' 
  }, { status: 400 });
}`}</pre>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-balance">Built for Developers</h2>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-3 bg-primary text-background font-semibold rounded-lg transition-all"
            >
              View Full Documentation
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
