
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
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

  // Sri Lanka cities
  const cities = [
    { name: 'Jaffna', x: 50, y: 5, color: '#f59e0b' },
    { name: 'Trincomalee', x: 58, y: 20, color: '#8b5cf6' },
    { name: 'Kandy', x: 48, y: 40, color: '#10b981' },
    { name: 'Colombo', x: 30, y: 55, color: '#ef4444' },
    { name: 'Galle', x: 44, y: 65, color: '#3b82f6' },
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden">
      {/* Enhanced Pastel Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/35 via-cyan-200/30 to-emerald-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-violet-200/30 via-indigo-200/25 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Interactive mouse follower */}
        <div 
          className="absolute w-32 h-32 bg-gradient-to-br from-rose-300/20 to-violet-300/20 rounded-full blur-2xl transition-all duration-300 pointer-events-none"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
          }}
        />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            {/* Floating Status Badge */}
            <div className={`inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-rose-200/50 shadow-lg mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse mr-3"></div>
                <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
                  Sri Lanka's Smartest Transit Platform
                </span>
                <Sparkles className="h-4 w-4 text-rose-400 ml-2" />
              </div>
            </div>

            {/* Hero Heading */}
            <div className={`mb-12 transition-all duration-1200 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                <div className="flex items-center mb-6">
                  <div className="relative mr-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-500">
                      <Navigation className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
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
                  
                  <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent">
                    Journeys
                  </span>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600">Start</span>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-10 w-10 text-rose-400 animate-bounce" />
                      <span className="text-slate-700">Here.</span>
                    </div>
                  </div>
                </div>
              </h1>
            </div>
            
            {/* Description */}
            <div className={`mb-12 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
                The future of Sri Lankan public transport is here. Experience 
                <span className="mx-2 px-3 py-1 bg-gradient-to-r from-rose-100 via-pink-100 to-violet-100 rounded-full text-violet-700 font-bold inline-flex items-center shadow-sm">
                  <Zap className="h-3 w-3 mr-1 text-rose-500" />
                  AI-powered
                </span>
                journeys with real-time tracking.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: MapPin, text: "Live GPS", color: "from-emerald-400 to-cyan-400" },
                  { icon: Clock, text: "Real-Time", color: "from-blue-400 to-violet-400" },
                  { icon: Bus, text: "Smart Booking", color: "from-rose-400 to-pink-400" },
                  { icon: TrendingUp, text: "AI Analytics", color: "from-violet-400 to-purple-400" }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center px-4 py-2 bg-white/60 backdrop-blur-xl rounded-full border border-white/40 shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    <div className={`w-7 h-7 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mr-2`}>
                      <feature.icon className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white px-10 py-5 rounded-3xl text-lg font-bold shadow-2xl hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/auth/register" className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-3" />
                  Discover Services
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-violet-300/60 hover:border-rose-400/80 text-slate-700 hover:text-rose-600 px-10 py-5 rounded-3xl text-lg font-bold bg-white/70 backdrop-blur-xl hover:scale-105 transition-transform"
                asChild
              >
                <Link href="#demo" className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-6 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {[
                { value: "50K+", label: "Users", icon: Heart, gradient: "from-rose-400 to-pink-500" },
                { value: "99.9%", label: "Uptime", icon: Stars, gradient: "from-violet-400 to-purple-500" },
                { value: "24/7", label: "Support", icon: Globe, gradient: "from-emerald-400 to-green-500" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                  <div className="text-xs text-slate-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - 3D Glassmorphic Map Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-[600px] mx-auto">
              
              {/* Main Glass Sphere */}
              <div className="absolute inset-0 rounded-full bg-transparent from-white/30 via-blue-50/40 to-indigo-100/30 backdrop-blur-3xl">
                
                {/* Inner glow layers */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-100/20 to-indigo-100/10 blur-xl" />

                
                {/* Location Pins */}
                {cities.map((city, i) => (
                  <motion.div
                    key={city.name}
                    className="absolute"
                    style={{
                      left: `${city.x}%`,
                      top: `${city.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      y: [0, -10, 0]
                    }}
                    transition={{
                      scale: { delay: 1 + i * 0.1, duration: 0.5 },
                      y: { duration: 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }
                    }}
                  >
                    <div className="relative">
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow-2xl ring-2 ring-white/70"
                        style={{ backgroundColor: city.color }}
                      >
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      
                      <motion.div
                        animate={{ 
                          scale: [1, 2.5, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: city.color }}
                      />

                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="text-[10px] font-bold text-slate-800 bg-white/95 px-2 py-1 rounded-full shadow-md">
                          {city.name}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Moving Bus */}
                <motion.div
                  animate={{
                    x: ['20%', '35%', '50%', '40%', '25%', '20%'],
                    y: ['25%', '40%', '60%', '75%', '50%', '25%']
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute"
                >
                  <motion.div
                    animate={{ rotate: [-3, 3, -3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl ring-2 ring-white/60"
                  >
                    <Bus className="w-7 h-7 text-white" />
                  </motion.div>
                </motion.div>

                {/* Floating dots */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-violet-400/60 rounded-full"
                    style={{
                      left: `${30 + (i % 5) * 10}%`,
                      top: `${25 + Math.floor(i / 5) * 20}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>

             
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      REAL-TIME TRACKING
                    </div>
                    <div className="text-lg font-black text-slate-900">
                      Interactive 3D Map
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2.5 h-2.5 bg-green-500 rounded-full"
                    />
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Live
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
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
//       {/* Enhanced Pastel Background */}
//       <div className="absolute inset-0">
//         {/* Main gradient orbs */}
//         <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/35 via-cyan-200/30 to-emerald-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-violet-200/30 via-indigo-200/25 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        
//         {/* Floating elements */}
//         <div className="absolute top-32 left-1/4 w-6 h-6 bg-rose-300/60 rounded-full animate-bounce delay-300 shadow-lg"></div>
//         <div className="absolute top-64 right-1/3 w-4 h-4 bg-violet-400/70 rounded-full animate-bounce delay-700 shadow-md"></div>
//         <div className="absolute bottom-40 left-1/2 w-5 h-5 bg-cyan-300/80 rounded-full animate-bounce delay-500 shadow-lg"></div>
//         <div className="absolute top-96 left-3/4 w-3 h-3 bg-pink-400/60 rounded-full animate-bounce delay-200 shadow-md"></div>
        
//         {/* Interactive mouse follower */}
//         <div 
//           className="absolute w-32 h-32 bg-gradient-to-br from-rose-300/20 to-violet-300/20 rounded-full blur-2xl transition-all duration-300 pointer-events-none"
//           style={{
//             left: mousePosition.x - 64,
//             top: mousePosition.y - 64,
//           }}
//         />
        
//         {/* Subtle grid */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:60px_60px]"></div>
//       </div>
      
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
//         {/* Floating Status Badge */}
//         <div className={`inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-rose-200/50 shadow-lg mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//           <div className="flex items-center">
//             <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse mr-3"></div>
//             <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
//               Sri Lanka's Smartest Transit Platform
//             </span>
//             <Sparkles className="h-4 w-4 text-rose-400 ml-2 animate-spin" />
//           </div>
//         </div>

//         <div className="max-w-6xl">
//           {/* Hero Heading with Staggered Animation */}
//           <div className={`mb-12 transition-all duration-1200 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
//             <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight">
//               <div className="flex items-center mb-6">
//                 <div className="relative mr-6">
//                   <div className="w-20 h-20 bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-500">
//                     <Navigation className="h-10 w-10 text-white" />
//                   </div>
//                   <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
//                 </div>
//                 <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
//                   TransitLK
//                 </span>
//               </div>
              
//               <div className="space-y-3">
//                 <div className="relative">
//                   <span className="block text-slate-700">Seamless</span>
//                   <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-rose-300 via-pink-300 to-violet-300 rounded-full opacity-60"></div>
//                 </div>
                
//                 <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent animate-pulse">
//                   Journeys
//                 </span>
                
//                 <div className="flex items-center gap-4">
//                   <span className="text-slate-600">Start</span>
//                   <div className="flex items-center space-x-2">
//                     <Heart className="h-12 w-12 text-rose-400 animate-bounce" />
//                     <span className="text-slate-700">Here.</span>
//                   </div>
//                 </div>
//               </div>
//             </h1>
//           </div>
          
//           {/* Enhanced Description */}
//           <div className={`mb-16 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-4xl leading-relaxed font-medium">
//               The future of Sri Lankan public transport is here. Experience 
//               <span className="mx-2 px-4 py-2 bg-gradient-to-r from-rose-100 via-pink-100 to-violet-100 rounded-full text-violet-700 font-bold inline-flex items-center shadow-sm">
//                 <Zap className="h-4 w-4 mr-2 text-rose-500" />
//                 AI-powered journeys
//               </span>
//               with real-time tracking, effortless booking, and intelligent analytics.
//             </p>

//             {/* Feature Tags */}
//             <div className="flex flex-wrap gap-4 mb-8">
//               {[
//                 { icon: MapPin, text: "Live GPS Tracking", color: "from-emerald-400 to-cyan-400" },
//                 { icon: Clock, text: "Real-Time Updates", color: "from-blue-400 to-violet-400" },
//                 { icon: Bus, text: "Smart Booking", color: "from-rose-400 to-pink-400" },
//                 { icon: TrendingUp, text: "AI Analytics", color: "from-violet-400 to-purple-400" }
//               ].map((feature, index) => (
//                 <div
//                   key={index}
//                   className="group flex items-center px-5 py-3 bg-white/60 backdrop-blur-xl rounded-full border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                 >
//                   <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform duration-300`}>
//                     <feature.icon className="h-4 w-4 text-white" />
//                   </div>
//                   <span className="text-sm font-semibold text-slate-700">{feature.text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Modern CTA Buttons */}
//           <div className={`flex flex-col sm:flex-row gap-8 mb-20 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
//             <Button 
//               size="lg" 
//               className="group relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white px-12 py-6 rounded-3xl text-xl font-bold h-auto shadow-2xl hover:shadow-rose-500/25 transition-all duration-500 transform hover:scale-110"
//               asChild
//             >
//               <Link href="/auth/register" className="flex items-center">
//                 <Sparkles className="h-6 w-6 mr-4 group-hover:rotate-180 transition-transform duration-500" />
//                 Discover Our Services
//                 <ArrowRight className="h-6 w-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                
//                 {/* Animated shimmer */}
//                 <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000"></div>
//               </Link>
//             </Button>
            
//             <Button 
//               size="lg" 
//               variant="outline"
//               className="group border-3 border-violet-300/60 hover:border-rose-400/80 text-slate-700 hover:text-rose-600 px-12 py-6 rounded-3xl text-xl font-bold h-auto bg-white/70 backdrop-blur-xl hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//               asChild
//             >
//               <Link href="#demo" className="flex items-center">
//                 <div className="w-12 h-12 rounded-full border-3 border-current flex items-center justify-center mr-5 group-hover:rotate-90 transition-transform duration-500 bg-gradient-to-br from-rose-100 to-violet-100">
//                   <Play className="h-6 w-6 ml-0.5" />
//                 </div>
//                 Watch Demo
//               </Link>
//             </Button>
//           </div>

//           {/* Floating Stats Cards */}
//           <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
//                 className={`group relative bg-gradient-to-br ${stat.bg} backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
//               >
//                 <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${stat.gradient} rounded-full animate-pulse`}></div>
                
//                 <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
//                   <stat.icon className="h-7 w-7 text-white" />
//                 </div>
                
//                 <div className="text-3xl font-black text-slate-800 mb-2 group-hover:text-4xl transition-all duration-300">
//                   {stat.value}
//                 </div>
                
//                 <div className="text-sm text-slate-600 font-semibold">
//                   {stat.label}
//                 </div>
                
//                 {/* Hover glow effect */}
//                 <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Scroll Indicator */}
//       <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
//         <div className="flex flex-col items-center space-y-3 animate-bounce">
//           <span className="text-sm text-slate-500 font-semibold">Scroll to explore</span>
//           <div className="w-8 h-12 border-3 border-rose-300/60 rounded-full flex justify-center bg-white/40 backdrop-blur-sm">
//             <div className="w-2 h-4 bg-gradient-to-b from-rose-400 to-violet-400 rounded-full mt-2 animate-pulse"></div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }



