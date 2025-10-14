// 'use client'

// import React from 'react'
// import { Card, CardContent } from '@/components/ui/card'
// import { MapPin, Smartphone, BarChart3, CheckCircle } from 'lucide-react'

// const features = [
//   {
//     icon: MapPin,
//     title: 'Real-Time GPS Tracking',
//     description: 'Track your bus live with pinpoint accuracy. Know exactly when your bus will arrive.',
//     gradient: 'from-blue-50 to-blue-100/50',
//     iconBg: 'bg-blue-600',
//     highlights: [
//       'GPS-based live tracking',
//       'WebSocket real-time updates',
//       '2-minute accuracy guarantee'
//     ]
//   },
//   {
//     icon: Smartphone,
//     title: 'Digital Ticketing',
//     description: 'Book tickets instantly with QR code validation. No more cash transactions or long queues.',
//     gradient: 'from-cyan-50 to-cyan-100/50',
//     iconBg: 'bg-cyan-600',
//     highlights: [
//       'Real-time seat availability',
//       'Multi-payment gateways'
//     ]
//   },
//   {
//     icon: BarChart3,
//     title: 'Smart Analytics',
//     description: 'Powerful insights for operators and data-driven journey planning for passengers.',
//     gradient: 'from-purple-50 to-purple-100/50',
//     iconBg: 'bg-purple-600',
//     highlights: [
//       'Fleet management dashboard',
//       'Route optimization',
//       'Performance analytics'
//     ]
//   }
// ]

// export function FeaturesSection() {
//   return (
//     <section id="features" className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//             Revolutionizing Sri Lankan Transport
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             TransitLK brings cutting-edge technology to public transport, making travel 
//             efficient, reliable, and user-friendly for everyone across Sri Lanka.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <Card 
//               key={index}
//               className={`group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${feature.gradient}`}
//             >
//               <CardContent className="p-8">
//                 <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
//                   <feature.icon className="h-6 w-6 text-white" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
//                 <p className="text-gray-600 mb-4">{feature.description}</p>
//                 <ul className="text-sm text-gray-500 space-y-1">
//                   {feature.highlights.map((highlight, idx) => (
//                     <li key={idx} className="flex items-center">
//                       <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
//                       {highlight}
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }




'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  MapPin,
  Smartphone,
  BarChart3,
  CheckCircle,
  Sparkles,
  Zap,
  Star,
  Heart,
  TrendingUp,
  Activity,
  Clock,
  Shield,
  Users,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Real-Time GPS Magic',
    description: 'Experience the future of tracking with AI-powered precision and crystal-clear location updates.',
    gradient: 'from-rose-50 to-pink-50',
    iconGradient: 'from-rose-400 to-pink-500',
    accentColor: 'rose',
    highlights: [
      'GPS-based live tracking',
      'WebSocket real-time updates',
      '2-minute accuracy guarantee',
      'Smart route predictions'
    ],
    stats: { value: '99.9%', label: 'Accuracy' }
  },
  {
    icon: Smartphone,
    title: 'Digital Booking Bliss',
    description: 'Seamlessly book your journey with smart QR validation and lightning-fast payment processing.',
    gradient: 'from-violet-50 to-purple-50',
    iconGradient: 'from-violet-400 to-purple-500',
    accentColor: 'violet',
    highlights: [
      'Instant seat availability',
      'Multi-payment gateways',
      'QR code validation',
      'Smart notifications'
    ],
    stats: { value: '<2s', label: 'Booking Time' }
  },
  {
    icon: BarChart3,
    title: 'Intelligent Analytics',
    description: 'Unlock powerful insights with AI-driven analytics and predictive intelligence for smarter decisions.',
    gradient: 'from-cyan-50 to-blue-50',
    iconGradient: 'from-cyan-400 to-blue-500',
    accentColor: 'cyan',
    highlights: [
      'Fleet management dashboard',
      'Route optimization AI',
      'Performance analytics',
      'Predictive maintenance'
    ],
    stats: { value: '40%', label: 'Efficiency Boost' }
  }
]

const backgroundFeatures = [
  { icon: Shield, position: 'top-20 left-20', delay: '0s' },
  { icon: Users, position: 'top-40 right-32', delay: '0.5s' },
  { icon: Globe, position: 'bottom-32 left-32', delay: '1s' },
  { icon: Activity, position: 'bottom-20 right-20', delay: '1.5s' }
]

export function FeaturesSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 4000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(interval)
    }
  }, [])

  return (
    <section id="features" className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden py-20">
      {/* Enhanced Pastel Background - Same as Hero */}
      <div className="absolute inset-0">
        {/* Main gradient orbs */}
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/35 via-cyan-200/30 to-emerald-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-violet-200/30 via-indigo-200/25 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating elements */}
        {backgroundFeatures.map((feature, index) => (
          <div
            key={index}
            className={`absolute ${feature.position} w-6 h-6 bg-gradient-to-br from-rose-300/60 to-violet-400/60 rounded-full animate-bounce shadow-lg`}
            style={{ animationDelay: feature.delay }}
          >
            <feature.icon className="h-4 w-4 text-white m-1" />
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
                Revolutionary Features
              </span>
              <Sparkles className="h-4 w-4 text-rose-400 ml-2 animate-spin" />
            </div>
          </div>

          {/* Hero-style Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative mr-6">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-500">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="block text-slate-600">Revolutionizing</span>
              <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent animate-pulse">
                Sri Lankan
              </span>
              <div className="flex items-center justify-center gap-4">
                <span className="text-slate-700">Transport</span>
                <Heart className="h-8 w-8 text-rose-400 animate-bounce" />
              </div>
            </div>
          </h2>

          <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            TransitLK brings cutting-edge technology to public transport, making travel
            <span className="mx-2 px-4 py-2 bg-gradient-to-r from-rose-100 via-pink-100 to-violet-100 rounded-full text-violet-700 font-bold inline-flex items-center shadow-sm">
              <Zap className="h-4 w-4 mr-2 text-rose-500" />
              efficient & magical
            </span>
            for everyone across Sri Lanka.
          </p>

          {/* Feature Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`flex items-center px-5 py-3 rounded-full border transition-all duration-300 cursor-pointer ${activeFeature === index
                  ? `bg-gradient-to-r ${feature.gradient} border-${feature.accentColor}-300 scale-105 shadow-lg`
                  : 'bg-white/80 border-white/40 hover:border-rose-200/50 hover:scale-105'
                  }`}
              >
                <feature.icon className={`h-4 w-4 mr-2 ${activeFeature === index ? `text-${feature.accentColor}-600` : 'text-slate-500'
                  }`} />
                <span className={`text-sm font-medium ${activeFeature === index ? `text-${feature.accentColor}-700` : 'text-slate-700'
                  }`}>
                  {feature.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-3xl`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <CardContent className="p-8">
                {/* Floating accent dot */}
                <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${feature.iconGradient} rounded-full animate-pulse`}></div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.iconGradient} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-3xl transition-all duration-300">
                  {feature.title}
                </h3>

                <p className="text-slate-600 mb-6 leading-relaxed font-medium">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-3 mb-8">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      <div className={`w-6 h-6 bg-gradient-to-r ${feature.iconGradient} rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-sm`}>
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Stats */}
                <div className={`flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40`}>
                  <div>
                    <div className="text-2xl font-black text-slate-800">{feature.stats.value}</div>
                    <div className="text-sm text-slate-600 font-semibold">{feature.stats.label}</div>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-br ${feature.iconGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Star className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconGradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats Row - Hero Style */}
        {/* <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { 
              value: "50K+", 
              label: "Daily Users", 
              icon: Users, 
              gradient: "from-rose-400 to-pink-500",
              bg: "from-rose-50 to-pink-50"
            },
            { 
              value: "99.9%", 
              label: "Uptime", 
              icon: Activity, 
              gradient: "from-violet-400 to-purple-500",
              bg: "from-violet-50 to-purple-50"
            },
            { 
              value: "<2s", 
              label: "Response", 
              icon: Clock, 
              gradient: "from-cyan-400 to-blue-500",
              bg: "from-cyan-50 to-blue-50"
            },
            { 
              value: "24/7", 
              label: "Support", 
              icon: Shield, 
              gradient: "from-emerald-400 to-green-500",
              bg: "from-emerald-50 to-green-50"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${stat.bg} backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
            >
              <div className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${stat.gradient} rounded-full animate-pulse`}></div>
              
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              
              <div className="text-2xl font-black text-slate-800 mb-1 group-hover:text-3xl transition-all duration-300">
                {stat.value}
              </div>
              
              <div className="text-sm text-slate-600 font-semibold">
                {stat.label}
              </div>
              
              {/* Hover glow effect */}
        {/* <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  )
}
