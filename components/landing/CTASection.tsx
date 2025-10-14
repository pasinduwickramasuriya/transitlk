// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'

// export function CTASection() {
//   return (
//     <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 relative overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//         <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
//           Ready for a Better Ride?
//         </h2>
//         <p className="text-xl text-slate-300 mb-12 leading-relaxed">
//           Join the thousands of Sri Lankans embracing a smarter, more connected way to
//           travel. Download the app and start your journey today.
//         </p>
//         <div className="flex flex-col sm:flex-row gap-6 justify-center">
//           <Button
//             size="lg"
//             className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full text-lg font-medium h-auto"
//             asChild
//           >
//             <Link href="/auth/register">Get Started Now</Link>
//           </Button>
//           <Button
//             size="lg"
//             variant="outline"
//             className="border-2 border-slate-300 text-slate-300 hover:bg-slate-300 hover:text-slate-900 px-8 py-4 rounded-full text-lg font-medium h-auto"
//             asChild
//           >
//             <Link href="/contact">Contact Sales</Link>
//           </Button>
//         </div>
//       </div>
//     </section>
//   )
// }






'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, Heart, Zap } from 'lucide-react'

export function CTASection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden py-24">
      {/* Simple Pastel Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-violet-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        {/* Status Badge */}
        <div className={`inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-rose-200/50 shadow-lg mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Sparkles className="h-4 w-4 text-rose-400 mr-2 animate-spin" />
          <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
            Your Journey Awaits
          </span>
          <Sparkles className="h-4 w-4 text-violet-400 ml-2 animate-spin" />
        </div>

        {/* Main Heading */}
        <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-8 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="block text-slate-600 mb-4">Ready for a</span>
          <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Better Ride?
          </span>
          <div className="flex items-center justify-center gap-4">
            <span className="text-slate-700">Let's Go!</span>
            <Heart className="h-8 w-8 text-rose-400 animate-bounce" />
          </div>
        </h2>

        {/* Description */}
        <p className={`text-xl sm:text-2xl text-slate-600 mb-12 leading-relaxed font-medium max-w-3xl mx-auto transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Join thousands of Sri Lankans embracing a 
          <span className="mx-2 px-4 py-2 bg-gradient-to-r from-rose-100 via-pink-100 to-violet-100 rounded-full text-violet-700 font-bold inline-flex items-center shadow-sm">
            <Zap className="h-4 w-4 mr-2 text-rose-500" />
            smarter way
          </span>
          to travel. Start your magical journey today!
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white px-12 py-6 rounded-3xl text-xl font-bold shadow-2xl hover:shadow-rose-500/25 transition-all duration-500 transform hover:scale-110 h-auto"
            asChild
          >
            <Link href="/auth/register" className="flex items-center">
              <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-180 transition-transform duration-500" />
              Get Started Now
              <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000"></div>
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="group border-3 border-violet-300/60 hover:border-rose-400/80 text-slate-700 hover:text-rose-600 px-12 py-6 rounded-3xl text-xl font-bold bg-white/70 backdrop-blur-xl hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-auto"
            asChild
          >
            <Link href="/contact" className="flex items-center">
              Contact Sales
            </Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className={`flex flex-wrap justify-center items-center gap-8 mt-16 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center text-slate-600">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-semibold">50K+ Happy Users</span>
          </div>
          <div className="flex items-center text-slate-600">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-semibold">99.9% Uptime</span>
          </div>
          <div className="flex items-center text-slate-600">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-semibold">4.9★ Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
