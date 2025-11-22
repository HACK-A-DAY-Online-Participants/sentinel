"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function Team() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const team = [
    { name: "Ashutosh", role: "Founder & CEO" },
    { name: "Anmol", role: "CTO & ML Lead" },
    { name: "Alok", role: "Security Lead" },
    { name: "Parth", role: "Product Lead" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section ref={ref} className="py-24 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">Team</h2>
          <p className="text-muted-foreground text-lg">Built by security and AI experts</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8"
        >
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="p-6 glass-panel rounded-lg text-center group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
                {member.name[0]}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="text-sm text-primary mt-2">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
