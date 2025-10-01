
// 'use client'

// import React, { useState, useEffect, useCallback, useRef } from 'react'
// import Map, {
//   Marker,
//   Popup,
//   NavigationControl,
//   FullscreenControl,
//   ViewStateChangeEvent
// } from 'react-map-gl/mapbox'
// import 'mapbox-gl/dist/mapbox-gl.css'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Switch } from '@/components/ui/switch'
// import { Input } from '@/components/ui/input'
// import { Separator } from '@/components/ui/separator'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import {
//   Navigation,
//   Activity,
//   Wifi,
//   WifiOff,
//   RefreshCw,
//   MapPin,
//   Bus,
//   Clock,
//   AlertTriangle,
//   Play,
//   Pause,
//   Search,
//   ExternalLink,
//   Gauge,
//   Maximize2,
//   Target,
//   X,
//   Loader2,
//   Signal,
//   Smartphone,
//   Layers,
//   Radio,
//   Eye,
//   EyeOff,
//   Filter,
//   MapIcon
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'

// const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// interface TrackingStats {
//   totalBuses: number
//   activeBuses: number
//   connectedDevices: number
//   recentPositions: number
//   offlineBuses: number
// }

// interface Operator {
//   id: string
//   name: string
// }

// interface Device {
//   id: string
//   deviceId: string
//   name: string
//   isActive: boolean
//   lastSeen: string
//   bus: {
//     id: string
//     busNumber: string
//     busType: string
//     capacity: number
//     isActive: boolean
//   } | null
//   latestPosition: {
//     id: string
//     latitude: number
//     longitude: number
//     speed: number | null
//     heading: number | null
//     timestamp: string
//   } | null
// }

// interface Position {
//   id: string
//   deviceId: string
//   latitude: number
//   longitude: number
//   speed: number | null
//   heading: number | null
//   timestamp: string
//   device: {
//     id: string
//     deviceId: string
//     name: string
//     bus: {
//       id: string
//       busNumber: string
//       busType: string
//       capacity: number
//       isActive: boolean
//     } | null
//   }
// }

// interface ViewState {
//   longitude: number
//   latitude: number
//   zoom: number
//   transitionDuration?: number
// }

// interface LiveBusTrackingClientProps {
//   operator: Operator
//   stats: TrackingStats
// }

// export function LiveBusTrackingClient({ operator, stats: initialStats }: LiveBusTrackingClientProps) {
//   const [stats, setStats] = useState(initialStats)
//   const [devices, setDevices] = useState<Device[]>([])
//   const [positions, setPositions] = useState<Position[]>([])
//   const [selectedBus, setSelectedBus] = useState<string | null>(null)
//   const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
//   const [isLiveTracking, setIsLiveTracking] = useState(true)
//   const [showOfflineDevices, setShowOfflineDevices] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [focusedDevice, setFocusedDevice] = useState<string | null>(null)
//   const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
//   const [isLoading, setIsLoading] = useState(false)
//   const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v12")
//   const [showBusList, setShowBusList] = useState(true)

//   // Refs for cleanup
//   const intervalRef = useRef<NodeJS.Timeout | null>(null)
//   const isMountedRef = useRef(true)

//   // Map viewport state
//   const [viewState, setViewState] = useState<ViewState>({
//     longitude: 79.8612,
//     latitude: 6.9271,
//     zoom: 10,
//   })

//   // ✅ Real-time data fetching functions with proper error handling
//   const fetchDevices = useCallback(async () => {
//     if (!isMountedRef.current) return

//     try {
//       setIsLoading(true)
//       const response = await fetch(`/api/operator/tracking/devices?active=${!showOfflineDevices}&t=${Date.now()}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         cache: 'no-store'
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//       }

//       const data = await response.json()

//       if (isMountedRef.current) {
//         setDevices(data.devices || [])
//         setError(null)
//         console.log(`✅ Fetched ${data.devices?.length || 0} devices`)
//       }
//     } catch (err) {
//       console.error('❌ Error fetching devices:', err)
//       if (isMountedRef.current) {
//         setError(err instanceof Error ? err.message : 'Failed to load devices')
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setIsLoading(false)
//       }
//     }
//   }, [showOfflineDevices])

//   const fetchPositions = useCallback(async () => {
//     if (!isMountedRef.current) return

//     try {
//       const response = await fetch(`/api/operator/tracking/positions?t=${Date.now()}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         cache: 'no-store'
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//       }

//       const data = await response.json()

//       if (isMountedRef.current) {
//         setPositions(data.positions || [])

//         // ✅ Update devices with latest positions from positions data
//         if (data.positions && Array.isArray(data.positions)) {
//           setDevices(prevDevices => {
//             return prevDevices.map(device => {
//               const latestPosition = data.positions.find((pos: Position) => pos.deviceId === device.deviceId)
//               if (latestPosition) {
//                 return {
//                   ...device,
//                   latestPosition: {
//                     id: latestPosition.id,
//                     latitude: latestPosition.latitude,
//                     longitude: latestPosition.longitude,
//                     speed: latestPosition.speed,
//                     heading: latestPosition.heading,
//                     timestamp: latestPosition.timestamp
//                   }
//                 }
//               }
//               return device
//             })
//           })
//         }

//         console.log(`✅ Fetched ${data.positions?.length || 0} positions`)
//       }
//     } catch (err) {
//       console.error('❌ Error fetching positions:', err)
//       if (isMountedRef.current && !error) {
//         setError('Failed to fetch real-time positions')
//       }
//     }
//   }, [error])

//   // ✅ Combined data refresh function
//   const refreshAllData = useCallback(async () => {
//     if (!isMountedRef.current) return

//     try {
//       setLoading(true)
//       await Promise.all([
//         fetchDevices(),
//         fetchPositions()
//       ])
//       setLastUpdate(new Date())
//     } catch (err) {
//       console.error('❌ Error refreshing data:', err)
//     } finally {
//       if (isMountedRef.current) {
//         setLoading(false)
//       }
//     }
//   }, [fetchDevices, fetchPositions])

//   // ✅ Setup real-time tracking with proper cleanup
//   useEffect(() => {
//     if (!MAPBOX_TOKEN) {
//       toast.error('Mapbox token is missing. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file.')
//       return
//     }

//     // Initial data load
//     refreshAllData()

//     // Clear existing interval
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current)
//     }

//     // Setup live tracking interval
//     if (isLiveTracking) {
//       intervalRef.current = setInterval(() => {
//         if (isMountedRef.current && isLiveTracking) {
//           fetchPositions() // Only fetch positions for real-time updates
//           setLastUpdate(new Date())
//         }
//       }, 3000) // Update every 3 seconds for real-time tracking

//       console.log('🔄 Live tracking started (3s interval)')
//     } else {
//       console.log('⏸️ Live tracking paused')
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//         intervalRef.current = null
//       }
//     }
//   }, [isLiveTracking, refreshAllData, fetchPositions])

//   // ✅ Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMountedRef.current = false
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//       }
//     }
//   }, [])

//   // ✅ Refetch devices when offline filter changes
//   useEffect(() => {
//     fetchDevices()
//   }, [showOfflineDevices, fetchDevices])

//   // Auto-focus when search finds single device
//   useEffect(() => {
//     const filteredDevices = getFilteredDevices()
//     const devicesWithLocation = filteredDevices.filter(d => d.latestPosition)

//     if (searchTerm && devicesWithLocation.length === 1) {
//       const device = devicesWithLocation[0]
//       flyToDevice(device)
//       setFocusedDevice(device.id)
//     } else if (!searchTerm) {
//       setFocusedDevice(null)
//     }
//   }, [searchTerm, devices])

//   // Get device status
//   const getDeviceStatus = useCallback((device: Device) => {
//     if (!device.isActive || !device.bus?.isActive) return 'inactive'
//     if (!device.latestPosition) return 'offline'

//     const now = new Date()
//     const lastUpdate = new Date(device.latestPosition.timestamp)
//     const minutesAgo = (now.getTime() - lastUpdate.getTime()) / (1000 * 60)

//     if (minutesAgo <= 5) return 'online'
//     if (minutesAgo <= 30) return 'stale'
//     return 'offline'
//   }, [])

//   // Get marker color based on status
//   const getMarkerColor = useCallback((status: string) => {
//     switch (status) {
//       case 'online': return 'bg-emerald-500 shadow-emerald-500/50'
//       case 'stale': return 'bg-amber-500 shadow-amber-500/50'
//       case 'offline': return 'bg-red-500 shadow-red-500/50'
//       case 'inactive': return 'bg-slate-400 shadow-slate-400/50'
//       default: return 'bg-slate-400 shadow-slate-400/50'
//     }
//   }, [])

//   // Get filtered devices with null safety
//   const getFilteredDevices = useCallback(() => {
//     if (!searchTerm.trim()) {
//       return devices
//     }

//     return devices.filter(device => {
//       const busNumber = device.bus?.busNumber?.toLowerCase() || ''
//       const deviceName = device.name?.toLowerCase() || ''
//       const deviceId = device.deviceId?.toLowerCase() || ''
//       const search = searchTerm.toLowerCase()

//       return busNumber.includes(search) ||
//         deviceName.includes(search) ||
//         deviceId.includes(search)
//     })
//   }, [devices, searchTerm])

//   // Enhanced fly to device with animation
//   const flyToDevice = useCallback((device: Device, showToast: boolean = true) => {
//     if (device.latestPosition && device.latestPosition.latitude && device.latestPosition.longitude) {
//       const { latitude, longitude } = device.latestPosition
//       setViewState(prevState => ({
//         ...prevState,
//         longitude,
//         latitude,
//         zoom: 16,
//         transitionDuration: 1500,
//       }))
//       setFocusedDevice(device.id)
//       if (showToast) {
//         toast.success(`🎯 Focused on ${device.bus?.busNumber || device.name}`)
//       }
//     } else {
//       toast.error(`${device.bus?.busNumber || device.name} has no location data available`)
//     }
//   }, [])

//   // Handle marker click
//   const onMarkerClick = useCallback((device: Device) => {
//     setSelectedDevice(device)
//     setSelectedBus(device.id)
//     flyToDevice(device)
//   }, [flyToDevice])

//   // Auto-fit bounds to show all buses
//   const fitBounds = useCallback(() => {
//     const devicesWithLocation = devices.filter(device =>
//       device.latestPosition &&
//       device.latestPosition.latitude &&
//       device.latestPosition.longitude
//     )

//     if (devicesWithLocation.length === 0) return

//     if (devicesWithLocation.length === 1) {
//       flyToDevice(devicesWithLocation[0])
//     } else {
//       const latitudes = devicesWithLocation.map(d => d.latestPosition!.latitude)
//       const longitudes = devicesWithLocation.map(d => d.latestPosition!.longitude)

//       const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length
//       const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length

//       setViewState(prevState => ({
//         ...prevState,
//         longitude: centerLng,
//         latitude: centerLat,
//         zoom: 12,
//         transitionDuration: 1000,
//       }))
//     }
//   }, [devices, flyToDevice])

//   // Calculate live stats from current data
//   const liveStats = React.useMemo(() => {
//     const now = new Date()
//     const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

//     const onlineBuses = devices.filter(device =>
//       device.isActive &&
//       device.bus?.isActive &&
//       device.latestPosition &&
//       new Date(device.latestPosition.timestamp) > fiveMinutesAgo
//     ).length

//     const activeBuses = devices.filter(device =>
//       device.isActive && device.bus?.isActive
//     ).length

//     return {
//       ...initialStats,
//       totalBuses: devices.length,
//       activeBuses,
//       connectedDevices: onlineBuses,
//       offlineBuses: activeBuses - onlineBuses,
//       recentPositions: positions.length
//     }
//   }, [devices, positions, initialStats])

//   // Clear search and show all devices
//   const clearSearch = useCallback(() => {
//     setSearchTerm('')
//     setFocusedDevice(null)
//     setSelectedDevice(null)
//     setSelectedBus(null)
//     fitBounds()
//   }, [fitBounds])

//   // Get status color
//   const getStatusColor = useCallback((status: string) => {
//     switch (status) {
//       case 'online': return 'text-emerald-700 bg-emerald-100 border-emerald-200'
//       case 'stale': return 'text-amber-700 bg-amber-100 border-amber-200'
//       case 'offline': return 'text-red-700 bg-red-100 border-red-200'
//       case 'inactive': return 'text-slate-700 bg-slate-100 border-slate-200'
//       default: return 'text-slate-700 bg-slate-100 border-slate-200'
//     }
//   }, [])

//   // Format time ago
//   const formatTimeAgo = useCallback((timestamp: string) => {
//     const now = new Date()
//     const then = new Date(timestamp)
//     const diffMs = now.getTime() - then.getTime()
//     const diffMins = Math.floor(diffMs / (1000 * 60))

//     if (diffMins < 1) return 'Just now'
//     if (diffMins < 60) return `${diffMins}m ago`
//     if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
//     return `${Math.floor(diffMins / 1440)}d ago`
//   }, [])

//   // Map style options
//   const mapStyles = [
//     { id: "mapbox://styles/mapbox/streets-v12", name: "Streets", icon: MapIcon },
//     { id: "mapbox://styles/mapbox/satellite-streets-v12", name: "Satellite", icon: Layers },
//     { id: "mapbox://styles/mapbox/dark-v11", name: "Dark", icon: Eye },
//     { id: "mapbox://styles/mapbox/light-v11", name: "Light", icon: EyeOff }
//   ]

//   // Loading state
//   if (loading && devices.length === 0) {
//     return (
//       <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
//         <CardContent className="flex items-center justify-center py-24">
//           <div className="flex flex-col items-center gap-6">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Bus className="h-6 w-6 text-blue-600" />
//               </div>
//             </div>
//             <div className="text-center space-y-2">
//               <h3 className="text-xl font-semibold text-slate-800">Loading Live Bus Tracking</h3>
//               <p className="text-sm text-slate-600">Connecting to GPS network...</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // Missing token state
//   if (!MAPBOX_TOKEN) {
//     return (
//       <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
//         <CardContent className="flex items-center justify-center py-24">
//           <div className="flex flex-col items-center gap-6 text-center max-w-md">
//             <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-3xl">
//               🗝️
//             </div>
//             <div className="space-y-4">
//               <h3 className="text-2xl font-bold text-slate-800">Mapbox Token Required</h3>
//               <p className="text-slate-600 leading-relaxed">
//                 Please add your Mapbox access token to enable the live tracking map
//               </p>
//               <div className="bg-slate-100 p-4 rounded-xl border">
//                 <code className="text-sm text-slate-700 font-mono">
//                   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
//                 </code>
//               </div>
//               <Button
//                 onClick={() => window.open('https://account.mapbox.com/access-tokens/', '_blank')}
//                 className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
//               >
//                 Get Mapbox Token
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   const filteredDevices = getFilteredDevices()
//   const devicesWithLocation = devices.filter(d => d.latestPosition && d.latestPosition.latitude && d.latestPosition.longitude)
//   const filteredWithLocation = filteredDevices.filter(d => d.latestPosition && d.latestPosition.latitude && d.latestPosition.longitude)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="container mx-auto p-6 space-y-8">
//         {/* Enhanced Header */}
//         <div className="text-center space-y-4">
//           <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
//             <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
//               <Navigation className="h-6 w-6 text-white" />
//             </div>
//             <div className="text-left">
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                 Live Bus Tracking
//               </h1>
//               <p className="text-sm text-slate-600">Operator: {operator.name}</p>
//             </div>
//           </div>

//           {/* Enhanced Controls */}
//           <div className="flex flex-wrap items-center justify-center gap-4">
//             <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
//               <Radio className={cn("h-4 w-4", isLiveTracking ? "text-green-500" : "text-slate-400")} />
//               <Switch
//                 checked={isLiveTracking}
//                 onCheckedChange={setIsLiveTracking}
//                 id="live-tracking"
//               />
//               <label htmlFor="live-tracking" className="text-sm font-medium cursor-pointer">
//                 Live Tracking
//               </label>
//               {isLiveTracking && (
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//               )}
//             </div>

//             <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
//               <Filter className="h-4 w-4 text-slate-600" />
//               <Switch
//                 checked={showOfflineDevices}
//                 onCheckedChange={setShowOfflineDevices}
//                 id="show-offline"
//               />
//               <label htmlFor="show-offline" className="text-sm font-medium cursor-pointer">
//                 Show Offline
//               </label>
//             </div>

//             <Button
//               onClick={refreshAllData}
//               variant="outline"
//               size="sm"
//               disabled={loading}
//               className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90"
//             >
//               <RefreshCw className={cn("h-4 w-4 mr-2", (loading || isLoading) && "animate-spin")} />
//               Refresh
//             </Button>
//           </div>
//         </div>

//         {/* Enhanced Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//           <ModernStatsCard
//             title="Total Buses"
//             value={liveStats.totalBuses}
//             icon={Bus}
//             gradient="from-blue-500 to-cyan-500"
//             bgGradient="from-blue-50 to-cyan-50"
//           />
//           <ModernStatsCard
//             title="Online Buses"
//             value={liveStats.connectedDevices}
//             icon={Wifi}
//             gradient="from-emerald-500 to-green-500"
//             bgGradient="from-emerald-50 to-green-50"
//           />
//           <ModernStatsCard
//             title="Offline Buses"
//             value={liveStats.offlineBuses}
//             icon={WifiOff}
//             gradient="from-red-500 to-rose-500"
//             bgGradient="from-red-50 to-rose-50"
//           />
//           <ModernStatsCard
//             title="Recent Updates"
//             value={liveStats.recentPositions}
//             icon={Activity}
//             gradient="from-orange-500 to-amber-500"
//             bgGradient="from-orange-50 to-amber-50"
//           />
//           <ModernStatsCard
//             title="Tracking Status"
//             value={isLiveTracking ? 'Live' : 'Paused'}
//             icon={isLiveTracking ? Play : Pause}
//             gradient={isLiveTracking ? "from-green-500 to-emerald-500" : "from-slate-500 to-gray-500"}
//             bgGradient={isLiveTracking ? "from-green-50 to-emerald-50" : "from-slate-50 to-gray-50"}
//             isText={true}
//           />
//         </div>

//         {/* Error Banner */}
//         {error && (
//           <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
//             <CardContent className="py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-amber-100 rounded-lg">
//                     <AlertTriangle className="h-5 w-5 text-amber-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-amber-800">Connection Warning</p>
//                     <p className="text-sm text-amber-700">{error}</p>
//                   </div>
//                 </div>
//                 <Button onClick={refreshAllData} size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
//                   <RefreshCw className="h-4 w-4 mr-2" />
//                   Retry
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Main Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]">
//           {/* Enhanced Search & Bus List */}
//           {showBusList && (
//             <div className="lg:col-span-4 xl:col-span-3 space-y-6">
//               {/* Enhanced Search */}
//               <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
//                 <CardHeader className="pb-4">
//                   <CardTitle className="flex items-center gap-3 text-lg">
//                     <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
//                       <Search className="h-5 w-5 text-white" />
//                     </div>
//                     <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                       Bus Search & Focus
//                     </span>
//                     {isLoading && <Loader2 className="h-4 w-4 animate-spin text-purple-500" />}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex gap-2">
//                     <div className="relative flex-1">
//                       <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                       <Input
//                         type="text"
//                         placeholder="Search buses by number, name or device ID..."
//                         className="pl-10 border-slate-200 bg-white/50 backdrop-blur-sm focus:bg-white/80 transition-all"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                     {searchTerm && (
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={clearSearch}
//                         className="shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>

//                   {/* Search Results Preview */}
//                   {searchTerm && (
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-2 text-sm text-slate-600">
//                         <Target className="h-4 w-4" />
//                         <span>Found {filteredDevices.length} bus(es) • {filteredWithLocation.length} with GPS</span>
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {filteredDevices.length > 0 ? (
//                           filteredDevices.slice(0, 6).map((device) => (
//                             <Badge
//                               key={device.id}
//                               variant={focusedDevice === device.id ? "default" : "secondary"}
//                               className={cn(
//                                 "cursor-pointer gap-2 hover:scale-105 transition-all duration-200 px-3 py-1",
//                                 focusedDevice === device.id && "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
//                               )}
//                               onClick={() => device.latestPosition && device.latestPosition.latitude && device.latestPosition.longitude && onMarkerClick(device)}
//                             >
//                               {device.latestPosition && device.latestPosition.latitude && device.latestPosition.longitude && (
//                                 <div className={cn("w-2 h-2 rounded-full animate-pulse",
//                                   getDeviceStatus(device) === 'online' ? 'bg-green-400' :
//                                     getDeviceStatus(device) === 'stale' ? 'bg-yellow-400' :
//                                       getDeviceStatus(device) === 'offline' ? 'bg-red-400' : 'bg-gray-400'
//                                 )} />
//                               )}
//                               {focusedDevice === device.id && <Target className="h-3 w-3" />}
//                               {device.bus?.busNumber || device.name}
//                             </Badge>
//                           ))
//                         ) : (
//                           <Badge variant="outline" className="gap-2 border-dashed">
//                             <Search className="h-3 w-3" />
//                             No buses found matching "{searchTerm}"
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Enhanced Bus List */}
//               <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm flex-1">
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center justify-between">
//                     <CardTitle className="flex items-center gap-3">
//                       <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
//                         <Bus className="h-5 w-5 text-white" />
//                       </div>
//                       <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
//                         Fleet Status
//                       </span>
//                     </CardTitle>
//                     <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-3 py-1">
//                       {filteredDevices.length}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="p-0">
//                   <ScrollArea className="h-[400px]">
//                     {filteredDevices.length === 0 ? (
//                       <div className="p-12 text-center">
//                         <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                           <Bus className="h-8 w-8 text-slate-500" />
//                         </div>
//                         <h3 className="text-lg font-medium text-slate-700 mb-2">No buses found</h3>
//                         <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
//                       </div>
//                     ) : (
//                       <div className="space-y-2 p-4">
//                         {filteredDevices.map((device) => {
//                           const status = getDeviceStatus(device)
//                           const isSelected = selectedBus === device.id

//                           return (
//                             <div
//                               key={device.id}
//                               className={cn(
//                                 "p-4 rounded-xl cursor-pointer transition-all duration-200 border-2",
//                                 isSelected
//                                   ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg scale-[1.02]"
//                                   : "bg-white/50 border-slate-200 hover:bg-white/80 hover:shadow-md hover:scale-[1.01]"
//                               )}
//                               onClick={() => setSelectedBus(isSelected ? null : device.id)}
//                             >
//                               <div className="flex items-center justify-between mb-3">
//                                 <div className="flex items-center gap-3">
//                                   <div className={cn(
//                                     "w-3 h-3 rounded-full shadow-lg",
//                                     status === 'online' && "bg-emerald-500 shadow-emerald-500/50 animate-pulse",
//                                     status === 'stale' && "bg-amber-500 shadow-amber-500/50",
//                                     status === 'offline' && "bg-red-500 shadow-red-500/50",
//                                     status === 'inactive' && "bg-slate-400 shadow-slate-400/50"
//                                   )} />
//                                   <div>
//                                     <p className="font-semibold text-slate-800">
//                                       {device.bus?.busNumber || device.name}
//                                     </p>
//                                     <p className="text-xs text-slate-500">
//                                       {device.bus?.busType} • {device.deviceId}
//                                     </p>
//                                   </div>
//                                 </div>

//                                 <div className="text-right space-y-1">
//                                   <Badge
//                                     variant="outline"
//                                     className={cn("text-xs font-medium", getStatusColor(status))}
//                                   >
//                                     {status.toUpperCase()}
//                                   </Badge>
//                                   {device.latestPosition && (
//                                     <p className="text-xs text-slate-500">
//                                       {formatTimeAgo(device.latestPosition.timestamp)}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>

//                               {/* Enhanced Position Details */}
//                               {device.latestPosition && (
//                                 <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
//                                   <div className="flex items-center gap-2 text-slate-600">
//                                     <MapPin className="h-3 w-3 text-red-500" />
//                                     <span className="font-mono">
//                                       {device.latestPosition.latitude.toFixed(4)}, {device.latestPosition.longitude.toFixed(4)}
//                                     </span>
//                                   </div>
//                                   {device.latestPosition.speed !== null && (
//                                     <div className="flex items-center gap-2 text-slate-600">
//                                       <Gauge className="h-3 w-3 text-blue-500" />
//                                       <span className="font-medium">
//                                         {device.latestPosition.speed.toFixed(1)} km/h
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           )
//                         })}
//                       </div>
//                     )}
//                   </ScrollArea>
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {/* Enhanced Live Map */}
//           <div className={cn("space-y-6", showBusList ? "lg:col-span-8 xl:col-span-9" : "lg:col-span-12")}>
//             {/* Map Controls */}
//             <div className="flex items-center justify-between gap-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowBusList(!showBusList)}
//                 className="bg-white/80 backdrop-blur-sm border-white/20"
//               >
//                 {showBusList ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
//                 {showBusList ? 'Hide' : 'Show'} Bus List
//               </Button>

//               <div className="flex items-center gap-2">
//                 {mapStyles.map((style) => (
//                   <Button
//                     key={style.id}
//                     variant={mapStyle === style.id ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setMapStyle(style.id)}
//                     className={cn(
//                       "bg-white/80 backdrop-blur-sm border-white/20",
//                       mapStyle === style.id && "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
//                     )}
//                   >
//                     <style.icon className="h-4 w-4 mr-2" />
//                     {style.name}
//                   </Button>
//                 ))}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Badge variant="outline" className="gap-2 bg-white/80 backdrop-blur-sm border-white/20">
//                   <div className={cn("w-2 h-2 rounded-full", isLiveTracking ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
//                   {isLiveTracking ? 'LIVE' : 'PAUSED'}
//                 </Badge>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={fitBounds}
//                   disabled={devicesWithLocation.length === 0}
//                   className="bg-white/80 backdrop-blur-sm border-white/20"
//                 >
//                   <Maximize2 className="h-4 w-4 mr-2" />
//                   Fit All
//                 </Button>
//               </div>
//             </div>

//             {/* Enhanced Map */}
//             <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
//               <CardContent className="p-0">
//                 <div className="h-[600px] w-full relative">
//                   <Map
//                     {...viewState}
//                     onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
//                     mapboxAccessToken={MAPBOX_TOKEN}
//                     style={{ width: '100%', height: '100%' }}
//                     mapStyle={mapStyle}
//                   >
//                     <NavigationControl position="top-right" />
//                     <FullscreenControl position="top-right" />

//                     {/* Enhanced Bus Markers */}
//                     {filteredDevices.map((device) => {
//                       if (!device.latestPosition ||
//                         !device.latestPosition.latitude ||
//                         !device.latestPosition.longitude ||
//                         typeof device.latestPosition.latitude !== 'number' ||
//                         typeof device.latestPosition.longitude !== 'number') {
//                         return null
//                       }

//                       const { latitude, longitude } = device.latestPosition
//                       const status = getDeviceStatus(device)
//                       const isFocused = focusedDevice === device.id

//                       return (
//                         <Marker
//                           key={device.id}
//                           longitude={longitude}
//                           latitude={latitude}
//                         >
//                           <div
//                             className={cn(
//                               "cursor-pointer transition-all duration-300 hover:scale-110",
//                               isFocused && 'animate-bounce'
//                             )}
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               onMarkerClick(device)
//                             }}
//                           >
//                             {/* Enhanced Bus marker */}
//                             <div
//                               className={cn(
//                                 "w-10 h-10 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-white text-lg font-bold backdrop-blur-sm",
//                                 getMarkerColor(status),
//                                 isFocused && 'ring-4 ring-blue-400 ring-opacity-50 scale-110'
//                               )}
//                               style={{
//                                 background: isFocused
//                                   ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
//                                   : undefined,
//                                 boxShadow: isFocused
//                                   ? '0 8px 32px rgba(59, 130, 246, 0.6)'
//                                   : '0 4px 20px rgba(0, 0, 0, 0.3)',
//                               }}
//                             >
//                               🚌
//                             </div>
//                             {/* Enhanced tooltip */}
//                             <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl backdrop-blur-sm">
//                               <div className="font-semibold">{device.bus?.busNumber || device.name}</div>
//                               <div className="text-slate-300">{status.toUpperCase()}</div>
//                               <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
//                             </div>
//                           </div>
//                         </Marker>
//                       )
//                     })}

//                     {/* Enhanced Device Popup */}
//                     {selectedDevice && selectedDevice.latestPosition && (
//                       <Popup
//                         longitude={selectedDevice.latestPosition.longitude}
//                         latitude={selectedDevice.latestPosition.latitude}
//                         anchor="bottom"
//                         onClose={() => {
//                           setSelectedDevice(null)
//                           setSelectedBus(null)
//                         }}
//                         closeOnClick={false}
//                         className="max-w-sm"
//                       >
//                         <div className="p-6 min-w-80 space-y-6 bg-white rounded-2xl shadow-2xl border-0">
//                           <div className="flex items-center justify-between">
//                             <h3 className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                               {selectedDevice.bus?.busNumber || selectedDevice.name}
//                             </h3>
//                             <Badge
//                               variant="outline"
//                               className={cn("text-xs gap-2 font-medium", getStatusColor(getDeviceStatus(selectedDevice)))}
//                             >
//                               <div className={cn("w-2 h-2 rounded-full",
//                                 getDeviceStatus(selectedDevice) === 'online' ? 'bg-emerald-500 animate-pulse' :
//                                   getDeviceStatus(selectedDevice) === 'stale' ? 'bg-amber-500' :
//                                     getDeviceStatus(selectedDevice) === 'offline' ? 'bg-red-500' : 'bg-slate-400'
//                               )} />
//                               {getDeviceStatus(selectedDevice).toUpperCase()}
//                             </Badge>
//                           </div>

//                           <div className="grid grid-cols-2 gap-6 text-sm">
//                             <div className="space-y-2">
//                               <div className="flex items-center gap-2 text-slate-600">
//                                 <Bus className="h-4 w-4 text-blue-500" />
//                                 <span className="font-medium">Bus Type</span>
//                               </div>
//                               <p className="text-slate-800 font-medium">
//                                 {selectedDevice.bus?.busType || 'N/A'}
//                               </p>
//                             </div>

//                             <div className="space-y-2">
//                               <div className="flex items-center gap-2 text-slate-600">
//                                 <Gauge className="h-4 w-4 text-green-500" />
//                                 <span className="font-medium">Speed</span>
//                               </div>
//                               <Badge variant="secondary" className="text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
//                                 {Math.round(selectedDevice.latestPosition.speed || 0)} km/h
//                               </Badge>
//                             </div>

//                             <div className="col-span-2 space-y-2">
//                               <div className="flex items-center gap-2 text-slate-600">
//                                 <MapPin className="h-4 w-4 text-red-500" />
//                                 <span className="font-medium">GPS Coordinates</span>
//                               </div>
//                               <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-xl border">
//                                 <p className="font-mono text-sm text-slate-700">
//                                   📍 {selectedDevice.latestPosition.latitude.toFixed(6)}, {selectedDevice.latestPosition.longitude.toFixed(6)}
//                                 </p>
//                               </div>
//                             </div>

//                             <div className="col-span-2 space-y-2">
//                               <div className="flex items-center gap-2 text-slate-600">
//                                 <Clock className="h-4 w-4 text-purple-500" />
//                                 <span className="font-medium">Last Update</span>
//                               </div>
//                               <p className="text-slate-700">
//                                 📅 {formatTimeAgo(selectedDevice.latestPosition.timestamp)}
//                               </p>
//                             </div>

//                             {selectedDevice.bus && (
//                               <div className="col-span-2 space-y-2">
//                                 <div className="flex items-center gap-2 text-slate-600">
//                                   <Smartphone className="h-4 w-4 text-orange-500" />
//                                   <span className="font-medium">Capacity</span>
//                                 </div>
//                                 <p className="text-slate-700 font-medium">
//                                   👥 {selectedDevice.bus.capacity} passengers
//                                 </p>
//                               </div>
//                             )}
//                           </div>

//                           <Separator />

//                           <div className="flex gap-3">
//                             <Button
//                               onClick={() => flyToDevice(selectedDevice)}
//                               className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg"
//                             >
//                               <Target className="h-4 w-4" />
//                               🎯 Focus Here
//                             </Button>
//                             <Button
//                               onClick={() => {
//                                 setSelectedDevice(null)
//                                 setSelectedBus(null)
//                               }}
//                               variant="outline"
//                               size="icon"
//                               className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </Popup>
//                     )}
//                   </Map>

//                   {/* Map overlays */}
//                   <div className="absolute top-4 left-4 space-y-3 z-10">
//                     {/* Status Legend */}
//                     <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4">
//                       <h4 className="text-sm font-semibold mb-3 text-slate-700">Bus Status</h4>
//                       <div className="space-y-2 text-xs">
//                         {[
//                           { status: 'online', color: 'bg-emerald-500', label: 'Online' },
//                           { status: 'stale', color: 'bg-amber-500', label: 'Stale' },
//                           { status: 'offline', color: 'bg-red-500', label: 'Offline' },
//                           { status: 'inactive', color: 'bg-slate-400', label: 'Inactive' }
//                         ].map(({ status, color, label }) => (
//                           <div key={status} className="flex items-center gap-2">
//                             <div className={cn("w-3 h-3 rounded-full shadow-sm", color)} />
//                             <span className="text-slate-600 font-medium">{label}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Live Indicator */}
//                     {isLiveTracking && (
//                       <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-2xl text-xs font-semibold animate-pulse shadow-xl border border-white/20 backdrop-blur-md">
//                         <div className="flex items-center gap-2">
//                           <div className="w-2 h-2 bg-white rounded-full animate-ping" />
//                           Live Tracking Active
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Enhanced Status Bar */}
//         <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
//           <CardContent className="py-4">
//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <div className="flex flex-wrap gap-4">
//                 <Badge variant="outline" className="gap-2 px-3 py-1 bg-blue-50 border-blue-200 text-blue-700">
//                   <Bus className="h-3 w-3" />
//                   Total: {devices.length}
//                 </Badge>

//                 <Badge variant="default" className="gap-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500">
//                   <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
//                   GPS Active: {devicesWithLocation.length}
//                 </Badge>

//                 {searchTerm && (
//                   <Badge variant="secondary" className="gap-2 px-3 py-1 bg-purple-50 border-purple-200 text-purple-700">
//                     <Search className="h-3 w-3" />
//                     Found: {filteredDevices.length} ({filteredWithLocation.length} with GPS)
//                   </Badge>
//                 )}

//                 {focusedDevice && (
//                   <Badge variant="default" className="gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500">
//                     <Target className="h-3 w-3" />
//                     Focused Bus
//                   </Badge>
//                 )}
//               </div>

//               <div className="flex items-center gap-4 text-sm text-slate-600">
//                 <div className="flex items-center gap-2">
//                   <RefreshCw className={cn("h-4 w-4", (isLoading || loading) && "animate-spin")} />
//                   <span>Auto-refresh: {isLiveTracking ? '3s' : 'OFF'}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Clock className="h-4 w-4" />
//                   <span className="font-mono text-xs">
//                     {lastUpdate.toLocaleTimeString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Empty State */}
//         {devices.length === 0 && !error && !loading && (
//           <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-slate-100">
//             <CardContent className="py-24 text-center">
//               <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
//                 <Bus className="h-12 w-12 text-slate-500" />
//               </div>
//               <h3 className="text-2xl font-bold text-slate-800 mb-3">No GPS Buses Found</h3>
//               <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
//                 No active GPS tracking buses are currently registered in the system.
//                 Add buses to start tracking their locations in real-time.
//               </p>
//               <Button onClick={refreshAllData} className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg">
//                 <RefreshCw className="h-4 w-4" />
//                 Refresh Data
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }

// // Enhanced Modern Stats Card Component
// interface ModernStatsCardProps {
//   title: string
//   value: string | number
//   icon: React.ComponentType<{ className?: string }>
//   gradient: string
//   bgGradient: string
//   isText?: boolean
// }

// function ModernStatsCard({ title, value, icon: Icon, gradient, bgGradient, isText = false }: ModernStatsCardProps) {
//   return (
//     <Card className={cn("border-0 shadow-xl bg-gradient-to-br", bgGradient, "hover:shadow-2xl transition-all duration-300 hover:scale-105 group")}>
//       <CardContent className="p-6">
//         <div className="flex items-center space-x-4">
//           <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-lg group-hover:shadow-xl transition-all duration-300", gradient)}>
//             <Icon className="h-6 w-6 text-white" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className={cn(
//               "font-bold text-slate-800 group-hover:text-slate-900 transition-colors",
//               isText ? "text-xl" : "text-2xl"
//             )}>
//               {typeof value === 'number' ? value.toLocaleString() : value}
//             </p>
//             <p className="text-sm text-slate-600 font-medium">{title}</p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
















'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Map, {
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    ViewStateChangeEvent
} from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Navigation,
    Activity,
    Wifi,
    WifiOff,
    RefreshCw,
    MapPin,
    Bus,
    Clock,
    AlertTriangle,
    Play,
    Pause,
    Search,
    ExternalLink,
    Gauge,
    Maximize2,
    Target,
    X,
    Loader2,
    Signal,
    Smartphone,
    Layers,
    Radio,
    Eye,
    EyeOff,
    Filter,
    MapIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

interface TrackingStats {
    totalBuses: number
    activeBuses: number
    connectedDevices: number
    recentPositions: number
    offlineBuses: number
}

interface Operator {
    id: string
    name: string
}

interface Device {
    id: string
    deviceId: string
    name: string
    isActive: boolean
    lastSeen: string
    bus: {
        id: string
        busNumber: string
        busType: string
        capacity: number
        isActive: boolean
    } | null
    latestPosition: {
        id: string
        latitude: number
        longitude: number
        speed: number | null
        heading: number | null
        timestamp: string
    } | null
}

interface Position {
    id: string
    deviceId: string
    latitude: number
    longitude: number
    speed: number | null
    heading: number | null
    timestamp: string
    device: {
        id: string
        deviceId: string
        name: string
        bus: {
            id: string
            busNumber: string
            busType: string
            capacity: number
            isActive: boolean
        } | null
    }
}

interface ViewState {
    longitude: number
    latitude: number
    zoom: number
    transitionDuration?: number
}

interface LiveBusTrackingClientProps {
    operator: Operator
    stats: TrackingStats
}

export function LiveBusTrackingClient({ operator, stats: initialStats }: LiveBusTrackingClientProps) {
    const [stats, setStats] = useState(initialStats)
    const [devices, setDevices] = useState<Device[]>([])
    const [positions, setPositions] = useState<Position[]>([])
    const [selectedBus, setSelectedBus] = useState<string | null>(null)
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
    const [isLiveTracking, setIsLiveTracking] = useState(true)
    const [showOfflineDevices, setShowOfflineDevices] = useState(false)
    const [loading, setLoading] = useState(false) // ✅ CHANGED: false for instant display
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [focusedDevice, setFocusedDevice] = useState<string | null>(null)
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState(false)
    const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v12")
    const [showBusList, setShowBusList] = useState(true)
    const [isInitialized, setIsInitialized] = useState(false) // ✅ ADDED: track data initialization

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])


    // Refs for cleanup
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const isMountedRef = useRef(true)

    // Map viewport state
    const [viewState, setViewState] = useState<ViewState>({
        longitude: 79.8612,
        latitude: 6.9271,
        zoom: 10,
    })

    // ✅ OPTIMIZED: Real-time data fetching with timeout
    const fetchDevices = useCallback(async () => {
        if (!isMountedRef.current) return

        try {
            setIsLoading(true)
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000) // ✅ 5s timeout

            const response = await fetch(`/api/operator/tracking/devices?active=${!showOfflineDevices}&t=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                signal: controller.signal // ✅ ADDED: abort signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()

            if (isMountedRef.current) {
                setDevices(data.devices || [])
                setError(null)
                console.log(`✅ Fetched ${data.devices?.length || 0} devices`)
            }
        } catch (err: any) {
            console.error('❌ Error fetching devices:', err)
            if (isMountedRef.current && err.name !== 'AbortError') { // ✅ ADDED: ignore abort errors
                setError(err instanceof Error ? err.message : 'Failed to load devices')
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false)
            }
        }
    }, [showOfflineDevices])

    const fetchPositions = useCallback(async () => {
        if (!isMountedRef.current) return

        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 4000) // ✅ 4s timeout

            const response = await fetch(`/api/operator/tracking/positions?t=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                signal: controller.signal // ✅ ADDED: abort signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()

            if (isMountedRef.current) {
                setPositions(data.positions || [])

                // ✅ Update devices with latest positions from positions data
                if (data.positions && Array.isArray(data.positions)) {
                    setDevices(prevDevices => {
                        return prevDevices.map(device => {
                            const latestPosition = data.positions.find((pos: Position) => pos.deviceId === device.deviceId)
                            if (latestPosition) {
                                return {
                                    ...device,
                                    latestPosition: {
                                        id: latestPosition.id,
                                        latitude: latestPosition.latitude,
                                        longitude: latestPosition.longitude,
                                        speed: latestPosition.speed,
                                        heading: latestPosition.heading,
                                        timestamp: latestPosition.timestamp
                                    }
                                }
                            }
                            return device
                        })
                    })
                }

                console.log(`✅ Fetched ${data.positions?.length || 0} positions`)
            }
        } catch (err: any) {
            console.error('❌ Error fetching positions:', err)
            if (isMountedRef.current && err.name !== 'AbortError' && !error) { // ✅ ADDED: ignore abort errors
                setError('Failed to fetch real-time positions')
            }
        }
    }, [error])

    // ✅ OPTIMIZED: Combined data refresh function
    const refreshAllData = useCallback(async () => {
        if (!isMountedRef.current) return

        try {
            setLoading(true)
            await Promise.all([
                fetchDevices(),
                fetchPositions()
            ])
            setLastUpdate(new Date())
            setIsInitialized(true)
        } catch (err: any) {
            console.error('❌ Error refreshing data:', err)
        } finally {
            if (isMountedRef.current) {
                setLoading(false)
            }
        }
    }, []) // ✅ EMPTY ARRAY - no dependencies






    useEffect(() => {
        if (!MAPBOX_TOKEN) {
            toast.error('Mapbox token is missing. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file.')
            return
        }

        const initData = async () => {
            try {
                setLoading(true)
                await Promise.all([
                    fetchDevices(),
                    fetchPositions()
                ])
                setLastUpdate(new Date())
                setIsInitialized(true)
            } catch (err: any) {
                console.error('❌ Error initializing:', err)
            } finally {
                if (isMountedRef.current) {
                    setLoading(false)
                }
            }
        }

        initData()

        return () => {
            isMountedRef.current = false
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, []) // ✅ EMPTY ARRAY - no dependencies




    // ✅ ADDED: Separate effect for live tracking setup
    useEffect(() => {
        // Clear existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }

        // Setup live tracking interval only after initialization
        if (isLiveTracking && isInitialized) {
            intervalRef.current = setInterval(() => {
                if (isMountedRef.current && isLiveTracking) {
                    fetchPositions() // Only fetch positions for real-time updates
                    setLastUpdate(new Date())
                }
            }, 3000) // Update every 3 seconds for real-time tracking

            console.log('🔄 Live tracking started (3s interval)')
        } else {
            console.log('⏸️ Live tracking paused')
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isLiveTracking, isInitialized, fetchPositions]) // ✅ ADDED: proper dependencies

    // ✅ Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    // ✅ OPTIMIZED: Refetch devices when offline filter changes
    useEffect(() => {
        if (isInitialized) { // ✅ ADDED: only after initialization
            const timeoutId = setTimeout(() => fetchDevices(), 300) // ✅ ADDED: debounce
            return () => clearTimeout(timeoutId)
        }
    }, [showOfflineDevices, fetchDevices, isInitialized])

    // Auto-focus when search finds single device
    useEffect(() => {
        const filteredDevices = getFilteredDevices()
        const devicesWithLocation = filteredDevices.filter(d => d.latestPosition)

        if (searchTerm && devicesWithLocation.length === 1) {
            const device = devicesWithLocation[0]
            flyToDevice(device)
            setFocusedDevice(device.id)
        } else if (!searchTerm) {
            setFocusedDevice(null)
        }
    }, [searchTerm, devices])

    // Get device status
    const getDeviceStatus = useCallback((device: Device) => {
        if (!device.isActive || !device.bus?.isActive) return 'inactive'
        if (!device.latestPosition) return 'offline'

        const now = new Date()
        const lastUpdate = new Date(device.latestPosition.timestamp)
        const minutesAgo = (now.getTime() - lastUpdate.getTime()) / (1000 * 60)

        if (minutesAgo <= 5) return 'online'
        if (minutesAgo <= 30) return 'stale'
        return 'offline'
    }, [])

    // Get marker color based on status
    const getMarkerColor = useCallback((status: string) => {
        switch (status) {
            case 'online': return 'bg-emerald-500 shadow-emerald-500/50'
            case 'stale': return 'bg-amber-500 shadow-amber-500/50'
            case 'offline': return 'bg-red-500 shadow-red-500/50'
            case 'inactive': return 'bg-slate-400 shadow-slate-400/50'
            default: return 'bg-slate-400 shadow-slate-400/50'
        }
    }, [])

    // Get filtered devices with null safety
    const getFilteredDevices = useCallback(() => {
        if (!searchTerm.trim()) {
            return devices
        }

        return devices.filter(device => {
            const busNumber = device.bus?.busNumber?.toLowerCase() || ''
            const deviceName = device.name?.toLowerCase() || ''
            const deviceId = device.deviceId?.toLowerCase() || ''
            const search = searchTerm.toLowerCase()

            return busNumber.includes(search) ||
                deviceName.includes(search) ||
                deviceId.includes(search)
        })
    }, [devices, searchTerm])

    // Enhanced fly to device with animation
    const flyToDevice = useCallback((device: Device, showToast: boolean = true) => {
        if (device.latestPosition && device.latestPosition.latitude && device.latestPosition.longitude) {
            const { latitude, longitude } = device.latestPosition
            setViewState(prevState => ({
                ...prevState,
                longitude,
                latitude,
                zoom: 16,
                transitionDuration: 1500,
            }))
            setFocusedDevice(device.id)
            if (showToast) {
                toast.success(`🎯 Focused on ${device.bus?.busNumber || device.name}`)
            }
        } else {
            toast.error(`${device.bus?.busNumber || device.name} has no location data available`)
        }
    }, [])

    // Handle marker click
    const onMarkerClick = useCallback((device: Device) => {
        setSelectedDevice(device)
        setSelectedBus(device.id)
        flyToDevice(device)
    }, [flyToDevice])

    // Auto-fit bounds to show all buses
    const fitBounds = useCallback(() => {
        const devicesWithLocation = devices.filter(device =>
            device.latestPosition &&
            device.latestPosition.latitude &&
            device.latestPosition.longitude
        )

        if (devicesWithLocation.length === 0) return

        if (devicesWithLocation.length === 1) {
            flyToDevice(devicesWithLocation[0])
        } else {
            const latitudes = devicesWithLocation.map(d => d.latestPosition!.latitude)
            const longitudes = devicesWithLocation.map(d => d.latestPosition!.longitude)

            const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length
            const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length

            setViewState(prevState => ({
                ...prevState,
                longitude: centerLng,
                latitude: centerLat,
                zoom: 12,
                transitionDuration: 1000,
            }))
        }
    }, [devices, flyToDevice])

    // Calculate live stats from current data
    const liveStats = React.useMemo(() => {
        const now = new Date()
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

        const onlineBuses = devices.filter(device =>
            device.isActive &&
            device.bus?.isActive &&
            device.latestPosition &&
            new Date(device.latestPosition.timestamp) > fiveMinutesAgo
        ).length

        const activeBuses = devices.filter(device =>
            device.isActive && device.bus?.isActive
        ).length

        return {
            ...initialStats,
            totalBuses: devices.length,
            activeBuses,
            connectedDevices: onlineBuses,
            offlineBuses: activeBuses - onlineBuses,
            recentPositions: positions.length
        }
    }, [devices, positions, initialStats])

    // Clear search and show all devices
    const clearSearch = useCallback(() => {
        setSearchTerm('')
        setFocusedDevice(null)
        setSelectedDevice(null)
        setSelectedBus(null)
        fitBounds()
    }, [fitBounds])

    // Get status color
    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'online': return 'text-emerald-700 bg-emerald-100 border-emerald-200'
            case 'stale': return 'text-amber-700 bg-amber-100 border-amber-200'
            case 'offline': return 'text-red-700 bg-red-100 border-red-200'
            case 'inactive': return 'text-slate-700 bg-slate-100 border-slate-200'
            default: return 'text-slate-700 bg-slate-100 border-slate-200'
        }
    }, [])

    // Format time ago
    const formatTimeAgo = useCallback((timestamp: string) => {
        const now = new Date()
        const then = new Date(timestamp)
        const diffMs = now.getTime() - then.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
        return `${Math.floor(diffMins / 1440)}d ago`
    }, [])

    // Map style options
    const mapStyles = [
        { id: "mapbox://styles/mapbox/streets-v12", name: "Streets", icon: MapIcon },
        { id: "mapbox://styles/mapbox/satellite-streets-v12", name: "Satellite", icon: Layers },
        { id: "mapbox://styles/mapbox/dark-v11", name: "Dark", icon: Eye },
        { id: "mapbox://styles/mapbox/light-v11", name: "Light", icon: EyeOff }
    ]

    // ✅ REMOVED: Loading state condition - always show UI
    // Missing token state
    if (!MAPBOX_TOKEN) {
        return (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-6 text-center max-w-md">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-3xl">
                            🗝️
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-800">Mapbox Token Required</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Please add your Mapbox access token to enable the live tracking map
                            </p>
                            <div className="bg-slate-100 p-4 rounded-xl border">
                                <code className="text-sm text-slate-700 font-mono">
                                    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
                                </code>
                            </div>
                            <Button
                                onClick={() => window.open('https://account.mapbox.com/access-tokens/', '_blank')}
                                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            >
                                Get Mapbox Token
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const filteredDevices = getFilteredDevices()
    const devicesWithLocation = devices.filter(d => d.latestPosition && d.latestPosition.latitude && d.latestPosition.longitude)
    const filteredWithLocation = filteredDevices.filter(d => d.latestPosition && d.latestPosition.latitude && d.latestPosition.longitude)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto p-6 space-y-8">
                {/* Enhanced Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                            <Navigation className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Live Bus Tracking
                            </h1>
                            <p className="text-sm text-slate-600">Operator: {operator.name}</p>
                        </div>
                    </div>

                    {/* Enhanced Controls */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
                            <Radio className={cn("h-4 w-4", isLiveTracking ? "text-green-500" : "text-slate-400")} />
                            <Switch
                                checked={isLiveTracking}
                                onCheckedChange={setIsLiveTracking}
                                id="live-tracking"
                            />
                            <label htmlFor="live-tracking" className="text-sm font-medium cursor-pointer">
                                Live Tracking
                            </label>
                            {isLiveTracking && (
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            )}
                        </div>

                        <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
                            <Filter className="h-4 w-4 text-slate-600" />
                            <Switch
                                checked={showOfflineDevices}
                                onCheckedChange={setShowOfflineDevices}
                                id="show-offline"
                            />
                            <label htmlFor="show-offline" className="text-sm font-medium cursor-pointer">
                                Show Offline
                            </label>
                        </div>

                        <Button
                            onClick={refreshAllData}
                            variant="outline"
                            size="sm"
                            disabled={loading}
                            className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90"
                        >
                            <RefreshCw className={cn("h-4 w-4 mr-2", (loading || isLoading) && "animate-spin")} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <ModernStatsCard
                        title="Total Buses"
                        value={liveStats.totalBuses}
                        icon={Bus}
                        gradient="from-blue-500 to-cyan-500"
                        bgGradient="from-blue-50 to-cyan-50"
                    />
                    <ModernStatsCard
                        title="Online Buses"
                        value={liveStats.connectedDevices}
                        icon={Wifi}
                        gradient="from-emerald-500 to-green-500"
                        bgGradient="from-emerald-50 to-green-50"
                    />
                    <ModernStatsCard
                        title="Offline Buses"
                        value={liveStats.offlineBuses}
                        icon={WifiOff}
                        gradient="from-red-500 to-rose-500"
                        bgGradient="from-red-50 to-rose-50"
                    />
                    <ModernStatsCard
                        title="Recent Updates"
                        value={liveStats.recentPositions}
                        icon={Activity}
                        gradient="from-orange-500 to-amber-500"
                        bgGradient="from-orange-50 to-amber-50"
                    />
                    <ModernStatsCard
                        title="Tracking Status"
                        value={isLiveTracking ? 'Live' : 'Paused'}
                        icon={isLiveTracking ? Play : Pause}
                        gradient={isLiveTracking ? "from-green-500 to-emerald-500" : "from-slate-500 to-gray-500"}
                        bgGradient={isLiveTracking ? "from-green-50 to-emerald-50" : "from-slate-50 to-gray-50"}
                        isText={true}
                    />
                </div>

                {/* Error Banner */}
                {error && (
                    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
                        <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-amber-800">Connection Warning</p>
                                        <p className="text-sm text-amber-700">{error}</p>
                                    </div>
                                </div>
                                <Button onClick={refreshAllData} size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Retry
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[700px]">
                    {/* Enhanced Search & Bus List */}
                    {showBusList && (
                        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                            {/* Enhanced Search */}
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-lg">
                                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                            <Search className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            Bus Search & Focus
                                        </span>
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-purple-500" />}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search buses by number, name or device ID..."
                                                className="pl-10 border-slate-200 bg-white/50 backdrop-blur-sm focus:bg-white/80 transition-all"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        {searchTerm && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={clearSearch}
                                                className="shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Search Results Preview */}
                                    {searchTerm && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Target className="h-4 w-4" />
                                                <span>Found {filteredDevices.length} bus(es) • {filteredWithLocation.length} with GPS</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {filteredDevices.length > 0 ? (
                                                    filteredDevices.slice(0, 6).map((device) => (
                                                        <Badge
                                                            key={device.id}
                                                            variant={focusedDevice === device.id ? "default" : "secondary"}
                                                            className={cn(
                                                                "cursor-pointer gap-2 hover:scale-105 transition-all duration-200 px-3 py-1",
                                                                focusedDevice === device.id && "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                                            )}
                                                            onClick={() => device.latestPosition && device.latestPosition.latitude && device.latestPosition.longitude && onMarkerClick(device)}
                                                        >
                                                            {device.latestPosition && device.latestPosition.latitude && device.latestPosition.longitude && (
                                                                <div className={cn("w-2 h-2 rounded-full animate-pulse",
                                                                    getDeviceStatus(device) === 'online' ? 'bg-green-400' :
                                                                        getDeviceStatus(device) === 'stale' ? 'bg-yellow-400' :
                                                                            getDeviceStatus(device) === 'offline' ? 'bg-red-400' : 'bg-gray-400'
                                                                )} />
                                                            )}
                                                            {focusedDevice === device.id && <Target className="h-3 w-3" />}
                                                            {device.bus?.busNumber || device.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Badge variant="outline" className="gap-2 border-dashed">
                                                        <Search className="h-3 w-3" />
                                                        No buses found matching "{searchTerm}"
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Enhanced Bus List */}
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm flex-1">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                                                <Bus className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                Fleet Status
                                            </span>
                                        </CardTitle>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-3 py-1">
                                            {filteredDevices.length}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[400px]">
                                        {filteredDevices.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <Bus className="h-8 w-8 text-slate-500" />
                                                </div>
                                                <h3 className="text-lg font-medium text-slate-700 mb-2">
                                                    {!isInitialized ? 'Loading buses...' : 'No buses found'} {/* ✅ CHANGED: dynamic message */}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {!isInitialized ? 'Connecting to GPS network...' : 'Try adjusting your search or filters'} {/* ✅ CHANGED: dynamic message */}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 p-4">
                                                {filteredDevices.map((device) => {
                                                    const status = getDeviceStatus(device)
                                                    const isSelected = selectedBus === device.id

                                                    return (
                                                        <div
                                                            key={device.id}
                                                            className={cn(
                                                                "p-4 rounded-xl cursor-pointer transition-all duration-200 border-2",
                                                                isSelected
                                                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg scale-[1.02]"
                                                                    : "bg-white/50 border-slate-200 hover:bg-white/80 hover:shadow-md hover:scale-[1.01]"
                                                            )}
                                                            onClick={() => setSelectedBus(isSelected ? null : device.id)}
                                                        >
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={cn(
                                                                        "w-3 h-3 rounded-full shadow-lg",
                                                                        status === 'online' && "bg-emerald-500 shadow-emerald-500/50 animate-pulse",
                                                                        status === 'stale' && "bg-amber-500 shadow-amber-500/50",
                                                                        status === 'offline' && "bg-red-500 shadow-red-500/50",
                                                                        status === 'inactive' && "bg-slate-400 shadow-slate-400/50"
                                                                    )} />
                                                                    <div>
                                                                        <p className="font-semibold text-slate-800">
                                                                            {device.bus?.busNumber || device.name}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500">
                                                                            {device.bus?.busType} • {device.deviceId}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right space-y-1">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={cn("text-xs font-medium", getStatusColor(status))}
                                                                    >
                                                                        {status.toUpperCase()}
                                                                    </Badge>
                                                                    {device.latestPosition && (
                                                                        <p className="text-xs text-slate-500">
                                                                            {formatTimeAgo(device.latestPosition.timestamp)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Enhanced Position Details */}
                                                            {device.latestPosition && (
                                                                <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
                                                                    <div className="flex items-center gap-2 text-slate-600">
                                                                        <MapPin className="h-3 w-3 text-red-500" />
                                                                        <span className="font-mono">
                                                                            {device.latestPosition.latitude.toFixed(4)}, {device.latestPosition.longitude.toFixed(4)}
                                                                        </span>
                                                                    </div>
                                                                    {device.latestPosition.speed !== null && (
                                                                        <div className="flex items-center gap-2 text-slate-600">
                                                                            <Gauge className="h-3 w-3 text-blue-500" />
                                                                            <span className="font-medium">
                                                                                {device.latestPosition.speed.toFixed(1)} km/h
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Enhanced Live Map */}
                    <div className={cn("space-y-6", showBusList ? "lg:col-span-8 xl:col-span-9" : "lg:col-span-12")}>
                        {/* Map Controls */}
                        <div className="flex items-center justify-between gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowBusList(!showBusList)}
                                className="bg-white/80 backdrop-blur-sm border-white/20"
                            >
                                {showBusList ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                {showBusList ? 'Hide' : 'Show'} Bus List
                            </Button>

                            <div className="flex items-center gap-2">
                                {mapStyles.map((style) => (
                                    <Button
                                        key={style.id}
                                        variant={mapStyle === style.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setMapStyle(style.id)}
                                        className={cn(
                                            "bg-white/80 backdrop-blur-sm border-white/20",
                                            mapStyle === style.id && "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                        )}
                                    >
                                        <style.icon className="h-4 w-4 mr-2" />
                                        {style.name}
                                    </Button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="gap-2 bg-white/80 backdrop-blur-sm border-white/20">
                                    <div className={cn("w-2 h-2 rounded-full", isLiveTracking ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
                                    {isLiveTracking ? 'LIVE' : 'PAUSED'}
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fitBounds}
                                    disabled={devicesWithLocation.length === 0}
                                    className="bg-white/80 backdrop-blur-sm border-white/20"
                                >
                                    <Maximize2 className="h-4 w-4 mr-2" />
                                    Fit All
                                </Button>
                            </div>
                        </div>

                        {/* Enhanced Map */}
                        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
                            <CardContent className="p-0">
                                <div className="h-[600px] w-full relative">
                                    <Map
                                        {...viewState}
                                        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
                                        mapboxAccessToken={MAPBOX_TOKEN}
                                        style={{ width: '100%', height: '100%' }}
                                        mapStyle={mapStyle}
                                    >
                                        <NavigationControl position="top-right" />
                                        <FullscreenControl position="top-right" />

                                        {/* Enhanced Bus Markers */}
                                        {filteredDevices.map((device) => {
                                            if (!device.latestPosition ||
                                                !device.latestPosition.latitude ||
                                                !device.latestPosition.longitude ||
                                                typeof device.latestPosition.latitude !== 'number' ||
                                                typeof device.latestPosition.longitude !== 'number') {
                                                return null
                                            }

                                            const { latitude, longitude } = device.latestPosition
                                            const status = getDeviceStatus(device)
                                            const isFocused = focusedDevice === device.id

                                            return (
                                                <Marker
                                                    key={device.id}
                                                    longitude={longitude}
                                                    latitude={latitude}
                                                >
                                                    <div
                                                        className={cn(
                                                            "cursor-pointer transition-all duration-300 hover:scale-110",
                                                            isFocused && 'animate-bounce'
                                                        )}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onMarkerClick(device)
                                                        }}
                                                    >
                                                        {/* Enhanced Bus marker */}
                                                        <div
                                                            className={cn(
                                                                "w-10 h-10 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-white text-lg font-bold backdrop-blur-sm",
                                                                getMarkerColor(status),
                                                                isFocused && 'ring-4 ring-blue-400 ring-opacity-50 scale-110'
                                                            )}
                                                            style={{
                                                                background: isFocused
                                                                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                                                    : undefined,
                                                                boxShadow: isFocused
                                                                    ? '0 8px 32px rgba(59, 130, 246, 0.6)'
                                                                    : '0 4px 20px rgba(0, 0, 0, 0.3)',
                                                            }}
                                                        >
                                                            🚌
                                                        </div>
                                                        {/* Enhanced tooltip */}
                                                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl backdrop-blur-sm">
                                                            <div className="font-semibold">{device.bus?.busNumber || device.name}</div>
                                                            <div className="text-slate-300">{status.toUpperCase()}</div>
                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                                        </div>
                                                    </div>
                                                </Marker>
                                            )
                                        })}

                                        {/* Enhanced Device Popup */}
                                        {selectedDevice && selectedDevice.latestPosition && (
                                            <Popup
                                                longitude={selectedDevice.latestPosition.longitude}
                                                latitude={selectedDevice.latestPosition.latitude}
                                                anchor="bottom"
                                                onClose={() => {
                                                    setSelectedDevice(null)
                                                    setSelectedBus(null)
                                                }}
                                                closeOnClick={false}
                                                className="max-w-sm"
                                            >
                                                <div className="p-6 min-w-80 space-y-6 bg-white rounded-2xl shadow-2xl border-0">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                                            {selectedDevice.bus?.busNumber || selectedDevice.name}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn("text-xs gap-2 font-medium", getStatusColor(getDeviceStatus(selectedDevice)))}
                                                        >
                                                            <div className={cn("w-2 h-2 rounded-full",
                                                                getDeviceStatus(selectedDevice) === 'online' ? 'bg-emerald-500 animate-pulse' :
                                                                    getDeviceStatus(selectedDevice) === 'stale' ? 'bg-amber-500' :
                                                                        getDeviceStatus(selectedDevice) === 'offline' ? 'bg-red-500' : 'bg-slate-400'
                                                            )} />
                                                            {getDeviceStatus(selectedDevice).toUpperCase()}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6 text-sm">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-slate-600">
                                                                <Bus className="h-4 w-4 text-blue-500" />
                                                                <span className="font-medium">Bus Type</span>
                                                            </div>
                                                            <p className="text-slate-800 font-medium">
                                                                {selectedDevice.bus?.busType || 'N/A'}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-slate-600">
                                                                <Gauge className="h-4 w-4 text-green-500" />
                                                                <span className="font-medium">Speed</span>
                                                            </div>
                                                            <Badge variant="secondary" className="text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                                                                {Math.round(selectedDevice.latestPosition.speed || 0)} km/h
                                                            </Badge>
                                                        </div>

                                                        <div className="col-span-2 space-y-2">
                                                            <div className="flex items-center gap-2 text-slate-600">
                                                                <MapPin className="h-4 w-4 text-red-500" />
                                                                <span className="font-medium">GPS Coordinates</span>
                                                            </div>
                                                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-xl border">
                                                                <p className="font-mono text-sm text-slate-700">
                                                                    📍 {selectedDevice.latestPosition.latitude.toFixed(6)}, {selectedDevice.latestPosition.longitude.toFixed(6)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-2 space-y-2">
                                                            <div className="flex items-center gap-2 text-slate-600">
                                                                <Clock className="h-4 w-4 text-purple-500" />
                                                                <span className="font-medium">Last Update</span>
                                                            </div>
                                                            <p className="text-slate-700">
                                                                📅 {formatTimeAgo(selectedDevice.latestPosition.timestamp)}
                                                            </p>
                                                        </div>

                                                        {selectedDevice.bus && (
                                                            <div className="col-span-2 space-y-2">
                                                                <div className="flex items-center gap-2 text-slate-600">
                                                                    <Smartphone className="h-4 w-4 text-orange-500" />
                                                                    <span className="font-medium">Capacity</span>
                                                                </div>
                                                                <p className="text-slate-700 font-medium">
                                                                    👥 {selectedDevice.bus.capacity} passengers
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Separator />

                                                    <div className="flex gap-3">
                                                        <Button
                                                            onClick={() => flyToDevice(selectedDevice)}
                                                            className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg"
                                                        >
                                                            <Target className="h-4 w-4" />
                                                            🎯 Focus Here
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedDevice(null)
                                                                setSelectedBus(null)
                                                            }}
                                                            variant="outline"
                                                            size="icon"
                                                            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Popup>
                                        )}
                                    </Map>

                                    {/* Map overlays */}
                                    <div className="absolute top-4 left-4 space-y-3 z-10">
                                        {/* Status Legend */}
                                        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4">
                                            <h4 className="text-sm font-semibold mb-3 text-slate-700">Bus Status</h4>
                                            <div className="space-y-2 text-xs">
                                                {[
                                                    { status: 'online', color: 'bg-emerald-500', label: 'Online' },
                                                    { status: 'stale', color: 'bg-amber-500', label: 'Stale' },
                                                    { status: 'offline', color: 'bg-red-500', label: 'Offline' },
                                                    { status: 'inactive', color: 'bg-slate-400', label: 'Inactive' }
                                                ].map(({ status, color, label }) => (
                                                    <div key={status} className="flex items-center gap-2">
                                                        <div className={cn("w-3 h-3 rounded-full shadow-sm", color)} />
                                                        <span className="text-slate-600 font-medium">{label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Live Indicator */}
                                        {isLiveTracking && (
                                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-2xl text-xs font-semibold animate-pulse shadow-xl border border-white/20 backdrop-blur-md">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                                                    Live Tracking Active
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Enhanced Status Bar */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-4">
                                <Badge variant="outline" className="gap-2 px-3 py-1 bg-blue-50 border-blue-200 text-blue-700">
                                    <Bus className="h-3 w-3" />
                                    Total: {devices.length}
                                </Badge>

                                <Badge variant="default" className="gap-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    GPS Active: {devicesWithLocation.length}
                                </Badge>

                                {searchTerm && (
                                    <Badge variant="secondary" className="gap-2 px-3 py-1 bg-purple-50 border-purple-200 text-purple-700">
                                        <Search className="h-3 w-3" />
                                        Found: {filteredDevices.length} ({filteredWithLocation.length} with GPS)
                                    </Badge>
                                )}

                                {focusedDevice && (
                                    <Badge variant="default" className="gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500">
                                        <Target className="h-3 w-3" />
                                        Focused Bus
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <RefreshCw className={cn("h-4 w-4", (isLoading || loading) && "animate-spin")} />
                                    <span>Auto-refresh: {isLiveTracking ? '3s' : 'OFF'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {/* <span className="font-mono text-xs">
                    {lastUpdate.toLocaleTimeString()}
                  </span> */}
                                    <span className="font-mono text-xs">
                                        {mounted ? lastUpdate.toLocaleTimeString() : '--:--:--'}
                                    </span>


                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Empty State */}
                {devices.length === 0 && !error && !loading && isInitialized && ( // ✅ CHANGED: only show when initialized
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-slate-100">
                        <CardContent className="py-24 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Bus className="h-12 w-12 text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">No GPS Buses Found</h3>
                            <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                                No active GPS tracking buses are currently registered in the system.
                                Add buses to start tracking their locations in real-time.
                            </p>
                            <Button onClick={refreshAllData} className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg">
                                <RefreshCw className="h-4 w-4" />
                                Refresh Data
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

// Enhanced Modern Stats Card Component
interface ModernStatsCardProps {
    title: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    gradient: string
    bgGradient: string
    isText?: boolean
}

function ModernStatsCard({ title, value, icon: Icon, gradient, bgGradient, isText = false }: ModernStatsCardProps) {
    return (
        <Card className={cn("border-0 shadow-xl bg-gradient-to-br", bgGradient, "hover:shadow-2xl transition-all duration-300 hover:scale-105 group")}>
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-lg group-hover:shadow-xl transition-all duration-300", gradient)}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={cn(
                            "font-bold text-slate-800 group-hover:text-slate-900 transition-colors",
                            isText ? "text-xl" : "text-2xl"
                        )}>
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </p>
                        <p className="text-sm text-slate-600 font-medium">{title}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
