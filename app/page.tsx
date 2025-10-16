// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
      
//     </div>
    
//   );
// }






// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import {
//   MapPin,
//   Clock,
//   CreditCard,
//   Smartphone,
//   Users,
//   BarChart3,
//   Navigation,
//   Zap,
//   Shield,
//   Star,
//   ArrowRight,
//   Play,
//   CheckCircle
// } from 'lucide-react'

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
//       {/* Navigation */}
//       <nav className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 flex items-center">
//                 <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
//                   <Navigation className="h-5 w-5 text-white" />
//                 </div>
//                 <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//                   TransitLK
//                 </span>
//               </div>
//             </div>
//             <div className="hidden md:block">
//               <div className="ml-10 flex items-baseline space-x-8">
//                 <Link href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
//                   Features
//                 </Link>
//                 <Link href="#services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
//                   Services
//                 </Link>
//                 <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
//                   How It Works
//                 </Link>
//                 <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
//                   Sign In
//                 </Link>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Button asChild variant="outline" className="hidden sm:inline-flex">
//                 <Link href="/auth/login">Sign In</Link>
//               </Button>
//               <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
//                 <Link href="/auth/register">Get Started</Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden py-20 sm:py-32">
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5" />
//           <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/3 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl" />
//         </div>
        
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
//               <span className="block">Seamless</span>
//               <span className="block">Journeys Start</span>
//               <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//                 Here.
//               </span>
//             </h1>
//             <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
//               The future of Sri Lankan public transport. Real-time tracking, effortless booking, 
//               and powerful analytics, unified in one innovative platform.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button 
//                 size="lg" 
//                 className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 py-4 h-auto"
//                 asChild
//               >
//                 <Link href="/auth/register">
//                   Discover Our Services
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Link>
//               </Button>
//               <Button 
//                 size="lg" 
//                 variant="outline" 
//                 className="text-lg px-8 py-4 h-auto border-2 hover:bg-gray-50"
//                 asChild
//               >
//                 <Link href="#demo">
//                   <Play className="mr-2 h-5 w-5" />
//                   Watch Demo
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Core Features Section */}
//       <section id="features" className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               The Core of Modern Transit
//             </h2>
//             <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//               TransitLK is engineered with a powerful suite of services to create an efficient, 
//               reliable, and user-friendly transport network for everyone.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Real-Time Tracking */}
//             <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
//               <CardContent className="p-8">
//                 <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                   <MapPin className="h-6 w-6 text-white" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Tracking</h3>
//                 <p className="text-gray-600 mb-4">
//                   Pinpoint accuracy for your commute. See live bus locations and get precise arrival times.
//                 </p>
//                 <ul className="text-sm text-gray-500 space-y-1">
//                   <li className="flex items-center">
//                     <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                     GPS-based live tracking
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                     2-minute accuracy guarantee
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>

//             {/* Online Booking */}
//             <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
//               <CardContent className="p-8">
//                 <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                   <Smartphone className="h-6 w-6 text-white" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Booking</h3>
//                 <p className="text-gray-600 mb-4">
//                   Your seat secured. Book tickets instantly from anywhere, anytime with QR code validation.
//                 </p>
//                 <ul className="text-sm text-gray-500 space-y-1">
//                   <li className="flex items-center">
//                     <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                     Real-time seat availability
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                     QR code mobile validation
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>

//             {/* Operator Dashboard */}
//             <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
//               <CardContent className="p-8">
//                 <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                   <BarChart3 className="h-6 w-6 text-white" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">Operator Dashboards</h3>
//                 <p className="text-gray-600 mb-4">
//                   Data-driven decisions for operators. Optimize routes and manage fleets with real-time analytics.
//                 </p>
//                 <ul className="text-sm text-gray-500 space-y-1">
//                   <li className="flex items-center">
//                     <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                     Comprehensive fleet management
//                   </li>
//                   <li className="flex items-center">
//                     <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                     Performance analytics
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//               Your Journey, Simplified
//             </h2>
//             <p className="text-lg text-gray-600">
//               Get on board with TransitLK in three easy steps
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Step 1 */}
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <span className="text-white text-2xl font-bold">1</span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Create Account</h3>
//               <p className="text-gray-600">
//                 Sign up in seconds to access all features and personalize your experience.
//               </p>
//             </div>

//             {/* Step 2 */}
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <span className="text-white text-2xl font-bold">2</span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Plan & Book</h3>
//               <p className="text-gray-600">
//                 Use our intuitive journey planner to find your route and book your ticket.
//               </p>
//             </div>

//             {/* Step 3 */}
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <span className="text-white text-2xl font-bold">3</span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Track & Go</h3>
//               <p className="text-gray-600">
//                 Follow your bus in real-time and travel with confidence.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Additional Features */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900 mb-6">
//                 Built for Sri Lankan Commuters
//               </h2>
//               <div className="space-y-6">
//                 <div className="flex items-start space-x-4">
//                   <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <Shield className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-1">Secure Payments</h3>
//                     <p className="text-gray-600">PCI DSS compliant payment processing with multiple gateway support.</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-4">
//                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <Zap className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-1">Lightning Fast</h3>
//                     <p className="text-gray-600">WebSocket connections ensure real-time updates with minimal latency.</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-4">
//                   <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <Star className="h-5 w-5 text-purple-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-1">User-Centric Design</h3>
//                     <p className="text-gray-600">Intuitive interface designed specifically for Sri Lankan transport needs.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8 text-center">
//               <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <Users className="h-12 w-12 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Thousands</h3>
//               <p className="text-gray-600 mb-6">
//                 Be part of Sri Lanka's transport revolution. Join thousands of satisfied users.
//               </p>
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <div className="text-2xl font-bold text-blue-600">50K+</div>
//                   <div className="text-sm text-gray-600">Users</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-cyan-600">500+</div>
//                   <div className="text-sm text-gray-600">Routes</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold text-purple-600">98%</div>
//                   <div className="text-sm text-gray-600">Accuracy</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600">
//         <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
//             Ready for a Better Ride?
//           </h2>
//           <p className="text-xl text-blue-100 mb-8">
//             Join the thousands of Sri Lankans embracing a smarter, more connected way to travel. 
//             Download the app and start your journey today.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button 
//               size="lg" 
//               className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto font-semibold"
//               asChild
//             >
//               <Link href="/auth/register">Get Started Now</Link>
//             </Button>
//             <Button 
//               size="lg" 
//               variant="outline" 
//               className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 h-auto"
//               asChild
//             >
//               <Link href="/contact">Contact Sales</Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-400 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center mb-4">
//                 <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
//                   <Navigation className="h-5 w-5 text-white" />
//                 </div>
//                 <span className="ml-2 text-xl font-bold text-white">TransitLK</span>
//               </div>
//               <p className="text-sm">
//                 Revolutionizing public transport in Sri Lanka with cutting-edge technology and user-centric design.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-white font-semibold mb-4">Platform</h3>
//               <ul className="space-y-2 text-sm">
//                 <li><Link href="#" className="hover:text-white transition-colors">Real-Time Tracking</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Online Booking</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Operator Dashboard</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">For Commuters</Link></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-white font-semibold mb-4">Company</h3>
//               <ul className="space-y-2 text-sm">
//                 <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-white font-semibold mb-4">Resources</h3>
//               <ul className="space-y-2 text-sm">
//                 <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
//                 <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
//             <p>&copy; 2025 TransitLK. All rights reserved. Built with innovation in Sri Lanka.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }







'use client'

import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { BenefitsSection } from '@/components/landing/BenefitsSection'
import { CTASection } from '@/components/landing/CTASection'
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
      <CTASection />
      <Footer />
      <BusAssistant/>
    </div>
  )
}
