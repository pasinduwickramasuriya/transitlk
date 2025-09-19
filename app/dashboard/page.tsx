import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bus, MapPin, CreditCard, Clock, TrendingUp, Users, Calendar } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with real API calls
async function getDashboardData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return {
    stats: {
      totalBookings: 12,
      completedTrips: 8,
      upcomingTrips: 2,
      totalSpent: 4500
    },
    recentBookings: [
      {
        id: '1',
        route: 'Colombo → Kandy',
        date: '2025-09-20',
        time: '08:30 AM',
        status: 'confirmed',
        amount: 450
      },
      {
        id: '2',
        route: 'Kandy → Galle',
        date: '2025-09-18',
        time: '02:15 PM',
        status: 'completed',
        amount: 380
      }
    ],
    upcomingTrips: [
      {
        id: '3',
        route: 'Colombo → Jaffna',
        date: '2025-09-22',
        time: '06:00 AM',
        busNumber: 'NB-1234',
        status: 'confirmed'
      }
    ]
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back to TransitLK</p>
        </div>
        <Link href="/search">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Bus className="w-4 h-4 mr-2" />
            Book New Trip
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Bus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.completedTrips}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.upcomingTrips}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {data.stats.totalSpent}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Bookings
            </CardTitle>
            <CardDescription>Your latest bus reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{booking.route}</p>
                    <p className="text-sm text-gray-600">
                      {booking.date} at {booking.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Rs. {booking.amount}</p>
                    <Badge 
                      variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/bookings">
                <Button variant="outline" className="w-full">
                  View All Bookings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Trips
            </CardTitle>
            <CardDescription>Your scheduled journeys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.upcomingTrips.map((trip) => (
                <div key={trip.id} className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">{trip.route}</p>
                      <p className="text-sm text-blue-700">
                        {trip.date} at {trip.time}
                      </p>
                      <p className="text-xs text-blue-600">
                        Bus: {trip.busNumber}
                      </p>
                    </div>
                    <Link href="/dashboard/tracking">
                      <Button size="sm" variant="outline">
                        Track Bus
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              
              {data.upcomingTrips.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming trips</p>
                  <Link href="/search">
                    <Button className="mt-4">Book a Trip</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
