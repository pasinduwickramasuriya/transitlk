// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'

// export function CTASection() {
//   return (
//     <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600">
//       <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//         <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
//           Ready to Transform Your Commute?
//         </h2>
//         <p className="text-xl text-blue-100 mb-8">
//           Join thousands of Sri Lankans who have already embraced smarter, more connected travel. 
//           Experience the future of public transport today.
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Button 
//             size="lg" 
//             className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto font-semibold"
//             asChild
//           >
//             <Link href="/auth/register">Get Started Now</Link>
//           </Button>
//           <Button 
//             size="lg" 
//             variant="outline" 
//             className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 h-auto"
//             asChild
//           >
//             <Link href="/contact">Learn More</Link>
//           </Button>
//         </div>
//       </div>
//     </section>
//   )
// }






'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
          Ready for a Better Ride?
        </h2>
        <p className="text-xl text-slate-300 mb-12 leading-relaxed">
          Join the thousands of Sri Lankans embracing a smarter, more connected way to 
          travel. Download the app and start your journey today.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button 
            size="lg" 
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full text-lg font-medium h-auto"
            asChild
          >
            <Link href="/auth/register">Get Started Now</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-slate-300 text-slate-300 hover:bg-slate-300 hover:text-slate-900 px-8 py-4 rounded-full text-lg font-medium h-auto"
            asChild
          >
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
