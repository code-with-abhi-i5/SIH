import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { AIIntelligence } from "@/components/sections/AIIntelligence";
import { LocationIntelligence } from "@/components/sections/LocationIntelligence";
import { ChallengeCategories } from "@/components/sections/ChallengeCategories";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Impact } from "@/components/sections/Impact";
import { CTA } from "@/components/sections/CTA";

export function LandingPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-navy-900 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Problem />
        <HowItWorks />
        <AIIntelligence />
        <LocationIntelligence />
        <ChallengeCategories />
        <Ecosystem />
        <Impact />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
