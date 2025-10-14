
// 'use client'

// import React, { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Bus, MapPin, CreditCard, Clock, TrendingUp, Calendar } from 'lucide-react'
// import { isUserLoggedIn, getCurrentUser } from '@/utils/auth'

// interface Booking {
//   id: string
//   route: string
//   date: string
//   time: string
//   status: 'confirmed' | 'completed' | string
//   amount: number
// }

// interface Trip {
//   id: string
//   route: string
//   date: string
//   time: string
//   busNumber: string
//   status: 'confirmed' | 'completed' | string
// }

// interface Stats {
//   totalBookings: number
//   completedTrips: number
//   upcomingTrips: number
//   totalSpent: number
// }

// interface DashboardData {
//   stats: Stats
//   recentBookings: Booking[]
//   upcomingTrips: Trip[]
// }

// interface User {
//   id: string
//   name?: string | null
//   email?: string | null
//   // extend as needed
// }

// async function getDashboardData(): Promise<DashboardData> {
//   await new Promise((r) => setTimeout(r, 100))
//   return {
//     stats: {
//       totalBookings: 12,
//       completedTrips: 8,
//       upcomingTrips: 2,
//       totalSpent: 4500,
//     },
//     recentBookings: [
//       {
//         id: '1',
//         route: 'Colombo → Kandy',
//         date: '2025-09-20',
//         time: '08:30 AM',
//         status: 'confirmed',
//         amount: 450,
//       },
//       {
//         id: '2',
//         route: 'Kandy → Galle',
//         date: '2025-09-18',
//         time: '02:15 PM',
//         status: 'completed',
//         amount: 380,
//       },
//     ],
//     upcomingTrips: [
//       {
//         id: '3',
//         route: 'Colombo → Jaffna',
//         date: '2025-09-22',
//         time: '06:00 AM',
//         busNumber: 'NB-1234',
//         status: 'confirmed',
//       },
//     ],
//   }
// }

// export default function UserProfile() {
//   const router = useRouter()

//   const [data, setData] = useState<DashboardData | null>(null)
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     let intervalId: NodeJS.Timeout

//     async function fetchData() {
//       setIsLoading(true)

//       if (!isUserLoggedIn()) {
//         router.push('/') // Redirect home if session expired
//         return
//       }

//       const dashboardData = await getDashboardData()
//       setData(dashboardData)

//       setUser(getCurrentUser())
//       setIsLoading(false)

//       // Setup interval to poll session expiry every 10 seconds
//       intervalId = setInterval(() => {
//         if (!isUserLoggedIn()) {
//           clearInterval(intervalId)
//           router.push('/')
//         }
//       }, 5000)
//     }

//     fetchData()

//     return () => {
//       if (intervalId) clearInterval(intervalId)
//     }
//   }, [router])

//   if (isLoading || !data) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>
//   }

//   return (
//     <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden p-6 sm:p-8 lg:p-12 rounded-lg shadow-lg">
//       {/* ... rest of your JSX ... same as you provided ... */}
//       {/* Background Gradient Orbs */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-rose-200/40 via-pink-200/40 to-violet-300/40 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 left-8 w-[450px] h-[450px] bg-gradient-to-br from-cyan-200/30 via-blue-200/30 to-emerald-300/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-gradient-to-br from-violet-200/25 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>
//       </div>

//       {/* Dashboard Content Container */}
//       <div className="relative z-10 max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           <div>
//             <h1 className="text-4xl font-extrabold text-slate-900">Dashboard</h1>
//             {user ? (
//               <p className="text-lg text-slate-600 mt-1">Welcome back, {user.name || user.email}</p>
//             ) : (
//               <p className="text-lg text-slate-600 mt-1">Welcome back to TransitLK</p>
//             )}
//           </div>
//           <Link href="/search" passHref>
//             <Button className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 shadow-lg px-6 py-3 rounded-xl font-semibold text-white">
//               <Bus className="w-5 h-5" />
//               Book New Trip
//             </Button>
//           </Link>
//         </header>

//         {/* Stats Grid */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[
//             { title: 'Total Bookings', value: data.stats.totalBookings, icon: <Bus className="w-5 h-5 text-rose-500" />, subtitle: 'All time bookings' },
//             { title: 'Completed Trips', value: data.stats.completedTrips, icon: <MapPin className="w-5 h-5 text-green-600" />, subtitle: 'Successfully completed' },
//             { title: 'Upcoming Trips', value: data.stats.upcomingTrips, icon: <Clock className="w-5 h-5 text-amber-500" />, subtitle: 'Next 7 days' },
//             { title: 'Total Spent', value: `Rs. ${data.stats.totalSpent}`, icon: <CreditCard className="w-5 h-5 text-purple-600" />, subtitle: 'This year' },
//           ].map(({ title, value, icon, subtitle }) => (
//             <Card key={title} className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/30">
//               <CardHeader className="flex justify-between items-center">
//                 <CardTitle className="text-sm font-semibold text-slate-700">{title}</CardTitle>
//                 {icon}
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-extrabold text-slate-900">{value}</p>
//                 <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </section>

//         {/* Recent Bookings */}
//         <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <Card className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/30">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg font-semibold text-rose-600">
//                 <TrendingUp className="w-6 h-6" />
//                 Recent Bookings
//               </CardTitle>
//               <CardDescription className="text-slate-600">Your latest bus reservations</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {data.recentBookings.length > 0 ? (
//                 <ul className="space-y-4">
//                   {data.recentBookings.map(({ id, route, date, time, status, amount }) => (
//                     <li key={id} className="flex justify-between items-center p-4 rounded-lg border border-white/30 bg-green-50 shadow-sm">
//                       <div>
//                         <p className="font-semibold text-slate-900">{route}</p>
//                         <p className="text-sm text-slate-700">{date} at {time}</p>
//                       </div>
//                       <div className="text-right space-y-1">
//                         <p className="font-semibold">Rs. {amount}</p>
//                         <Badge variant={status === 'confirmed' ? 'default' : 'secondary'} className="uppercase text-xs font-semibold">
//                           {status}
//                         </Badge>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-center text-slate-600 py-10">No recent bookings found.</p>
//               )}
//               <div className="mt-6 flex justify-center">
//                 <Link href="/dashboard/bookings" passHref>
//                   <Button variant="outline" className="w-full max-w-xs">View All Bookings</Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Upcoming Trips */}
//           <Card className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/30">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg font-semibold text-green-600">
//                 <Calendar className="w-6 h-6" />
//                 Upcoming Trips
//               </CardTitle>
//               <CardDescription className="text-slate-600">Your scheduled journeys</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {data.upcomingTrips.length ? (
//                 <ul className="space-y-4">
//                   {data.upcomingTrips.map(({ id, route, date, time, busNumber }) => (
//                     <li key={id} className="p-4 rounded-lg border border-white/30 bg-blue-50 shadow-sm">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="font-semibold text-blue-900">{route}</p>
//                           <p className="text-sm text-blue-700">{date} at {time}</p>
//                           <p className="text-xs text-blue-600">Bus: {busNumber}</p>
//                         </div>
//                         <Link href="/dashboard/tracking" passHref>
//                           <Button size="sm" variant="outline">Track Bus</Button>
//                         </Link>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <div className="text-center py-8 text-slate-600">
//                   <Bus className="mx-auto mb-4 w-12 h-12 opacity-50" />
//                   <p>No upcoming trips</p>
//                   <Link href="/search" passHref>
//                     <Button className="mt-4">Book a Trip</Button>
//                   </Link>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </section>
//       </div>
//     </section>
//   )
// }








'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bus, MapPin, CreditCard, Clock, TrendingUp, Calendar, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Booking {
  id: string
  route: string
  date: string
  time: string
  status: 'confirmed' | 'completed' | 'pending' | 'cancelled' | string
  amount: number
}

interface Trip {
  id: string
  route: string
  date: string
  time: string
  busNumber: string
  status: 'confirmed' | 'completed' | string
}

interface Stats {
  totalBookings: number
  completedTrips: number
  upcomingTrips: number
  totalSpent: number
}

interface DashboardData {
  stats: Stats
  recentBookings: Booking[]
  upcomingTrips: Trip[]
}

export default function UserDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/dashboard')

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-rose-500" />
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-rose-200/30 blur-xl animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <p className="text-lg text-slate-700 mb-4">Failed to load dashboard</p>
        <Button onClick={fetchDashboardData}>Try Again</Button>
      </div>
    )
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 via-purple-50 to-violet-50 overflow-hidden p-4 sm:p-8 lg:p-12">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-rose-300/30 via-pink-300/20 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-300/25 via-cyan-300/20 to-teal-300/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-violet-300/20 via-indigo-300/15 to-blue-300/20 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/25 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-lg text-slate-600 mt-2">
              Welcome back, {session?.user?.name || session?.user?.email || 'User'}
            </p>
          </div>
          <Link href="/search">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-rose-400 via-purple-500 to-blue-500 hover:from-rose-500 hover:via-purple-600 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl font-semibold">
              <Bus className="w-5 h-5" />
              Book New Trip
            </Button>
          </Link>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Bookings"
            value={data.stats.totalBookings}
            icon={<Bus className="w-6 h-6" />}
            subtitle="All time bookings"
            gradient="from-rose-400 to-pink-500"
          />
          <StatCard
            title="Completed Trips"
            value={data.stats.completedTrips}
            icon={<MapPin className="w-6 h-6" />}
            subtitle="Successfully completed"
            gradient="from-emerald-400 to-teal-500"
          />
          <StatCard
            title="Upcoming Trips"
            value={data.stats.upcomingTrips}
            icon={<Clock className="w-6 h-6" />}
            subtitle="Scheduled journeys"
            gradient="from-amber-400 to-orange-500"
          />
          <StatCard
            title="Total Spent"
            value={`Rs. ${data.stats.totalSpent.toLocaleString()}`}
            icon={<CreditCard className="w-6 h-6" />}
            subtitle="This year"
            gradient="from-purple-400 to-violet-500"
          />
        </section>

        {/* Recent Bookings & Upcoming Trips */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card className="bg-white/20 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/15">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                <TrendingUp className="w-7 h-7 text-rose-400" />
                Recent Bookings
              </CardTitle>
              <CardDescription className="text-slate-600">Your latest bus reservations</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {data.recentBookings.length > 0 ? (
                <ul className="space-y-4">
                  {data.recentBookings.map((booking) => (
                    <li key={booking.id} className="flex justify-between items-center p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-rose-100/15 to-pink-100/10 backdrop-blur-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      <div>
                        <p className="font-bold text-slate-900">{booking.route}</p>
                        <p className="text-sm text-slate-700">{booking.date} at {booking.time}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-black text-rose-600">Rs. {booking.amount}</p>
                        <Badge
                          variant={booking.status === 'confirmed' ? 'default' : booking.status === 'completed' ? 'secondary' : 'destructive'}
                          className="uppercase text-xs font-bold shadow-md"
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600">No bookings yet</p>
                </div>
              )}
              <div className="mt-6">
                <Link href="/dashboard/bookings">
                  <Button variant="outline" className="w-full border-2 border-rose-300/50 hover:bg-rose-100/50 backdrop-blur-md transition-all">
                    View All Bookings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Trips */}
          <Card className="bg-white/20 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/15">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                <Calendar className="w-7 h-7 text-blue-400" />
                Upcoming Trips
              </CardTitle>
              <CardDescription className="text-slate-600">Your scheduled journeys</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {data.upcomingTrips.length > 0 ? (
                <ul className="space-y-4">
                  {data.upcomingTrips.map((trip) => (
                    <li key={trip.id} className="p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-100/15 to-cyan-100/10 backdrop-blur-2xl shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-blue-900">{trip.route}</p>
                          <p className="text-sm text-blue-700">{trip.date} at {trip.time}</p>
                          <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                            <Bus className="w-3 h-3" />
                            Bus: {trip.busNumber}
                          </p>
                        </div>
                        <Link href={`/dashboard/tracking?bookingId=${trip.id}`}>
                          <Button size="sm" variant="outline" className="border-blue-300 hover:bg-blue-100/50">
                            Track Bus
                          </Button>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <Bus className="w-16 h-16 mx-auto text-slate-300" />
                  <p className="text-slate-600">No upcoming trips</p>
                  <Link href="/booking">
                    <Button className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white">
                      Book a Trip
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </section>
  )
}

function StatCard({ title, value, icon, subtitle, gradient }: {
  title: string
  value: number | string
  icon: React.ReactNode
  subtitle: string
  gradient: string
}) {
  return (
    <Card className="bg-white/20 backdrop-blur-3xl rounded-2xl shadow-xl border border-white/15 hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-sm font-semibold text-slate-700">{title}</CardTitle>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-black text-slate-900 mb-1">{value}</p>
        <p className="text-xs text-slate-600">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
