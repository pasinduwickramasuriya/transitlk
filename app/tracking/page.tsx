// import { Suspense } from 'react'
// import { Loader2 } from 'lucide-react'
// import { PublicBusTrackingClient } from '@/components/user/PublicBusTrackingClient'
// import { Navbar } from '@/components/landing/Navbar'
// import { Footer } from '@/components/landing/Footer'

// export const metadata = {
//   title: 'Track Your Bus - Live GPS Tracking',
//   description: 'Track your bus in real-time with live GPS location updates'
// }

// export default function TrackingPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
//         <Navbar/>
//       <Suspense fallback={<LoadingFallback />}>
//         <PublicBusTrackingClient />
//       </Suspense>
//       <Footer/>
//     </div>
//   )
// }

// function LoadingFallback() {
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center space-y-4">
//         <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
//         <p className="text-lg text-slate-600 font-medium">Loading tracking system...</p>
//       </div>
//     </div>
//   )
// }









'use client'

import { PublicBusTrackingClient } from '@/components/user/PublicBusTrackingClient'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br mt-10 from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />
      <PublicBusTrackingClient />
      <Footer />
    </div>
  )
}
