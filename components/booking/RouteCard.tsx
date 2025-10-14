// 'use client'

// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { 
//   Bus, Clock, Users, Route, Star, ArrowRight, 
//   Wifi, Coffee, Shield, Lock 
// } from 'lucide-react'
// import { RouteData, ScheduleData } from '@/types/booking'
// import { isUserLoggedIn } from '@/utils/auth' // ✅ Only need this import
// import { toast } from 'sonner'

// interface RouteCardProps {
//   route: RouteData
//   schedule: ScheduleData
//   onSelect: () => void // ✅ This handles EVERYTHING in the parent component
// }

// export function RouteCard({ route, schedule, onSelect }: RouteCardProps) {
//   const fare = route.fares.find(f => f.busType === schedule.bus.busType && f.isActive)

//   // ✅ SUPER SIMPLE: Just call onSelect - parent handles login check
//   const handleButtonClick = () => {
//     console.log('🚌 RouteCard button clicked - delegating to parent')
//     onSelect() // ✅ Parent component (BookTicketsPage) handles ALL login logic
//   }

//   const formatTime = (timeString: string) => {
//     try {
//       const [hours, minutes] = timeString.split(':')
//       const time = new Date()
//       time.setHours(parseInt(hours), parseInt(minutes))
//       return time.toLocaleTimeString('en-US', { 
//         hour: 'numeric', 
//         minute: '2-digit', 
//         hour12: true 
//       })
//     } catch {
//       return timeString
//     }
//   }

//   const calculateDuration = (departure: string, arrival: string) => {
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

//   return (
//     <div className="relative group">
//       <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-[1.02]"></div>

//       <div className="relative p-8">
//         <div className="flex items-center justify-between">
//           <div className="flex-1">
//             {/* Bus Info */}
//             <div className="flex items-center gap-6 mb-6">
//               <div className="p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl">
//                 <Bus className="h-8 w-8 text-cyan-600" />
//               </div>

//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900">{route.operator.name}</h3>
//                 <p className="text-gray-700 text-lg">{schedule.bus.busType} • {schedule.bus.busNumber}</p>
//                 <Badge variant="outline" className="mt-1 text-xs">
//                   Route {route.routeNumber}
//                 </Badge>
//               </div>

//               <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100/80 rounded-full">
//                 <Star className="h-4 w-4 text-yellow-500 fill-current" />
//                 <span className="text-sm font-semibold text-yellow-700">4.8</span>
//               </div>
//             </div>

//             {/* Journey Details */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
//                 <Clock className="h-5 w-5 text-cyan-600" />
//                 <div>
//                   <p className="text-sm text-gray-600">Journey Time</p>
//                   <p className="font-bold text-gray-900">
//                     {formatTime(schedule.departureTime)} → {formatTime(schedule.arrivalTime)}
//                   </p>
//                   <p className="text-xs text-gray-600">{calculateDuration(schedule.departureTime, schedule.arrivalTime)}</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
//                 <Users className="h-5 w-5 text-teal-600" />
//                 <div>
//                   <p className="text-sm text-gray-600">Available Seats</p>
//                   <p className="font-bold text-gray-900">{schedule.bus.capacity} seats</p>
//                   <p className="text-xs text-teal-700">Good availability</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
//                 <Route className="h-5 w-5 text-blue-600" />
//                 <div>
//                   <p className="text-sm text-gray-600">Distance</p>
//                   <p className="font-bold text-gray-900">
//                     {route.distance ? `${route.distance} km` : 'Direct route'}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Features */}
//             <div className="flex gap-3">
//               <Badge variant="outline" className="bg-white/60">
//                 <Wifi className="h-4 w-4 mr-2" />Wi-Fi
//               </Badge>
//               <Badge variant="outline" className="bg-white/60">
//                 <Coffee className="h-4 w-4 mr-2" />AC
//               </Badge>
//               <Badge variant="outline" className="bg-white/60">
//                 <Shield className="h-4 w-4 mr-2" />GPS
//               </Badge>
//             </div>
//           </div>

//           {/* Price & Action */}
//           <div className="text-right ml-8">
//             <div className="mb-6 p-6 bg-gradient-to-br from-white/60 to-cyan-50/60 rounded-2xl">
//               <p className="text-4xl font-black text-gray-900">
//                 {fare?.currency || 'LKR'} {fare?.basePrice ? fare.basePrice.toLocaleString() : 'N/A'}
//               </p>
//               <p className="text-sm text-gray-600">per seat</p>
//             </div>

//             {/* ✅ PERFECT Button - Shows different text based on login */}
//             <Button
//               onClick={handleButtonClick} // ✅ Super simple - just calls parent
//               className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
//             >
//               {/* ✅ Dynamic text based on login status */}
//               {isUserLoggedIn() ? (
//                 <>
//                   Select This Bus
//                   <ArrowRight className="h-5 w-5 ml-3" />
//                 </>
//               ) : (
//                 <>
//                   <Lock className="h-5 w-5 mr-2" />
//                   Sign In to Book
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }









'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bus, Clock, Users, Route, Star, ArrowRight,
  Wifi, Coffee, Shield, Lock, MapPin, Calendar
} from 'lucide-react'
import { RouteData, ScheduleData } from '@/types/booking'
import { isUserLoggedIn } from '@/utils/auth'

interface RouteCardProps {
  route: RouteData
  schedule: ScheduleData
  onSelect: () => void
}

export function RouteCard({ route, schedule, onSelect }: RouteCardProps) {
  const fare = route.fares.find(f => f.busType === schedule.bus.busType && f.isActive)

  const handleButtonClick = () => {
    console.log('🚌 RouteCard button clicked')
    onSelect()
  }

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':')
      const time = new Date()
      time.setHours(parseInt(hours), parseInt(minutes))
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return timeString
    }
  }

  const calculateDuration = (departure: string, arrival: string) => {
    try {
      const [depHours, depMinutes] = departure.split(':').map(Number)
      const [arrHours, arrMinutes] = arrival.split(':').map(Number)

      const depTime = depHours * 60 + depMinutes
      const arrTime = arrHours * 60 + arrMinutes
      const diffMinutes = arrTime - depTime

      if (diffMinutes < 0) return 'Invalid'

      const hours = Math.floor(diffMinutes / 60)
      const minutes = diffMinutes % 60

      return `${hours}h ${minutes}m`
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="relative group">
      {/* Decorative Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-sky-50/30 to-teal-50/30 rounded-[2rem] -z-10"></div>

      {/* Main Card Container */}
      <div className="relative bg-white/40 backdrop-blur-3xl rounded-[2rem] border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] overflow-hidden">
        {/* Card Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section - Responsive Flex */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            {/* Bus Info Section */}
            <div className="flex items-start gap-4 flex-1">
              {/* Bus Icon */}
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-100/80 to-fuchsia-100/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/60">
                <Bus className="h-7 w-7 sm:h-8 sm:w-8 text-violet-600" />
              </div>

              {/* Bus Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 truncate">
                    {route.operator.name}
                  </h3>
                  {/* Rating Badge - Hidden on smallest screens */}
                  <div className="hidden xs:flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 backdrop-blur-xl rounded-full border border-amber-200/50 shadow-md flex-shrink-0">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="text-sm font-black text-amber-700">4.8</span>
                  </div>
                </div>

                <p className="text-slate-600 text-base sm:text-lg font-semibold mb-2">
                  {schedule.bus.busType} • {schedule.bus.busNumber}
                </p>

                <Badge className="bg-gradient-to-r from-violet-100/70 to-fuchsia-100/70 text-violet-700 border border-violet-200/50 backdrop-blur-xl text-xs font-bold">
                  Route {route.routeNumber}
                </Badge>
              </div>
            </div>

            {/* Price Section - Responsive */}
            <div className="lg:text-right">
              <div className="inline-block lg:block p-4 sm:p-6 bg-gradient-to-br from-emerald-50/70 via-teal-50/70 to-cyan-50/70 backdrop-blur-xl rounded-2xl border-2 border-white/60 shadow-lg">
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {fare?.currency || 'LKR'} {fare?.basePrice ? fare.basePrice.toLocaleString() : 'N/A'}
                </p>
                <p className="text-sm text-slate-600 font-semibold mt-1">per seat</p>
              </div>
            </div>
          </div>

          {/* Journey Details Grid - Fully Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {/* Time Card */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-sky-50/60 to-cyan-50/60 backdrop-blur-xl rounded-xl border border-white/60 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Clock className="h-5 w-5 text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 font-semibold mb-1">Journey Time</p>
                <p className="font-black text-slate-800 text-sm sm:text-base truncate">
                  {formatTime(schedule.departureTime)}
                </p>
                <p className="text-xs text-slate-500 font-semibold">
                  → {formatTime(schedule.arrivalTime)}
                </p>
                <Badge className="bg-sky-100/70 text-sky-700 border-0 text-xs mt-1 font-bold">
                  {calculateDuration(schedule.departureTime, schedule.arrivalTime)}
                </Badge>
              </div>
            </div>

            {/* Seats Card */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-violet-50/60 to-fuchsia-50/60 backdrop-blur-xl rounded-xl border border-white/60 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 font-semibold mb-1">Available Seats</p>
                <p className="font-black text-slate-800 text-base">{schedule.bus.capacity}</p>
                <Badge className="bg-emerald-100/70 text-emerald-700 border-0 text-xs mt-1 font-bold">
                  Good availability
                </Badge>
              </div>
            </div>

            {/* Distance Card */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-rose-50/60 to-pink-50/60 backdrop-blur-xl rounded-xl border border-white/60 shadow-md hover:shadow-lg transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Route className="h-5 w-5 text-rose-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 font-semibold mb-1">Distance</p>
                <p className="font-black text-slate-800 text-base">
                  {route.distance ? `${route.distance} km` : 'Direct'}
                </p>
                <Badge className="bg-rose-100/70 text-rose-700 border-0 text-xs mt-1 font-bold">
                  Express route
                </Badge>
              </div>
            </div>
          </div>

          {/* Features & Action Section - Responsive */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Features Badges */}
            {/* <div className="flex flex-wrap gap-2">
              <Badge className="bg-gradient-to-r from-sky-100/70 to-cyan-100/70 text-sky-700 border border-sky-200/50 backdrop-blur-xl font-bold text-xs">
                <Wifi className="h-3.5 w-3.5 mr-1.5" />Wi-Fi
              </Badge>
              <Badge className="bg-gradient-to-r from-violet-100/70 to-fuchsia-100/70 text-violet-700 border border-violet-200/50 backdrop-blur-xl font-bold text-xs">
                <Coffee className="h-3.5 w-3.5 mr-1.5" />AC
              </Badge>
              <Badge className="bg-gradient-to-r from-emerald-100/70 to-teal-100/70 text-emerald-700 border border-emerald-200/50 backdrop-blur-xl font-bold text-xs">
                <Shield className="h-3.5 w-3.5 mr-1.5" />GPS
              </Badge>
            </div> */}

            {/* Action Button - Full width on mobile */}
            <Button
              onClick={handleButtonClick}
              className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-black px-6 sm:px-8 py-4 sm:py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              {isUserLoggedIn() ? (
                <>
                  <span className="flex items-center justify-center">
                    Select This Bus
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center justify-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Sign In to Book
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
