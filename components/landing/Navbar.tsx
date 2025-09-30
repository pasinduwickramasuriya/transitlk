// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { Navigation } from 'lucide-react'

// export function Navbar() {
//   return (
//     <nav className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 flex items-center">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
//                 <Navigation className="h-5 w-5 text-white" />
//               </div>
//               <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//                 TransitLK
//               </span>
//             </div>
//           </div>
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-8">
//               <Link href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
//                 Features
//               </Link>
//               <Link href="#services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
//                 Services
//               </Link>
//               <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
//                 How It Works
//               </Link>
//               <Link href="/auth/signup" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
//                 Sign In
//               </Link>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Button asChild variant="outline" className="hidden sm:inline-flex">
//               <Link href="/auth/signin">Sign In</Link>
//             </Button>
//             <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
//               <Link href="/auth/signup">Get Started</Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }






'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navigation, Menu, X } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Navigation className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                TransitLK
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="#services" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Services
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                How it Works
              </Link>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          {/* Sign Up Button */}
          <div className="flex items-center space-x-4">
            <Button 
              asChild 
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full font-medium"
            >
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-2">
              <Link href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="#services" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Services
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                How it Works
              </Link>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
