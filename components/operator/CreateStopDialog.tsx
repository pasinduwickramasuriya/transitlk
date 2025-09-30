'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Save, Loader2, Map } from 'lucide-react'

interface CreateStopDialogProps {
    operatorId: string
    children: React.ReactNode
}

interface RouteOption {
    id: string
    routeNumber: string
    startLocation: string
    endLocation: string
}

export function CreateStopDialog({ operatorId, children }: CreateStopDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [routes, setRoutes] = useState<RouteOption[]>([])
    const [formData, setFormData] = useState({
        name: '',
        latitude: '',
        longitude: '',
        order: '',
        routeId: ''
    })

    // Fetch available routes
    const fetchRoutes = useCallback(async () => {
        try {
            const response = await fetch('/api/operator/routes?limit=100')
            if (response.ok) {
                const data = await response.json()
                setRoutes(data.routes || [])
            }
        } catch (error) {
            console.error('Error fetching routes:', error)
        }
    }, [])

    useEffect(() => {
        if (open) {
            fetchRoutes()
        }
    }, [open, fetchRoutes])

    const handleSubmit = useCallback(async () => {
        if (!formData.name || !formData.routeId || !formData.latitude || !formData.longitude) {
            alert('Stop name, route, latitude, and longitude are required')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/operator/stops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                    order: formData.order ? parseInt(formData.order) : undefined,
                    routeId: formData.routeId
                })
            })

            if (response.ok) {
                setOpen(false)
                setFormData({
                    name: '',
                    latitude: '',
                    longitude: '',
                    order: '',
                    routeId: ''
                })
                alert('✅ Stop created successfully!')
                window.location.reload()
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create stop')
            }
        } catch (error) {
            console.error('❌ Error creating stop:', error)
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to create stop'}`)
        } finally {
            setLoading(false)
        }
    }, [formData])

    // Get current location
    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    }))
                },
                (error) => {
                    console.error('Error getting location:', error)
                    alert('Unable to get your location. Please enter coordinates manually.')
                }
            )
        } else {
            alert('Geolocation is not supported by this browser.')
        }
    }, [])

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {children}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-purple-600" />
                            <span>Add New Stop</span>
                        </DialogTitle>
                        <DialogDescription>
                            Add a new stop to one of your routes with GPS coordinates
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="route">Route *</Label>
                            <Select
                                value={formData.routeId}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, routeId: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a route" />
                                </SelectTrigger>
                                <SelectContent>
                                    {routes.map((route) => (
                                        <SelectItem key={route.id} value={route.id}>
                                            {route.routeNumber} - {route.startLocation} → {route.endLocation}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stopName">Stop Name *</Label>
                            <Input
                                id="stopName"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., Central Bus Station"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="latitude">Latitude *</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="0.000001"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                                    placeholder="6.927079"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude">Longitude *</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="0.000001"
                                    value={formData.longitude}
                                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                                    placeholder="79.861243"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation}>
                                <Map className="h-4 w-4 mr-2" />
                                Use Current Location
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="order">Stop Order</Label>
                            <Input
                                id="order"
                                type="number"
                                min="1"
                                value={formData.order}
                                onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                                placeholder="Order in route (auto-assigned if empty)"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Create Stop
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
