// import { Sidebar } from '@/components/dashboard/sidebar'
// import { Navbar } from '@/components/landing/Navbar'
// import { Providers } from '@/components/providers'


// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     // <div className="min-h-screen bg-gray-50">
//     <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden">

//       <div className="flex h-screen">
//         <Navbar />

//         <Sidebar />

//         {/* Main Content */}

//         <div className="flex-1 flex flex-col overflow-hidden">
//           <main className="flex-1 overflow-y-auto p-6">

//             <Providers>
//               {children}
//             </Providers>

//           </main>

//         </div>

//       </div>
//     </div>
//   )
// }







'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Navbar } from '@/components/landing/Navbar'
import { Providers } from '@/components/providers'
import { isUserLoggedIn } from '@/utils/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Immediately check if user state is valid on mount, otherwise redirect home
    if (!isUserLoggedIn()) {
      router.push('/dashboard')
    }

    // Optionally, poll every 10 seconds to detect session expiry in real-time
    const intervalId = setInterval(() => {
      if (!isUserLoggedIn()) {
        router.push('/')
        clearInterval(intervalId)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [router])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden">
      <div className="flex h-screen">
        <Navbar />
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <Providers>
              {children}
            </Providers>
          </main>
        </div>
      </div>
    </div>
  )
}
