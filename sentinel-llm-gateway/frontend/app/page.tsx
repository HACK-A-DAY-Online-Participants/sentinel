import Hero from "@/components/hero"
import ArchitectureDiagram from "@/components/architecture-diagram"
import HowItWorks from "@/components/how-it-works"
import Features from "@/components/features"
import LiveDemo from "@/components/live-demo"
import UseCases from "@/components/use-cases"
import SDK from "@/components/sdk"
import Team from "@/components/team"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <ArchitectureDiagram />
      <HowItWorks />
      <Features />
      <LiveDemo />
      <UseCases />
      <SDK />
      <Team />
      <Footer />
    </main>
  )
}
