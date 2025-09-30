'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Calendar,
    MoreHorizontal,
    Edit,
    Trash2,
    Plus,
    Save,
    Clock,
    Loader2,
    RefreshCcw,
    AlertTriangle,
    Activity,
    Bus,
    Route
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '../ui/checkbok'

// ✅ TYPES FOR SCHEDULES
interface Schedule {
    id: string
    routeId: string
    busId: string
    departureTime: string
    arrivalTime: string
    frequency?: number | null
    isActive: boolean
    createdAt: string
    updatedAt: string
    route: {
        id: string
        routeNumber: string
        startLocation: string
        endLocation: string
    }
    bus: {
        id: string
        busNumber: string
        capacity: number
        busType: string
    }
    _count: {
        bookings: number
    }
}

interface SchedulesData {
    schedules: Schedule[]
    total: number
    totalPages: number
    currentPage: number
}

interface ScheduleFormData {
    routeId: string
    busId: string
    departureTime: string
    arrivalTime: string
    frequency?: number
    isActive: boolean
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

export function SchedulesTable() {
    // ✅ STATE MANAGEMENT
    const [schedulesData, setSchedulesData] = useState<SchedulesData | null>(null)
    const [routes, setRoutes] = useState<RouteOption[]>([])
    const [buses, setBuses] = useState<BusOption[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    
    // Dialog states
    const [createDialog, setCreateDialog] = useState(false)
    const [editDialog, setEditDialog] = useState<{ open: boolean; schedule: Schedule | null }>({
        open: false,
        schedule: null
    })
    
    // Form states
    const [createForm, setCreateForm] = useState<ScheduleFormData>({
        routeId: '',
        busId: '',
        departureTime: '',
        arrivalTime: '',
        frequency: undefined,
        isActive: true
    })
    const [editForm, setEditForm] = useState<ScheduleFormData>({
        routeId: '',
        busId: '',
        departureTime: '',
        arrivalTime: '',
        frequency: undefined,
        isActive: true
    })

    const router = useRouter()
    const searchParams = useSearchParams()

    // ✅ FETCH SCHEDULES DATA
    const fetchSchedulesData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const queryParams = new URLSearchParams({
                page: searchParams.get('page') || '1',
                limit: '10',
                search: searchParams.get('search') || '',
                routeId: searchParams.get('routeId') || '',
                busId: searchParams.get('busId') || '',
                status: searchParams.get('status') || 'all'
            })

            const response = await fetch(`/api/operator/schedules?${queryParams}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch schedules`)
            }

            const data = await response.json()
            setSchedulesData(data)
        } catch (err) {
            console.error('❌ Error fetching schedules:', err)
            setError(err instanceof Error ? err.message : 'Failed to load schedules')
        } finally {
            setLoading(false)
        }
    }, [searchParams])

    // ✅ FETCH ROUTES AND BUSES
    const fetchRoutesAndBuses = useCallback(async () => {
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
            console.error('❌ Error fetching routes and buses:', error)
        }
    }, [])

    useEffect(() => {
        fetchSchedulesData()
        fetchRoutesAndBuses()
    }, [fetchSchedulesData, fetchRoutesAndBuses])

    // ✅ UTILITY FUNCTIONS
    const formatTime = useCallback((timeString: string): string => {
        try {
            const [hours, minutes] = timeString.split(':')
            const hour = parseInt(hours, 10)
            const minute = parseInt(minutes, 10)
            const period = hour >= 12 ? 'PM' : 'AM'
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
            return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
        } catch {
            return timeString
        }
    }, [])

    const calculateDuration = useCallback((departure: string, arrival: string): string => {
        try {
            const [depHours, depMinutes] = departure.split(':').map(Number)
            const [arrHours, arrMinutes] = arrival.split(':').map(Number)
            
            let durationMinutes = (arrHours * 60 + arrMinutes) - (depHours * 60 + depMinutes)
            
            if (durationMinutes < 0) {
                durationMinutes += 24 * 60 // Next day arrival
            }
            
            const hours = Math.floor(durationMinutes / 60)
            const minutes = durationMinutes % 60
            
            return `${hours}h ${minutes}m`
        } catch {
            return 'N/A'
        }
    }, [])

    // ✅ CREATE SCHEDULE
    const handleCreateSchedule = useCallback(async () => {
        if (!createForm.routeId || !createForm.busId || !createForm.departureTime || !createForm.arrivalTime) {
            alert('Route, bus, departure time, and arrival time are required')
            return
        }

        setActionLoading('create')

        try {
            const response = await fetch('/api/operator/schedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createForm)
            })

            if (response.ok) {
                setCreateDialog(false)
                setCreateForm({
                    routeId: '',
                    busId: '',
                    departureTime: '',
                    arrivalTime: '',
                    frequency: undefined,
                    isActive: true
                })
                await fetchSchedulesData()
                alert('✅ Schedule created successfully')
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create schedule')
            }
        } catch (error) {
            console.error('❌ Error creating schedule:', error)
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to create schedule'}`)
        } finally {
            setActionLoading(null)
        }
    }, [createForm, fetchSchedulesData])

    // ✅ UPDATE SCHEDULE
    const handleUpdateSchedule = useCallback(async () => {
        if (!editDialog.schedule || !editForm.departureTime || !editForm.arrivalTime) {
            alert('Departure time and arrival time are required')
            return
        }

        setActionLoading(editDialog.schedule.id)

        try {
            const response = await fetch(`/api/operator/schedules/${editDialog.schedule.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            })

            if (response.ok) {
                setEditDialog({ open: false, schedule: null })
                await fetchSchedulesData()
                alert('✅ Schedule updated successfully')
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update schedule')
            }
        } catch (error) {
            console.error('❌ Error updating schedule:', error)
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to update schedule'}`)
        } finally {
            setActionLoading(null)
        }
    }, [editDialog.schedule, editForm, fetchSchedulesData])

    // ✅ DELETE SCHEDULE
    const handleDeleteSchedule = useCallback(async (schedule: Schedule) => {
        const confirmed = window.confirm(
            `⚠️ DELETE SCHEDULE\n\nRoute: ${schedule.route.routeNumber}\nBus: ${schedule.bus.busNumber}\nDeparture: ${formatTime(schedule.departureTime)}\n\nThis will also cancel all related bookings!\n\nThis action cannot be undone!\n\nClick OK to proceed.`
        )

        if (!confirmed) return

        setActionLoading(schedule.id)

        try {
            const response = await fetch(`/api/operator/schedules/${schedule.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                await fetchSchedulesData()
                alert('✅ Schedule deleted successfully')
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Failed to delete schedule')
            }
        } catch (error) {
            console.error('❌ Error deleting schedule:', error)
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to delete schedule'}`)
        } finally {
            setActionLoading(null)
        }
    }, [fetchSchedulesData, formatTime])

    // ✅ TOGGLE SCHEDULE STATUS
    const toggleScheduleStatus = useCallback(async (schedule: Schedule) => {
        setActionLoading(schedule.id)

        try {
            const response = await fetch(`/api/operator/schedules/${schedule.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !schedule.isActive })
            })

            if (response.ok) {
                await fetchSchedulesData()
                alert(`✅ Schedule ${schedule.isActive ? 'deactivated' : 'activated'} successfully`)
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update schedule status')
            }
        } catch (error) {
            console.error('❌ Error updating schedule status:', error)
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to update schedule status'}`)
        } finally {
            setActionLoading(null)
        }
    }, [fetchSchedulesData])

    // ✅ OPEN EDIT DIALOG
    const openEditDialog = useCallback((schedule: Schedule) => {
        setEditForm({
            routeId: schedule.routeId,
            busId: schedule.busId,
            departureTime: schedule.departureTime,
            arrivalTime: schedule.arrivalTime,
            frequency: schedule.frequency || undefined,
            isActive: schedule.isActive
        })
        setEditDialog({ open: true, schedule })
    }, [])

    // ✅ ERROR STATE
    if (error) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Schedules</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchSchedulesData}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // ✅ LOADING STATE
    if (loading || !schedulesData) {
        return <SchedulesTableSkeleton />
    }

    const { schedules, total, totalPages, currentPage } = schedulesData

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-orange-600" />
                            <span>Schedules Management</span>
                            <Badge variant="secondary">
                                {schedules.length} {schedules.length === 1 ? 'schedule' : 'schedules'}
                                {total > schedules.length && ` of ${total}`}
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button onClick={fetchSchedulesData} variant="outline" size="sm">
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button onClick={() => setCreateDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Schedule
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left p-4 font-medium text-gray-700">Route & Bus</th>
                                    <th className="text-center p-4 font-medium text-gray-700">Schedule</th>
                                    <th className="text-center p-4 font-medium text-gray-700">Frequency</th>
                                    <th className="text-center p-4 font-medium text-gray-700">Bookings</th>
                                    <th className="text-center p-4 font-medium text-gray-700">Status</th>
                                    <th className="text-right p-4 font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((schedule) => (
                                    <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <Route className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-gray-900">
                                                        {schedule.route.routeNumber}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {schedule.route.startLocation} → {schedule.route.endLocation}
                                                </div>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Bus className="h-3 w-3 text-green-600" />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {schedule.bus.busNumber}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {schedule.bus.busType}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="space-y-1">
                                                <div className="font-medium text-gray-900">
                                                    {formatTime(schedule.departureTime)} - {formatTime(schedule.arrivalTime)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Duration: {calculateDuration(schedule.departureTime, schedule.arrivalTime)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {schedule.frequency ? (
                                                <Badge variant="outline">
                                                    Every {schedule.frequency} min
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400 text-sm">One-time</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="font-medium text-gray-900">
                                                {schedule._count.bookings}
                                            </div>
                                            <div className="text-xs text-gray-500">bookings</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Badge
                                                className={cn(
                                                    "cursor-pointer hover:opacity-80 transition-opacity",
                                                    schedule.isActive
                                                        ? "bg-green-100 text-green-800 border-green-200"
                                                        : "bg-red-100 text-red-800 border-red-200"
                                                )}
                                                onClick={() => toggleScheduleStatus(schedule)}
                                                title="Click to toggle status"
                                            >
                                                {schedule.isActive ? (
                                                    <>
                                                        <Activity className="h-3 w-3 mr-1" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        Inactive
                                                    </>
                                                )}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" disabled={actionLoading === schedule.id}>
                                                        {actionLoading === schedule.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(schedule)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Schedule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toggleScheduleStatus(schedule)}>
                                                        <Activity className="mr-2 h-4 w-4" />
                                                        {schedule.isActive ? 'Deactivate' : 'Activate'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDeleteSchedule(schedule)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Schedule
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {schedules.length === 0 && (
                        <div className="text-center py-12 px-4">
                            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
                            <p className="text-gray-500 mb-6">Create schedules to assign buses to routes</p>
                            <Button onClick={() => setCreateDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Schedule
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* CREATE SCHEDULE DIALOG */}
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
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
                                    value={createForm.routeId}
                                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, routeId: value }))}
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
                                <Label htmlFor="bus">Bus *</Label>
                                <Select
                                    value={createForm.busId}
                                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, busId: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a bus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {buses.filter(bus => bus.isActive).map((bus) => (
                                            <SelectItem key={bus.id} value={bus.id}>
                                                {bus.busNumber} - {bus.busType} ({bus.capacity} seats)
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
                                    value={createForm.departureTime}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, departureTime: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="arrivalTime">Arrival Time *</Label>
                                <Input
                                    id="arrivalTime"
                                    type="time"
                                    value={createForm.arrivalTime}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, arrivalTime: e.target.value }))}
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
                                value={createForm.frequency || ''}
                                onChange={(e) => setCreateForm(prev => ({ 
                                    ...prev, 
                                    frequency: e.target.value ? parseInt(e.target.value) : undefined
                                }))}
                                placeholder="e.g., 30 (for every 30 minutes)"
                            />
                            <p className="text-xs text-gray-500">
                                Leave empty for one-time schedule, or set frequency for recurring schedules
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={createForm.isActive}
                                onCheckedChange={(checked: boolean) => setCreateForm(prev => ({ 
                                    ...prev, 
                                    isActive: checked as boolean 
                                }))}
                            />
                            <Label htmlFor="isActive" className="cursor-pointer">
                                Active Schedule
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateSchedule} disabled={actionLoading === 'create'}>
                            {actionLoading === 'create' ? (
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

            {/* EDIT SCHEDULE DIALOG */}
            <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, schedule: null })}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Edit className="h-5 w-5 text-orange-600" />
                            <span>Edit Schedule</span>
                        </DialogTitle>
                        <DialogDescription>
                            Update schedule information
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Current Route</Label>
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <div className="font-medium text-gray-900">
                                        {editDialog.schedule?.route.routeNumber}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {editDialog.schedule?.route.startLocation} → {editDialog.schedule?.route.endLocation}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Current Bus</Label>
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <div className="font-medium text-gray-900">
                                        {editDialog.schedule?.bus.busNumber}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {editDialog.schedule?.bus.busType} - {editDialog.schedule?.bus.capacity} seats
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="editDepartureTime">Departure Time *</Label>
                                <Input
                                    id="editDepartureTime"
                                    type="time"
                                    value={editForm.departureTime}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, departureTime: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editArrivalTime">Arrival Time *</Label>
                                <Input
                                    id="editArrivalTime"
                                    type="time"
                                    value={editForm.arrivalTime}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, arrivalTime: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editFrequency">Frequency (minutes)</Label>
                            <Input
                                id="editFrequency"
                                type="number"
                                min="5"
                                max="1440"
                                value={editForm.frequency || ''}
                                onChange={(e) => setEditForm(prev => ({ 
                                    ...prev, 
                                    frequency: e.target.value ? parseInt(e.target.value) : undefined
                                }))}
                                placeholder="e.g., 30 (for every 30 minutes)"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="editIsActive"
                                checked={editForm.isActive}
                                onCheckedChange={(checked) => setEditForm(prev => ({ 
                                    ...prev, 
                                    isActive: checked as boolean 
                                }))}
                            />
                            <Label htmlFor="editIsActive" className="cursor-pointer">
                                Active Schedule
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialog({ open: false, schedule: null })}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpdateSchedule} 
                            disabled={actionLoading === editDialog.schedule?.id}
                        >
                            {actionLoading === editDialog.schedule?.id ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Update Schedule
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

function SchedulesTableSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-4 p-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
