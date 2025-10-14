// 'use client'

// import React from 'react'
// import { Shield, Zap, Star, Users } from 'lucide-react'

// const benefits = [
//   {
//     icon: Shield,
//     title: 'Secure Payments',
//     description: 'PCI DSS compliant payment processing with multiple gateway support including mobile wallets.',
//     iconColor: 'text-green-600',
//     bgColor: 'bg-green-100'
//   },
//   {
//     icon: Zap,
//     title: 'Lightning Fast',
//     description: 'Real-time WebSocket connections ensure instant updates with minimal latency.',
//     iconColor: 'text-blue-600',
//     bgColor: 'bg-blue-100'
//   },
//   {
//     icon: Star,
//     title: 'Sri Lankan Context',
//     description: 'Designed specifically for Sri Lankan transport patterns and user preferences.',
//     iconColor: 'text-purple-600',
//     bgColor: 'bg-purple-100'
//   }
// ]

// export function BenefitsSection() {
//   return (
//     <section className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-6">
//               Built for Sri Lankan Commuters
//             </h2>
//             <div className="space-y-6">
//               {benefits.map((benefit, index) => (
//                 <div key={index} className="flex items-start space-x-4">
//                   <div className={`w-8 h-8 ${benefit.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
//                     <benefit.icon className={`h-5 w-5 ${benefit.iconColor}`} />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
//                     <p className="text-gray-600">{benefit.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8 text-center">
//             <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Users className="h-12 w-12 text-white" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">Join the Revolution</h3>
//             <p className="text-gray-600 mb-6">
//               Be part of Sri Lanka's transport transformation. Join thousands of satisfied users.
//             </p>
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div>
//                 <div className="text-2xl font-bold text-blue-600">25K+</div>
//                 <div className="text-sm text-gray-600">Active Users</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-cyan-600">150+</div>
//                 <div className="text-sm text-gray-600">Bus Routes</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-purple-600">98%</div>
//                 <div className="text-sm text-gray-600">Accuracy</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }




'use client'

import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  Zap, 
  Star, 
  Users, 
  Sparkles, 
  Heart,
  TrendingUp,
  Award,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react'

// Benefits data with enhanced styling
const benefits = [
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'PCI DSS compliant payment processing with end-to-end encryption and multi-layer security protocols.',
    gradient: 'from-emerald-400 to-green-500',
    cardGradient: 'from-emerald-50 to-green-50',
    accentColor: 'emerald',
    features: ['256-bit SSL encryption', 'PCI DSS compliance', 'Fraud protection']
  },
  {
    icon: Zap,
    title: 'Lightning Performance',
    description: 'Real-time WebSocket connections with edge computing ensure sub-second response times globally.',
    gradient: 'from-blue-400 to-cyan-500',
    cardGradient: 'from-blue-50 to-cyan-50',
    accentColor: 'blue',
    features: ['<200ms response time', 'Real-time updates', 'Edge optimization']
  },
  {
    icon: Star,
    title: 'Sri Lankan Excellence',
    description: 'Crafted specifically for Sri Lankan transport patterns, local preferences, and cultural context.',
    gradient: 'from-violet-400 to-purple-500',
    cardGradient: 'from-violet-50 to-purple-50',
    accentColor: 'violet',
    features: ['Local route optimization', 'Cultural adaptation', 'Regional preferences']
  }
]

// Stats data
const statsData = [
  { value: '50K+', label: 'Happy Users', icon: Users, gradient: 'from-rose-400 to-pink-500' },
  { value: '200+', label: 'Live Routes', icon: MapPin, gradient: 'from-cyan-400 to-blue-500' },
  { value: '99.9%', label: 'Uptime', icon: TrendingUp, gradient: 'from-violet-400 to-purple-500' }
]

// Floating elements
const floatingElements = [
  { icon: Award, position: 'top-20 left-20', delay: '0s' },
  { icon: Clock, position: 'bottom-40 right-32', delay: '1s' }
]

export function BenefitsSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeBenefit, setActiveBenefit] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Auto-rotate benefits
    const interval = setInterval(() => {
      setActiveBenefit(prev => (prev + 1) % benefits.length)
    }, 3500)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(interval)
    }
  }, [])

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden py-20">
      {/* Enhanced Pastel Background */}
      <div className="absolute inset-0">
        {/* Main gradient orbs */}
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/35 via-cyan-200/30 to-emerald-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating elements */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.position} w-6 h-6 bg-gradient-to-br from-rose-300/60 to-violet-400/60 rounded-full animate-bounce shadow-lg`}
            style={{ animationDelay: element.delay }}
          >
            <element.icon className="h-4 w-4 text-white m-1" />
          </div>
        ))}
        
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero-style Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Floating Status Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-rose-200/50 shadow-lg mb-12">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse mr-3"></div>
              <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
                Built for Sri Lankan Excellence
              </span>
              <Sparkles className="h-4 w-4 text-rose-400 ml-2 animate-spin" />
            </div>
          </div>

          {/* Hero-style Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-8">
            <div className="space-y-3">
              <span className="block text-slate-600">Designed For</span>
              <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent animate-pulse">
                Sri Lankan
              </span>
              <div className="flex items-center justify-center gap-4">
                <span className="text-slate-700">Commuters</span>
                <Heart className="h-8 w-8 text-rose-400 animate-bounce" />
              </div>
            </div>
          </h2>

          <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            Experience transport technology that understands your needs and delivers
            <span className="mx-2 px-4 py-2 bg-gradient-to-r from-rose-100 via-pink-100 to-violet-100 rounded-full text-violet-700 font-bold inline-flex items-center shadow-sm">
              <Star className="h-4 w-4 mr-2 text-rose-500" />
              exceptional results
            </span>
            every single journey.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Benefits Column */}
          <div className={`space-y-8 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`group relative bg-gradient-to-br ${benefit.cardGradient} backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                  activeBenefit === index ? 'scale-105 shadow-2xl' : ''
                }`}
                onMouseEnter={() => setActiveBenefit(index)}
              >
                {/* Floating accent dot */}
                <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${benefit.gradient} rounded-full animate-pulse`}></div>
                
                {/* Icon and Title Row */}
                <div className="flex items-start space-x-6 mb-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0`}>
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Title and Description */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-3xl transition-all duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {benefit.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {benefit.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center group-hover:translate-x-2 transition-transform duration-300">
                      <div className={`w-6 h-6 bg-gradient-to-r ${benefit.gradient} rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-sm`}>
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>

          {/* Stats Column */}
          <div className={`transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Main Stats Card */}
            <div className="relative bg-gradient-to-br from-violet-50 to-purple-50 backdrop-blur-xl p-12 rounded-3xl border border-white/60 shadow-2xl mb-8">
              {/* Floating accent elements */}
              <div className="absolute top-6 right-6 w-4 h-4 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full animate-pulse delay-500"></div>
              
              {/* Header */}
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-400 via-purple-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Users className="h-12 w-12 text-white" />
                </div>
                
                <h3 className="text-3xl font-black text-slate-800 mb-4">
                  Join the Revolution
                </h3>
                
                <p className="text-slate-600 text-lg font-medium leading-relaxed">
                  Be part of Sri Lanka's transport transformation. Join thousands of satisfied travelers.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statsData.map((stat, index) => (
                  <div 
                    key={index}
                    className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 hover:border-violet-300/50 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="text-3xl font-black text-slate-800 mb-2 group-hover:text-4xl transition-all duration-300">
                      {stat.value}
                    </div>
                    
                    <div className="text-sm text-slate-600 font-semibold">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">4.9★</div>
                  <div className="text-sm text-slate-600 font-semibold">User Rating</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-black text-slate-800">#1</div>
                  <div className="text-sm text-slate-600 font-semibold">Transit App</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
