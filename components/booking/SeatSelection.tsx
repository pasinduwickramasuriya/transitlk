// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
// import { Separator } from '@/components/ui/separator'
// import { User, ArrowRight, Loader2 } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'
// import { SelectedBusData, SearchData, SeatAvailability } from '@/types/booking'
// import { isUserLoggedIn } from '@/utils/auth'

// interface SeatSelectionProps {
//   selectedBus: SelectedBusData
//   searchData: SearchData
//   selectedSeats: number[]
//   onSeatSelection: (seats: number[]) => void
//   onProceedToPayment: () => void
//   onSessionExpired: () => void
// }

// export function SeatSelection({
//   selectedBus,
//   searchData,
//   selectedSeats,
//   onSeatSelection,
//   onProceedToPayment,
//   onSessionExpired,
// }: SeatSelectionProps) {
//   const [seatAvailability, setSeatAvailability] = useState<SeatAvailability[]>([])
//   const [loadingSeats, setLoadingSeats] = useState(true)

//   // Session Expiry Interval: Calls parent to navigate if expired
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isUserLoggedIn()) {
//         toast.error('Session expired. Please log in again.')
//         onSessionExpired()
//       }
//     }, 1000)
//     return () => clearInterval(interval)
//   }, [onSessionExpired])

//   // Load seats for selected bus+date
//   useEffect(() => {
//     fetchSeatAvailability()
//   }, [selectedBus?.schedule.id, searchData?.date])

//   async function fetchSeatAvailability() {
//     setLoadingSeats(true)
//     try {
//       const response = await fetch(`/api/seats/${selectedBus.schedule.id}?journeyDate=${searchData.date}`)
//       const data = await response.json()
//       if (data.success) {
//         setSeatAvailability(data.seats)
//       } else {
//         toast.error('Failed to load seat availability')
//         generateMockSeats()
//       }
//     } catch {
//       toast.error('Failed to load seats')
//       generateMockSeats()
//     } finally {
//       setLoadingSeats(false)
//     }
//   }

//   function generateMockSeats() {
//     const seats: SeatAvailability[] = []
//     for (let i = 1; i <= selectedBus.schedule.bus.capacity; i++) {
//       seats.push({
//         seatNumber: i,
//         isAvailable: Math.random() > 0.3,
//         isOccupied: Math.random() < 0.3,
//       })
//     }
//     setSeatAvailability(seats)
//   }

//   function formatTime(timeString: string) {
//     try {
//       const [hours, minutes] = timeString.split(':')
//       const time = new Date()
//       time.setHours(parseInt(hours), parseInt(minutes))
//       return time.toLocaleTimeString('en-US', {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true,
//       })
//     } catch {
//       return timeString
//     }
//   }

//   function calculateDuration(departure: string, arrival: string) {
//     try {
//       const [depHours, depMinutes] = departure.split(':').map(Number)
//       const [arrHours, arrMinutes] = arrival.split(':').map(Number)
//       const depTime = depHours * 60 + depMinutes
//       const arrTime = arrHours * 60 + arrMinutes
//       const diffMinutes = arrTime - depTime
//       if (diffMinutes < 0) return 'Invalid'
//       const hours = Math.floor(diffMinutes / 60)
//       const minutes = diffMinutes % 60
//       return `${hours}h ${minutes}m`
//     } catch {
//       return 'N/A'
//     }
//   }

//   function handleSeatClick(seatNumber: number) {
//     const seatInfo = seatAvailability.find(s => s.seatNumber === seatNumber)
//     if (seatInfo?.isOccupied) {
//       toast.error('This seat is already booked')
//       return
//     }
//     let newSelectedSeats = [...selectedSeats]
//     if (selectedSeats.includes(seatNumber)) {
//       newSelectedSeats = selectedSeats.filter(s => s !== seatNumber)
//     } else if (selectedSeats.length < 4) {
//       newSelectedSeats = [...selectedSeats, seatNumber]
//     } else {
//       toast.error('Maximum 4 seats can be selected')
//       return
//     }
//     onSeatSelection(newSelectedSeats)
//   }

//   function generateSeatLayout(capacity: number) {
//     return Array.from({ length: capacity }, (_, i) => i + 1)
//   }

//   function getTotalPrice() {
//     return selectedSeats.length * selectedBus.fare.basePrice
//   }

//   function proceedToPayment() {
//     if (selectedSeats.length === 0) {
//       toast.error('Please select at least one seat')
//       return
//     }
//     onProceedToPayment()
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="relative">
//         <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20"></div>
//         <div className="relative p-8">
//           {/* Header */}
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Seats</h2>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-lg text-gray-700 mb-2">
//                   {selectedBus.route.operator.name} • {selectedBus.schedule.bus.busType}
//                 </p>
//                 <p className="text-gray-600">
//                   {searchData.from} → {searchData.to} • {formatTime(selectedBus.schedule.departureTime)}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-2xl font-bold text-gray-900">
//                   {selectedBus.fare.currency} {selectedBus.fare.basePrice.toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-600">per seat</p>
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Seat Map */}
//             <div className="lg:col-span-2">
//               <div className="bg-white/60 rounded-2xl p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-bold text-gray-900">Bus Layout</h3>
//                   <div className="flex items-center gap-4 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="w-6 h-6 bg-green-200 border-2 border-green-400 rounded"></div>
//                       <span>Available</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-6 h-6 bg-cyan-500 border-2 border-cyan-600 rounded text-white flex items-center justify-center text-xs">✓</div>
//                       <span>Selected</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded"></div>
//                       <span>Occupied</span>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Driver Area */}
//                 <div className="mb-6 text-center">
//                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
//                     <User className="h-4 w-4" />
//                     <span className="text-sm font-medium">Driver</span>
//                   </div>
//                 </div>
//                 {/* Seat map */}
//                 {loadingSeats ? (
//                   <div className="flex items-center justify-center py-12">
//                     <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
//                     <span className="ml-3 text-gray-600">Loading seats...</span>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
//                     {generateSeatLayout(selectedBus.schedule.bus.capacity).map((seatNumber) => {
//                       const isSelected = selectedSeats.includes(seatNumber)
//                       const seatInfo = seatAvailability.find(s => s.seatNumber === seatNumber)
//                       const isOccupied = seatInfo?.isOccupied || false
//                       const isAisle = seatNumber % 4 === 3 || seatNumber % 4 === 0
//                       return (
//                         <div key={seatNumber} className="relative">
//                           <button
//                             onClick={() => handleSeatClick(seatNumber)}
//                             disabled={isOccupied}
//                             className={cn(
//                               "w-12 h-12 rounded-lg border-2 font-bold text-sm transition-all duration-200 flex items-center justify-center",
//                               isSelected && !isOccupied && "bg-cyan-500 border-cyan-600 text-white scale-110 shadow-lg",
//                               !isSelected && !isOccupied && "bg-green-200 border-green-400 hover:bg-green-300 hover:scale-105",
//                               isOccupied && "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50",
//                               isAisle && seatNumber % 4 === 0 && "mr-6"
//                             )}
//                           >
//                             {isSelected && !isOccupied ? '✓' : seatNumber}
//                           </button>
//                           {isAisle && seatNumber % 4 === 0 && seatNumber < selectedBus.schedule.bus.capacity && (
//                             <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
//                               |
//                             </div>
//                           )}
//                         </div>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//             {/* Booking Summary */}
//             <div className="space-y-6">
//               <div className="bg-white/60 rounded-2xl p-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
//                 <div className="space-y-4">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Selected Seats</span>
//                     <span className="font-medium">
//                       {selectedSeats.length > 0 ? selectedSeats.sort((a, b) => a - b).join(', ') : 'None'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Seat Count</span>
//                     <span className="font-medium">{selectedSeats.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Price per Seat</span>
//                     <span className="font-medium">
//                       {selectedBus.fare.currency} {selectedBus.fare.basePrice.toLocaleString()}
//                     </span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between text-lg font-bold">
//                     <span>Total Amount</span>
//                     <span className="text-cyan-600">
//                       {selectedBus.fare.currency} {getTotalPrice().toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//                 <Button
//                   onClick={proceedToPayment}
//                   disabled={selectedSeats.length === 0}
//                   className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold py-3 rounded-2xl"
//                 >
//                   Proceed to Payment
//                   <ArrowRight className="h-5 w-5 ml-2" />
//                 </Button>
//                 <p className="text-xs text-gray-500 mt-3 text-center">
//                   Maximum 4 seats can be selected
//                 </p>
//               </div>

//               {/* Journey Details */}
//               <div className="bg-white/60 rounded-2xl p-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4">Journey Details</h3>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Route</span>
//                     <span className="font-medium">{selectedBus.route.routeNumber}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Bus Number</span>
//                     <span className="font-medium">{selectedBus.schedule.bus.busNumber}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Departure</span>
//                     <span className="font-medium">{formatTime(selectedBus.schedule.departureTime)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Arrival</span>
//                     <span className="font-medium">{formatTime(selectedBus.schedule.arrivalTime)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Duration</span>
//                     <span className="font-medium">
//                       {calculateDuration(selectedBus.schedule.departureTime, selectedBus.schedule.arrivalTime)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }













'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User, ArrowRight, Loader2, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { SelectedBusData, SearchData, SeatAvailability } from '@/types/booking'
import { isUserLoggedIn } from '@/utils/auth'

interface SeatSelectionProps {
  selectedBus: SelectedBusData
  searchData: SearchData
  selectedSeats: number[]
  onSeatSelection: (seats: number[]) => void
  onProceedToPayment: () => void
  onSessionExpired: () => void
}

export function SeatSelection({
  selectedBus,
  searchData,
  selectedSeats,
  onSeatSelection,
  onProceedToPayment,
  onSessionExpired,
}: SeatSelectionProps) {
  const [seatAvailability, setSeatAvailability] = useState<SeatAvailability[]>([])
  const [loadingSeats, setLoadingSeats] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Session check
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isUserLoggedIn()) {
        toast.error('Session expired. Please log in again.')
        onSessionExpired()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [onSessionExpired])

  // Initial fetch
  useEffect(() => {
    fetchSeatAvailability()
  }, [selectedBus?.schedule.id, searchData?.date])

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        console.log('🔄 Auto-refreshing seat availability...')
        fetchSeatAvailability(true) // Silent refresh
      }, 10000) // Refresh every 10 seconds
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [autoRefresh, selectedBus?.schedule.id, searchData?.date])

  async function fetchSeatAvailability(silent = false) {
    if (!silent) setLoadingSeats(true)
    
    try {
      const response = await fetch(
        `/api/seats/${selectedBus.schedule.id}?journeyDate=${searchData.date}`,
        {
          cache: 'no-store', // Don't cache - always get fresh data
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      )
      
      const data = await response.json()
      
      if (data.success) {
        setSeatAvailability(data.seats)
        setLastUpdated(new Date().toLocaleTimeString())
        
        // Check if any selected seats became unavailable
        const occupiedSeats = data.seats
          .filter((s: SeatAvailability) => s.isOccupied)
          .map((s: SeatAvailability) => s.seatNumber)
        
        const conflictingSeats = selectedSeats.filter(seat => 
          occupiedSeats.includes(seat)
        )
        
        if (conflictingSeats.length > 0) {
          toast.warning(`Seats ${conflictingSeats.join(', ')} were just booked by someone else`)
          const newSelectedSeats = selectedSeats.filter(
            seat => !conflictingSeats.includes(seat)
          )
          onSeatSelection(newSelectedSeats)
        }
        
        if (!silent) {
          console.log('✅ Seat data loaded:', {
            total: data.seats.length,
            available: data.statistics.availableSeats,
            occupied: data.statistics.occupiedSeats
          })
        }
      } else {
        if (!silent) toast.error('Failed to load seat availability')
      }
    } catch (error) {
      console.error('❌ Failed to fetch seats:', error)
      if (!silent) toast.error('Failed to load seats')
    } finally {
      if (!silent) setLoadingSeats(false)
    }
  }

  function formatTime(timeString: string) {
    try {
      const [hours, minutes] = timeString.split(':')
      const time = new Date()
      time.setHours(parseInt(hours), parseInt(minutes))
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return timeString
    }
  }

  function handleSeatClick(seatNumber: number) {
    const seatInfo = seatAvailability.find(s => s.seatNumber === seatNumber)
    
    if (seatInfo?.isOccupied) {
      toast.error('This seat is already booked')
      return
    }
    
    let newSelectedSeats = [...selectedSeats]
    
    if (selectedSeats.includes(seatNumber)) {
      newSelectedSeats = selectedSeats.filter(s => s !== seatNumber)
    } else if (selectedSeats.length < 4) {
      newSelectedSeats = [...selectedSeats, seatNumber]
    } else {
      toast.error('Maximum 4 seats can be selected')
      return
    }
    
    onSeatSelection(newSelectedSeats)
  }

  function getTotalPrice() {
    return selectedSeats.length * selectedBus.fare.basePrice
  }

  function proceedToPayment() {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat')
      return
    }
    onProceedToPayment()
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/15 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl p-8">
        
        {/* Header with Refresh */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Seats</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Updated: {lastUpdated}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchSeatAvailability()}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-700 mb-2">
                {selectedBus.route.operator.name} • {selectedBus.schedule.bus.busType}
              </p>
              <p className="text-gray-600">
                {searchData.from} → {searchData.to} • {formatTime(selectedBus.schedule.departureTime)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                Rs. {selectedBus.fare.basePrice.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">per seat</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Bus Layout</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-200 border-2 border-green-400 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-cyan-500 border-2 border-cyan-600 rounded text-white flex items-center justify-center text-xs">✓</div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded"></div>
                    <span>Occupied</span>
                  </div>
                </div>
              </div>

              {/* Driver */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/50 rounded-full backdrop-blur-xl">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Driver</span>
                </div>
              </div>

              {/* Seats */}
              {loadingSeats ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                  <span className="ml-3 text-gray-600">Loading seats...</span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                  {seatAvailability.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.seatNumber)
                    const isOccupied = seat.isOccupied
                    
                    return (
                      <button
                        key={seat.seatNumber}
                        onClick={() => handleSeatClick(seat.seatNumber)}
                        disabled={isOccupied}
                        className={cn(
                          "w-12 h-12 rounded-lg border-2 font-bold text-sm transition-all duration-200 flex items-center justify-center",
                          isSelected && !isOccupied && "bg-cyan-500 border-cyan-600 text-white scale-110 shadow-lg",
                          !isSelected && !isOccupied && "bg-green-200 border-green-400 hover:bg-green-300 hover:scale-105",
                          isOccupied && "bg-gray-300 border-gray-400 cursor-not-allowed opacity-50"
                        )}
                      >
                        {isSelected && !isOccupied ? '✓' : seat.seatNumber}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Seats</span>
                  <span className="font-medium">
                    {selectedSeats.length > 0 ? selectedSeats.sort((a, b) => a - b).join(', ') : 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat Count</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Seat</span>
                  <span className="font-medium">Rs. {selectedBus.fare.basePrice.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-cyan-600">Rs. {getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
              
              <Button
                onClick={proceedToPayment}
                disabled={selectedSeats.length === 0}
                className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold py-3 rounded-2xl shadow-xl"
              >
                Proceed to Payment
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                🔄 Auto-refreshing every 10 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
