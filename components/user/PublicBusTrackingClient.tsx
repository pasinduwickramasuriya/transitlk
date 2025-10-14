'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Map, {
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
} from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
    Search,
    MapPin,
    Bus,
    Navigation as NavigationIcon,
    Clock,
    Wifi,
    WifiOff,
    RefreshCw,
    Loader2,
    Target,
    AlertCircle,
    Gauge,
    MapIcon,
    Layers,
    Eye,
    EyeOff,
    Play,
    Sparkles,
    X,
    Heart,
    Radio
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { forceCheckExpiry, getCurrentUser, isSessionExpired, isUserLoggedIn, saveReturnUrl, User } from '@/utils/auth'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

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
}

interface ViewState {
    longitude: number
    latitude: number
    zoom: number
    transitionDuration?: number
}

export function PublicBusTrackingClient() {

     // ✅ Simple auth check with window.location
    useEffect(() => {
        const loggedIn = isUserLoggedIn()
        if (!loggedIn) {
            saveReturnUrl('/tracking')
            toast.error('Please sign in to track buses')
            setTimeout(() => {
                window.location.href = '/auth/signin'
            }, 1000)
        }
    }, [])

    useEffect(() => {
        const sessionCheckInterval = setInterval(() => {
            const expired = isSessionExpired()
            
            if (expired) {
                // Session expired - redirect to home
                toast.error('Your session has expired')
                setTimeout(() => {
                    window.location.href = '/' // ✅ Redirect to home page
                }, 1000)
            }
        }, 5000) // Check every 5 seconds

        return () => clearInterval(sessionCheckInterval)
    }, [])

    
      useEffect(() => {
        const now = Date.now()
        const lastRefresh = sessionStorage.getItem('lastRefresh')
        
        // Check if this is a new visit (more than 2 seconds since last)
        if (!lastRefresh || now - parseInt(lastRefresh) > 2000) {
            sessionStorage.setItem('lastRefresh', now.toString())
            window.location.reload()  // Force hard refresh
            return
        }
    }, [])

    
    const [devices, setDevices] = useState<Device[]>([])
    const [positions, setPositions] = useState<Position[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
    const [selectedBus, setSelectedBus] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)
    const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v12")
    const [isLiveTracking, setIsLiveTracking] = useState(true)
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
    const [focusedDevice, setFocusedDevice] = useState<string | null>(null)

    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const isMountedRef = useRef(true)

    const [viewState, setViewState] = useState<ViewState>({
        longitude: 79.8612,
        latitude: 6.9271,
        zoom: 10,
    })
     const [user, setUser] = useState<User | null>(null)  // ✅ ADD THIS LINE IF MISSING
     

    useEffect(() => {
        setMounted(true)
        return () => {
            isMountedRef.current = false
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [])
     


 
        const fetchDevices = useCallback(async () => {
    if (!isMountedRef.current) return

    try {
        console.log('📡 Fetching devices from API...')
        const response = await fetch('/api/operator/tracking/devices?t=' + Date.now(), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        })

        if (!response.ok) {
            console.error('❌ Device fetch failed:', response.status)
            return
        }

        const data = await response.json()
        console.log('📥 Received data:', data)
        console.log('📥 Devices array:', data.devices)
        console.log('📥 Device count:', data.devices?.length)

        if (isMountedRef.current && data.devices) {
            console.log('✅ Setting devices state with', data.devices.length, 'devices')
            setDevices(data.devices)
            console.log('✅ Devices state set!')
        } else {
            console.log('❌ NOT setting devices - mounted:', isMountedRef.current, 'hasData:', !!data.devices)
        }
    } catch (err) {
        console.error('❌ Fetch error:', err)
    }
}, [])



    const fetchPositions = useCallback(async () => {
        if (!isMountedRef.current) return

        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000)

            const response = await fetch(`/api/operator/tracking/positions?t=${Date.now()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                console.warn(`⚠️ API returned ${response.status}: ${response.statusText}`)
                return
            }

            const data = await response.json()

            if (isMountedRef.current) {
                setPositions(data.positions || [])

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
            if (err.name === 'AbortError') {
                console.log('⏱️ Position fetch timed out')
                return
            }

            if (err.message === 'Failed to fetch') {
                console.warn('⚠️ Network issue - will retry on next interval')
                return
            }

            console.error('❌ Error fetching positions:', err.message)
        }
    }, [])


    //refresh all data when refresh button clicked 
    const refreshAllData = useCallback(async () => {
        if (!isMountedRef.current) return

        try {
            setLoading(true)
            await Promise.all([fetchDevices(), fetchPositions()])
            setLastUpdate(new Date())
            toast.success('🎉 Data refreshed successfully!')
        } catch (err: any) {
            console.error('❌ Error refreshing data:', err)
        } finally {
            if (isMountedRef.current) {
                setLoading(false)
            }
        }
    }, [fetchDevices, fetchPositions])
    // ✅ Auto-refresh: Calls refreshAllData() every 10 seconds (like auto-clicking the button)
    useEffect(() => {
        if (!isLiveTracking) return

        const autoRefreshTimer = setInterval(() => {
            if (isMountedRef.current && isLiveTracking) {
                refreshAllData()
            }
        }, 10000) // Every 10 seconds

        console.log('🔄 Auto-refresh button started (10s interval)')

        return () => {
            clearInterval(autoRefreshTimer)
            console.log('⏸️ Auto-refresh button stopped')
        }
    }, [isLiveTracking, refreshAllData])


    useEffect(() => {
        if (!MAPBOX_TOKEN) {
            toast.error('Mapbox token is missing')
            return
        }

        const initData = async () => {
            try {
                setLoading(true)
                await Promise.all([fetchDevices(), fetchPositions()])
                setLastUpdate(new Date())
            } catch (err: any) {
                console.error('❌ Error initializing:', err)
            } finally {
                if (isMountedRef.current) {
                    setLoading(false)
                }
            }
        }

        initData()
    }, [fetchDevices, fetchPositions])
 






    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }

        if (isLiveTracking) {
            intervalRef.current = setInterval(() => {
                if (isMountedRef.current && isLiveTracking) {
                    fetchPositions()
                    setLastUpdate(new Date())
                }
            }, 3000)

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
    }, [isLiveTracking, fetchPositions])

    

    // ✅ Auto-focus on search result
    useEffect(() => {
        const filteredDevices = getFilteredDevices()
        const devicesWithLocation = filteredDevices.filter(d => d.latestPosition)

        if (searchQuery && devicesWithLocation.length === 1) {
            const device = devicesWithLocation[0]
            flyToDevice(device, false)
            setFocusedDevice(device.id)
        } else if (!searchQuery) {
            setFocusedDevice(null)
        }
    }, [searchQuery, devices])


    const getDeviceStatus = useCallback((device: Device) => {
        if (!device.isActive || !device.bus?.isActive) return 'inactive'
        if (!device.latestPosition) return 'offline'

        const now = new Date()
        const lastUpdate = new Date(device.lastSeen)
        const minutesAgo = (now.getTime() - lastUpdate.getTime()) / (1000 * 60)

        if (minutesAgo <= 5) return 'online'
        if (minutesAgo <= 15) return 'stale'
        return 'offline'
    }, [])

    const getMarkerColor = useCallback((status: string) => {
        switch (status) {
            case 'online': return 'bg-emerald-400 shadow-emerald-300/60'
            case 'stale': return 'bg-amber-400 shadow-amber-300/60'
            case 'offline': return 'bg-rose-400 shadow-rose-300/60'
            case 'inactive': return 'bg-slate-300 shadow-slate-200/60'
            default: return 'bg-slate-300 shadow-slate-200/60'
        }
    }, [])

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'online': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
            case 'stale': return 'text-amber-600 bg-amber-50 border-amber-200'
            case 'offline': return 'text-rose-600 bg-rose-50 border-rose-200'
            case 'inactive': return 'text-slate-600 bg-slate-50 border-slate-200'
            default: return 'text-slate-600 bg-slate-50 border-slate-200'
        }
    }, [])

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


    const getFilteredDevices = useCallback(() => {
        if (!searchQuery.trim()) {
            return devices.filter(d => d.latestPosition && d.isActive && d.bus?.isActive)
        }

        return devices.filter(device => {
            const hasLocation = device.latestPosition && device.isActive && device.bus?.isActive
            if (!hasLocation) return false

            const busNumber = device.bus?.busNumber?.toLowerCase() || ''
            const deviceName = device.name?.toLowerCase() || ''
            const deviceId = device.deviceId?.toLowerCase() || ''
            const search = searchQuery.toLowerCase()

            return busNumber.includes(search) || deviceName.includes(search) || deviceId.includes(search)
        })
    }, [devices, searchQuery])
    



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
            setSelectedDevice(device)
            setSelectedBus(device.id)
            setFocusedDevice(device.id)
            if (showToast) toast.success(`🎯 Focused on ${device.bus?.busNumber || device.name}`)
        } else {
            toast.error(`${device.bus?.busNumber || device.name} has no location data`)
        }
    }, [])

    const onMarkerClick = useCallback((device: Device) => {
        setSelectedDevice(device)
        setSelectedBus(device.id)
        flyToDevice(device, false)
    }, [flyToDevice])

    const fitBounds = useCallback(() => {
        const devicesWithLocation = devices.filter(device =>
            device.latestPosition && device.latestPosition.latitude && device.latestPosition.longitude &&
            device.isActive && device.bus?.isActive
        )

        if (devicesWithLocation.length === 0) {
            toast.error('No active buses to display')
            return
        }

        if (devicesWithLocation.length === 1) {
            flyToDevice(devicesWithLocation[0], false)
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

        toast.success('📍 Showing all buses')
    }, [devices, flyToDevice])

    const clearSearch = useCallback(() => {
        setSearchQuery('')
        setFocusedDevice(null)
        setSelectedDevice(null)
        setSelectedBus(null)
        fitBounds()
    }, [fitBounds])

    const liveStats = React.useMemo(() => {
        const now = new Date()
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

        const onlineBuses = devices.filter(device =>
            device.isActive && device.bus?.isActive && device.latestPosition &&
            new Date(device.lastSeen) > fiveMinutesAgo
        ).length

        return {
            totalBuses: devices.filter(d => d.latestPosition && d.isActive && d.bus?.isActive).length,
            onlineBuses,
            recentPositions: positions.length
        }
    }, [devices, positions])

    const mapStyles = [
        { id: "mapbox://styles/mapbox/streets-v12", name: "Streets", icon: MapIcon },
        { id: "mapbox://styles/mapbox/satellite-streets-v12", name: "Satellite", icon: Layers },
        { id: "mapbox://styles/mapbox/dark-v11", name: "Dark", icon: Eye },
        { id: "mapbox://styles/mapbox/light-v11", name: "Light", icon: EyeOff }
    ]

    if (!MAPBOX_TOKEN) {
        return (
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
                <CardContent className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-6 text-center max-w-md">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center text-3xl shadow-2xl">
                            🗝️
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-800">Mapbox Token Required</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Please add your Mapbox access token to enable live tracking map
                            </p>
                            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-purple-200">
                                <code className="text-sm text-slate-700 font-mono">
                                    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
                                </code>
                            </div>
                            <Button
                                onClick={() => window.open('https://account.mapbox.com/access-tokens/', '_blank')}
                                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-full shadow-lg"
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            <div className="container mx-auto p-6 space-y-6">
                {/* Cute Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40">
                        <div className="p-3 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-2xl shadow-lg">
                            <Bus className="h-7 w-7 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                                Track Your Bus
                                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                            </h1>
                            <p className="text-sm text-slate-600 font-medium">Real-time GPS tracking • Made with <Heart className="h-3 w-3 inline text-pink-500 fill-pink-500" /></p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <Card className="border-0 shadow-2xl bg-white/60 backdrop-blur-xl">
                        <CardContent className="p-6">
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                                    <Input
                                        type="text"
                                        placeholder="🔍 Search by bus number (e.g., NB-1234)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-14 text-base border-2 border-purple-200 focus:border-purple-400 rounded-2xl bg-white/80 backdrop-blur-sm"
                                    />
                                    {searchQuery && (
                                        <Button
                                            onClick={clearSearch}
                                            size="icon"
                                            variant="ghost"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-purple-100"
                                        >
                                            <X className="h-4 w-4 text-purple-600" />
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    onClick={refreshAllData}
                                    disabled={loading}
                                    className="h-14 px-8 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 rounded-2xl shadow-lg text-white font-semibold"
                                >
                                    <RefreshCw className={cn("h-5 w-5 mr-2", loading && "animate-spin")} />
                                    Refresh
                                </Button>
                            </div>
                            {searchQuery && filteredDevices.length > 0 && (
                                <p className="text-sm text-purple-600 mt-3 font-medium">
                                    ✨ Found {filteredDevices.length} bus{filteredDevices.length !== 1 ? 'es' : ''}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Cute Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CuteStatsCard
                        title="Active Buses"
                        value={liveStats.totalBuses}
                        icon={Bus}
                        gradient="from-pink-400 to-rose-400"
                        bgGradient="from-pink-50/80 to-rose-50/80"
                    />
                    <CuteStatsCard
                        title="Online Now"
                        value={liveStats.onlineBuses}
                        icon={Wifi}
                        gradient="from-emerald-400 to-green-400"
                        bgGradient="from-emerald-50/80 to-green-50/80"
                    />
                    <CuteStatsCard
                        title="Live Tracking"
                        value={isLiveTracking ? '🟢 Active' : '⏸️ Paused'}
                        icon={Radio}
                        gradient="from-purple-400 to-blue-400"
                        bgGradient="from-purple-50/80 to-blue-50/80"
                        isText={true}
                    />
                </div>

                {/* Error Banner */}
                {error && (
                    <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-lg">
                        <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-xl">
                                        <AlertCircle className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-amber-800">Connection Issue</p>
                                        <p className="text-sm text-amber-700">{error}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={refreshAllData}
                                    size="sm"
                                    className="bg-amber-400 hover:bg-amber-500 text-white rounded-full"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Retry
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Map & List */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Compact Map - Super Rounded */}
                    <Card className="lg:col-span-2 border-0 shadow-2xl overflow-hidden rounded-3xl">
                        <CardContent className="p-0">
                            <div className="relative h-[480px] w-full rounded-3xl overflow-hidden">
                                {mounted && (
                                    <Map
                                        {...viewState}
                                        onMove={evt => setViewState(evt.viewState)}
                                        mapboxAccessToken={MAPBOX_TOKEN}
                                        mapStyle={mapStyle}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <NavigationControl position="top-right" />
                                        <FullscreenControl position="top-right" />

                                        {/* Compact Map Controls */}
                                        <div className="absolute top-3 left-3 z-10">
                                            <Button
                                                onClick={fitBounds}
                                                size="sm"
                                                className="bg-white/90 backdrop-blur-sm text-purple-700 hover:bg-white shadow-xl rounded-full font-semibold"
                                            >
                                                <Target className="h-4 w-4 mr-2" />
                                                Show All
                                            </Button>
                                        </div>

                                        {/* Compact Map Style Selector */}
                                        <div className="absolute bottom-3 left-3 z-10 flex gap-2">
                                            {mapStyles.map(style => (
                                                <Button
                                                    key={style.id}
                                                    onClick={() => setMapStyle(style.id)}
                                                    size="sm"
                                                    className={cn(
                                                        "bg-white/90 backdrop-blur-sm rounded-full text-xs shadow-lg h-9 px-3",
                                                        mapStyle === style.id
                                                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                                            : "text-slate-700 hover:bg-white"
                                                    )}
                                                >
                                                    <style.icon className="h-3.5 w-3.5 mr-1.5" />
                                                    {style.name}
                                                </Button>
                                            ))}
                                        </div>

                                        {/* Cute Bus Markers */}
                                        {filteredDevices.map(device => {
                                            if (!device.latestPosition) return null
                                            const status = getDeviceStatus(device)
                                            const color = getMarkerColor(status)

                                            return (
                                                <Marker
                                                    key={device.id}
                                                    longitude={device.latestPosition.longitude}
                                                    latitude={device.latestPosition.latitude}
                                                    onClick={() => onMarkerClick(device)}
                                                >
                                                    <div className={cn(
                                                        "w-11 h-11 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transform hover:scale-125 transition-all",
                                                        color,
                                                        focusedDevice === device.id && "ring-4 ring-purple-400 animate-pulse"
                                                    )}>
                                                        <Bus className="h-5 w-5 text-white" />
                                                    </div>
                                                </Marker>
                                            )
                                        })}

                                        {/* Cute Popup */}
                                        {selectedDevice && selectedDevice.latestPosition && (
                                            <Popup
                                                longitude={selectedDevice.latestPosition.longitude}
                                                latitude={selectedDevice.latestPosition.latitude}
                                                onClose={() => {
                                                    setSelectedDevice(null)
                                                    setSelectedBus(null)
                                                }}
                                                closeButton={true}
                                                closeOnClick={false}
                                            >
                                                <div className="p-3">
                                                    <h3 className="font-bold text-base mb-2">{selectedDevice.bus?.busNumber || selectedDevice.name}</h3>
                                                    <Badge className={cn("mb-2 text-xs", getStatusColor(getDeviceStatus(selectedDevice)))}>
                                                        {getDeviceStatus(selectedDevice).toUpperCase()}
                                                    </Badge>
                                                    <Separator className="my-2" />
                                                    <div className="space-y-1.5 text-sm">
                                                        <p className="flex items-center gap-2 text-slate-600">
                                                            <Gauge className="h-4 w-4 text-purple-500" />
                                                            Speed: {selectedDevice.latestPosition.speed || 0} km/h
                                                        </p>
                                                        <p className="flex items-center gap-2 text-slate-600">
                                                            <MapPin className="h-4 w-4 text-pink-500" />
                                                            {selectedDevice.latestPosition.latitude.toFixed(4)}, {selectedDevice.latestPosition.longitude.toFixed(4)}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-slate-600">
                                                            <Clock className="h-4 w-4 text-blue-500" />
                                                            {formatTimeAgo(selectedDevice.lastSeen)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Popup>
                                        )}
                                    </Map>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compact Bus List - Super Rounded */}
                    <Card className="border-0 shadow-2xl bg-white/50 backdrop-blur-2xl rounded-3xl">
                        <CardHeader className="p-4 pb-3">
                            <CardTitle className="flex items-center gap-2 text-purple-700 text-base">
                                <Bus className="h-5 w-5" />
                                Active Buses ({filteredDevices.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <ScrollArea className="h-[400px] pr-3">
                                {loading && devices.length === 0 ? (
                                    <div className="text-center py-10">
                                        <Loader2 className="h-9 w-9 animate-spin text-purple-500 mx-auto mb-2" />
                                        <p className="text-sm text-slate-600 font-medium">Loading buses...</p>
                                    </div>
                                ) : filteredDevices.length === 0 ? (
                                    <div className="text-center py-10">
                                        <Bus className="h-14 w-14 text-purple-200 mx-auto mb-2" />
                                        <p className="text-sm text-slate-600 font-medium">
                                            {searchQuery ? 'No buses found' : 'No active buses'}
                                        </p>
                                        {searchQuery && (
                                            <Button
                                                onClick={clearSearch}
                                                size="sm"
                                                variant="outline"
                                                className="mt-3 rounded-full"
                                            >
                                                Clear Search
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {filteredDevices.map(device => {
                                            const status = getDeviceStatus(device)
                                            const isFocused = focusedDevice === device.id

                                            return (
                                                <div
                                                    key={device.id}
                                                    onClick={() => flyToDevice(device)}
                                                    className={cn(
                                                        "p-3.5 rounded-2xl cursor-pointer transition-all hover:scale-105",
                                                        isFocused
                                                            ? "bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-xl ring-4 ring-purple-200"
                                                            : "bg-white/70 backdrop-blur-sm hover:bg-white/90 shadow-lg"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className={cn(
                                                                "font-bold text-base",
                                                                isFocused ? "text-white" : "text-slate-800"
                                                            )}>
                                                                {device.bus?.busNumber || device.name}
                                                            </p>
                                                            <p className={cn(
                                                                "text-xs mt-1",
                                                                isFocused ? "text-white/90" : "text-slate-600"
                                                            )}>
                                                                {device.bus?.busType} • {device.latestPosition?.speed || 0} km/h
                                                            </p>
                                                        </div>
                                                        <Badge className={cn(
                                                            "text-xs font-semibold px-2 py-0.5",
                                                            isFocused
                                                                ? "bg-white/30 text-white border-white/40"
                                                                : getStatusColor(status)
                                                        )}>
                                                            {status.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    {device.latestPosition && (
                                                        <p className={cn(
                                                            "text-xs mt-2 flex items-center gap-1",
                                                            isFocused ? "text-white/80" : "text-slate-500"
                                                        )}>
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {formatTimeAgo(device.lastSeen)}
                                                        </p>
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

            </div>
        </div>
    )
}

interface CuteStatsCardProps {
    title: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    gradient: string
    bgGradient: string
    isText?: boolean
}

function CuteStatsCard({ title, value, icon: Icon, gradient, bgGradient, isText = false }: CuteStatsCardProps) {
    return (
        <Card className={cn("border-0 shadow-xl bg-gradient-to-br backdrop-blur-sm", bgGradient, "hover:shadow-2xl transition-all duration-300 hover:scale-105 group")}>
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <div className={cn("p-4 rounded-2xl bg-gradient-to-br shadow-2xl group-hover:shadow-xl transition-all duration-300", gradient)}>
                        <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={cn(
                            "font-black text-slate-800 group-hover:text-slate-900 transition-colors",
                            isText ? "text-xl" : "text-3xl"
                        )}>
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </p>
                        <p className="text-sm text-slate-600 font-semibold">{title}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}



















// 'use client'

// import React, { useState, useEffect, useCallback, useRef } from 'react'
// import Map, {
//     Marker,
//     Popup,
//     NavigationControl,
//     FullscreenControl,
// } from 'react-map-gl/mapbox'
// import 'mapbox-gl/dist/mapbox-gl.css'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Separator } from '@/components/ui/separator'
// import {
//     Search,
//     MapPin,
//     Bus,
//     Clock,
//     Wifi,
//     RefreshCw,
//     Loader2,
//     Target,
//     AlertCircle,
//     Gauge,
//     MapIcon,
//     Layers,
//     Eye,
//     EyeOff,
//     Sparkles,
//     X,
//     Heart,
//     Radio
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'
// import { getCurrentUser, type User } from '@/utils/auth'

// const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// interface Device {
//     id: string
//     deviceId: string
//     name: string
//     isActive: boolean
//     lastSeen: string
//     bus: {
//         id: string
//         busNumber: string
//         busType: string
//         capacity: number
//         isActive: boolean
//     } | null
//     latestPosition: {
//         id: string
//         latitude: number
//         longitude: number
//         speed: number | null
//         heading: number | null
//         timestamp: string
//     } | null
// }

// interface Position {
//     id: string
//     deviceId: string
//     latitude: number
//     longitude: number
//     speed: number | null
//     heading: number | null
//     timestamp: string
// }

// interface ViewState {
//     longitude: number
//     latitude: number
//     zoom: number
//     transitionDuration?: number
// }

// export function PublicBusTrackingClient() {
//     const [devices, setDevices] = useState<Device[]>([])
//     const [positions, setPositions] = useState<Position[]>([])
//     const [searchQuery, setSearchQuery] = useState('')
//     const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
//     const [selectedBus, setSelectedBus] = useState<string | null>(null)
//     const [loading, setLoading] = useState(false)
//     const [isLoading, setIsLoading] = useState(false)
//     const [error, setError] = useState<string | null>(null)
//     const [mounted, setMounted] = useState(false)
//     const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v12")
//     const [isLiveTracking, setIsLiveTracking] = useState(true)
//     const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
//     const [focusedDevice, setFocusedDevice] = useState<string | null>(null)
//     const [user, setUser] = useState<User | null>(null)

//     const intervalRef = useRef<NodeJS.Timeout | null>(null)
//     const isMountedRef = useRef(true)

//     const [viewState, setViewState] = useState<ViewState>({
//         longitude: 79.8612,
//         latitude: 6.9271,
//         zoom: 10,
//     })

//     // ✅ Initialize component
//     useEffect(() => {
//         setMounted(true)
//         const currentUser = getCurrentUser()
//         setUser(currentUser)
//         console.log('🚀 Component mounted, user:', currentUser)
        
//         return () => {
//             isMountedRef.current = false
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current)
//                 intervalRef.current = null
//             }
//         }
//     }, [])

//     // ✅ Fetch devices from API
//     const fetchDevices = useCallback(async () => {
//         if (!isMountedRef.current) return

//         try {
//             console.log('📡 Fetching devices...')
//             setIsLoading(true)
//             const controller = new AbortController()
//             const timeoutId = setTimeout(() => controller.abort(), 5000)

//             const response = await fetch(`/api/operator/tracking/devices?active=true&t=${Date.now()}`, {
//                 method: 'GET',
//                 headers: { 'Content-Type': 'application/json' },
//                 cache: 'no-store',
//                 signal: controller.signal
//             })

//             clearTimeout(timeoutId)

//             if (!response.ok) {
//                 throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//             }

//             const data = await response.json()

//             if (isMountedRef.current) {
//                 setDevices(data.devices || [])
//                 setError(null)
//                 console.log(`✅ Fetched ${data.devices?.length || 0} devices`)
//             }
//         } catch (err: any) {
//             console.error('❌ Error fetching devices:', err)
//             if (isMountedRef.current && err.name !== 'AbortError') {
//                 setError(err instanceof Error ? err.message : 'Failed to load devices')
//             }
//         } finally {
//             if (isMountedRef.current) {
//                 setIsLoading(false)
//             }
//         }
//     }, [])

//     // ✅ Fetch positions from API
//     const fetchPositions = useCallback(async () => {
//         if (!isMountedRef.current) return

//         try {
//             console.log('📍 Fetching positions...')
//             const controller = new AbortController()
//             const timeoutId = setTimeout(() => controller.abort(), 10000)

//             const response = await fetch(`/api/operator/tracking/positions?t=${Date.now()}`, {
//                 method: 'GET',
//                 headers: { 'Content-Type': 'application/json' },
//                 cache: 'no-store',
//                 signal: controller.signal
//             })

//             clearTimeout(timeoutId)

//             if (!response.ok) {
//                 console.warn(`⚠️ API returned ${response.status}: ${response.statusText}`)
//                 return
//             }

//             const data = await response.json()

//             if (isMountedRef.current) {
//                 setPositions(data.positions || [])

//                 if (data.positions && Array.isArray(data.positions)) {
//                     setDevices(prevDevices => {
//                         return prevDevices.map(device => {
//                             const latestPosition = data.positions.find((pos: Position) => pos.deviceId === device.deviceId)
//                             if (latestPosition) {
//                                 return {
//                                     ...device,
//                                     latestPosition: {
//                                         id: latestPosition.id,
//                                         latitude: latestPosition.latitude,
//                                         longitude: latestPosition.longitude,
//                                         speed: latestPosition.speed,
//                                         heading: latestPosition.heading,
//                                         timestamp: latestPosition.timestamp
//                                     }
//                                 }
//                             }
//                             return device
//                         })
//                     })
//                 }

//                 console.log(`✅ Fetched ${data.positions?.length || 0} positions`)
//             }
//         } catch (err: any) {
//             if (err.name === 'AbortError') {
//                 console.log('⏱️ Position fetch timed out')
//                 return
//             }

//             if (err.message === 'Failed to fetch') {
//                 console.warn('⚠️ Network issue - will retry on next interval')
//                 return
//             }

//             console.error('❌ Error fetching positions:', err.message)
//         }
//     }, [])

//     // ✅ Refresh all data
//     const refreshAllData = useCallback(async () => {
//         if (!isMountedRef.current) return

//         try {
//             console.log('🔄 Refreshing all data...')
//             setLoading(true)
//             await Promise.all([fetchDevices(), fetchPositions()])
//             setLastUpdate(new Date())
//             toast.success('🎉 Data refreshed successfully!')
//         } catch (err: any) {
//             console.error('❌ Error refreshing data:', err)
//         } finally {
//             if (isMountedRef.current) {
//                 setLoading(false)
//             }
//         }
//     }, [fetchDevices, fetchPositions])

//     // ✅ Initial data load
//     useEffect(() => {
//         if (!MAPBOX_TOKEN) {
//             toast.error('Mapbox token is missing')
//             return
//         }

//         const initData = async () => {
//             try {
//                 console.log('🚀 Initial data load...')
//                 setLoading(true)
//                 await Promise.all([fetchDevices(), fetchPositions()])
//                 setLastUpdate(new Date())
//             } catch (err: any) {
//                 console.error('❌ Error initializing:', err)
//             } finally {
//                 if (isMountedRef.current) {
//                     setLoading(false)
//                 }
//             }
//         }

//         initData()
//     }, [fetchDevices, fetchPositions])

//     // ✅ Position updates every 3 seconds
//     useEffect(() => {
//         if (intervalRef.current) {
//             clearInterval(intervalRef.current)
//         }

//         if (isLiveTracking) {
//             intervalRef.current = setInterval(() => {
//                 if (isMountedRef.current && isLiveTracking) {
//                     fetchPositions()
//                     setLastUpdate(new Date())
//                 }
//             }, 3000)

//             console.log('🔄 Live tracking started (3s interval)')
//         } else {
//             console.log('⏸️ Live tracking paused')
//         }

//         return () => {
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current)
//                 intervalRef.current = null
//             }
//         }
//     }, [isLiveTracking, fetchPositions])

//     // ✅ Auto-refresh every 10 seconds
//     useEffect(() => {
//         if (!isLiveTracking) return

//         const autoRefreshTimer = setInterval(() => {
//             if (isMountedRef.current && isLiveTracking) {
//                 refreshAllData()
//             }
//         }, 10000)

//         console.log('🔄 Auto-refresh started (10s interval)')

//         return () => {
//             clearInterval(autoRefreshTimer)
//             console.log('⏸️ Auto-refresh stopped')
//         }
//     }, [isLiveTracking, refreshAllData])

//     // ✅ Auto-focus on search result
//     useEffect(() => {
//         const filteredDevices = getFilteredDevices()
//         const devicesWithLocation = filteredDevices.filter(d => d.latestPosition)

//         if (searchQuery && devicesWithLocation.length === 1) {
//             const device = devicesWithLocation[0]
//             flyToDevice(device, false)
//             setFocusedDevice(device.id)
//         } else if (!searchQuery) {
//             setFocusedDevice(null)
//         }
//     }, [searchQuery, devices])

//     const getDeviceStatus = useCallback((device: Device) => {
//         if (!device.isActive || !device.bus?.isActive) return 'inactive'
//         if (!device.latestPosition) return 'offline'

//         const now = new Date()
//         const lastUpdate = new Date(device.lastSeen)
//         const minutesAgo = (now.getTime() - lastUpdate.getTime()) / (1000 * 60)

//         if (minutesAgo <= 5) return 'online'
//         if (minutesAgo <= 15) return 'stale'
//         return 'offline'
//     }, [])

//     const getMarkerColor = useCallback((status: string) => {
//         switch (status) {
//             case 'online': return 'bg-emerald-400 shadow-emerald-300/60'
//             case 'stale': return 'bg-amber-400 shadow-amber-300/60'
//             case 'offline': return 'bg-rose-400 shadow-rose-300/60'
//             case 'inactive': return 'bg-slate-300 shadow-slate-200/60'
//             default: return 'bg-slate-300 shadow-slate-200/60'
//         }
//     }, [])

//     const getStatusColor = useCallback((status: string) => {
//         switch (status) {
//             case 'online': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
//             case 'stale': return 'text-amber-600 bg-amber-50 border-amber-200'
//             case 'offline': return 'text-rose-600 bg-rose-50 border-rose-200'
//             case 'inactive': return 'text-slate-600 bg-slate-50 border-slate-200'
//             default: return 'text-slate-600 bg-slate-50 border-slate-200'
//         }
//     }, [])

//     const formatTimeAgo = useCallback((timestamp: string) => {
//         const now = new Date()
//         const then = new Date(timestamp)
//         const diffMs = now.getTime() - then.getTime()
//         const diffMins = Math.floor(diffMs / (1000 * 60))

//         if (diffMins < 1) return 'Just now'
//         if (diffMins < 60) return `${diffMins}m ago`
//         if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
//         return `${Math.floor(diffMins / 1440)}d ago`
//     }, [])

//     const getFilteredDevices = useCallback(() => {
//         const activeDevices = devices.filter(d => d.latestPosition && d.isActive && d.bus?.isActive)
//         console.log('📊 Active devices with locations:', activeDevices.length)

//         if (!searchQuery.trim()) {
//             return activeDevices
//         }

//         return activeDevices.filter(device => {
//             const busNumber = device.bus?.busNumber?.toLowerCase() || ''
//             const deviceName = device.name?.toLowerCase() || ''
//             const deviceId = device.deviceId?.toLowerCase() || ''
//             const search = searchQuery.toLowerCase()

//             return busNumber.includes(search) || deviceName.includes(search) || deviceId.includes(search)
//         })
//     }, [devices, searchQuery])

//     const flyToDevice = useCallback((device: Device, showToast: boolean = true) => {
//         if (device.latestPosition && device.latestPosition.latitude && device.latestPosition.longitude) {
//             const { latitude, longitude } = device.latestPosition
//             setViewState(prevState => ({
//                 ...prevState,
//                 longitude,
//                 latitude,
//                 zoom: 16,
//                 transitionDuration: 1500,
//             }))
//             setSelectedDevice(device)
//             setSelectedBus(device.id)
//             setFocusedDevice(device.id)
//             if (showToast) toast.success(`🎯 Focused on ${device.bus?.busNumber || device.name}`)
//         } else {
//             toast.error(`${device.bus?.busNumber || device.name} has no location data`)
//         }
//     }, [])

//     const onMarkerClick = useCallback((device: Device) => {
//         setSelectedDevice(device)
//         setSelectedBus(device.id)
//         flyToDevice(device, false)
//     }, [flyToDevice])

//     const fitBounds = useCallback(() => {
//         const devicesWithLocation = devices.filter(device =>
//             device.latestPosition && device.latestPosition.latitude && device.latestPosition.longitude &&
//             device.isActive && device.bus?.isActive
//         )

//         if (devicesWithLocation.length === 0) {
//             toast.error('No active buses to display')
//             return
//         }

//         if (devicesWithLocation.length === 1) {
//             flyToDevice(devicesWithLocation[0], false)
//         } else {
//             const latitudes = devicesWithLocation.map(d => d.latestPosition!.latitude)
//             const longitudes = devicesWithLocation.map(d => d.latestPosition!.longitude)

//             const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length
//             const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length

//             setViewState(prevState => ({
//                 ...prevState,
//                 longitude: centerLng,
//                 latitude: centerLat,
//                 zoom: 12,
//                 transitionDuration: 1000,
//             }))
//         }

//         toast.success('📍 Showing all buses')
//     }, [devices, flyToDevice])

//     const clearSearch = useCallback(() => {
//         setSearchQuery('')
//         setFocusedDevice(null)
//         setSelectedDevice(null)
//         setSelectedBus(null)
//         fitBounds()
//     }, [fitBounds])

//     const liveStats = React.useMemo(() => {
//         const now = new Date()
//         const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

//         const onlineBuses = devices.filter(device =>
//             device.isActive && device.bus?.isActive && device.latestPosition &&
//             new Date(device.lastSeen) > fiveMinutesAgo
//         ).length

//         return {
//             totalBuses: devices.filter(d => d.latestPosition && d.isActive && d.bus?.isActive).length,
//             onlineBuses,
//             recentPositions: positions.length
//         }
//     }, [devices, positions])

//     const mapStyles = [
//         { id: "mapbox://styles/mapbox/streets-v12", name: "Streets", icon: MapIcon },
//         { id: "mapbox://styles/mapbox/satellite-streets-v12", name: "Satellite", icon: Layers },
//         { id: "mapbox://styles/mapbox/dark-v11", name: "Dark", icon: Eye },
//         { id: "mapbox://styles/mapbox/light-v11", name: "Light", icon: EyeOff }
//     ]

//     if (!MAPBOX_TOKEN) {
//         return (
//             <Card className="border-0 shadow-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
//                 <CardContent className="flex items-center justify-center py-24">
//                     <div className="flex flex-col items-center gap-6 text-center max-w-md">
//                         <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center text-3xl shadow-2xl">
//                             🗝️
//                         </div>
//                         <div className="space-y-4">
//                             <h3 className="text-2xl font-bold text-slate-800">Mapbox Token Required</h3>
//                             <p className="text-slate-600 leading-relaxed">
//                                 Please add your Mapbox access token to enable live tracking map
//                             </p>
//                             <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-purple-200">
//                                 <code className="text-sm text-slate-700 font-mono">
//                                     NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
//                                 </code>
//                             </div>
//                             <Button
//                                 onClick={() => window.open('https://account.mapbox.com/access-tokens/', '_blank')}
//                                 className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-full shadow-lg"
//                             >
//                                 Get Mapbox Token
//                             </Button>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         )
//     }

//     const filteredDevices = getFilteredDevices()
//     console.log('🗺️ Rendering map with', filteredDevices.length, 'filtered devices')

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
//             <div className="container mx-auto p-6 space-y-6">
//                 {/* User Greeting */}
//                 {user && (
//                     <div className="flex justify-center">
//                         <div className="px-4 py-2 bg-white/40 backdrop-blur-xl rounded-full shadow-lg border border-white/50">
//                             <p className="text-sm text-slate-700">
//                                 Welcome back, <span className="font-bold text-purple-600">{user.name || user.email}</span>! 👋
//                             </p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Cute Header */}
//                 <div className="text-center space-y-4">
//                     <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40">
//                         <div className="p-3 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-2xl shadow-lg">
//                             <Bus className="h-7 w-7 text-white" />
//                         </div>
//                         <div className="text-left">
//                             <h1 className="text-3xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
//                                 Track Your Bus
//                                 <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
//                             </h1>
//                             <p className="text-sm text-slate-600 font-medium">Real-time GPS tracking • Made with <Heart className="h-3 w-3 inline text-pink-500 fill-pink-500" /></p>
//                         </div>
//                     </div>

//                     {/* Search Bar */}
//                     <Card className="border-0 shadow-2xl bg-white/60 backdrop-blur-xl">
//                         <CardContent className="p-6">
//                             <div className="flex gap-3">
//                                 <div className="relative flex-1">
//                                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
//                                     <Input
//                                         type="text"
//                                         placeholder="🔍 Search by bus number (e.g., NB-1234)..."
//                                         value={searchQuery}
//                                         onChange={(e) => setSearchQuery(e.target.value)}
//                                         className="pl-12 h-14 text-base border-2 border-purple-200 focus:border-purple-400 rounded-2xl bg-white/80 backdrop-blur-sm"
//                                     />
//                                     {searchQuery && (
//                                         <Button
//                                             onClick={clearSearch}
//                                             size="icon"
//                                             variant="ghost"
//                                             className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-purple-100"
//                                         >
//                                             <X className="h-4 w-4 text-purple-600" />
//                                         </Button>
//                                     )}
//                                 </div>
//                                 <Button
//                                     onClick={refreshAllData}
//                                     disabled={loading}
//                                     className="h-14 px-8 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 rounded-2xl shadow-lg text-white font-semibold"
//                                 >
//                                     <RefreshCw className={cn("h-5 w-5 mr-2", loading && "animate-spin")} />
//                                     Refresh
//                                 </Button>
//                             </div>
//                             {searchQuery && filteredDevices.length > 0 && (
//                                 <p className="text-sm text-purple-600 mt-3 font-medium">
//                                     ✨ Found {filteredDevices.length} bus{filteredDevices.length !== 1 ? 'es' : ''}
//                                 </p>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Cute Stats */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <CuteStatsCard
//                         title="Active Buses"
//                         value={liveStats.totalBuses}
//                         icon={Bus}
//                         gradient="from-pink-400 to-rose-400"
//                         bgGradient="from-pink-50/80 to-rose-50/80"
//                     />
//                     <CuteStatsCard
//                         title="Online Now"
//                         value={liveStats.onlineBuses}
//                         icon={Wifi}
//                         gradient="from-emerald-400 to-green-400"
//                         bgGradient="from-emerald-50/80 to-green-50/80"
//                     />
//                     <CuteStatsCard
//                         title="Live Tracking"
//                         value={isLiveTracking ? '🟢 Active' : '⏸️ Paused'}
//                         icon={Radio}
//                         gradient="from-purple-400 to-blue-400"
//                         bgGradient="from-purple-50/80 to-blue-50/80"
//                         isText={true}
//                     />
//                 </div>

//                 {/* Error Banner */}
//                 {error && (
//                     <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm shadow-lg">
//                         <CardContent className="py-4">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2 bg-amber-100 rounded-xl">
//                                         <AlertCircle className="h-5 w-5 text-amber-600" />
//                                     </div>
//                                     <div>
//                                         <p className="font-semibold text-amber-800">Connection Issue</p>
//                                         <p className="text-sm text-amber-700">{error}</p>
//                                     </div>
//                                 </div>
//                                 <Button
//                                     onClick={refreshAllData}
//                                     size="sm"
//                                     className="bg-amber-400 hover:bg-amber-500 text-white rounded-full"
//                                 >
//                                     <RefreshCw className="h-4 w-4 mr-2" />
//                                     Retry
//                                 </Button>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 )}

//                 {/* Map & List */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                     {/* Compact Map - Super Rounded */}
//                     <Card className="lg:col-span-2 border-0 shadow-2xl overflow-hidden rounded-3xl">
//                         <CardContent className="p-0">
//                             <div className="relative h-[480px] w-full rounded-3xl overflow-hidden">
//                                 {mounted && (
//                                     <Map
//                                         {...viewState}
//                                         onMove={evt => setViewState(evt.viewState)}
//                                         mapboxAccessToken={MAPBOX_TOKEN}
//                                         mapStyle={mapStyle}
//                                         style={{ width: '100%', height: '100%' }}
//                                     >
//                                         <NavigationControl position="top-right" />
//                                         <FullscreenControl position="top-right" />

//                                         {/* Compact Map Controls */}
//                                         <div className="absolute top-3 left-3 z-10">
//                                             <Button
//                                                 onClick={fitBounds}
//                                                 size="sm"
//                                                 className="bg-white/90 backdrop-blur-sm text-purple-700 hover:bg-white shadow-xl rounded-full font-semibold"
//                                             >
//                                                 <Target className="h-4 w-4 mr-2" />
//                                                 Show All
//                                             </Button>
//                                         </div>

//                                         {/* Compact Map Style Selector */}
//                                         <div className="absolute bottom-3 left-3 z-10 flex gap-2">
//                                             {mapStyles.map(style => (
//                                                 <Button
//                                                     key={style.id}
//                                                     onClick={() => setMapStyle(style.id)}
//                                                     size="sm"
//                                                     className={cn(
//                                                         "bg-white/90 backdrop-blur-sm rounded-full text-xs shadow-lg h-9 px-3",
//                                                         mapStyle === style.id
//                                                             ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
//                                                             : "text-slate-700 hover:bg-white"
//                                                     )}
//                                                 >
//                                                     <style.icon className="h-3.5 w-3.5 mr-1.5" />
//                                                     {style.name}
//                                                 </Button>
//                                             ))}
//                                         </div>

//                                         {/* Cute Bus Markers */}
//                                         {filteredDevices.map(device => {
//                                             if (!device.latestPosition) return null
//                                             const status = getDeviceStatus(device)
//                                             const color = getMarkerColor(status)

//                                             return (
//                                                 <Marker
//                                                     key={device.id}
//                                                     longitude={device.latestPosition.longitude}
//                                                     latitude={device.latestPosition.latitude}
//                                                     onClick={() => onMarkerClick(device)}
//                                                 >
//                                                     <div className={cn(
//                                                         "w-11 h-11 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transform hover:scale-125 transition-all",
//                                                         color,
//                                                         focusedDevice === device.id && "ring-4 ring-purple-400 animate-pulse"
//                                                     )}>
//                                                         <Bus className="h-5 w-5 text-white" />
//                                                     </div>
//                                                 </Marker>
//                                             )
//                                         })}

//                                         {/* Cute Popup */}
//                                         {selectedDevice && selectedDevice.latestPosition && (
//                                             <Popup
//                                                 longitude={selectedDevice.latestPosition.longitude}
//                                                 latitude={selectedDevice.latestPosition.latitude}
//                                                 onClose={() => {
//                                                     setSelectedDevice(null)
//                                                     setSelectedBus(null)
//                                                 }}
//                                                 closeButton={true}
//                                                 closeOnClick={false}
//                                             >
//                                                 <div className="p-3">
//                                                     <h3 className="font-bold text-base mb-2">{selectedDevice.bus?.busNumber || selectedDevice.name}</h3>
//                                                     <Badge className={cn("mb-2 text-xs", getStatusColor(getDeviceStatus(selectedDevice)))}>
//                                                         {getDeviceStatus(selectedDevice).toUpperCase()}
//                                                     </Badge>
//                                                     <Separator className="my-2" />
//                                                     <div className="space-y-1.5 text-sm">
//                                                         <p className="flex items-center gap-2 text-slate-600">
//                                                             <Gauge className="h-4 w-4 text-purple-500" />
//                                                             Speed: {selectedDevice.latestPosition.speed || 0} km/h
//                                                         </p>
//                                                         <p className="flex items-center gap-2 text-slate-600">
//                                                             <MapPin className="h-4 w-4 text-pink-500" />
//                                                             {selectedDevice.latestPosition.latitude.toFixed(4)}, {selectedDevice.latestPosition.longitude.toFixed(4)}
//                                                         </p>
//                                                         <p className="flex items-center gap-2 text-slate-600">
//                                                             <Clock className="h-4 w-4 text-blue-500" />
//                                                             {formatTimeAgo(selectedDevice.lastSeen)}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </Popup>
//                                         )}
//                                     </Map>
//                                 )}
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Compact Bus List - Super Rounded */}
//                     <Card className="border-0 shadow-2xl bg-white/50 backdrop-blur-2xl rounded-3xl">
//                         <CardHeader className="p-4 pb-3">
//                             <CardTitle className="flex items-center gap-2 text-purple-700 text-base">
//                                 <Bus className="h-5 w-5" />
//                                 Active Buses ({filteredDevices.length})
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-4 pt-0">
//                             <ScrollArea className="h-[400px] pr-3">
//                                 {loading && devices.length === 0 ? (
//                                     <div className="text-center py-10">
//                                         <Loader2 className="h-9 w-9 animate-spin text-purple-500 mx-auto mb-2" />
//                                         <p className="text-sm text-slate-600 font-medium">Loading buses...</p>
//                                     </div>
//                                 ) : filteredDevices.length === 0 ? (
//                                     <div className="text-center py-10">
//                                         <Bus className="h-14 w-14 text-purple-200 mx-auto mb-2" />
//                                         <p className="text-sm text-slate-600 font-medium">
//                                             {searchQuery ? 'No buses found' : 'No active buses'}
//                                         </p>
//                                         {searchQuery && (
//                                             <Button
//                                                 onClick={clearSearch}
//                                                 size="sm"
//                                                 variant="outline"
//                                                 className="mt-3 rounded-full"
//                                             >
//                                                 Clear Search
//                                             </Button>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <div className="space-y-2.5">
//                                         {filteredDevices.map(device => {
//                                             const status = getDeviceStatus(device)
//                                             const isFocused = focusedDevice === device.id

//                                             return (
//                                                 <div
//                                                     key={device.id}
//                                                     onClick={() => flyToDevice(device)}
//                                                     className={cn(
//                                                         "p-3.5 rounded-2xl cursor-pointer transition-all hover:scale-105",
//                                                         isFocused
//                                                             ? "bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-xl ring-4 ring-purple-200"
//                                                             : "bg-white/70 backdrop-blur-sm hover:bg-white/90 shadow-lg"
//                                                     )}
//                                                 >
//                                                     <div className="flex items-center justify-between">
//                                                         <div>
//                                                             <p className={cn(
//                                                                 "font-bold text-base",
//                                                                 isFocused ? "text-white" : "text-slate-800"
//                                                             )}>
//                                                                 {device.bus?.busNumber || device.name}
//                                                             </p>
//                                                             <p className={cn(
//                                                                 "text-xs mt-1",
//                                                                 isFocused ? "text-white/90" : "text-slate-600"
//                                                             )}>
//                                                                 {device.bus?.busType} • {device.latestPosition?.speed || 0} km/h
//                                                             </p>
//                                                         </div>
//                                                         <Badge className={cn(
//                                                             "text-xs font-semibold px-2 py-0.5",
//                                                             isFocused
//                                                                 ? "bg-white/30 text-white border-white/40"
//                                                                 : getStatusColor(status)
//                                                         )}>
//                                                             {status.toUpperCase()}
//                                                         </Badge>
//                                                     </div>
//                                                     {device.latestPosition && (
//                                                         <p className={cn(
//                                                             "text-xs mt-2 flex items-center gap-1",
//                                                             isFocused ? "text-white/80" : "text-slate-500"
//                                                         )}>
//                                                             <Clock className="h-3.5 w-3.5" />
//                                                             {formatTimeAgo(device.lastSeen)}
//                                                         </p>
//                                                     )}
//                                                 </div>
//                                             )
//                                         })}
//                                     </div>
//                                 )}
//                             </ScrollArea>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }

// interface CuteStatsCardProps {
//     title: string
//     value: string | number
//     icon: React.ComponentType<{ className?: string }>
//     gradient: string
//     bgGradient: string
//     isText?: boolean
// }

// function CuteStatsCard({ title, value, icon: Icon, gradient, bgGradient, isText = false }: CuteStatsCardProps) {
//     return (
//         <Card className={cn("border-0 shadow-xl bg-gradient-to-br backdrop-blur-sm", bgGradient, "hover:shadow-2xl transition-all duration-300 hover:scale-105 group")}>
//             <CardContent className="p-6">
//                 <div className="flex items-center space-x-4">
//                     <div className={cn("p-4 rounded-2xl bg-gradient-to-br shadow-2xl group-hover:shadow-xl transition-all duration-300", gradient)}>
//                         <Icon className="h-7 w-7 text-white" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                         <p className={cn(
//                             "font-black text-slate-800 group-hover:text-slate-900 transition-colors",
//                             isText ? "text-xl" : "text-3xl"
//                         )}>
//                             {typeof value === 'number' ? value.toLocaleString() : value}
//                         </p>
//                         <p className="text-sm text-slate-600 font-semibold">{title}</p>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }
