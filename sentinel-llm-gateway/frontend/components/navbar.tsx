"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/30 border-b border-accent/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
            <span className="text-lg font-bold text-balance">Sentinel</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#attacks" className="text-sm text-secondary hover:text-primary transition-colors">
              Attacks
            </Link>
            <Link href="#architecture" className="text-sm text-secondary hover:text-primary transition-colors">
              Architecture
            </Link>
            <Link href="#developers" className="text-sm text-secondary hover:text-primary transition-colors">
              Developers
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium text-background bg-primary rounded-lg hover:bg-accent transition-colors"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
