




'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Clock, 
  Navigation,
  Bus,
  Stars,
  Zap,
  Heart,
  TrendingUp,
  Globe
} from 'lucide-react'

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden">
      {/* Enhanced Pastel Background */}
      <div className="absolute inset-0">
        {/* Main gradient orbs */}
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/35 via-cyan-200/30 to-emerald-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-violet-200/30 via-indigo-200/25 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating elements */}
        <div className="absolute top-32 left-1/4 w-6 h-6 bg-rose-300/60 rounded-full animate-bounce delay-300 shadow-lg"></div>
        <div className="absolute top-64 right-1/3 w-4 h-4 bg-violet-400/70 rounded-full animate-bounce delay-700 shadow-md"></div>
        <div className="absolute bottom-40 left-1/2 w-5 h-5 bg-cyan-300/80 rounded-full animate-bounce delay-500 shadow-lg"></div>
        <div className="absolute top-96 left-3/4 w-3 h-3 bg-pink-400/60 rounded-full animate-bounce delay-200 shadow-md"></div>
        
        {/* Interactive mouse follower */}
        <div 
          className="absolute w-32 h-32 bg-gradient-to-br from-rose-300/20 to-violet-300/20 rounded-full blur-2xl transition-all duration-300 pointer-events-none"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
          }}
        />
        
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        {/* Floating Status Badge */}
        <div className={`inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-rose-200/50 shadow-lg mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
              Sri Lanka's Smartest Transit Platform
            </span>
            <Sparkles className="h-4 w-4 text-rose-400 ml-2 animate-spin" />
          </div>
        </div>

        <div className="max-w-6xl">
          {/* Hero Heading with Staggered Animation */}
          <div className={`mb-12 transition-all duration-1200 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight">
              <div className="flex items-center mb-6">
                <div className="relative mr-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-500">
                    <Navigation className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
                </div>
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                  TransitLK
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="relative">
                  <span className="block text-slate-700">Seamless</span>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-rose-300 via-pink-300 to-violet-300 rounded-full opacity-60"></div>
                </div>
                
                <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent animate-pulse">
                  Journeys
                </span>
                
                <div className="flex items-center gap-4">
                  <span className="text-slate-600">Start</span>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-12 w-12 text-rose-400 animate-bounce" />
                    <span className="text-slate-700">Here.</span>
                  </div>
                </div>
              </div>
            </h1>
          </div>
          
          {/* Enhanced Description */}
          <div className={`mb-16 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-4xl leading-relaxed font-medium">
              The future of Sri Lankan public transport is here. Experience 
              <span className="mx-2 px-4 py-2 bg-gradient-to-r from-rose-100 via-pink-100 to-violet-100 rounded-full text-violet-700 font-bold inline-flex items-center shadow-sm">
                <Zap className="h-4 w-4 mr-2 text-rose-500" />
                AI-powered journeys
              </span>
              with real-time tracking, effortless booking, and intelligent analytics.
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: MapPin, text: "Live GPS Tracking", color: "from-emerald-400 to-cyan-400" },
                { icon: Clock, text: "Real-Time Updates", color: "from-blue-400 to-violet-400" },
                { icon: Bus, text: "Smart Booking", color: "from-rose-400 to-pink-400" },
                { icon: TrendingUp, text: "AI Analytics", color: "from-violet-400 to-purple-400" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-center px-5 py-3 bg-white/60 backdrop-blur-xl rounded-full border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform duration-300`}>
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Modern CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-8 mb-20 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white px-12 py-6 rounded-3xl text-xl font-bold h-auto shadow-2xl hover:shadow-rose-500/25 transition-all duration-500 transform hover:scale-110"
              asChild
            >
              <Link href="/auth/register" className="flex items-center">
                <Sparkles className="h-6 w-6 mr-4 group-hover:rotate-180 transition-transform duration-500" />
                Discover Our Services
                <ArrowRight className="h-6 w-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                
                {/* Animated shimmer */}
                <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000"></div>
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="group border-3 border-violet-300/60 hover:border-rose-400/80 text-slate-700 hover:text-rose-600 px-12 py-6 rounded-3xl text-xl font-bold h-auto bg-white/70 backdrop-blur-xl hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="#demo" className="flex items-center">
                <div className="w-12 h-12 rounded-full border-3 border-current flex items-center justify-center mr-5 group-hover:rotate-90 transition-transform duration-500 bg-gradient-to-br from-rose-100 to-violet-100">
                  <Play className="h-6 w-6 ml-0.5" />
                </div>
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Floating Stats Cards */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { 
                value: "50K+", 
                label: "Happy Travelers", 
                icon: Heart, 
                gradient: "from-rose-400 to-pink-500",
                bg: "from-rose-50 to-pink-50"
              },
              { 
                value: "99.9%", 
                label: "Uptime Magic", 
                icon: Stars, 
                gradient: "from-violet-400 to-purple-500",
                bg: "from-violet-50 to-purple-50"
              },
              { 
                value: "<2s", 
                label: "Lightning Fast", 
                icon: Zap, 
                gradient: "from-cyan-400 to-blue-500",
                bg: "from-cyan-50 to-blue-50"
              },
              { 
                value: "24/7", 
                label: "Always There", 
                icon: Globe, 
                gradient: "from-emerald-400 to-green-500",
                bg: "from-emerald-50 to-green-50"
              }
            ].map((stat, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${stat.bg} backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
              >
                <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${stat.gradient} rounded-full animate-pulse`}></div>
                
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                
                <div className="text-3xl font-black text-slate-800 mb-2 group-hover:text-4xl transition-all duration-300">
                  {stat.value}
                </div>
                
                <div className="text-sm text-slate-600 font-semibold">
                  {stat.label}
                </div>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex flex-col items-center space-y-3 animate-bounce">
          <span className="text-sm text-slate-500 font-semibold">Scroll to explore</span>
          <div className="w-8 h-12 border-3 border-rose-300/60 rounded-full flex justify-center bg-white/40 backdrop-blur-sm">
            <div className="w-2 h-4 bg-gradient-to-b from-rose-400 to-violet-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}






// 'use client'

// import React, { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { 
//   Play, 
//   ArrowRight, 
//   Sparkles, 
//   MapPin, 
//   Clock, 
//   Navigation,
//   Bus,
//   Stars,
//   Zap,
//   Heart,
//   TrendingUp,
//   Globe
// } from 'lucide-react'

// export function HeroSection() {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
//   const [isLoaded, setIsLoaded] = useState(false)

//   useEffect(() => {
//     setIsLoaded(true)
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePosition({ x: e.clientX, y: e.clientY })
//     }
//     window.addEventListener('mousemove', handleMouseMove)
//     return () => window.removeEventListener('mousemove', handleMouseMove)
//   }, [])

//   return (
//     <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden">
//       {/* Enhanced Pastel Background - Responsive sizes */}
//       <div className="absolute inset-0">
//         {/* Main gradient orbs - Responsive sizes */}
//         <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 w-[250px] sm:w-[350px] md:w-[450px] lg:w-[500px] h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] bg-gradient-to-br from-blue-200/35 via-cyan-200/30 to-emerald-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-gradient-to-br from-violet-200/30 via-indigo-200/25 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        
//         {/* Floating elements - Responsive positioning */}
//         <div className="absolute top-20 sm:top-32 left-1/4 w-4 sm:w-6 h-4 sm:h-6 bg-rose-300/60 rounded-full animate-bounce delay-300 shadow-lg"></div>
//         <div className="absolute top-40 sm:top-64 right-1/4 sm:right-1/3 w-3 sm:w-4 h-3 sm:h-4 bg-violet-400/70 rounded-full animate-bounce delay-700 shadow-md"></div>
//         <div className="absolute bottom-20 sm:bottom-40 left-1/2 w-4 sm:w-5 h-4 sm:h-5 bg-cyan-300/80 rounded-full animate-bounce delay-500 shadow-lg"></div>
//         <div className="absolute top-60 sm:top-96 right-1/4 sm:left-3/4 w-2 sm:w-3 h-2 sm:h-3 bg-pink-400/60 rounded-full animate-bounce delay-200 shadow-md"></div>
        
//         {/* Interactive mouse follower - Hidden on touch devices */}
//         <div 
//           className="hidden md:block absolute w-32 h-32 bg-gradient-to-br from-rose-300/20 to-violet-300/20 rounded-full blur-2xl transition-all duration-300 pointer-events-none"
//           style={{
//             left: mousePosition.x - 64,
//             top: mousePosition.y - 64,
//           }}
//         />
        
//         {/* Subtle grid */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]"></div>
//       </div>
      
//       <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16">
//         {/* Floating Status Badge - Responsive */}
//         <div className={`flex justify-center mb-6 sm:mb-8 md:mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//           <div className="inline-flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-white/70 backdrop-blur-xl rounded-full border border-rose-200/50 shadow-lg">
//             <div className="flex items-center">
//               <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse mr-2 sm:mr-3"></div>
//               <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
//                 Sri Lanka's Smartest Transit Platform
//               </span>
//               <Sparkles className="h-3 sm:h-4 w-3 sm:w-4 text-rose-400 ml-1 sm:ml-2 animate-spin" />
//             </div>
//           </div>
//         </div>

//         <div className="max-w-6xl mx-auto">
//           {/* Hero Heading - Fully Responsive */}
//           <div className={`mb-8 sm:mb-10 md:mb-12 transition-all duration-1200 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
//             <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
//               <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6">
//                 <div className="relative mb-4 sm:mb-0 sm:mr-4 md:mr-6">
//                   <div className="w-12 sm:w-16 md:w-18 lg:w-20 h-12 sm:h-16 md:h-18 lg:h-20 bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-500">
//                     <Navigation className="h-6 sm:h-8 md:h-9 lg:h-10 w-6 sm:w-8 md:w-9 lg:w-10 text-white" />
//                   </div>
//                   <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-6 h-4 sm:h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
//                 </div>
//                 <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-rose-600 bg-clip-text text-transparent text-center sm:text-left">
//                   TransitLK
//                 </span>
//               </div>
              
//               <div className="space-y-2 sm:space-y-3 text-center sm:text-left">
//                 <div className="relative">
//                   <span className="block text-slate-700">Seamless</span>
//                   <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-rose-300 via-pink-300 to-violet-300 rounded-full opacity-60"></div>
//                 </div>
                
//                 <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent animate-pulse">
//                   Journeys
//                 </span>
                
//                 <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4">
//                   <span className="text-slate-600">Start</span>
//                   <div className="flex items-center space-x-1 sm:space-x-2">
//                     <Heart className="h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 text-rose-400 animate-bounce" />
//                     <span className="text-slate-700">Here.</span>
//                   </div>
//                 </div>
//               </div>
//             </h1>
//           </div>
          
//           {/* Enhanced Description - Responsive */}
//           <div className={`mb-10 sm:mb-12 md:mb-16 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed font-medium text-center sm:text-left">
//               The future of Sri Lankan public transport is here. Experience 
//               <span className="mx-1 sm:mx-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-gradient-to-r from-rose-100 via-pink-100 to-violet-100 rounded-full text-violet-700 font-bold inline-flex items-center shadow-sm text-sm sm:text-base">
//                 <Zap className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2 text-rose-500" />
//                 AI-powered journeys
//               </span>
//               with real-time tracking, effortless booking, and intelligent analytics.
//             </p>

//             {/* Feature Tags - Responsive Grid */}
//             <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
//               {[
//                 { icon: MapPin, text: "Live GPS Tracking", color: "from-emerald-400 to-cyan-400" },
//                 { icon: Clock, text: "Real-Time Updates", color: "from-blue-400 to-violet-400" },
//                 { icon: Bus, text: "Smart Booking", color: "from-rose-400 to-pink-400" },
//                 { icon: TrendingUp, text: "AI Analytics", color: "from-violet-400 to-purple-400" }
//               ].map((feature, index) => (
//                 <div
//                   key={index}
//                   className="group flex items-center px-3 sm:px-4 md:px-5 py-2 sm:py-3 bg-white/60 backdrop-blur-xl rounded-full border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                 >
//                   <div className={`w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300`}>
//                     <feature.icon className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
//                   </div>
//                   <span className="text-xs sm:text-sm font-semibold text-slate-700">{feature.text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Modern CTA Buttons - Responsive */}
//           <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 justify-center sm:justify-start transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
//             <Button 
//               size="lg" 
//               className="group relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-2xl sm:rounded-3xl text-base sm:text-lg md:text-xl font-bold h-auto shadow-2xl hover:shadow-rose-500/25 transition-all duration-500 transform hover:scale-110"
//               asChild
//             >
//               <Link href="/auth/register" className="flex items-center justify-center">
//                 <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 mr-2 sm:mr-3 md:mr-4 group-hover:rotate-180 transition-transform duration-500" />
//                 <span className="whitespace-nowrap">Discover Our Services</span>
//                 <ArrowRight className="h-5 sm:h-6 w-5 sm:w-6 ml-2 sm:ml-3 md:ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                
//                 {/* Animated shimmer */}
//                 <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000"></div>
//               </Link>
//             </Button>
            
//             <Button 
//               size="lg" 
//               variant="outline"
//               className="group border-2 sm:border-3 border-violet-300/60 hover:border-rose-400/80 text-slate-700 hover:text-rose-600 px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-2xl sm:rounded-3xl text-base sm:text-lg md:text-xl font-bold h-auto bg-white/70 backdrop-blur-xl hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//               asChild
//             >
//               <Link href="#demo" className="flex items-center justify-center">
//                 <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 rounded-full border-2 sm:border-3 border-current flex items-center justify-center mr-3 sm:mr-4 md:mr-5 group-hover:rotate-90 transition-transform duration-500 bg-gradient-to-br from-rose-100 to-violet-100">
//                   <Play className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 ml-0.5" />
//                 </div>
//                 <span className="whitespace-nowrap">Watch Demo</span>
//               </Link>
//             </Button>
//           </div>

//           {/* Floating Stats Cards - Responsive Grid */}
//           <div className={`grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             {[
//               { 
//                 value: "50K+", 
//                 label: "Happy Travelers", 
//                 icon: Heart, 
//                 gradient: "from-rose-400 to-pink-500",
//                 bg: "from-rose-50 to-pink-50"
//               },
//               { 
//                 value: "99.9%", 
//                 label: "Uptime Magic", 
//                 icon: Stars, 
//                 gradient: "from-violet-400 to-purple-500",
//                 bg: "from-violet-50 to-purple-50"
//               },
//               { 
//                 value: "<2s", 
//                 label: "Lightning Fast", 
//                 icon: Zap, 
//                 gradient: "from-cyan-400 to-blue-500",
//                 bg: "from-cyan-50 to-blue-50"
//               },
//               { 
//                 value: "24/7", 
//                 label: "Always There", 
//                 icon: Globe, 
//                 gradient: "from-emerald-400 to-green-500",
//                 bg: "from-emerald-50 to-green-50"
//               }
//             ].map((stat, index) => (
//               <div
//                 key={index}
//                 className={`group relative bg-gradient-to-br ${stat.bg} backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
//               >
//                 <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-r ${stat.gradient} rounded-full animate-pulse`}></div>
                
//                 <div className={`w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 bg-gradient-to-br ${stat.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
//                   <stat.icon className="h-5 sm:h-6 md:h-7 w-5 sm:w-6 md:w-7 text-white" />
//                 </div>
                
//                 <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 mb-1 sm:mb-2 group-hover:text-2xl sm:group-hover:text-3xl md:group-hover:text-4xl transition-all duration-300">
//                   {stat.value}
//                 </div>
                
//                 <div className="text-xs sm:text-sm text-slate-600 font-semibold">
//                   {stat.label}
//                 </div>
                
//                 {/* Hover glow effect */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Scroll Indicator - Responsive */}
//       <div className={`absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
//         <div className="flex flex-col items-center space-y-2 sm:space-y-3 animate-bounce">
//           <span className="text-xs sm:text-sm text-slate-500 font-semibold">Scroll to explore</span>
//           <div className="w-6 sm:w-8 h-8 sm:h-12 border-2 sm:border-3 border-rose-300/60 rounded-full flex justify-center bg-white/40 backdrop-blur-sm">
//             <div className="w-1.5 sm:w-2 h-3 sm:h-4 bg-gradient-to-b from-rose-400 to-violet-400 rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
