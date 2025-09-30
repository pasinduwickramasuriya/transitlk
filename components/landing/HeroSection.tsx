// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { ArrowRight, Play } from 'lucide-react'

// export function HeroSection() {
//   return (
//     <section className="relative overflow-hidden py-20 sm:py-32">
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5" />
//         <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl" />
//         <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/3 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl" />
//       </div>
      
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center">
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
//             <span className="block">Smart Travel</span>
//             <span className="block">Made</span>
//             <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//               Simple.
//             </span>
//           </h1>
//           <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
//             Experience the future of Sri Lankan public transport. Real-time bus tracking, seamless ticket booking, 
//             and intelligent journey planning in one unified platform.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button 
//               size="lg" 
//               className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 py-4 h-auto"
//               asChild
//             >
//               <Link href="/auth/register">
//                 Start Your Journey
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Link>
//             </Button>
//             <Button 
//               size="lg" 
//               variant="outline" 
//               className="text-lg px-8 py-4 h-auto border-2 hover:bg-gray-50"
//               asChild
//             >
//               <Link href="#demo">
//                 <Play className="mr-2 h-5 w-5" />
//                 Watch Demo
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }





'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-300/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-4xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
            <span className="block">Seamless</span>
            <span className="block">Journeys Start</span>
            <span className="block">Here.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
            The future of Sri Lankan public transport. Real-time 
            tracking, effortless booking, and powerful analytics, unified 
            in one innovative platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Button 
              size="lg" 
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full text-lg font-medium h-auto"
              asChild
            >
              <Link href="/auth/register">
                Discover Our Services
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="ghost" 
              className="text-gray-700 hover:text-gray-900 px-8 py-4 rounded-full text-lg font-medium h-auto border-2 border-transparent hover:border-gray-200"
              asChild
            >
              <Link href="#demo" className="flex items-center">
                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3">
                  <Play className="h-4 w-4 ml-0.5" />
                </div>
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
