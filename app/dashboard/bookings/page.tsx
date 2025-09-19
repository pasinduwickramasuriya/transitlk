import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Calendar, MapPin, Clock, Download } from 'lucide-react'
import Link from 'next/link'

interface Booking {
  id: string
  bookingRef: string
  route: string
  origin: string
  destination: string
  date: string
  time: string
  busNumber: string
  seats: string[]
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending'
  amount: number
  paymentMethod: string
}

// Mock data - replace with real API calls
async function getBookings(): Promise<Booking[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return [
    {
      id: '1',
      bookingRef: 'TLK-001',
      route: 'Colombo → Kandy',
      origin: 'Colombo Fort',
      destination: 'Kandy Terminal',
      date: '2025-09-20',
      time: '08:30 AM',
      busNumber: 'NB-1234',
      seats: ['A12', 'A13'],
      status: 'confirmed',
      amount: 450,
      paymentMethod: 'Credit Card'
    },
    {
      id: '2',
      bookingRef: 'TLK-002',
      route: 'Kandy → Galle',
      origin: 'Kandy Terminal',
      destination: 'Galle Bus Stand',
      date: '2025-09-18',
      time: '02:15 PM',
      busNumber: 'SB-5678',
      seats: ['B08'],
      status: 'completed',
      amount: 380,
      paymentMethod: 'eZ Cash'
    },
    {
      id: '3',
      bookingRef: 'TLK-003',
      route: 'Colombo → Jaffna',
      origin: 'Colombo Pettah',
      destination: 'Jaffna Central',
      date: '2025-09-22',
      time: '06:00 AM',
      busNumber: 'NB-9012',
      seats: ['C15'],
      status: 'confirmed',
      amount: 650,
      paymentMethod: 'Bank Transfer'
    }
  ]
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed':
      return 'default'
    case 'completed':
      return 'secondary'
    case 'cancelled':
      return 'destructive'
    case 'pending':
      return 'outline'
    default:
      return 'secondary'
  }
}

export default async function BookingsPage() {
  const bookings = await getBookings()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage all your bus reservations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/search">
            <Button>Book New Trip</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by booking reference or route..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge 
                      variant={getStatusColor(booking.status)}
                      className="capitalize"
                    >
                      {booking.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Ref: {booking.bookingRef}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{booking.route}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.origin} → {booking.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Bus:</span>
                      <span>{booking.busNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      Rs. {booking.amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Seats: {booking.seats.join(', ')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking.paymentMethod}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link href={`/dashboard/bookings/${booking.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {booking.status === 'confirmed' && (
                      <Link href="/dashboard/tracking">
                        <Button size="sm" className="w-full">
                          Track Bus
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              You haven't made any bus reservations yet.
            </p>
            <Link href="/search">
              <Button>Book Your First Trip</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
