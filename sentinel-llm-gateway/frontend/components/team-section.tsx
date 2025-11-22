"use client"

import { motion } from "framer-motion"

export default function TeamSection() {
  const team = [
    {
      name: "Ashutosh",
      role: "Co-Founder & CEO",
      bio: "AI Security Expert",
    },
    {
      name: "Anmol",
      role: "Co-Founder & CTO",
      bio: "ML Engineer",
    },
    {
      name: "Alok",
      role: "Co-Founder & Lead Researcher",
      bio: "Security Researcher",
    },
    {
      name: "Parth",
      role: "Co-Founder & Product Lead",
      bio: "Product Designer",
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
      <div className="relative max-w-7xl mx-auto">
        <motion.div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold mb-6 text-balance"
          >
            Built by Security Experts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-secondary max-w-2xl mx-auto"
          >
            A world-class team dedicated to LLM security and safety.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {team.map((member, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -8 }} className="text-center">
              <div className="mb-6 mx-auto">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <div className="text-3xl font-bold text-primary">{member.name[0]}</div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-primary font-semibold mb-2">{member.role}</p>
              <p className="text-secondary text-sm">{member.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
