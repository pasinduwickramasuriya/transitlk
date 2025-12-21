/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminDashboardService } from '@/lib/services/admin-service'
import { AdminStatsCards } from '@/components/admin/AdminStatsCards'
import { RecentBookings } from '@/components/admin/RecentBookings'
import { LiveBusMap } from '@/components/admin/LiveBusMap'
import { LayoutDashboard, Users,Bus, Route } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard - TransitLK',
  description: 'Overview of system statistics and performance metrics',
}

export default async function AdminDashboard() {
  // 1. Fetch Data
  const [stats, bookingsData, livePositions] = await Promise.all([
    AdminDashboardService.getStats(),
    AdminDashboardService.getAllBookings({ page: 1, limit: 5 }),
    AdminDashboardService.getLivePositions(),
  ])

  // Transform data to match RecentBookings interface
  // The DB has 'seatNumbers' (String), but component needs 'seatNumber' (Number)
  const formattedBookings = bookingsData.bookings.map((booking: any) => ({
    ...booking,
    // Extract the first seat number from the string and convert to int
    seatNumber: booking.seatNumbers ? parseInt(booking.seatNumbers.toString().split(',')[0]) : null,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
            System overview and performance metrics.
            </p>
        </div>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {/*Pass the transformed data here */}
            <RecentBookings bookings={formattedBookings} />
          </CardContent>
        </Card>

        {/* Live Bus Tracking */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Live Bus Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveBusMap positions={livePositions} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction href="/admin/users" title="Manage Users" desc="View accounts" icon={Users} />
            <QuickAction href="/admin/operators" title="Manage Operators" desc="Registrations" icon={Users} />
            <QuickAction href="/admin/routes" title="Manage Routes" desc="Configure routes" icon={Route} />
            <QuickAction href="/admin/buses" title="Manage Buses" desc="Fleet control" icon={Bus} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Simple Helper Component for Quick Actions to keep code clean
function QuickAction({ href, title, desc, icon: Icon }: any) {
    return (
        <a
            href={href}
            className="flex items-start gap-3 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-blue-200 transition-all group"
        >
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                <Icon className="h-5 w-5 text-slate-500 group-hover:text-blue-600" />
            </div>
            <div>
                <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
        </a>
    )
}