
// 'use client'

// import { useState } from 'react'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Bus, MapPin, Clock, RefreshCw } from 'lucide-react'

// interface Position {
//   latitude: number
//   longitude: number
//   speed: number | null
//   heading: number | null
//   timestamp: string
// }

// interface BusInfo {
//   registrationNo: string
//   capacity: number
// }

// interface LivePosition {
//   deviceId: string
//   name: string
//   bus?: BusInfo
//   latestPosition: Position | null
// }

// interface LiveBusMapProps {
//   positions: LivePosition[]
// }

// export function LiveBusMap({ positions }: LiveBusMapProps) {
//   const [selectedBus, setSelectedBus] = useState<LivePosition | null>(null)

//   const validPositions = positions.filter(pos => 
//     pos.latestPosition?.latitude && pos.latestPosition?.longitude
//   )

//   const getSpeedColor = (speed: number | null | undefined) => {
//     const safeSpeed = speed ?? 0
//     if (safeSpeed === 0) return 'bg-red-100 text-red-800'
//     if (safeSpeed > 30) return 'bg-green-100 text-green-800'
//     return 'bg-yellow-100 text-yellow-800'
//   }

//   const getSpeedText = (speed: number | null | undefined) => {
//     const safeSpeed = speed ?? 0
//     if (safeSpeed === 0) return 'Stopped'
//     if (safeSpeed > 30) return 'Fast'
//     return 'Slow'
//   }

//   const formatTime = (timestamp: string) => {
//     try {
//       return new Date(timestamp).toLocaleTimeString()
//     } catch {
//       return 'Now'
//     }
//   }

//   if (validPositions.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <Bus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-500">No live bus data available</p>
//         <p className="text-sm text-gray-400 mt-1">Buses will appear here when tracking is active</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-gray-600">{validPositions.length} buses active</p>
//         <Button variant="outline" size="sm">
//           <RefreshCw className="w-4 h-4 mr-2" />
//           Refresh
//         </Button>
//       </div>
      
//       <div className="space-y-3 max-h-[300px] overflow-auto">
//         {validPositions.slice(0, 5).map((position) => (
//           <div
//             key={position.deviceId}
//             className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
//             onClick={() => setSelectedBus(
//               selectedBus?.deviceId === position.deviceId ? null : position
//             )}
//           >
//             <div className="flex items-center justify-between mb-2">
//               <div className="flex items-center gap-2">
//                 <Bus className="w-4 h-4 text-blue-600" />
//                 <span className="font-medium text-sm">
//                   {position.bus?.registrationNo || position.name}
//                 </span>
//               </div>
//               <Badge className={getSpeedColor(position.latestPosition?.speed)}>
//                 {getSpeedText(position.latestPosition?.speed)}
//               </Badge>
//             </div>
            
//             <div className="text-xs text-gray-500 space-y-1">
//               <div className="flex items-center gap-1">
//                 <MapPin className="w-3 h-3" />
//                 <span>
//                   {position.latestPosition!.latitude.toFixed(4)}, 
//                   {position.latestPosition!.longitude.toFixed(4)}
//                 </span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 <span>{formatTime(position.latestPosition!.timestamp)}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {validPositions.length > 5 && (
//         <div className="text-center">
//           <Button variant="link" size="sm">
//             View all {validPositions.length} buses
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }



// 'use client'

// import { useState } from 'react'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Bus, MapPin, Clock, RefreshCw } from 'lucide-react'

// // ✅ FIXED: Updated interfaces to match your actual data structure
// interface Position {
//   id: string
//   latitude: number
//   longitude: number
//   speed: number | null
//   heading: number | null
//   timestamp: Date
//   busId: string | null
//   deviceId: string
// }

// interface BusInfo {
//   busNumber: string
//   capacity: number
//   operator?: string
// }

// interface LivePosition {
//   deviceId: string
//   name: string
//   bus: BusInfo | null | undefined  // ✅ Allow null and undefined
//   latestPosition: Position | null
// }

// interface LiveBusMapProps {
//   positions: LivePosition[]
// }

// export function LiveBusMap({ positions }: LiveBusMapProps) {
//   const [selectedBus, setSelectedBus] = useState<LivePosition | null>(null)

//   const validPositions = positions.filter(pos => 
//     pos.latestPosition?.latitude && pos.latestPosition?.longitude
//   )

//   const getSpeedColor = (speed: number | null | undefined) => {
//     const safeSpeed = speed ?? 0
//     if (safeSpeed === 0) return 'bg-red-100 text-red-800'
//     if (safeSpeed > 30) return 'bg-green-100 text-green-800'
//     return 'bg-yellow-100 text-yellow-800'
//   }

//   const getSpeedText = (speed: number | null | undefined) => {
//     const safeSpeed = speed ?? 0
//     if (safeSpeed === 0) return 'Stopped'
//     if (safeSpeed > 30) return 'Fast'
//     return 'Slow'
//   }

//   const formatTime = (timestamp: Date) => {
//     try {
//       return timestamp.toLocaleTimeString()
//     } catch {
//       return 'Now'
//     }
//   }

//   if (validPositions.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <Bus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-500">No live bus data available</p>
//         <p className="text-sm text-gray-400 mt-1">Buses will appear here when tracking is active</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-gray-600">{validPositions.length} buses active</p>
//         <Button variant="outline" size="sm">
//           <RefreshCw className="w-4 h-4 mr-2" />
//           Refresh
//         </Button>
//       </div>
      
//       <div className="space-y-3 max-h-[300px] overflow-auto">
//         {validPositions.slice(0, 5).map((position) => (
//           <div
//             key={position.deviceId}
//             className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
//             onClick={() => setSelectedBus(
//               selectedBus?.deviceId === position.deviceId ? null : position
//             )}
//           >
//             <div className="flex items-center justify-between mb-2">
//               <div className="flex items-center gap-2">
//                 <Bus className="w-4 h-4 text-blue-600" />
//                 <span className="font-medium text-sm">
//                   {position.bus?.busNumber || position.name}
//                 </span>
//               </div>
//               <Badge className={getSpeedColor(position.latestPosition?.speed)}>
//                 {getSpeedText(position.latestPosition?.speed)}
//               </Badge>
//             </div>
            
//             <div className="text-xs text-gray-500 space-y-1">
//               <div className="flex items-center gap-1">
//                 <MapPin className="w-3 h-3" />
//                 <span>
//                   {position.latestPosition!.latitude.toFixed(4)}, 
//                   {position.latestPosition!.longitude.toFixed(4)}
//                 </span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 <span>{formatTime(position.latestPosition!.timestamp)}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {validPositions.length > 5 && (
//         <div className="text-center">
//           <Button variant="link" size="sm">
//             View all {validPositions.length} buses
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }



'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bus, MapPin, Clock, RefreshCw } from 'lucide-react'

// ✅ FIXED: Updated interfaces to match your actual data structure
interface Position {
  id: string
  latitude: number
  longitude: number
  speed: number | null
  heading: number | null
  timestamp: Date
  busId: string | null
  deviceId: string
}

interface BusInfo {
  busNumber: string
  capacity: number
  operator?: string
}

interface LivePosition {
  deviceId: string
  name: string
  bus: BusInfo | null | undefined  // ✅ Allow null and undefined
  latestPosition: Position | null
}

interface LiveBusMapProps {
  positions: LivePosition[]
}

export function LiveBusMap({ positions }: LiveBusMapProps) {
  const [selectedBus, setSelectedBus] = useState<LivePosition | null>(null)
  const [isClient, setIsClient] = useState(false) // ✅ Hydration fix

  // ✅ FIXED: Only render on client to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const validPositions = positions.filter(pos => 
    pos.latestPosition?.latitude && pos.latestPosition?.longitude
  )

  const getSpeedColor = (speed: number | null | undefined) => {
    const safeSpeed = speed ?? 0
    if (safeSpeed === 0) return 'bg-red-100 text-red-800'
    if (safeSpeed > 30) return 'bg-green-100 text-green-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getSpeedText = (speed: number | null | undefined) => {
    const safeSpeed = speed ?? 0
    if (safeSpeed === 0) return 'Stopped'
    if (safeSpeed > 30) return 'Fast'
    return 'Slow'
  }

  // ✅ FIXED: Consistent formatting that works on both server and client
  const formatTime = (timestamp: Date) => {
    try {
      // Use consistent 24-hour format to avoid hydration mismatch
      return timestamp.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    } catch (error) {
      return 'Invalid Time'
    }
  }

  // ✅ FIXED: Alternative safe formatting method
  const formatTimeSafe = (timestamp: Date) => {
    try {
      const hours = timestamp.getHours().toString().padStart(2, '0')
      const minutes = timestamp.getMinutes().toString().padStart(2, '0')
      const seconds = timestamp.getSeconds().toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    } catch (error) {
      return 'Invalid Time'
    }
  }

  if (validPositions.length === 0) {
    return (
      <div className="text-center py-8">
        <Bus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No live bus data available</p>
        <p className="text-sm text-gray-400 mt-1">Buses will appear here when tracking is active</p>
      </div>
    )
  }

  // ✅ FIXED: Show loading state during hydration
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{validPositions.length} buses active</p>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="w-4 h-4 mr-2" />
            Loading...
          </Button>
        </div>
        <div className="space-y-3 max-h-[300px] overflow-auto">
          {validPositions.slice(0, 5).map((position) => (
            <div
              key={position.deviceId}
              className="p-3 border rounded-lg bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">
                    {position.bus?.busNumber || position.name}
                  </span>
                </div>
                <Badge className={getSpeedColor(position.latestPosition?.speed)}>
                  {getSpeedText(position.latestPosition?.speed)}
                </Badge>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>
                    {position.latestPosition!.latitude.toFixed(4)}, 
                    {position.latestPosition!.longitude.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Loading...</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">{validPositions.length} buses active</p>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-auto">
        {validPositions.slice(0, 5).map((position) => (
          <div
            key={position.deviceId}
            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setSelectedBus(
              selectedBus?.deviceId === position.deviceId ? null : position
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">
                  {position.bus?.busNumber || position.name}
                </span>
              </div>
              <Badge className={getSpeedColor(position.latestPosition?.speed)}>
                {getSpeedText(position.latestPosition?.speed)}
              </Badge>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>
                  {position.latestPosition!.latitude.toFixed(4)}, 
                  {position.latestPosition!.longitude.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {/* ✅ FIXED: Use consistent time formatting */}
                <span>{formatTimeSafe(position.latestPosition!.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {validPositions.length > 5 && (
        <div className="text-center">
          <Button variant="link" size="sm">
            View all {validPositions.length} buses
          </Button>
        </div>
      )}
    </div>
  )
}
