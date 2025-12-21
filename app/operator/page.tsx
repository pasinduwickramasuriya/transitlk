/* eslint-disable @typescript-eslint/no-explicit-any */





import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// import { Progress } from '@/components/ui/progress'
import {
  Bus, Route, Calendar, TrendingUp, Users, DollarSign,
  Activity, AlertTriangle, CheckCircle, Clock, MapPin,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart,
  Navigation, Fuel, Shield, Bell, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@radix-ui/react-progress'

export const metadata: Metadata = {
  title: 'Operator Dashboard - TransitLK',
  description: 'Comprehensive overview of fleet performance, bookings, and analytics',
}

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

interface DashboardStats {
  fleet: {
    totalBuses: number
    activeBuses: number
    maintenanceBuses: number
    totalRoutes: number
    activeRoutes: number
    totalSchedules: number
    activeSchedules: number
    deviceCount: number
    onlineDevices: number
  }
  financial: {
    todayRevenue: number
    monthlyRevenue: number
    totalRevenue: number
    pendingPayments: number
    completedPayments: number
    averageTicketPrice: number
  }
  bookings: {
    todayBookings: number
    weeklyBookings: number
    monthlyBookings: number
    totalBookings: number
    pendingBookings: number
    confirmedBookings: number
    cancelledBookings: number
  }
  performance: {
    avgOccupancy: number
    onTimePerformance: number
    customerSatisfaction: number
    totalDistance: number
  }
}

async function getOperatorStats(operatorId: string): Promise<DashboardStats> {
  try {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const yearStart = new Date(now.getFullYear(), 0, 1)

    // Fleet Statistics
    const [
      totalBuses,
      activeBuses,
      totalRoutes,
      activeRoutes,
      totalSchedules,
      activeSchedules,
      devices,
      onlineDevices
    ] = await Promise.all([
      prisma.bus.count({ where: { operatorId } }),
      prisma.bus.count({ where: { operatorId, isActive: true } }),
      prisma.route.count({ where: { operatorId } }),
      prisma.route.count({ where: { operatorId, isActive: true } }),
      prisma.schedule.count({
        where: { bus: { operatorId } }
      }),
      prisma.schedule.count({
        where: { bus: { operatorId }, isActive: true }
      }),
      prisma.device.count({
        where: { bus: { operatorId } }
      }),
      prisma.device.count({
        where: {
          bus: { operatorId },
          isActive: true,
          lastSeen: { gte: new Date(Date.now() - 5 * 60 * 1000) } // Online in last 5 minutes
        }
      })
    ])

    // Financial Statistics
    const [
      todayPayments,
      monthlyPayments,
      totalPayments,
      pendingPayments,
      completedPayments
    ] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          booking: { bus: { operatorId } },
          status: 'COMPLETED',
          createdAt: { gte: today }
        },
        _sum: { amount: true },
        _count: true
      }),
      prisma.payment.aggregate({
        where: {
          booking: { bus: { operatorId } },
          status: 'COMPLETED',
          createdAt: { gte: monthStart }
        },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        where: {
          booking: { bus: { operatorId } },
          status: 'COMPLETED'
        },
        _sum: { amount: true }
      }),
      prisma.payment.count({
        where: {
          booking: { bus: { operatorId } },
          status: 'PENDING'
        }
      }),
      prisma.payment.count({
        where: {
          booking: { bus: { operatorId } },
          status: 'COMPLETED'
        }
      })
    ])

    // Booking Statistics
    const [
      todayBookings,
      weeklyBookings,
      monthlyBookings,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings
    ] = await Promise.all([
      prisma.booking.count({
        where: {
          bus: { operatorId },
          createdAt: { gte: today }
        }
      }),
      prisma.booking.count({
        where: {
          bus: { operatorId },
          createdAt: { gte: weekAgo }
        }
      }),
      prisma.booking.count({
        where: {
          bus: { operatorId },
          createdAt: { gte: monthStart }
        }
      }),
      prisma.booking.count({
        where: { bus: { operatorId } }
      }),
      prisma.booking.count({
        where: {
          bus: { operatorId },
          status: 'PENDING'
        }
      }),
      prisma.booking.count({
        where: {
          bus: { operatorId },
          status: 'CONFIRMED'
        }
      }),
      prisma.booking.count({
        where: {
          bus: { operatorId },
          status: 'CANCELLED'
        }
      })
    ])

    // Calculate averages and performance metrics
    const avgTicketPrice = completedPayments > 0
      ? (totalPayments._sum.amount || 0) / completedPayments
      : 0

    const totalDistance = await prisma.route.aggregate({
      where: { operatorId },
      _sum: { distance: true }
    })

    // Mock performance data (in real app, calculate from actual data)
    const avgOccupancy = Math.floor(Math.random() * 30) + 60 // 60-90%
    const onTimePerformance = Math.floor(Math.random() * 20) + 75 // 75-95%
    const customerSatisfaction = Math.floor(Math.random() * 10) + 85 // 85-95%

    return {
      fleet: {
        totalBuses,
        activeBuses,
        maintenanceBuses: totalBuses - activeBuses,
        totalRoutes,
        activeRoutes,
        totalSchedules,
        activeSchedules,
        deviceCount: devices,
        onlineDevices
      },
      financial: {
        todayRevenue: todayPayments._sum.amount || 0,
        monthlyRevenue: monthlyPayments._sum.amount || 0,
        totalRevenue: totalPayments._sum.amount || 0,
        pendingPayments,
        completedPayments,
        averageTicketPrice: avgTicketPrice
      },
      bookings: {
        todayBookings,
        weeklyBookings,
        monthlyBookings,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings
      },
      performance: {
        avgOccupancy,
        onTimePerformance,
        customerSatisfaction,
        totalDistance: totalDistance._sum.distance || 0
      }
    }
  } catch (error) {
    console.error('Error fetching operator stats:', error)
    // Return default stats on error
    return {
      fleet: {
        totalBuses: 0, activeBuses: 0, maintenanceBuses: 0,
        totalRoutes: 0, activeRoutes: 0, totalSchedules: 0,
        activeSchedules: 0, deviceCount: 0, onlineDevices: 0
      },
      financial: {
        todayRevenue: 0, monthlyRevenue: 0, totalRevenue: 0,
        pendingPayments: 0, completedPayments: 0, averageTicketPrice: 0
      },
      bookings: {
        todayBookings: 0, weeklyBookings: 0, monthlyBookings: 0,
        totalBookings: 0, pendingBookings: 0, confirmedBookings: 0,
        cancelledBookings: 0
      },
      performance: {
        avgOccupancy: 0, onTimePerformance: 0, customerSatisfaction: 0,
        totalDistance: 0
      }
    }
  }
}

async function getRecentBookings(operatorId: string) {
  try {
    return await prisma.booking.findMany({
      where: { bus: { operatorId } },
      include: {
        user: {
          select: { name: true, email: true }
        },
        schedule: {
          include: {
            route: {
              select: {
                routeNumber: true,
                startLocation: true,
                endLocation: true
              }
            }
          }
        },
        bus: {
          select: { busNumber: true, busType: true }
        },
        payment: {
          select: { amount: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 8
    })
  } catch (error) {
    console.error('Error fetching recent bookings:', error)
    return []
  }
}

async function getOperatorBySession(session: any) {
  try {
    // First try to find by session name, otherwise use default
    const operator = await prisma.operator.findFirst({
      where: { name: session?.user?.name || '' }
    })

    if (operator) return operator

    // Fallback to default operator or create one
    return await prisma.operator.upsert({
      where: { id: DEFAULT_OPERATOR_ID },
      update: { isActive: true },
      create: {
        id: DEFAULT_OPERATOR_ID,
        name: session?.user?.name || 'TransitLK Operator',
        licenseNo: 'TLK001',
        contactInfo: 'contact@transitlk.com',
        isActive: true
      }
    })
  } catch (error) {
    console.error('Error getting operator:', error)
    return {
      id: DEFAULT_OPERATOR_ID,
      name: 'TransitLK Operator',
      licenseNo: 'TLK001',
      contactInfo: 'contact@transitlk.com',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}

export default async function OperatorDashboard() {
  const session = await getServerSession(authOptions)

  const operator = await getOperatorBySession(session)
  const [stats, recentBookings] = await Promise.all([
    getOperatorStats(operator.id),
    getRecentBookings(operator.id)
  ])

  const revenueGrowth = stats.financial.monthlyRevenue > 0
    ? ((stats.financial.todayRevenue * 30) / stats.financial.monthlyRevenue - 1) * 100
    : 0

  const bookingGrowth = stats.bookings.monthlyBookings > 0
    ? ((stats.bookings.weeklyBookings * 4.3) / stats.bookings.monthlyBookings - 1) * 100
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Operator Dashboard
              </h1>
              <p className="text-sm text-slate-600">Welcome back, {operator.name}</p>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Todays Revenue</p>
                  <p className="text-2xl font-bold text-slate-800">
                    LKR {stats.financial.todayRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {revenueGrowth >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-xs font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(revenueGrowth).toFixed(1)}% vs last month
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Fleet Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Fleet</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.fleet.activeBuses}/{stats.fleet.totalBuses}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-slate-600">
                        {((stats.fleet.activeBuses / Math.max(stats.fleet.totalBuses, 1)) * 100).toFixed(0)}% operational
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <Bus className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Bookings Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Todays Bookings</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.bookings.todayBookings}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {bookingGrowth >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-xs font-medium ${bookingGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(bookingGrowth).toFixed(1)}% vs last week
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Score Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Performance Score</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.performance.onTimePerformance}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-slate-600">On-time performance</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fleet Overview */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-blue-600" />
                Fleet Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Active Buses</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {stats.fleet.activeBuses}/{stats.fleet.totalBuses}
                  </Badge>
                </div>
                <Progress
                  value={(stats.fleet.activeBuses / Math.max(stats.fleet.totalBuses, 1)) * 100}
                  className="h-2"
                />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Online Devices</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {stats.fleet.onlineDevices}/{stats.fleet.deviceCount}
                  </Badge>
                </div>
                <Progress
                  value={(stats.fleet.onlineDevices / Math.max(stats.fleet.deviceCount, 1)) * 100}
                  className="h-2"
                />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Active Routes</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {stats.fleet.activeRoutes}/{stats.fleet.totalRoutes}
                  </Badge>
                </div>
                <Progress
                  value={(stats.fleet.activeRoutes / Math.max(stats.fleet.totalRoutes, 1)) * 100}
                  className="h-2"
                />
              </div>

              <div className="pt-4 border-t">
                <Link href="/operator/tracking">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Navigation className="h-4 w-4 mr-2" />
                    Live Tracking
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-slate-600">Monthly Revenue</p>
                  <p className="text-lg font-bold text-slate-800">
                    LKR {(stats.financial.monthlyRevenue / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-slate-600">Avg. Ticket</p>
                  <p className="text-lg font-bold text-slate-800">
                    LKR {stats.financial.averageTicketPrice.toFixed(0)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Completed Payments</span>
                  <span className="font-medium">{stats.financial.completedPayments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Pending Payments</span>
                  <span className="font-medium text-orange-600">{stats.financial.pendingPayments}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link href="/operator/fare">
                  <Button variant="outline" className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Manage Fares
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-orange-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Occupancy Rate</span>
                    <span className="text-sm font-medium">{stats.performance.avgOccupancy}%</span>
                  </div>
                  <Progress value={stats.performance.avgOccupancy} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">On-Time Performance</span>
                    <span className="text-sm font-medium">{stats.performance.onTimePerformance}%</span>
                  </div>
                  <Progress value={stats.performance.onTimePerformance} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Customer Satisfaction</span>
                    <span className="text-sm font-medium">{stats.performance.customerSatisfaction}%</span>
                  </div>
                  <Progress value={stats.performance.customerSatisfaction} className="h-2" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600">Total Distance Covered</p>
                  <p className="text-lg font-bold text-slate-800">
                    {stats.performance.totalDistance.toFixed(1)} km
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Recent Bookings
                </CardTitle>
                <Badge variant="secondary">{recentBookings.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-800">{booking.passengerName}</p>
                          <Badge
                            variant="outline"
                            className={
                              booking.status === 'CONFIRMED'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : booking.status === 'PENDING'
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  : 'bg-red-50 text-red-700 border-red-200'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {booking.schedule.route.routeNumber} • {booking.bus.busNumber}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.schedule.route.startLocation} → {booking.schedule.route.endLocation}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">LKR {booking.totalAmount}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No recent bookings</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Link href="/operator/tracking">
                  <Button variant="outline" className="w-full justify-between p-4 h-auto">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Navigation className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Live Bus Tracking</p>
                        <p className="text-sm text-slate-500">Monitor fleet in real-time</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/operator/notifications">
                  <Button variant="outline" className="w-full justify-between p-4 h-auto">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Bell className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Send Notifications</p>
                        <p className="text-sm text-slate-500">Alert passengers about updates</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/operator/fare">
                  <Button variant="outline" className="w-full justify-between p-4 h-auto">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Manage Fares</p>
                        <p className="text-sm text-slate-500">Update pricing and routes</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>

                <Button variant="outline" className="w-full justify-between p-4 h-auto" disabled>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-500">Analytics & Reports</p>
                      <p className="text-sm text-slate-400">Coming soon</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Footer */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600">System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-slate-600">GPS Active: {stats.fleet.onlineDevices} devices</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-600">Live Tracking Available</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
