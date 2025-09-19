import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Download, MapPin, Calendar, Clock, CreditCard, Bus, Users, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface BookingDetails {
  id: string
  bookingRef: string
  route: string
  origin: string
  destination: string
  date: string
  time: string
  busNumber: string
  busOperator: string
  seats: string[]
  passengers: Array<{
    name: string
    age: number
    gender: string
    phone: string
  }>
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending'
  amount: number
  breakdown: {
    baseFare: number
    taxes: number
    serviceFee: number
    discount: number
  }
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  bookingNotes?: string
}

// Mock data - replace with real API call
async function getBookingDetails(id: string): Promise<BookingDetails | null> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const bookings: Record<string, BookingDetails> = {
    '1': {
      id: '1',
      bookingRef: 'TLK-001',
      route: 'Colombo → Kandy',
      origin: 'Colombo Fort Bus Terminal',
      destination: 'Kandy Central Bus Stand',
      date: '2025-09-20',
      time: '08:30 AM',
      busNumber: 'NB-1234',
      busOperator: 'National Transport Ltd',
      seats: ['A12', 'A13'],
      passengers: [
        {
          name: 'John Doe',
          age: 28,
          gender: 'Male',
          phone: '+94 77 123 4567'
        },
        {
          name: 'Jane Doe',
          age: 26,
          gender: 'Female', 
          phone: '+94 77 123 4568'
        }
      ],
      status: 'confirmed',
      amount: 450,
      breakdown: {
        baseFare: 380,
        taxes: 45,
        serviceFee: 25,
        discount: 0
      },
      paymentMethod: 'Credit Card (**** 4567)',
      paymentStatus: 'Paid',
      createdAt: '2025-09-15T10:30:00Z',
      bookingNotes: 'Window seats requested'
    }
  }

  return bookings[id] || null
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

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const booking = await getBookingDetails(id)

  if (!booking) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/bookings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-600 mt-1">Reference: {booking.bookingRef}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          {booking.status === 'confirmed' && (
            <Link href="/dashboard/tracking">
              <Button>Track Bus</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bus className="w-5 h-5" />
                  Trip Information
                </CardTitle>
                <Badge variant={getStatusColor(booking.status)} className="capitalize">
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">From</p>
                      <p className="text-sm text-gray-600">{booking.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">To</p>
                      <p className="text-sm text-gray-600">{booking.destination}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-gray-600">{booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Departure Time</p>
                      <p className="text-sm text-gray-600">{booking.time}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Bus Number</p>
                  <p className="text-sm text-gray-600">{booking.busNumber}</p>
                </div>
                <div>
                  <p className="font-medium">Operator</p>
                  <p className="text-sm text-gray-600">{booking.busOperator}</p>
                </div>
                <div>
                  <p className="font-medium">Seats</p>
                  <p className="text-sm text-gray-600">{booking.seats.join(', ')}</p>
                </div>
                <div>
                  <p className="font-medium">Total Passengers</p>
                  <p className="text-sm text-gray-600">{booking.passengers.length}</p>
                </div>
              </div>

              {booking.bookingNotes && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium">Notes</p>
                    <p className="text-sm text-gray-600">{booking.bookingNotes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Passenger Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Passenger Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-sm text-gray-600">
                          {passenger.age} years, {passenger.gender}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{passenger.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Base Fare</span>
                  <span className="text-sm">Rs. {booking.breakdown.baseFare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taxes & Fees</span>
                  <span className="text-sm">Rs. {booking.breakdown.taxes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Service Fee</span>
                  <span className="text-sm">Rs. {booking.breakdown.serviceFee}</span>
                </div>
                {booking.breakdown.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Discount</span>
                    <span className="text-sm">-Rs. {booking.breakdown.discount}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total Amount</span>
                  <span>Rs. {booking.amount}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Payment Method</span>
                  <span>{booking.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Status</span>
                  <Badge variant="outline" className="text-green-600">
                    {booking.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Booking Date</span>
                  <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Email Receipt
              </Button>
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              {booking.status === 'confirmed' && (
                <Button variant="destructive" className="w-full">
                  Cancel Booking
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
