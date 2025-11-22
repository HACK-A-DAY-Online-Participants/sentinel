"use client"

import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import StorySection from "@/components/story-section"
import PipelineSection from "@/components/pipeline-section"
import FeaturesSection from "@/components/features-section"
import UseCasesSection from "@/components/use-cases-section"
import TerminalSimulation from "@/components/terminal-sim"
import LiveDemoSection from "@/components/live-demo-section"
import DeveloperSection from "@/components/developer-section"
import SecuritySection from "@/components/security-section"
import TeamSection from "@/components/team-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <StorySection />
      <PipelineSection />
      <FeaturesSection />
      <UseCasesSection />
      <TerminalSimulation />
      <LiveDemoSection />
      <DeveloperSection />
      <SecuritySection />
      <TeamSection />
      <Footer />
    </main>
  )
}
