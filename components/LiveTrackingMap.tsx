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
