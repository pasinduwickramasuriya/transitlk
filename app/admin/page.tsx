


import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminDashboardService } from '@/lib/services/admin-service'
import { AdminStatsCards } from '@/components/admin/AdminStatsCards'
import { RecentBookings } from '@/components/admin/RecentBookings'
import { LiveBusMap } from '@/components/admin/LiveBusMap'

export const metadata: Metadata = {
  title: 'Admin Dashboard - TransitLK',
  description: 'Overview of system statistics and performance metrics',
}

export default async function AdminDashboard() {
  const [stats, recentBookings, livePositions] = await Promise.all([
    AdminDashboardService.getStats(),
    AdminDashboardService.getAllBookings({ page: 1, limit: 5 }),
    AdminDashboardService.getLivePositions(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your TransitLK system performance and metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentBookings bookings={recentBookings.bookings} />
          </CardContent>
        </Card>

        {/* Live Bus Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Live Bus Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveBusMap positions={livePositions} />
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
              href="/admin/users"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Manage Users</h3>
              <p className="text-sm text-gray-500">View and edit user accounts</p>
            </a>
            <a
              href="/admin/operators"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Manage Operators</h3>
              <p className="text-sm text-gray-500">Handle operator registrations</p>
            </a>
            <a
              href="/admin/routes"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Manage Routes</h3>
              <p className="text-sm text-gray-500">Configure bus routes</p>
            </a>
            <a
              href="/admin/buses"
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">Manage Buses</h3>
              <p className="text-sm text-gray-500">Handle bus fleet</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

