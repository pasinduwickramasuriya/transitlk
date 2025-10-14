// 'use client'

// import { Navbar } from "../landing/Navbar"

// interface BookingLayoutProps {
//   children: React.ReactNode
//   onBack: () => void
// }

// export function BookingLayout({ children, onBack }: BookingLayoutProps) {
//   return (
//     <>
//     <Navbar/>
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 relative overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0">
//         <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-cyan-300/30 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-br from-blue-300/25 to-teal-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div>
//       {/* Main Content */}
//       {children}
//     </div></>
//   )
// }







'use client'

import { Footer } from "../landing/Footer"
import { Navbar } from "../landing/Navbar"

interface BookingLayoutProps {
  children: React.ReactNode
  onBack: () => void
}

export function BookingLayout({ children, onBack }: BookingLayoutProps) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 relative overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-cyan-300/30 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-br from-blue-300/25 to-teal-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
      <Footer/>
    </>
  )
}
