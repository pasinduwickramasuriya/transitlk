export interface RouteData {
  id: string
  routeNumber: string
  startLocation: string
  endLocation: string
  distance?: number
  estimatedTime?: number
  isActive: boolean
  operator: {
    id: string
    name: string
    licenseNo: string
    contactInfo: string
  }
  schedules: ScheduleData[]
  fares: FareData[]
}

export interface ScheduleData {
  id: string
  departureTime: string
  arrivalTime: string
  frequency?: number
  isActive: boolean
  bus: {
    id: string
    busNumber: string
    busType: string
    capacity: number
    isActive: boolean
  }
}

export interface FareData {
  id: string
  busType: string
  basePrice: number
  currency: string
  isActive: boolean
}

export interface SelectedBusData {
  route: RouteData
  schedule: ScheduleData
  fare: FareData
}

export interface SearchData {
  from: string
  to: string
  date: string
}

// export interface SeatAvailability {
//   seatNumber: number
//   isAvailable: boolean
//   isOccupied: boolean
//   bookingId?: string
// }


// ✅ NEW - Add the missing fields
export interface SeatAvailability {
  seatNumber: number
  isAvailable: boolean
  isOccupied: boolean
  bookingId?: string        // Add this line
  passengerName?: string    // Add this line  
  status?: string           // Add this line
}
