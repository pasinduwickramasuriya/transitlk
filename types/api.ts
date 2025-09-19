export interface DashboardStats {
  totalBookings: number
  completedTrips: number
  upcomingTrips: number
  totalSpent: number
}

export interface BookingItem {
  id: string
  bookingRef: string
  route: string
  origin: string
  destination: string
  date: string
  time: string
  busNumber: string
  seats: string[]
  status: string
  amount: number
  paymentMethod: string
  createdAt: string
}

export interface BusLocation {
  busNumber: string
  route: string
  currentLocation: {
    lat: number
    lng: number
    address: string
  }
  nextStop: string
  estimatedArrival: string
  status: 'on_time' | 'delayed' | 'boarding' | 'departed'
  capacity: {
    occupied: number
    total: number
  }
  lastUpdated: string
}

export interface TrackingData {
  activeBuses: BusLocation[]
  userBookings: Array<{
    id: string
    busNumber: string
    route: string
    date: string
    time: string
    status: string
  }>
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  profileImage?: string
  emailVerified: boolean
  phoneVerified: boolean
  memberSince: string
  role: string
}
