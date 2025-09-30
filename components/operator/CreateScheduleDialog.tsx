'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Save, Loader2, Route, Bus } from 'lucide-react'
import { Checkbox } from '../ui/checkbok'

interface CreateScheduleDialogProps {
    operatorId: string
    children: React.ReactNode
}

interface RouteOption {
    id: string
    routeNumber: string
    startLocation: string
    endLocation: string
}

interface BusOption {
    id: string
    busNumber: string
    capacity: number
    busType: string
    isActive: boolean
}

export function CreateScheduleDialog({ operatorId, children }: CreateScheduleDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [routes, setRoutes] = useState<RouteOption[]>([])
    const [buses, setBuses] = useState<BusOption[]>([])
    const [formData, setFormData] = useState({
        routeId: '',
        busId: '',
        departureTime: '',
        arrivalTime: '',
        frequency: '',
        isActive: true
    })

    // Fetch routes and buses
    const fetchData = useCallback(async () => {
        try {
            const [routesResponse, busesResponse] = await Promise.all([
                fetch('/api/operator/routes?limit=100'),
                fetch('/api/operator/buses?limit=100')
            ])

            if (routesResponse.ok) {
                const routesData = await routesResponse.json()
                setRoutes(routesData.routes || [])
            }

            if (busesResponse.ok) {
                const busesData = await busesResponse.json()
                setBuses(busesData.buses || [])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }, [])

    useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open, fetchData])

    const handleSubmit = useCallback(async () => {
        if (!formData.routeId || !formData.busId || !formData.departureTime || !formData.arrivalTime) {
            alert('Route, bus, departure time, and arrival time are required')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/operator/schedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    routeId: formData.routeId,
                    busId: formData.busId,
                    departureTime: formData.departureTime,
                    arrivalTime: formData.arrivalTime,
                    frequency: formData.frequency ? parseInt(formData.frequency) : undefined,
                    isActive: formData.isActive
                })
            })

            if (response.ok) {
                setOpen(false)
                setFormData({
                    routeId: '',
                    busId: '',
                    departureTime: '',
                    arrivalTime: '',
                    frequency: '',
                    isActive: true
                })
                alert('✅ Schedule created successfully!')
                window.location.reload()
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create schedule')
            }
        } catch (error) {
            console.error('❌ Error creating schedule:', error)
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to create schedule'}`)
        } finally {
            setLoading(false)
        }
    }, [formData])

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {children}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-orange-600" />
                            <span>Add New Schedule</span>
                        </DialogTitle>
                        <DialogDescription>
                            Create a new schedule by assigning a bus to a route with specific times
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                                <div className="flex items-center">
                                                    <Route className="w-4 h-4 mr-2 text-blue-600" />
                                                    {route.routeNumber} - {route.startLocation} → {route.endLocation}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bus">Bus *</Label>
                                <Select
                                    value={formData.busId}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, busId: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a bus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {buses.filter(bus => bus.isActive).map((bus) => (
                                            <SelectItem key={bus.id} value={bus.id}>
                                                <div className="flex items-center">
                                                    <Bus className="w-4 h-4 mr-2 text-green-600" />
                                                    {bus.busNumber} - {bus.busType} ({bus.capacity} seats)
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="departureTime">Departure Time *</Label>
                                <Input
                                    id="departureTime"
                                    type="time"
                                    value={formData.departureTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="arrivalTime">Arrival Time *</Label>
                                <Input
                                    id="arrivalTime"
                                    type="time"
                                    value={formData.arrivalTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, arrivalTime: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="frequency">Frequency (minutes)</Label>
                            <Input
                                id="frequency"
                                type="number"
                                min="5"
                                max="1440"
                                value={formData.frequency}
                                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                                placeholder="e.g., 30 (for every 30 minutes)"
                            />
                            <p className="text-xs text-gray-500">
                                Leave empty for one-time schedule, or set frequency for recurring schedules
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
                            />
                            <Label htmlFor="isActive" className="cursor-pointer">
                                Active Schedule
                            </Label>
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
                                    Create Schedule
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
