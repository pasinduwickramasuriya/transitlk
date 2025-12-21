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
