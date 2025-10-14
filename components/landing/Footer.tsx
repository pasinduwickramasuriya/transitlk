




// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { Navigation } from 'lucide-react'

// export function Footer() {
//   return (
//     <footer className="bg-slate-900 text-slate-400 py-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
//           <div className="md:col-span-1">
//             <div className="flex items-center mb-6">
//               <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
//                 <Navigation className="h-5 w-5 text-white" />
//               </div>
//               <span className="ml-3 text-xl font-bold text-white">TransitLK</span>
//             </div>
//             <p className="text-sm text-slate-400 leading-relaxed">
//               Revolutionizing public transport in Sri Lanka 
//               with innovative Sri Lanka.
//             </p>
//           </div>
          
//           <div>
//             <h3 className="text-white font-semibold mb-6">Platform</h3>
//             <ul className="space-y-3 text-sm">
//               <li><Link href="#" className="hover:text-white transition-colors">Real-Time Tracking</Link></li>
//               <li><Link href="#" className="hover:text-white transition-colors">Online Booking</Link></li>
//               <li><Link href="#" className="hover:text-white transition-colors">Operator Dashboards</Link></li>
//               <li><Link href="#" className="hover:text-white transition-colors">For Commuters</Link></li>
//             </ul>
//           </div>
          
//           <div>
//             <h3 className="text-white font-semibold mb-6">Company</h3>
//             <ul className="space-y-3 text-sm">
//               <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
//               <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
//               <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
//               <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
//             </ul>
//           </div>
          
//           <div>
//             <h3 className="text-white font-semibold mb-6">Resources</h3>
//             <ul className="space-y-3 text-sm">
//               <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
//               <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
//               <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
//               <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
//             </ul>
//           </div>
//         </div>
        
//         <div className="border-t border-slate-700 pt-8 text-center text-sm">
//           <p>&copy; 2025 TransitLK. All rights reserved. Built with innovations in Sri Lanka</p>
//         </div>
//       </div>
//     </footer>
//   )
// }





'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Navigation, 
  Sparkles, 
  Heart, 
  Mail, 
  Phone, 
  MapPin,
  Users,
  Clock,
  Star,
  ArrowRight,
  Send,
  TrendingUp,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Subscribe:', email)
    setEmail('')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden">
      {/* Enhanced Pastel Background - Same as HeroSection */}
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
        {/* Newsletter Section with Hero-style */}
        {/* <div className={`text-center mb-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
         
          <div className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-rose-200/50 shadow-lg mb-12">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse mr-3"></div>
              <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
                Stay Connected with TransitLK
              </span>
              <Sparkles className="h-4 w-4 text-rose-400 ml-2 animate-spin" />
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative mr-6">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-500">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent animate-pulse">
                Journey
              </span>
              <div className="flex items-center justify-center gap-4">
                <span className="text-slate-600">Updates</span>
                <Heart className="h-8 w-8 text-rose-400 animate-bounce" />
                <span className="text-slate-700">Daily.</span>
              </div>
            </div>
          </h2>

          <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            Get the latest updates on new routes, features, and 
            <span className="mx-2 px-4 py-2 bg-gradient-to-r from-rose-100 via-pink-100 to-violet-100 rounded-full text-violet-700 font-bold inline-flex items-center shadow-sm">
              <Star className="h-4 w-4 mr-2 text-rose-500" />
              transit innovations
            </span>
            delivered to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-6 justify-center mb-16 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-16 pr-6 py-5 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all duration-300 text-lg"
                required
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white px-12 py-5 rounded-3xl text-lg font-bold h-auto shadow-2xl hover:shadow-rose-500/25 transition-all duration-500 transform hover:scale-110"
            >
              <Send className="h-5 w-5 mr-3 group-hover:translate-x-2 transition-transform duration-300" />
              Subscribe Now
              <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
             
              <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000"></div>
            </Button>
          </form>
        </div> */}

        {/* Main Footer Content with Hero-style Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Brand Section */}
          <div className="group relative bg-gradient-to-br from-rose-50 to-pink-50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center mb-8">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:rotate-12 transition-all duration-300">
                  <Navigation className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-4">
                <span className="text-2xl font-black bg-gradient-to-r from-violet-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                  TransitLK
                </span>
                <div className="text-sm text-slate-600 font-semibold">Smart Transit</div>
              </div>
            </div>
            
            <p className="text-slate-600 leading-relaxed mb-6">
              Revolutionizing public transport across Sri Lanka with cutting-edge technology and seamless experiences.
            </p>

            {/* Contact Pills */}
            <div className="space-y-3">
              {[
                { icon: Mail, text: 'hello@transitlk.com', color: 'from-violet-400 to-purple-400' },
                { icon: Phone, text: '+94 11 234 5678', color: 'from-rose-400 to-pink-400' },
                { icon: MapPin, text: 'Colombo, Sri Lanka', color: 'from-cyan-400 to-blue-400' }
              ].map((contact, index) => (
                <div key={index} className="flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                  <div className={`w-6 h-6 bg-gradient-to-r ${contact.color} rounded-full flex items-center justify-center mr-3`}>
                    <contact.icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{contact.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Section */}
          <div className="group relative bg-gradient-to-br from-violet-50 to-purple-50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <h3 className="text-2xl font-black mb-6">
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Platform
              </span>
            </h3>
            
            <div className="space-y-4">
              {[
                { name: 'Real-Time Tracking', icon: Clock, color: 'from-emerald-400 to-green-500' },
                { name: 'Smart Booking', icon: Star, color: 'from-blue-400 to-cyan-500' },
                { name: 'Fleet Management', icon: Users, color: 'from-rose-400 to-pink-500' },
                { name: 'Mobile Apps', icon: Phone, color: 'from-violet-400 to-purple-500' }
              ].map((item, index) => (
                <Link key={index} href="#" className="group flex items-center space-x-3 p-3 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:scale-105">
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Company Section */}
          <div className="group relative bg-gradient-to-br from-cyan-50 to-blue-50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <h3 className="text-2xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Company
              </span>
            </h3>
            
            <div className="space-y-4">
              {[
                'About Us', 'Careers', 'Press Kit', 'Blog'
              ].map((item, index) => (
                <Link key={index} href="#" className="block group">
                  <div className="font-semibold text-slate-700 group-hover:text-cyan-600 transition-colors mb-1">
                    {item}
                  </div>
                  <div className="text-sm text-slate-500">
                    {item === 'About Us' && 'Our story & mission'}
                    {item === 'Careers' && 'Join our team'}
                    {item === 'Press Kit' && 'Media resources'}
                    {item === 'Blog' && 'Latest insights'}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="group relative bg-gradient-to-br from-emerald-50 to-green-50 backdrop-blur-xl p-8 rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <h3 className="text-2xl font-black mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Resources
              </span>
            </h3>
            
            <div className="space-y-4">
              {[
                'Help Center', 'API Docs', 'Privacy Policy', 'Terms of Service'
              ].map((item, index) => (
                <Link key={index} href="#" className="block group">
                  <div className="font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors mb-1">
                    {item}
                  </div>
                  <div className="text-sm text-slate-500">
                    {item === 'Help Center' && '24/7 support'}
                    {item === 'API Docs' && 'Developer resources'}
                    {item === 'Privacy Policy' && 'Data protection'}
                    {item === 'Terms of Service' && 'Legal information'}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section - Hero Style */}
        {/* <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
              icon: Star, 
              gradient: "from-violet-400 to-purple-500",
              bg: "from-violet-50 to-purple-50"
            },
            { 
              value: "<2s", 
              label: "Lightning Fast", 
              icon: TrendingUp, 
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
              {/* <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>  */}

        {/* Bottom Section */}
        <div className={`border-t border-white/30 pt-12 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-slate-600 mb-2 text-lg font-medium">
                &copy; 2025 TransitLK. All rights reserved.
              </p>
              <p className="text-slate-500 flex items-center justify-center lg:justify-start">
                Made with <Heart className="h-5 w-5 text-rose-400 mx-2 animate-pulse" /> in Sri Lanka
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {[
                { icon: Twitter, gradient: 'from-blue-400 to-cyan-500' },
                { icon: Facebook, gradient: 'from-blue-600 to-indigo-600' },
                { icon: Instagram, gradient: 'from-pink-400 to-rose-500' },
                { icon: Linkedin, gradient: 'from-indigo-500 to-blue-600' }
              ].map((social, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`group w-14 h-14 bg-gradient-to-br ${social.gradient} rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1`}
                >
                  <social.icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </Link>
              ))}
            </div>

            {/* Back to Top */}
            <Button
              onClick={scrollToTop}
              className="group w-14 h-14 bg-gradient-to-br from-violet-400/80 to-rose-400/80 hover:from-violet-500 hover:to-rose-500 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <ArrowUp className="h-6 w-6 text-white group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
