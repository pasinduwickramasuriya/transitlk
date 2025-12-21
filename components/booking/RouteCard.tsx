'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bus, Clock, Users, Route, Star, ArrowRight,
  Wifi, Coffee, Shield, Lock
} from 'lucide-react'
import { RouteData, ScheduleData } from '@/types/booking'
import { isUserLoggedIn } from '@/utils/auth' //  Only need this import

interface RouteCardProps {
  route: RouteData
  schedule: ScheduleData
  onSelect: () => void //  This handles EVERYTHING in the parent component
}

export function RouteCard({ route, schedule, onSelect }: RouteCardProps) {
  const fare = route.fares.find(f => f.busType === schedule.bus.busType && f.isActive)

  //  SUPER SIMPLE: Just call onSelect - parent handles login check
  const handleButtonClick = () => {
    console.log('RouteCard button clicked - delegating to parent')
    onSelect() //  Parent component (BookTicketsPage) handles ALL login logic
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
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-[1.02]"></div>

      <div className="relative p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Bus Info */}
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl">
                <Bus className="h-8 w-8 text-cyan-600" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">{route.operator.name}</h3>
                <p className="text-gray-700 text-lg">{schedule.bus.busType} • {schedule.bus.busNumber}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  Route {route.routeNumber}
                </Badge>
              </div>

              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100/80 rounded-full">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-yellow-700">4.8</span>
              </div>
            </div>

            {/* Journey Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                <Clock className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="text-sm text-gray-600">Journey Time</p>
                  <p className="font-bold text-gray-900">
                    {formatTime(schedule.departureTime)} → {formatTime(schedule.arrivalTime)}
                  </p>
                  <p className="text-xs text-gray-600">{calculateDuration(schedule.departureTime, schedule.arrivalTime)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                <Users className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-600">Available Seats</p>
                  <p className="font-bold text-gray-900">{schedule.bus.capacity} seats</p>
                  <p className="text-xs text-teal-700">Good availability</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                <Route className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-bold text-gray-900">
                    {route.distance ? `${route.distance} km` : 'Direct route'}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="flex gap-3">
              <Badge variant="outline" className="bg-white/60">
                <Wifi className="h-4 w-4 mr-2" />Wi-Fi
              </Badge>
              <Badge variant="outline" className="bg-white/60">
                <Coffee className="h-4 w-4 mr-2" />AC
              </Badge>
              <Badge variant="outline" className="bg-white/60">
                <Shield className="h-4 w-4 mr-2" />GPS
              </Badge>
            </div>
          </div>

          {/* Price & Action */}
          <div className="text-right ml-8">
            <div className="mb-6 p-6 bg-gradient-to-br from-white/60 to-cyan-50/60 rounded-2xl">
              <p className="text-4xl font-black text-gray-900">
                {fare?.currency || 'LKR'} {fare?.basePrice ? fare.basePrice.toLocaleString() : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">per seat</p>
            </div>

            {/*  PERFECT Button - Shows different text based on login */}
            <Button
              onClick={handleButtonClick} //  Super simple - just calls parent
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
            >
              {/*  Dynamic text based on login status */}
              {isUserLoggedIn() ? (
                <>
                  Select This Bus
                  <ArrowRight className="h-5 w-5 ml-3" />
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Sign In to Book
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}



