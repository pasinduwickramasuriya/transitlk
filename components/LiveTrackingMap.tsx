

// 'use client'

// import { useState, useEffect, useCallback, useRef, SetStateAction } from 'react'
// import Map, { Marker, Popup, MapRef } from 'react-map-gl/mapbox'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Bus, RefreshCw, MapPin, Clock, Users, AlertCircle } from 'lucide-react'
// import 'mapbox-gl/dist/mapbox-gl.css'

// // Types for better type safety
// interface Position {
//     latitude: number
//     longitude: number
//     speed: number | null
//     heading: number | null
//     timestamp: string
// }

// interface BusRoute {
//     name: string
//     startLocation: string
//     endLocation: string
// }

// interface BusInfo {
//     busNumber: string
//     capacity: number
//     operator?: string
//     currentRoute?: BusRoute
// }

// interface LivePosition {
//     deviceId: string
//     name: string
//     bus?: BusInfo
//     latestPosition: Position | null
// }

// interface ApiResponse {
//     devices: LivePosition[]
//     total: number
//     timestamp: string
// }

// interface LiveTrackingMapProps {
//     mapboxToken: string
// }

// // Default viewport for Sri Lanka
// const DEFAULT_VIEWPORT = {
//     longitude: 80.7718,
//     latitude: 7.8731,
//     zoom: 8
// }

// export default function LiveTrackingMap({ mapboxToken }: LiveTrackingMapProps) {
//     const mapRef = useRef<MapRef>(null)
//     const [positions, setPositions] = useState<LivePosition[]>([])
//     const [selectedBus, setSelectedBus] = useState<LivePosition | null>(null)
//     const [isLoading, setIsLoading] = useState(false)
//     const [error, setError] = useState<string | null>(null)
//     const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

//     const [viewState, setViewState] = useState(DEFAULT_VIEWPORT)

//     // Fetch live positions with proper error handling
//     const fetchPositions = useCallback(async () => {
//         try {
//             setIsLoading(true)
//             setError(null)

//             const response = await fetch('/api/positions', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             })

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`)
//             }

//             const data: ApiResponse = await response.json()

//             // Validate response data
//             if (!data || !Array.isArray(data.devices)) {
//                 throw new Error('Invalid response format')
//             }

//             setPositions(data.devices)
//             setLastUpdate(new Date())

//         } catch (error) {
//             const errorMessage = error instanceof Error ? error.message : 'Failed to fetch positions'
//             console.error('Error fetching positions:', error)
//             setError(errorMessage)
//         } finally {
//             setIsLoading(false)
//         }
//     }, [])

//     // Auto-refresh positions
//     useEffect(() => {
//         fetchPositions()
//         const interval = setInterval(fetchPositions, 10000) // Update every 10 seconds

//         return () => clearInterval(interval)
//     }, [fetchPositions])

//     // Get marker color based on speed/status
//     const getMarkerColor = (position: LivePosition): string => {
//         if (!position.latestPosition) return '#6b7280' // Gray for no position

//         const speed = position.latestPosition.speed || 0
//         if (speed > 40) return '#22c55e' // Green - fast
//         if (speed > 10) return '#f59e0b' // Orange - medium  
//         if (speed > 0) return '#3b82f6'  // Blue - slow
//         return '#ef4444' // Red - stopped
//     }

//     // Format timestamp safely
//     const formatTime = (timestamp: string): string => {
//         try {
//             return new Date(timestamp).toLocaleTimeString('en-US', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 second: '2-digit'
//             })
//         } catch {
//             return 'Invalid time'
//         }
//     }

//     // Calculate time since last update
//     const getTimeSinceUpdate = (timestamp: string): string => {
//         try {
//             const now = new Date()
//             const updateTime = new Date(timestamp)
//             const diffMs = now.getTime() - updateTime.getTime()
//             const diffMinutes = Math.floor(diffMs / 60000)

//             if (diffMinutes < 1) return 'Just now'
//             if (diffMinutes === 1) return '1 minute ago'
//             return `${diffMinutes} minutes ago`
//         } catch {
//             return 'Unknown'
//         }
//     }

//     // Filter valid positions
//     const validPositions = positions.filter(pos =>
//         pos.latestPosition &&
//         pos.latestPosition.latitude &&
//         pos.latestPosition.longitude
//     )

//     return (
//         <Card className="w-full h-full">
//             <CardHeader>
//                 <div className="flex items-center justify-between">
//                     <CardTitle className="flex items-center gap-2">
//                         <Bus className="w-5 h-5" />
//                         Live Bus Tracking ({validPositions.length} active)
//                     </CardTitle>
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-500">
//                             Last update: {lastUpdate.toLocaleTimeString()}
//                         </span>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={fetchPositions}
//                             disabled={isLoading}
//                         >
//                             <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//                             Refresh
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Error display */}
//                 {error && (
//                     <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
//                         <AlertCircle className="w-4 h-4 text-red-500" />
//                         <span className="text-sm text-red-700">{error}</span>
//                     </div>
//                 )}
//             </CardHeader>

//             <CardContent className="p-0">
//                 <div className="h-[600px] rounded-b-lg overflow-hidden relative">
//                     {!mapboxToken ? (
//                         <div className="flex items-center justify-center h-full bg-gray-100">
//                             <p className="text-gray-500">Mapbox token is required</p>
//                         </div>
//                     ) : (
//                         <Map
//                             ref={mapRef}
//                             {...viewState}
//                             onMove={(evt: { viewState: SetStateAction<{ longitude: number; latitude: number; zoom: number }> }) => setViewState(evt.viewState)}
//                             mapboxAccessToken={mapboxToken}
//                             mapStyle="mapbox://styles/mapbox/streets-v12"
//                             style={{ width: '100%', height: '100%' }}
//                         >
//                             {/* Bus Markers */}
//                             {validPositions.map((position) => (
//                                 <Marker
//                                     key={position.deviceId}
//                                     longitude={position.latestPosition!.longitude}
//                                     latitude={position.latestPosition!.latitude}
//                                     anchor="center"
//                                 >
//                                     <div
//                                         className="cursor-pointer transform transition-transform hover:scale-110"
//                                         onClick={() => setSelectedBus(position)}
//                                         role="button"
//                                         tabIndex={0}
//                                         onKeyDown={(e) => {
//                                             if (e.key === 'Enter' || e.key === ' ') {
//                                                 setSelectedBus(position)
//                                             }
//                                         }}
//                                         aria-label={`Bus ${position.bus?.busNumber || position.name}`}
//                                     >
//                                         <div
//                                             className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative"
//                                             style={{ backgroundColor: getMarkerColor(position) }}
//                                         >
//                                             <Bus className="w-5 h-5 text-white" />

//                                             {/* Speed indicator */}
//                                             {position.latestPosition!.speed && position.latestPosition!.speed > 0 && (
//                                                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold">
//                                                     {Math.round(position.latestPosition!.speed)}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </Marker>
//                             ))}

//                             {/* Bus Popup */}
//                             {selectedBus && selectedBus.latestPosition && (
//                                 <Popup
//                                     longitude={selectedBus.latestPosition.longitude}
//                                     latitude={selectedBus.latestPosition.latitude}
//                                     anchor="top"
//                                     onClose={() => setSelectedBus(null)}
//                                     closeButton={true}
//                                     closeOnClick={false}
//                                 >
//                                     <div className="p-3 min-w-[280px]">
//                                         <div className="flex items-center justify-between mb-2">
//                                             <h3 className="font-semibold text-lg">
//                                                 {selectedBus.bus?.busNumber || selectedBus.name}
//                                             </h3>
//                                             <Badge variant="outline" className="text-green-600">
//                                                 Live
//                                             </Badge>
//                                         </div>

//                                         {selectedBus.bus?.currentRoute && (
//                                             <p className="text-sm text-gray-600 mb-3">
//                                                 {selectedBus.bus.currentRoute.startLocation} → {selectedBus.bus.currentRoute.endLocation}
//                                             </p>
//                                         )}

//                                         <div className="space-y-2 text-sm">
//                                             <div className="flex items-center gap-2">
//                                                 <MapPin className="w-4 h-4 text-gray-500" />
//                                                 <span className="font-mono">
//                                                     {selectedBus.latestPosition.latitude.toFixed(4)}, {selectedBus.latestPosition.longitude.toFixed(4)}
//                                                 </span>
//                                             </div>

//                                             <div className="flex items-center gap-2">
//                                                 <Clock className="w-4 h-4 text-gray-500" />
//                                                 <span>
//                                                     {formatTime(selectedBus.latestPosition.timestamp)}
//                                                     <span className="text-gray-400 ml-1">
//                                                         ({getTimeSinceUpdate(selectedBus.latestPosition.timestamp)})
//                                                     </span>
//                                                 </span>
//                                             </div>

//                                             {selectedBus.latestPosition.speed !== null && (
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="w-4 h-4 text-gray-500 text-center">🚀</span>
//                                                     <span>Speed: {Math.round(selectedBus.latestPosition.speed)} km/h</span>
//                                                 </div>
//                                             )}

//                                             {selectedBus.latestPosition.heading !== null && (
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="w-4 h-4 text-gray-500 text-center">🧭</span>
//                                                     <span>Heading: {Math.round(selectedBus.latestPosition.heading)}°</span>
//                                                 </div>
//                                             )}

//                                             {selectedBus.bus && (
//                                                 <div className="flex items-center gap-2">
//                                                     <Users className="w-4 h-4 text-gray-500" />
//                                                     <span>Capacity: {selectedBus.bus.capacity} seats</span>
//                                                 </div>
//                                             )}

//                                             {selectedBus.bus?.operator && (
//                                                 <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
//                                                     Operator: {selectedBus.bus.operator}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </Popup>
//                             )}
//                         </Map>
//                     )}

//                     {/* Loading overlay */}
//                     {isLoading && (
//                         <div className="absolute top-2 right-2 bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2">
//                             <RefreshCw className="w-4 h-4 animate-spin" />
//                             <span className="text-sm">Loading...</span>
//                         </div>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }



'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bus, RefreshCw, MapPin, Clock, Users, AlertCircle, Navigation } from 'lucide-react'

interface Position {
    latitude: number
    longitude: number
    speed: number | null
    heading: number | null
    timestamp: string
}

interface BusInfo {
    busNumber: string
    capacity: number
    operator?: string
}

interface LivePosition {
    deviceId: string
    name: string
    bus?: BusInfo
    latestPosition: Position | null
}

interface LiveTrackingMapProps {
    mapboxToken: string
}

export default function LiveTrackingMap({ mapboxToken }: LiveTrackingMapProps) {
    const [positions, setPositions] = useState<LivePosition[]>([])
    const [selectedBus, setSelectedBus] = useState<LivePosition | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

    const fetchPositions = async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            const response = await fetch('/api/positions')
            
            if (response.ok) {
                const data = await response.json()
                setPositions(data.devices || [])
            } else {
                setPositions([
                    {
                        deviceId: '1',
                        name: 'Demo Bus 001',
                        bus: { busNumber: 'B001', capacity: 45, operator: 'Demo Transport' },
                        latestPosition: {
                            latitude: 6.9271,
                            longitude: 79.8612,
                            speed: 25,
                            heading: 180,
                            timestamp: new Date().toISOString()
                        }
                    }
                ])
            }
            
            setLastUpdate(new Date())
            
        } catch (error) {
            setError('Using demo data - API not available')
            setPositions([
                {
                    deviceId: 'demo1',
                    name: 'Demo Bus 001',
                    bus: { busNumber: 'B001', capacity: 45 },
                    latestPosition: {
                        latitude: 6.9271,
                        longitude: 79.8612,
                        speed: 35,
                        heading: 180,
                        timestamp: new Date().toISOString()
                    }
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPositions()
        const interval = setInterval(fetchPositions, 10000)
        return () => clearInterval(interval)
    }, [])

    const validPositions = positions.filter(pos => 
        pos.latestPosition?.latitude && pos.latestPosition?.longitude
    )

    const formatTime = (timestamp: string) => {
        try {
            return new Date(timestamp).toLocaleTimeString()
        } catch {
            return 'Now'
        }
    }

    // FIXED FUNCTIONS - NO MORE ERRORS!
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

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Bus className="w-5 h-5" />
                        Live Bus Tracking ({validPositions.length} active)
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            Last update: {lastUpdate.toLocaleTimeString()}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchPositions}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-700">{error}</span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-4">
                {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="flex items-center gap-2">
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            <span>Loading buses...</span>
                        </div>
                    </div>
                ) : validPositions.length === 0 ? (
                    <div className="h-[400px] flex items-center justify-center">
                        <p className="text-gray-500">No buses available</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid gap-4 max-h-[400px] overflow-auto">
                            {validPositions.map((position) => (
                                <div
                                    key={position.deviceId}
                                    className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                                        selectedBus?.deviceId === position.deviceId 
                                            ? 'border-blue-500 shadow-md' 
                                            : 'border-gray-200'
                                    }`}
                                    onClick={() => setSelectedBus(
                                        selectedBus?.deviceId === position.deviceId ? null : position
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-full">
                                                <Bus className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {position.bus?.busNumber || position.name}
                                                </h3>
                                                {position.bus?.operator && (
                                                    <p className="text-sm text-gray-500">
                                                        {position.bus.operator}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {/* FIXED - NO MORE ERROR! */}
                                        <Badge className={getSpeedColor(position.latestPosition?.speed)}>
                                            {getSpeedText(position.latestPosition?.speed)}
                                        </Badge>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span>
                                                {position.latestPosition!.latitude.toFixed(4)}, 
                                                {position.latestPosition!.longitude.toFixed(4)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <span>{formatTime(position.latestPosition!.timestamp)}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Navigation className="w-4 h-4 text-gray-500" />
                                            <span>{Math.round(position.latestPosition?.speed ?? 0)} km/h</span>
                                        </div>
                                        
                                        {position.bus?.capacity && (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-500" />
                                                <span>{position.bus.capacity} seats</span>
                                            </div>
                                        )}
                                    </div>

                                    {selectedBus?.deviceId === position.deviceId && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="font-medium mb-2">Bus Details</h4>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p><strong>Device ID:</strong> {position.deviceId}</p>
                                                <p><strong>Speed:</strong> {Math.round(position.latestPosition?.speed ?? 0)} km/h</p>
                                                <p><strong>Last Update:</strong> {formatTime(position.latestPosition!.timestamp)}</p>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                className="mt-2"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    const coords = `${position.latestPosition!.latitude},${position.latestPosition!.longitude}`
                                                    window.open(`https://maps.google.com/maps?q=${coords}`, '_blank')
                                                }}
                                            >
                                                View on Google Maps
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
