// 'use client'

// import React from 'react'

// const steps = [
//   {
//     number: '1',
//     title: 'Create Account',
//     description: 'Sign up in seconds to access all features and personalize your journey experience.',
//     gradient: 'from-blue-600 to-cyan-600'
//   },
//   {
//     number: '2', 
//     title: 'Find & Book',
//     description: 'Use our smart journey planner to find routes and book your tickets instantly.',
//     gradient: 'from-cyan-600 to-purple-600'
//   },
//   {
//     number: '3',
//     title: 'Track & Travel',
//     description: 'Follow your bus in real-time and enjoy a stress-free journey.',
//     gradient: 'from-purple-600 to-pink-600'
//   }
// ]

// export function HowItWorksSection() {
//   return (
//     <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//             Your Journey, Simplified
//           </h2>
//           <p className="text-lg text-gray-600">
//             Get started with TransitLK in three easy steps
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {steps.map((step, index) => (
//             <div key={index} className="text-center">
//               <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
//                 <span className="text-white text-2xl font-bold">{step.number}</span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
//               <p className="text-gray-600">{step.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }





'use client'

import React, { useState, useEffect } from 'react'
import { 
  UserPlus, 
  Search, 
  Navigation, 
  Sparkles, 
  Heart, 
  ArrowRight,
  CheckCircle,
  Smartphone,
  MapPin,
  Clock,
  Star,
  Zap
} from 'lucide-react'

const steps = [
  {
    number: '1',
    title: 'Create Your Magic Account',
    description: 'Join our community in seconds with smart verification and personalized onboarding experience.',
    icon: UserPlus,
    gradient: 'from-rose-400 to-pink-500',
    cardGradient: 'from-rose-50 to-pink-50',
    accentColor: 'rose',
    features: [
      'Smart verification system',
      'Personalized dashboard',
      'Instant profile setup',
      'Welcome rewards'
    ],
    stats: { value: '<30s', label: 'Setup Time' }
  },
  {
    number: '2', 
    title: 'Find & Book Instantly',
    description: 'Discover perfect routes with AI-powered planning and book your journey with lightning speed.',
    icon: Search,
    gradient: 'from-violet-400 to-purple-500',
    cardGradient: 'from-violet-50 to-purple-50',
    accentColor: 'violet',
    features: [
      'AI route optimization',
      'Real-time availability',
      'Multiple payment options',
      'Smart notifications'
    ],
    stats: { value: '2.5s', label: 'Booking Speed' }
  },
  {
    number: '3',
    title: 'Track & Travel Blissfully',
    description: 'Follow your journey in real-time with precision tracking and enjoy stress-free travel experiences.',
    icon: Navigation,
    gradient: 'from-cyan-400 to-blue-500',
    cardGradient: 'from-cyan-50 to-blue-50',
    accentColor: 'cyan',
    features: [
      'Live GPS tracking',
      'Arrival predictions',
      'Journey updates',
      'Smart assistance'
    ],
    stats: { value: '99.9%', label: 'Accuracy' }
  }
]

const floatingElements = [
  { icon: Smartphone, position: 'top-32 left-16', delay: '0s' },
  { icon: MapPin, position: 'top-64 right-24', delay: '0.5s' },
  { icon: Clock, position: 'bottom-40 left-24', delay: '1s' },
  { icon: Star, position: 'bottom-32 right-16', delay: '1.5s' }
]

export function HowItWorksSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Auto-progress steps
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length)
    }, 3000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(interval)
    }
  }, [])

  return (
    <section id="how-it-works" className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden py-20">
      {/* Enhanced Pastel Background - Same as Hero */}
      <div className="absolute inset-0">
        {/* Main gradient orbs */}
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/35 via-cyan-200/30 to-emerald-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-violet-200/30 via-indigo-200/25 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        
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
                Simple Journey Process
              </span>
              <Sparkles className="h-4 w-4 text-rose-400 ml-2 animate-spin" />
            </div>
          </div>

          {/* Hero-style Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative mr-6">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-500">
                  <ArrowRight className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <span className="block text-slate-600">Your Journey,</span>
              <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent animate-pulse">
                Simplified
              </span>
              <div className="flex items-center justify-center gap-4">
                <span className="text-slate-700">& Magical</span>
                <Heart className="h-8 w-8 text-rose-400 animate-bounce" />
              </div>
            </div>
          </h2>

          <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            Get started with TransitLK in three 
            <span className="mx-2 px-4 py-2 bg-gradient-to-r from-rose-100 via-pink-100 to-violet-100 rounded-full text-violet-700 font-bold inline-flex items-center shadow-sm">
              <Zap className="h-4 w-4 mr-2 text-rose-500" />
              magical steps
            </span>
            and transform your daily travel experience.
          </p>
        </div>

        {/* Steps with Connecting Line */}
        <div className={`relative mb-20 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-32 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-1">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-300 via-violet-300 to-cyan-300 rounded-full opacity-30"></div>
              <div className={`absolute inset-0 bg-gradient-to-r from-rose-400 via-violet-400 to-cyan-400 rounded-full transition-all duration-1000 ${
                isLoaded ? 'w-full' : 'w-0'
              }`}></div>
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`group relative transition-all duration-500 ${
                  activeStep === index ? 'scale-105' : 'hover:scale-105'
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Step Card */}
                <div className={`relative bg-gradient-to-br ${step.cardGradient} backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
                  {/* Floating accent dot */}
                  <div className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${step.gradient} rounded-full animate-pulse`}></div>
                  
                  {/* Step Number Badge */}
                  <div className="flex justify-center mb-8">
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      <span className="text-white text-2xl font-black">{step.number}</span>
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity`}></div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-black text-slate-800 mb-4 text-center group-hover:text-3xl transition-all duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed font-medium text-center">
                    {step.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        <div className={`w-6 h-6 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-sm`}>
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-slate-700 font-medium text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stats */}
                  <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40">
                    <div>
                      <div className="text-2xl font-black text-slate-800">{step.stats.value}</div>
                      <div className="text-sm text-slate-600 font-semibold">{step.stats.label}</div>
                    </div>
                    <div className={`w-10 h-10 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Star className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </div>

                {/* Arrow Between Steps (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-32 -right-6 w-12 h-12 items-center justify-center z-10">
                    <div className={`w-8 h-8 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center shadow-lg animate-bounce`}>
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className={`flex justify-center space-x-4 mb-16 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                activeStep === index 
                  ? 'bg-gradient-to-r from-rose-400 to-violet-400 scale-125' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center space-x-2 text-slate-600 text-lg font-semibold">
            <Sparkles className="h-6 w-6 text-rose-400 animate-pulse" />
            <span>Ready to start your magical journey?</span>
            <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
