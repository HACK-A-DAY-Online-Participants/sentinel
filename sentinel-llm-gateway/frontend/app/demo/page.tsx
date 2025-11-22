"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function DemoPage() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const riskScores = {
      high: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 70 : null,
      medium: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 40 : null,
      low: Math.random() > 0.5 ? Math.floor(Math.random() * 40) : null,
    }

    const risks = Object.entries(riskScores)
      .filter(([_, score]) => score !== null)
      .map(([level, score]) => ({ level, score }))
      .sort((a, b) => b.score - a.score)

    const maxRisk = risks[0]?.score || 0
    let action = "ALLOW"
    if (maxRisk > 70) action = "BLOCK"
    else if (maxRisk > 40) action = "SANITIZE"

    setResult({
      prompt,
      risks,
      action,
      timestamp: new Date().toLocaleTimeString(),
      detectionPoints: [
        "Pattern matching: Checked against 2,847 known attacks",
        "Heuristic analysis: 15 suspicious indicators found",
        "ML classifier: 92% confidence in classification",
        "Policy check: Matched 3 violation rules",
      ],
    })

    setLoading(false)
  }

  const samplePrompts = [
    "How do I use Python for data analysis?",
    "Tell me about machine learning algorithms",
    "How do I build a web application?",
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold">
              Sentinel
            </motion.div>
          </Link>
          <p className="text-muted-foreground">Live Demo</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold">Try Sentinel Live</h1>
            <p className="text-lg text-muted-foreground">Test real-time threat detection and analyze any prompt</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <label className="block text-sm font-semibold">Enter a prompt to analyze:</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type any prompt here..."
                  className="w-full h-40 p-4 rounded-lg border border-foreground/20 bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={loading || !prompt.trim()}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {loading ? "Analyzing..." : "Analyze Prompt"}
              </motion.button>

              {/* Sample Prompts */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Try a sample:</p>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((sample, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setPrompt(sample)}
                      className="px-3 py-1 text-sm bg-foreground/5 border border-foreground/10 rounded-full hover:bg-foreground/10 transition-colors"
                    >
                      {sample}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 p-6 rounded-lg border border-foreground/10 bg-foreground/2 h-fit"
            >
              <h3 className="font-semibold">How it works:</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">1.</span>
                  <span>Enter or paste any prompt</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">2.</span>
                  <span>Sentinel analyzes in real-time</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">3.</span>
                  <span>View risk scores and recommendations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">4.</span>
                  <span>See detection details</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Results Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="border-t border-foreground/10 pt-8">
                <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>

                {/* Original Prompt */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-lg bg-foreground/2 border border-foreground/10 mb-6"
                >
                  <p className="text-sm text-muted-foreground mb-2">Your prompt:</p>
                  <p className="text-foreground italic">"{result.prompt}"</p>
                </motion.div>

                {/* Risk Scores */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3 mb-6"
                >
                  <h3 className="font-semibold">Risk Assessment:</h3>
                  {result.risks.map((risk, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{risk.level} Risk</span>
                        <span>{risk.score}%</span>
                      </div>
                      <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${risk.score}%` }}
                          transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
                          className={`h-full ${
                            risk.level === "high"
                              ? "bg-red-500"
                              : risk.level === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Action */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`p-4 rounded-lg border-2 mb-6 ${
                    result.action === "BLOCK"
                      ? "bg-red-500/10 border-red-500/30"
                      : result.action === "SANITIZE"
                        ? "bg-yellow-500/10 border-yellow-500/30"
                        : "bg-green-500/10 border-green-500/30"
                  }`}
                >
                  <p className="text-sm text-muted-foreground mb-1">Recommended Action:</p>
                  <p
                    className={`text-lg font-bold ${
                      result.action === "BLOCK"
                        ? "text-red-500"
                        : result.action === "SANITIZE"
                          ? "text-yellow-500"
                          : "text-green-500"
                    }`}
                  >
                    {result.action}
                  </p>
                </motion.div>

                {/* Detection Details */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <h3 className="font-semibold">Detection Details:</h3>
                  <ul className="space-y-2">
                    {result.detectionPoints.map((point, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <div className="pt-4 text-xs text-muted-foreground">Analyzed at {result.timestamp}</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
