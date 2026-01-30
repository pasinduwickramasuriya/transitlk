

'use client'

import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { BenefitsSection } from '@/components/landing/BenefitsSection'
import { ReviewsSection } from '@/components/landing/ReviewsSection'
import { CTASection } from "@/components/landing/CTASection";
import { Providers } from "@/components/providers";
import { Footer } from '@/components/landing/Footer'
import BusAssistant from '@/components/BusAssistant'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <Providers>
        <ReviewsSection />
      </Providers>
      <CTASection />
      <Footer />
      <BusAssistant />
    </div>
  )
}
