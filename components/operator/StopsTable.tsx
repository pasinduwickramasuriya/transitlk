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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    MapPin,
    MoreHorizontal,
    Edit,
    Trash2,
    Plus,
    Save,
    X,
    Loader2,
    RefreshCcw,
    Navigation,
    AlertTriangle,
    Map
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ✅ TYPES FOR STOPS
interface Stop {
    id: string
    name: string
    latitude: number
    longitude: number
    order: number
    routeId: string
    createdAt: string
    route: {
        id: string
        routeNumber: string
        startLocation: string
        endLocation: string
    }
}

interface StopsData {
    stops: Stop[]
    total: number
    totalPages: number
    currentPage: number
}

interface StopFormData {
    name: string
    latitude: number
    longitude: number
    order: number
    routeId: string
}

interface RouteOption {
    id: string
    routeNumber: string
    startLocation: string
    endLocation: string
}

export function StopsTable() {
    // ✅ STATE MANAGEMENT
    const [stopsData, setStopsData] = useState<StopsData | null>(null)
    const [routes, setRoutes] = useState<RouteOption[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    
    // Dialog states
    const [createDialog, setCreateDialog] = useState(false)
    const [editDialog, setEditDialog] = useState<{ open: boolean; stop: Stop | null }>({
        open: false,
        stop: null
    })
    
    // Form states
    const [createForm, setCreateForm] = useState<StopFormData>({
        name: '',
        latitude: 0,
        longitude: 0,
        order: 1,
        routeId: ''
    })
    const [editForm, setEditForm] = useState<StopFormData>({
        name: '',
        latitude: 0,
        longitude: 0,
        order: 1,
        routeId: ''
    })

    const router = useRouter()
    const searchParams = useSearchParams()

    // ✅ FETCH STOPS DATA
    const fetchStopsData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const queryParams = new URLSearchParams({
                page: searchParams.get('page') || '1',
                limit: '10',
                search: searchParams.get('search') || '',
                routeId: searchParams.get('routeId') || ''
            })

            const response = await fetch(`/api/operator/stops?${queryParams}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch stops`)
            }

            const data = await response.json()
            setStopsData(data)
        } catch (err) {
            console.error('❌ Error fetching stops:', err)
            setError(err instanceof Error ? err.message : 'Failed to load stops')
        } finally {
            setLoading(false)
        }
    }, [searchParams])

    // ✅ FETCH AVAILABLE ROUTES
    const fetchRoutes = useCallback(async () => {
        try {
            const response = await fetch('/api/operator/routes?limit=100', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            if (response.ok) {
                const data = await response.json()
                setRoutes(data.routes || [])
            }
        } catch (error) {
            console.error('❌ Error fetching routes:', error)
        }
    }, [])

    useEffect(() => {
        fetchStopsData()
        fetchRoutes()
    }, [fetchStopsData, fetchRoutes])

    // ✅ CREATE STOP
    const handleCreateStop = useCallback(async () => {
        if (!createForm.name.trim() || !createForm.routeId) {
            alert('Stop name and route are required')
            return
        }

        setActionLoading('create')

        try {
            const response = await fetch('/api/operator/stops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createForm)
            })

            if (response.ok) {
                setCreateDialog(false)
                setCreateForm({
                    name: '',
                    latitude: 0,
                    longitude: 0,
                    order: 1,
                    routeId: ''
                })
                await fetchStopsData()
                alert('✅ Stop created successfully')
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create stop')
            }
        } catch (error) {
            console.error('❌ Error creating stop:', error)
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to create stop'}`)
        } finally {
            setActionLoading(null)
        }
    }, [createForm, fetchStopsData])

    // ✅ UPDATE STOP
    const handleUpdateStop = useCallback(async () => {
        if (!editDialog.stop || !editForm.name.trim()) {
            alert('Stop name is required')
            return
        }

        setActionLoading(editDialog.stop.id)

        try {
            const response = await fetch(`/api/operator/stops/${editDialog.stop.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            })

            if (response.ok) {
                setEditDialog({ open: false, stop: null })
                await fetchStopsData()
                alert('✅ Stop updated successfully')
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update stop')
            }
        } catch (error) {
            console.error('❌ Error updating stop:', error)
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to update stop'}`)
        } finally {
            setActionLoading(null)
        }
    }, [editDialog.stop, editForm, fetchStopsData])

    // ✅ DELETE STOP
    const handleDeleteStop = useCallback(async (stop: Stop) => {
        const confirmed = window.confirm(
            `⚠️ DELETE STOP "${stop.name}"\n\nThis action cannot be undone!\n\nClick OK to proceed.`
        )

        if (!confirmed) return

        setActionLoading(stop.id)

        try {
            const response = await fetch(`/api/operator/stops/${stop.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                await fetchStopsData()
                alert('✅ Stop deleted successfully')
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Failed to delete stop')
            }
        } catch (error) {
            console.error('❌ Error deleting stop:', error)
            alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to delete stop'}`)
        } finally {
            setActionLoading(null)
        }
    }, [fetchStopsData])

    // ✅ OPEN EDIT DIALOG
    const openEditDialog = useCallback((stop: Stop) => {
        setEditForm({
            name: stop.name,
            latitude: stop.latitude,
            longitude: stop.longitude,
            order: stop.order,
            routeId: stop.routeId
        })
        setEditDialog({ open: true, stop })
    }, [])

    // ✅ ERROR STATE
    if (error) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Stops</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchStopsData}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // ✅ LOADING STATE
    if (loading || !stopsData) {
        return <StopsTableSkeleton />
    }

    const { stops, total, totalPages, currentPage } = stopsData

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-purple-600" />
                            <span>Stops Management</span>
                            <Badge variant="secondary">
                                {stops.length} {stops.length === 1 ? 'stop' : 'stops'}
                                {total > stops.length && ` of ${total}`}
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button onClick={fetchStopsData} variant="outline" size="sm">
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button onClick={() => setCreateDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Stop
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left p-4 font-medium text-gray-700">Stop Name</th>
                                    <th className="text-left p-4 font-medium text-gray-700">Route</th>
                                    <th className="text-center p-4 font-medium text-gray-700">Order</th>
                                    <th className="text-center p-4 font-medium text-gray-700">Coordinates</th>
                                    <th className="text-right p-4 font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stops.map((stop) => (
                                    <tr key={stop.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{stop.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    Added {new Date(stop.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{stop.route.routeNumber}</div>
                                                <div className="text-sm text-gray-600">
                                                    {stop.route.startLocation} → {stop.route.endLocation}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Badge variant="outline">#{stop.order}</Badge>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="text-sm text-gray-600">
                                                {stop.latitude.toFixed(6)}, {stop.longitude.toFixed(6)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" disabled={actionLoading === stop.id}>
                                                        {actionLoading === stop.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(stop)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Stop
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => window.open(`https://www.google.com/maps?q=${stop.latitude},${stop.longitude}`, '_blank')}
                                                    >
                                                        <Map className="mr-2 h-4 w-4" />
                                                        View on Map
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDeleteStop(stop)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Stop
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {stops.length === 0 && (
                        <div className="text-center py-12 px-4">
                            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No stops found</h3>
                            <p className="text-gray-500 mb-6">Add stops to your routes to get started</p>
                            <Button onClick={() => setCreateDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Stop
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* CREATE STOP DIALOG */}
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-purple-600" />
                            <span>Add New Stop</span>
                        </DialogTitle>
                        <DialogDescription>
                            Add a new stop to one of your routes
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
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
                            <Label htmlFor="stopName">Stop Name *</Label>
                            <Input
                                id="stopName"
                                value={createForm.name}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
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
                                    value={createForm.latitude}
                                    onChange={(e) => setCreateForm(prev => ({ 
                                        ...prev, 
                                        latitude: parseFloat(e.target.value) || 0 
                                    }))}
                                    placeholder="6.927079"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude">Longitude *</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="0.000001"
                                    value={createForm.longitude}
                                    onChange={(e) => setCreateForm(prev => ({ 
                                        ...prev, 
                                        longitude: parseFloat(e.target.value) || 0 
                                    }))}
                                    placeholder="79.861243"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="order">Stop Order</Label>
                            <Input
                                id="order"
                                type="number"
                                min="1"
                                value={createForm.order}
                                onChange={(e) => setCreateForm(prev => ({ 
                                    ...prev, 
                                    order: parseInt(e.target.value) || 1 
                                }))}
                                placeholder="1"
                            />
                            <p className="text-xs text-gray-500">Order of this stop in the route</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateStop} disabled={actionLoading === 'create'}>
                            {actionLoading === 'create' ? (
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

            {/* EDIT STOP DIALOG */}
            <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, stop: null })}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Edit className="h-5 w-5 text-purple-600" />
                            <span>Edit Stop</span>
                        </DialogTitle>
                        <DialogDescription>
                            Update stop information
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="editStopName">Stop Name *</Label>
                            <Input
                                id="editStopName"
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., Central Bus Station"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="editLatitude">Latitude *</Label>
                                <Input
                                    id="editLatitude"
                                    type="number"
                                    step="0.000001"
                                    value={editForm.latitude}
                                    onChange={(e) => setEditForm(prev => ({ 
                                        ...prev, 
                                        latitude: parseFloat(e.target.value) || 0 
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editLongitude">Longitude *</Label>
                                <Input
                                    id="editLongitude"
                                    type="number"
                                    step="0.000001"
                                    value={editForm.longitude}
                                    onChange={(e) => setEditForm(prev => ({ 
                                        ...prev, 
                                        longitude: parseFloat(e.target.value) || 0 
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="editOrder">Stop Order</Label>
                            <Input
                                id="editOrder"
                                type="number"
                                min="1"
                                value={editForm.order}
                                onChange={(e) => setEditForm(prev => ({ 
                                    ...prev, 
                                    order: parseInt(e.target.value) || 1 
                                }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialog({ open: false, stop: null })}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpdateStop} 
                            disabled={actionLoading === editDialog.stop?.id}
                        >
                            {actionLoading === editDialog.stop?.id ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Update Stop
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

function StopsTableSkeleton() {
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
                        <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
