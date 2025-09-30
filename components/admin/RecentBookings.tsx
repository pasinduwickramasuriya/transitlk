

// import { Badge } from '@/components/ui/badge'

// // ✅ FIXED: Updated interface to match your actual data structure
// interface BookingWithDetails {
//     id: string
//     seatNumber: string
//     status: string
//     totalAmount: number
//     passengerName: string
//     passengerPhone: string
//     createdAt: Date
//     user: {
//         name: string | null  // Allow null
//         email: string
//     }
//     schedule: {
//         bus: {
//             busNumber: string
//         }
//         route: {
//             routeNumber: string
//             startLocation: string
//             endLocation: string
//         }
//     }
//     ticket?: {
//         id: string
//         qrCode: string
//     } | null
//     payment?: {
//         id: string
//         amount: number
//         status: string
//         paymentMethod: string
//     } | null
// }

// interface RecentBookingsProps {
//     bookings: BookingWithDetails[]
// }

// export function RecentBookings({ bookings }: RecentBookingsProps) {
//     // ✅ FIXED: Proper function implementations instead of throwing errors
//     const formatCurrency = (amount: number): string => {
//         return new Intl.NumberFormat('en-LK', {
//             style: 'currency',
//             currency: 'LKR',
//         }).format(amount)
//     }

//     const formatDateTime = (date: Date): string => {
//         return new Intl.DateTimeFormat('en-LK', {
//             dateStyle: 'medium',
//             timeStyle: 'short',
//         }).format(date)
//     }

//     const getStatusColor = (status: string) => {
//         switch (status.toLowerCase()) {
//             case 'confirmed':
//                 return 'bg-green-100 text-green-800'
//             case 'pending':
//                 return 'bg-yellow-100 text-yellow-800'
//             case 'cancelled':
//                 return 'bg-red-100 text-red-800'
//             case 'completed':
//                 return 'bg-blue-100 text-blue-800'
//             default:
//                 return 'bg-gray-100 text-gray-800'
//         }
//     }

//     if (!bookings || bookings.length === 0) {
//         return (
//             <div className="text-center py-8">
//                 <p className="text-gray-500">No recent bookings</p>
//             </div>
//         )
//     }

//     return (
//         <div className="space-y-4">
//             {bookings.map((booking) => (
//                 <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
//                     <div className="flex-1">
//                         <div className="flex items-center justify-between mb-2">
//                             <h4 className="font-medium text-sm">
//                                 {booking.schedule.route.routeNumber}
//                             </h4>
//                             <Badge className={getStatusColor(booking.status)}>
//                                 {booking.status}
//                             </Badge>
//                         </div>
//                         <p className="text-sm text-gray-600 mb-1">
//                             {booking.user.name || booking.passengerName} • Seat {booking.seatNumber}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                             {booking.schedule.route.startLocation} → {booking.schedule.route.endLocation}
//                         </p>
//                         <p className="text-xs text-gray-400 mt-1">
//                             {formatDateTime(booking.createdAt)}
//                         </p>
//                     </div>
//                     <div className="text-right ml-4">
//                         <p className="font-semibold text-sm">
//                             {formatCurrency(booking.totalAmount)}
//                         </p>
//                         <p className="text-xs text-gray-500">{booking.schedule.bus.busNumber}</p>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )
// }

import { Badge } from '@/components/ui/badge'

// ✅ SIMPLE: Use 'any' for complex nested objects to avoid type issues
interface SimpleBooking {
  id: string
  seatNumber: number | null
  status: string
  totalAmount: number
  passengerName: string
  passengerPhone: string
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  schedule: {
    bus: { busNumber: string }
    route: {
      routeNumber: string
      startLocation: string
      endLocation: string
    }
  }
  ticket: any    // ✅ Accept any ticket structure
  payment: any   // ✅ Accept any payment structure
}

interface RecentBookingsProps {
  bookings: SimpleBooking[]
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  
  // ✅ HELPER FUNCTIONS: Simple and clean
  const formatSeatNumber = (seatNumber: number | null) => {
    return seatNumber ? `Seat ${seatNumber}` : 'No seat assigned'
  }

  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toLocaleString()}`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethod = (payment: any) => {
    return payment?.method || payment?.paymentMethod || 'Unknown'
  }

  // ✅ EARLY RETURN: Handle empty state
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No recent bookings</h3>
        <p className="text-gray-500">Bookings will appear here as they are made</p>
      </div>
    )
  }

  // ✅ MAIN RENDER: Clean and simple
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  )

  // ✅ BOOKING CARD COMPONENT: Clear and readable
  function BookingCard({ booking }: { booking: SimpleBooking }) {
    const passengerName = booking.user?.name || booking.passengerName || 'Unknown'
    
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-lg">
              {booking.schedule.route.routeNumber}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {booking.schedule.route.startLocation} → {booking.schedule.route.endLocation}
            </p>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
          </Badge>
        </div>

        {/* Passenger Info */}
        <div className="mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{passengerName}</p>
              <p className="text-sm text-gray-500">{formatSeatNumber(booking.seatNumber)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Bus</p>
              <p className="font-medium text-gray-700">{booking.schedule.bus.busNumber}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(booking.totalAmount)}
            </p>
            {booking.payment && (
              <p className="text-xs text-gray-500 mt-1">
                via {getPaymentMethod(booking.payment)}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {formatDate(booking.createdAt)}
            </p>
            {booking.ticket && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Ticket issued
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }
}
