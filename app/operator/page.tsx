import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bus, Route, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react'
// import { OperatorStatsCards } from '@/components/operator/OperatorStatsCards'
// import { RecentBookings } from '@/components/operator/RecentBookings'
// import { FleetStatus } from '@/components/operator/FleetStatus'

export const metadata: Metadata = {
  title: 'Operator Dashboard - TransitLK',
  description: 'Overview of fleet performance and bookings',
}

async function getOperatorStats(operatorId: string) {
  const [
    totalBuses,
    activeBuses,
    totalRoutes,
    activeRoutes,
    totalSchedules,
    activeSchedules,
    todayBookings,
    monthlyRevenue,
    recentBookings
  ] = await Promise.all([
    prisma.bus.count({ where: { operatorId } }),
    prisma.bus.count({ where: { operatorId, isActive: true } }),
    prisma.route.count({ where: { operatorId } }),
    prisma.route.count({ where: { operatorId, isActive: true } }),
    prisma.schedule.count({
      where: {
        bus: { operatorId }
      }
    }),
    prisma.schedule.count({
      where: {
        bus: { operatorId },
        isActive: true
      }
    }),
    prisma.booking.count({
      where: {
        bus: { operatorId },
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.payment.aggregate({
      where: {
        booking: {
          bus: { operatorId }
        },
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: {
        amount: true
      }
    }),
    prisma.booking.findMany({
      where: {
        bus: { operatorId }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
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
          select: {
            busNumber: true
          }
        },
        payment: {
          select: {
            amount: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ])

  return {
    totalBuses,
    activeBuses,
    totalRoutes,
    activeRoutes,
    totalSchedules,
    activeSchedules,
    todayBookings,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    recentBookings
  }
}

async function getOperatorBySession(session: any) {
  return await prisma.operator.findFirst({
    where: { name: session.user.name || '' }
  })
}

export default async function OperatorDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return <div>Unauthorized</div>
  }

  const operator = await getOperatorBySession(session)
  
  if (!operator) {
    return <div>Operator not found</div>
  }

  const stats = await getOperatorStats(operator.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {operator.name}. Here's your fleet overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Buses</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBuses}</p>
                <p className="text-xs text-green-600">{stats.activeBuses} active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Route className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Routes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalRoutes}</p>
                <p className="text-xs text-green-600">{stats.activeRoutes} active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Schedules</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalSchedules}</p>
                <p className="text-xs text-green-600">{stats.activeSchedules} active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  LKR {stats.monthlyRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Today's Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.todayBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{booking.passengerName}</p>
                      <p className="text-sm text-gray-600">
                        {booking.schedule.route.routeNumber} - {booking.bus.busNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.schedule.route.startLocation} → {booking.schedule.route.endLocation}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">LKR {booking.totalAmount}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent bookings</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Buses</span>
                <span className="font-semibold">{stats.activeBuses}/{stats.totalBuses}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(stats.activeBuses / stats.totalBuses) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Routes</span>
                <span className="font-semibold">{stats.activeRoutes}/{stats.totalRoutes}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(stats.activeRoutes / stats.totalRoutes) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Schedules</span>
                <span className="font-semibold">{stats.activeSchedules}/{stats.totalSchedules}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(stats.activeSchedules / stats.totalSchedules) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/operator/fleet"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Manage Fleet</h3>
              <p className="text-sm text-gray-500">Add, edit, or view your buses</p>
            </a>
            <a
              href="/operator/schedules"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Manage Schedules</h3>
              <p className="text-sm text-gray-500">Create and update bus schedules</p>
            </a>
            <a
              href="/operator/routes"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">View Routes</h3>
              <p className="text-sm text-gray-500">Check your assigned routes</p>
            </a>
            <a
              href="/operator/reports"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Reports</h3>
              <p className="text-sm text-gray-500">View performance analytics</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
