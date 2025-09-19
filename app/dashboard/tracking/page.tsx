


// 'use client'

// import { useState, useEffect, useCallback, useRef } from 'react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { 
//   MapPin, 
//   Navigation, 
//   Clock, 
//   Bus, 
//   Search, 
//   RefreshCw, 
//   AlertCircle,
//   Users,
//   Route,
//   Loader2
// } from 'lucide-react'
// import Map, { Marker, Popup, Source, Layer } from 'react-map-gl'
// import type { MapRef } from 'react-map-gl'
// import 'mapbox-gl/dist/mapbox-gl.css'
// import { Marker } from 'mapbox-gl'

// interface BusLocation {
//   busNumber: string
//   route: string
//   currentLocation: {
//     lat: number
//     lng: number
//     address: string
//   }
//   nextStop: string
//   estimatedArrival: string
//   status: 'on_time' | 'delayed' | 'boarding' | 'departed'
//   capacity: {
//     occupied: number
//     total: number
//   }
//   lastUpdated: string
//   operator?: string
//   speed?: number
// }

// interface TrackingData {
//   activeBuses: BusLocation[]
//   userBookings: Array<{
//     id: string
//     busNumber: string
//     route: string
//     date: string
//     time: string
//     status: string
//   }>
// }

// interface RouteData {
//   type: 'Feature'
//   geometry: {
//     type: 'LineString'
//     coordinates: number[][]
//   }
// }

// const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// // Sri Lanka coordinates for initial view
// const SRI_LANKA_BOUNDS = {
//   center: { lng: 80.7718, lat: 7.8731 } as [number, number],
//   zoom: 7
// }

// export default function TrackingPage() {
//   const mapRef = useRef<MapRef>(null)
//   const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
//   const [selectedBus, setSelectedBus] = useState<string>('')
//   const [searchQuery, setSearchQuery] = useState('')
//   const [isLoading, setIsLoading] = useState(true)
//   const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
//   const [selectedBusPopup, setSelectedBusPopup] = useState<BusLocation | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [routeData, setRouteData] = useState<Record<string, RouteData>>({})

//   // Viewport state for map
//   const [viewState, setViewState] = useState({
//     longitude: SRI_LANKA_BOUNDS.center[0],
//     latitude: SRI_LANKA_BOUNDS.center[1],
//     zoom: SRI_LANKA_BOUNDS.zoom
//   })

//   // Fetch tracking data from API
//   const fetchTrackingData = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       setError(null)

//       const response = await fetch('/api/tracking')
//       if (!response.ok) {
//         throw new Error('Failed to fetch tracking data')
//       }

//       const data = await response.json()
//       setTrackingData(data)
      
//       // Generate mock route data for demonstration
//       generateRouteData(data.activeBuses)
      
//     } catch (err) {
//       console.error('Error fetching tracking data:', err)
//       setError('Failed to load tracking data')
      
//       // Fallback to mock data
//       const mockData: TrackingData = {
//         activeBuses: [
//           {
//             busNumber: 'NB-1234',
//             route: 'Colombo → Kandy',
//             currentLocation: {
//               lat: 6.9271,
//               lng: 79.8612,
//               address: 'Near Kiribathgoda Junction'
//             },
//             nextStop: 'Kadawatha Bus Stop',
//             estimatedArrival: '10:45 AM',
//             status: 'on_time',
//             capacity: {
//               occupied: 28,
//               total: 45
//             },
//             lastUpdated: new Date().toISOString(),
//             operator: 'National Transport Ltd',
//             speed: 45
//           },
//           {
//             busNumber: 'SB-5678',
//             route: 'Kandy → Galle',
//             currentLocation: {
//               lat: 7.2906,
//               lng: 80.6337,
//               address: 'Kandy City Center'
//             },
//             nextStop: 'Peradeniya Junction',
//             estimatedArrival: '11:15 AM',
//             status: 'boarding',
//             capacity: {
//               occupied: 12,
//               total: 40
//             },
//             lastUpdated: new Date().toISOString(),
//             operator: 'Southern Express',
//             speed: 0
//           },
//           {
//             busNumber: 'CB-9876',
//             route: 'Colombo → Jaffna',
//             currentLocation: {
//               lat: 8.1478,
//               lng: 80.4142,
//               address: 'Anuradhapura City'
//             },
//             nextStop: 'Vavuniya Central',
//             estimatedArrival: '2:30 PM',
//             status: 'delayed',
//             capacity: {
//               occupied: 35,
//               total: 50
//             },
//             lastUpdated: new Date().toISOString(),
//             operator: 'Northern Express',
//             speed: 52
//           }
//         ],
//         userBookings: [
//           {
//             id: '1',
//             busNumber: 'NB-1234',
//             route: 'Colombo → Kandy',
//             date: '2025-09-20',
//             time: '08:30 AM',
//             status: 'confirmed'
//           }
//         ]
//       }
//       setTrackingData(mockData)
//       generateRouteData(mockData.activeBuses)
//     } finally {
//       setIsLoading(false)
//       setLastRefresh(new Date())
//     }
//   }, [])

//   // Generate mock route data for buses
//   const generateRouteData = (buses: BusLocation[]) => {
//     const routes: Record<string, RouteData> = {}
    
//     buses.forEach(bus => {
//       // Generate mock route coordinates (in real app, fetch from API)
//       const routeCoords = generateMockRoute(bus.currentLocation.lng, bus.currentLocation.lat)
//       routes[bus.busNumber] = {
//         type: 'Feature',
//         geometry: {
//           type: 'LineString',
//           coordinates: routeCoords
//         }
//       }
//     })
    
//     setRouteData(routes)
//   }

//   // Generate mock route coordinates around current location
//   const generateMockRoute = (lng: number, lat: number) => {
//     const coords = []
//     const steps = 10
//     for (let i = 0; i < steps; i++) {
//       coords.push([
//         lng + (Math.random() - 0.5) * 0.1,
//         lat + (Math.random() - 0.5) * 0.1
//       ])
//     }
//     return coords
//   }

//   // Initial data load
//   useEffect(() => {
//     fetchTrackingData()
    
//     // Set up auto-refresh every 30 seconds
//     const interval = setInterval(fetchTrackingData, 30000)
    
//     return () => clearInterval(interval)
//   }, [fetchTrackingData])

//   // Handle manual refresh
//   const handleRefresh = () => {
//     fetchTrackingData()
//   }

//   // Handle bus selection
//   const handleBusSelect = (busNumber: string) => {
//     setSelectedBus(busNumber)
    
//     if (busNumber && trackingData) {
//       const bus = trackingData.activeBuses.find(b => b.busNumber === busNumber)
//       if (bus && mapRef.current) {
//         mapRef.current.flyTo({
//           center: [bus.currentLocation.lng, bus.currentLocation.lat],
//           zoom: 12,
//           duration: 2000
//         })
//       }
//     }
//   }

//   // Get status styling
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'on_time': return 'default'
//       case 'delayed': return 'destructive'
//       case 'boarding': return 'outline'
//       case 'departed': return 'secondary'
//       default: return 'secondary'
//     }
//   }

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case 'on_time': return 'On Time'
//       case 'delayed': return 'Delayed'
//       case 'boarding': return 'Boarding'
//       case 'departed': return 'Departed'
//       default: return status
//     }
//   }

//   // Get bus marker color based on status
//   const getBusMarkerColor = (status: string) => {
//     switch (status) {
//       case 'on_time': return '#22c55e'
//       case 'delayed': return '#ef4444'
//       case 'boarding': return '#f59e0b'
//       case 'departed': return '#6b7280'
//       default: return '#3b82f6'
//     }
//   }

//   // Filter buses based on search and selection
//   const filteredBuses = trackingData?.activeBuses.filter(bus => {
//     const matchesSearch = !searchQuery || 
//       bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       bus.route.toLowerCase().includes(searchQuery.toLowerCase())
    
//     const matchesSelection = !selectedBus || bus.busNumber === selectedBus
    
//     return matchesSearch && matchesSelection
//   }) || []

//   // Check for Mapbox token
//   if (!MAPBOX_ACCESS_TOKEN) {
//     return (
//       <div className="space-y-6">
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>
//             Mapbox access token is required. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables.
//           </AlertDescription>
//         </Alert>
//       </div>
//     )
//   }

//   // Loading state
//   if (isLoading && !trackingData) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Bus Tracking</h1>
//             <p className="text-gray-600 mt-2">Real-time bus location and status</p>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <Card className="lg:col-span-2">
//             <CardContent className="h-96 flex items-center justify-center">
//               <div className="text-center">
//                 <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
//                 <p className="text-gray-500">Loading tracking data...</p>
//               </div>
//             </CardContent>
//           </Card>
//           <div className="space-y-4">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <Card key={i} className="animate-pulse">
//                 <CardContent className="p-4">
//                   <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                   <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Error Message */}
//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Bus Tracking</h1>
//           <p className="text-gray-600 mt-2">
//             Real-time GPS tracking of {filteredBuses.length} active buses
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-gray-500">
//             Last updated: {lastRefresh.toLocaleTimeString()}
//           </span>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleRefresh}
//             disabled={isLoading}
//           >
//             <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <Card>
//         <CardContent className="p-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search by bus number or route..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//             <Select value={selectedBus} onValueChange={handleBusSelect}>
//               <SelectTrigger className="w-full sm:w-48">
//                 <SelectValue placeholder="Select Bus" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">All Buses</SelectItem>
//                 {trackingData?.activeBuses.map((bus) => (
//                   <SelectItem key={bus.busNumber} value={bus.busNumber}>
//                     {bus.busNumber} - {bus.route}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Mapbox Map */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Navigation className="w-5 h-5" />
//               Live Bus Locations
//             </CardTitle>
//             <CardDescription>
//               Real-time GPS tracking powered by Mapbox
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="h-[500px] rounded-b-lg overflow-hidden">
//               <Map
//                 ref={mapRef}
//                 {...viewState}
//                 onMove={evt => setViewState(evt.viewState)}
//                 mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
//                 mapStyle="mapbox://styles/mapbox/streets-v12"
//                 style={{ width: '100%', height: '100%' }}
//               >
//                 {/* Bus Routes */}
//                 {Object.entries(routeData).map(([busNumber, route]) => (
//                   <Source
//                     key={`route-${busNumber}`}
//                     id={`route-${busNumber}`}
//                     type="geojson"
//                     data={route}
//                   >
//                     <Layer
//                       id={`route-line-${busNumber}`}
//                       type="line"
//                       paint={{
//                         'line-color': selectedBus === busNumber ? '#3b82f6' : '#94a3b8',
//                         'line-width': selectedBus === busNumber ? 4 : 2,
//                         'line-opacity': selectedBus === busNumber ? 0.8 : 0.4
//                       }}
//                     />
//                   </Source>
//                 ))}

//                 {/* Bus Markers */}
//                 {filteredBuses.map((bus) => (
//                   <Marker
//                     key={bus.busNumber}
//                     longitude={bus.currentLocation.lng}
//                     latitude={bus.currentLocation.lat}
//                     anchor="bottom"
//                   >
//                     <div
//                       className={`relative cursor-pointer transform transition-transform hover:scale-110 ${
//                         selectedBus === bus.busNumber ? 'scale-125' : ''
//                       }`}
//                       onClick={() => setSelectedBusPopup(bus)}
//                     >
//                       <div
//                         className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
//                         style={{ backgroundColor: getBusMarkerColor(bus.status) }}
//                       >
//                         <Bus className="w-4 h-4 text-white" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold">
//                         {bus.capacity.occupied}
//                       </div>
//                     </div>
//                   </Marker>
//                 ))}

//                 {/* Bus Popup */}
//                 {selectedBusPopup && (
//                   <Popup
//                     longitude={selectedBusPopup.currentLocation.lng}
//                     latitude={selectedBusPopup.currentLocation.lat}
//                     anchor="top"
//                     onClose={() => setSelectedBusPopup(null)}
//                     closeButton={true}
//                     closeOnClick={false}
//                     className="bus-popup"
//                   >
//                     <div className="p-3 min-w-[250px]">
//                       <div className="flex items-center justify-between mb-2">
//                         <h3 className="font-semibold text-lg">{selectedBusPopup.busNumber}</h3>
//                         <Badge variant={getStatusColor(selectedBusPopup.status)}>
//                           {getStatusText(selectedBusPopup.status)}
//                         </Badge>
//                       </div>
                      
//                       <p className="text-sm text-gray-600 mb-3">{selectedBusPopup.route}</p>
                      
//                       <div className="space-y-2 text-sm">
//                         <div className="flex items-center gap-2">
//                           <MapPin className="w-4 h-4 text-gray-500" />
//                           <span>{selectedBusPopup.currentLocation.address}</span>
//                         </div>
                        
//                         <div className="flex items-center gap-2">
//                           <Clock className="w-4 h-4 text-gray-500" />
//                           <span>Next: {selectedBusPopup.nextStop} at {selectedBusPopup.estimatedArrival}</span>
//                         </div>
                        
//                         <div className="flex items-center gap-2">
//                           <Users className="w-4 h-4 text-gray-500" />
//                           <span>
//                             {selectedBusPopup.capacity.occupied}/{selectedBusPopup.capacity.total} passengers
//                           </span>
//                           <div className="flex-1 h-2 bg-gray-200 rounded-full ml-2">
//                             <div
//                               className="h-2 bg-blue-500 rounded-full"
//                               style={{
//                                 width: `${(selectedBusPopup.capacity.occupied / selectedBusPopup.capacity.total) * 100}%`
//                               }}
//                             />
//                           </div>
//                         </div>
                        
//                         {selectedBusPopup.speed !== undefined && (
//                           <div className="flex items-center gap-2">
//                             <Route className="w-4 h-4 text-gray-500" />
//                             <span>Speed: {selectedBusPopup.speed} km/h</span>
//                           </div>
//                         )}
                        
//                         {selectedBusPopup.operator && (
//                           <div className="text-xs text-gray-500 mt-2">
//                             Operator: {selectedBusPopup.operator}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </Popup>
//                 )}
//               </Map>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Bus List Sidebar */}
//         <div className="space-y-4">
//           {/* Your Bookings */}
//           {trackingData?.userBookings && trackingData.userBookings.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Your Active Trips</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {trackingData.userBookings.map((booking) => {
//                   const busData = trackingData.activeBuses.find(
//                     (bus) => bus.busNumber === booking.busNumber
//                   )
//                   return (
//                     <div
//                       key={booking.id}
//                       className="p-3 border rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
//                       onClick={() => handleBusSelect(booking.busNumber)}
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="font-medium">{booking.busNumber}</span>
//                         {busData && (
//                           <Badge variant={getStatusColor(busData.status)}>
//                             {getStatusText(busData.status)}
//                           </Badge>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-600">{booking.route}</p>
//                       <p className="text-xs text-gray-500">
//                         {booking.date} at {booking.time}
//                       </p>
//                     </div>
//                   )
//                 })}
//               </CardContent>
//             </Card>
//           )}

//           {/* All Active Buses */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Active Buses</CardTitle>
//               <CardDescription>
//                 {filteredBuses.length} buses currently tracked
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-3 max-h-96 overflow-y-auto">
//               {filteredBuses.map((bus) => (
//                 <div
//                   key={bus.busNumber}
//                   className={`p-4 border rounded-lg cursor-pointer transition-colors ${
//                     selectedBus === bus.busNumber 
//                       ? 'border-blue-500 bg-blue-50' 
//                       : 'hover:bg-gray-50'
//                   }`}
//                   onClick={() => handleBusSelect(
//                     selectedBus === bus.busNumber ? '' : bus.busNumber
//                   )}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       <div 
//                         className="w-3 h-3 rounded-full"
//                         style={{ backgroundColor: getBusMarkerColor(bus.status) }}
//                       />
//                       <span className="font-medium">{bus.busNumber}</span>
//                     </div>
//                     <Badge variant={getStatusColor(bus.status)}>
//                       {getStatusText(bus.status)}
//                     </Badge>
//                   </div>
                  
//                   <p className="text-sm text-gray-600 mb-2">{bus.route}</p>
                  
//                   <div className="space-y-1 text-xs text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <MapPin className="w-3 h-3" />
//                       <span>{bus.currentLocation.address}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       <span>Next: {bus.nextStop} at {bus.estimatedArrival}</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span>Capacity: {bus.capacity.occupied}/{bus.capacity.total}</span>
//                       <div className="flex items-center gap-1">
//                         <div className="w-16 h-1 bg-gray-200 rounded">
//                           <div 
//                             className="h-1 bg-blue-500 rounded"
//                             style={{ 
//                               width: `${(bus.capacity.occupied / bus.capacity.total) * 100}%` 
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     {bus.speed !== undefined && (
//                       <div className="flex items-center gap-1">
//                         <Route className="w-3 h-3" />
//                         <span>Speed: {bus.speed} km/h</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
              
//               {filteredBuses.length === 0 && (
//                 <div className="text-center py-8">
//                   <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-500">No buses match your search</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { Suspense } from 'react'
import LiveTrackingMap from '@/components/LiveTrackingMap'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export default function TrackingPage() {
  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Mapbox access token is required. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Bus Tracking</h1>
        <p className="text-gray-600 mt-2">Real-time GPS tracking of TransitLK buses</p>
      </div>

      <Suspense fallback={<div>Loading map...</div>}>
        <LiveTrackingMap mapboxToken={MAPBOX_ACCESS_TOKEN} />
      </Suspense>
    </div>
  )
}
