'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Route,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    MapPin,
    Clock,
    Users,
    Activity,
    AlertTriangle,
    Save,
    X,
    Loader2,
    RefreshCcw,
    Plus,
    Navigation
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ✅ TYPES FOR ROUTE DATA
interface RouteStop {
    id: string
    name: string
    latitude?: number
    longitude?: number
    order: number
}

interface RouteSchedule {
    id: string
    departureTime: string
    arrivalTime: string
    isActive: boolean
    bus: {
        busNumber: string
        capacity: number
        busType: string
    }
}

interface RouteWithDetails {
    id: string
    routeNumber: string
    startLocation: string
    endLocation: string
    distance?: number | null
    estimatedTime?: number | null
    isActive: boolean
    createdAt: string
    updatedAt: string
    stops?: RouteStop[]
    schedules?: RouteSchedule[]
    _count: {
        stops: number
        schedules: number
    }
}

interface RoutesData {
    routes: RouteWithDetails[]
    total: number
    totalPages: number
    currentPage: number
}

interface EditRouteData {
    routeNumber?: string
    startLocation?: string
    endLocation?: string
    distance?: number
    estimatedTime?: number
    isActive?: boolean
}

interface StatusConfig {
    color: string
    label: string
    icon: React.ReactNode
}

// ✅ ROUTE TYPES
const ROUTE_STATUSES = [
    { value: 'all', label: 'All Routes' },
    { value: 'active', label: 'Active Routes' },
    { value: 'inactive', label: 'Inactive Routes' }
] as const

// ✅ NOTIFICATION FUNCTION
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const prefix = type === 'error' ? '❌ Error: ' : '✅ Success: '
    console.log(`${type.toUpperCase()}: ${message}`)
    alert(prefix + message)
}

export function RoutesTable() {
    // ✅ STATE MANAGEMENT
    const [routesData, setRoutesData] = useState<RoutesData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    
    // Route editing state
    const [editingRoute, setEditingRoute] = useState<string | null>(null)
    const [editData, setEditData] = useState<EditRouteData>({})

    const router = useRouter()
    const searchParams = useSearchParams()

    // ✅ FETCH ROUTES DATA FROM BACKEND
    const fetchRoutesData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            console.log('📍 Fetching routes data from backend...')

            const queryParams = new URLSearchParams({
                page: searchParams.get('page') || '1',
                limit: '10',
                search: searchParams.get('search') || '',
                status: searchParams.get('status') || 'all'
            })

            const response = await fetch(`/api/operator/routes?${queryParams}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            })

            console.log('📊 Routes API response status:', response.status)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ 
                    error: `HTTP ${response.status}: ${response.statusText}` 
                }))
                throw new Error(errorData.error || `Request failed with status ${response.status}`)
            }

            const data = await response.json()
            console.log('✅ Routes data received:', { 
                routesCount: data.routes?.length || 0, 
                total: data.total 
            })

            setRoutesData(data)
        } catch (err) {
            console.error('❌ Error fetching routes data:', err)
            const message = err instanceof Error ? err.message : 'Failed to load routes data'
            setError(message)
            showNotification(message, 'error')
        } finally {
            setLoading(false)
        }
    }, [searchParams])

    // ✅ LOAD DATA ON MOUNT AND PARAMS CHANGE
    useEffect(() => {
        fetchRoutesData()
    }, [fetchRoutesData])

    // ✅ UTILITY FUNCTIONS
    const getRouteStatusConfig = useCallback((route: RouteWithDetails): StatusConfig => {
        if (!route.isActive) {
            return {
                color: 'bg-red-100 text-red-800 border-red-200',
                label: 'Inactive',
                icon: <AlertTriangle className="h-3 w-3" />
            }
        }

        const hasActiveSchedules = route.schedules?.some(s => s.isActive) || false
        
        if (hasActiveSchedules) {
            return {
                color: 'bg-green-100 text-green-800 border-green-200',
                label: 'Active',
                icon: <Activity className="h-3 w-3" />
            }
        }

        return {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            label: 'No Schedules',
            icon: <Clock className="h-3 w-3" />
        }
    }, [])

    const formatDistance = useCallback((distance?: number | null): string => {
        if (!distance) return 'N/A'
        return `${distance} km`
    }, [])

    const formatEstimatedTime = useCallback((time?: number | null): string => {
        if (!time) return 'N/A'
        const hours = Math.floor(time / 60)
        const minutes = time % 60
        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }
        return `${minutes}m`
    }, [])

    // ✅ ROUTE CRUD OPERATIONS
    const handleDeleteRoute = useCallback(async (id: string, routeNumber: string) => {
        const confirmed = window.confirm(
            `⚠️ DELETE ROUTE ${routeNumber}\n\nThis will permanently remove:\n• Route record\n• All stops on this route\n• Route schedules\n\nThis action CANNOT be undone!\n\nClick OK to proceed.`
        )

        if (!confirmed) return

        setActionLoading(id)

        try {
            console.log('🗑️ Deleting route:', id)

            const response = await fetch(`/api/operator/routes/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                const result = await response.json()
                console.log('✅ Route deleted successfully:', result)
                showNotification(`Route ${routeNumber} deleted successfully`)
                await fetchRoutesData()
            } else {
                const errorData = await response.json().catch(() => ({ 
                    error: 'Failed to delete route' 
                }))
                throw new Error(errorData.error || 'Delete operation failed')
            }
        } catch (error) {
            console.error('❌ Error deleting route:', error)
            const message = error instanceof Error ? error.message : 'Failed to delete route'
            showNotification(message, 'error')
        } finally {
            setActionLoading(null)
        }
    }, [fetchRoutesData])

    const startEdit = useCallback((route: RouteWithDetails) => {
        setEditingRoute(route.id)
        setEditData({
            routeNumber: route.routeNumber,
            startLocation: route.startLocation,
            endLocation: route.endLocation,
            distance: route.distance || undefined,
            estimatedTime: route.estimatedTime || undefined,
            isActive: route.isActive
        })
    }, [])

    const saveEdit = useCallback(async (id: string) => {
        // Validation
        if (!editData.routeNumber?.trim()) {
            showNotification('Route number is required', 'error')
            return
        }

        if (!editData.startLocation?.trim()) {
            showNotification('Start location is required', 'error')
            return
        }

        if (!editData.endLocation?.trim()) {
            showNotification('End location is required', 'error')
            return
        }

        setActionLoading(id)

        try {
            console.log('💾 Updating route:', id, editData)

            const response = await fetch(`/api/operator/routes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            })

            if (response.ok) {
                const result = await response.json()
                console.log('✅ Route updated successfully:', result.routeNumber)
                setEditingRoute(null)
                setEditData({})
                showNotification('Route updated successfully')
                await fetchRoutesData()
            } else {
                const errorData = await response.json().catch(() => ({ 
                    error: 'Failed to update route' 
                }))
                throw new Error(errorData.error || 'Update operation failed')
            }
        } catch (error) {
            console.error('❌ Error updating route:', error)
            const message = error instanceof Error ? error.message : 'Failed to update route'
            showNotification(message, 'error')
        } finally {
            setActionLoading(null)
        }
    }, [editData, fetchRoutesData])

    const cancelEdit = useCallback(() => {
        setEditingRoute(null)
        setEditData({})
    }, [])

    const toggleRouteStatus = useCallback(async (id: string, currentStatus: boolean) => {
        setActionLoading(id)

        try {
            console.log('🔄 Toggling route status:', id, !currentStatus)

            const response = await fetch(`/api/operator/routes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            })

            if (response.ok) {
                console.log('✅ Route status updated')
                showNotification(`Route ${currentStatus ? 'deactivated' : 'activated'} successfully`)
                await fetchRoutesData()
            } else {
                const errorData = await response.json().catch(() => ({ 
                    error: 'Failed to update route status' 
                }))
                throw new Error(errorData.error || 'Status update failed')
            }
        } catch (error) {
            console.error('❌ Error updating status:', error)
            const message = error instanceof Error ? error.message : 'Failed to update route status'
            showNotification(message, 'error')
        } finally {
            setActionLoading(null)
        }
    }, [fetchRoutesData])

    // ✅ PAGINATION
    const handlePageChange = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`?${params.toString()}`)
    }, [router, searchParams])

    // ✅ ERROR STATE
    if (error) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Routes Data</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchRoutesData} disabled={loading}>
                        <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // ✅ LOADING STATE
    if (loading || !routesData) {
        return <RoutesTableSkeleton />
    }

    const { routes, total, totalPages, currentPage } = routesData

    // ✅ MAIN RENDER
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Route className="h-5 w-5 text-blue-600" />
                        <span>Routes Management</span>
                        <Badge variant="secondary">
                            {routes.length} {routes.length === 1 ? 'route' : 'routes'}
                            {total > routes.length && ` of ${total}`}
                        </Badge>
                    </div>
                    <Button onClick={fetchRoutesData} variant="outline" size="sm" disabled={loading}>
                        <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                        Refresh
                    </Button>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                {/* ✅ RESPONSIVE TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left p-4 font-medium text-gray-700">Route Details</th>
                                <th className="text-left p-4 font-medium text-gray-700">Locations</th>
                                <th className="text-center p-4 font-medium text-gray-700">Distance & Time</th>
                                <th className="text-center p-4 font-medium text-gray-700">Stops</th>
                                <th className="text-center p-4 font-medium text-gray-700">Schedules</th>
                                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                                <th className="text-right p-4 font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {routes.map((route) => (
                                <RouteTableRow
                                    key={route.id}
                                    route={route}
                                    isEditing={editingRoute === route.id}
                                    editData={editData}
                                    isLoading={actionLoading === route.id}
                                    statusConfig={getRouteStatusConfig(route)}
                                    onEdit={() => startEdit(route)}
                                    onSave={() => saveEdit(route.id)}
                                    onCancel={cancelEdit}
                                    onDelete={() => handleDeleteRoute(route.id, route.routeNumber)}
                                    onToggleStatus={() => toggleRouteStatus(route.id, route.isActive)}
                                    onEditDataChange={setEditData}
                                    formatDistance={formatDistance}
                                    formatEstimatedTime={formatEstimatedTime}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ✅ EMPTY STATE */}
                {routes.length === 0 && (
                    <div className="text-center py-12 px-4">
                        <Route className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
                        <p className="text-gray-500 mb-6">
                            Add your first route to get started with route management
                        </p>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Route
                        </Button>
                    </div>
                )}

                {/* ✅ PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                        <p className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages} ({total} total routes)
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage <= 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </Button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = Math.max(1, currentPage - 2) + i
                                    if (pageNum > totalPages) return null

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {pageNum}
                                        </Button>
                                    )
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ✅ ROUTE TABLE ROW COMPONENT
interface RouteTableRowProps {
    route: RouteWithDetails
    isEditing: boolean
    editData: EditRouteData
    isLoading: boolean
    statusConfig: StatusConfig
    onEdit: () => void
    onSave: () => void
    onCancel: () => void
    onDelete: () => void
    onToggleStatus: () => void
    onEditDataChange: (data: EditRouteData) => void
    formatDistance: (distance?: number | null) => string
    formatEstimatedTime: (time?: number | null) => string
}

const RouteTableRow = React.memo<RouteTableRowProps>(({
    route,
    isEditing,
    editData,
    isLoading,
    statusConfig,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onToggleStatus,
    onEditDataChange,
    formatDistance,
    formatEstimatedTime
}) => {
    const router = useRouter()

    const stopsCount = route._count?.stops || 0
    const schedulesCount = route._count?.schedules || 0

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            {/* Route Details */}
            <td className="p-4">
                {isEditing ? (
                    <Input
                        value={editData.routeNumber || ''}
                        onChange={(e) => onEditDataChange({ 
                            ...editData, 
                            routeNumber: e.target.value.toUpperCase() 
                        })}
                        placeholder="Route Number"
                        disabled={isLoading}
                        className="text-sm"
                        maxLength={20}
                    />
                ) : (
                    <div>
                        <div className="font-semibold text-gray-900 text-lg">{route.routeNumber}</div>
                        <div className="text-xs text-gray-500">
                            Created {new Date(route.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                )}
            </td>

            {/* Locations */}
            <td className="p-4">
                {isEditing ? (
                    <div className="space-y-2">
                        <Input
                            value={editData.startLocation || ''}
                            onChange={(e) => onEditDataChange({ 
                                ...editData, 
                                startLocation: e.target.value 
                            })}
                            placeholder="Start Location"
                            disabled={isLoading}
                            className="text-sm"
                        />
                        <Input
                            value={editData.endLocation || ''}
                            onChange={(e) => onEditDataChange({ 
                                ...editData, 
                                endLocation: e.target.value 
                            })}
                            placeholder="End Location"
                            disabled={isLoading}
                            className="text-sm"
                        />
                    </div>
                ) : (
                    <div>
                        <div className="font-medium text-gray-900">{route.startLocation}</div>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                            <Navigation className="h-3 w-3 mr-1" />
                            {route.endLocation}
                        </div>
                    </div>
                )}
            </td>

            {/* Distance & Time */}
            <td className="p-4 text-center">
                {isEditing ? (
                    <div className="space-y-2">
                        <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={editData.distance || ''}
                            onChange={(e) => onEditDataChange({ 
                                ...editData, 
                                distance: parseFloat(e.target.value) || undefined
                            })}
                            placeholder="Distance (km)"
                            disabled={isLoading}
                            className="text-sm"
                        />
                        <Input
                            type="number"
                            min="0"
                            value={editData.estimatedTime || ''}
                            onChange={(e) => onEditDataChange({ 
                                ...editData, 
                                estimatedTime: parseInt(e.target.value) || undefined
                            })}
                            placeholder="Time (min)"
                            disabled={isLoading}
                            className="text-sm"
                        />
                    </div>
                ) : (
                    <div>
                        <div className="font-medium text-gray-900">
                            {formatDistance(route.distance)}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatEstimatedTime(route.estimatedTime)}
                        </div>
                    </div>
                )}
            </td>

            {/* Stops */}
            <td className="p-4 text-center">
                <div className="font-medium text-gray-900">{stopsCount}</div>
                <div className="text-xs text-gray-500">stops</div>
            </td>

            {/* Schedules */}
            <td className="p-4 text-center">
                <div className="font-medium text-gray-900">{schedulesCount}</div>
                <div className="text-xs text-gray-500">schedules</div>
            </td>

            {/* Status */}
            <td className="p-4">
                <Badge
                    className={cn(
                        statusConfig.color,
                        "cursor-pointer hover:opacity-80 transition-opacity inline-flex items-center"
                    )}
                    onClick={onToggleStatus}
                    title="Click to toggle status"
                >
                    {statusConfig.icon}
                    <span className="ml-1">{statusConfig.label}</span>
                </Badge>
            </td>

            {/* Actions */}
            <td className="p-4 text-right">
                {isEditing ? (
                    <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" onClick={onSave} disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Save className="h-3 w-3" />
                            )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={onCancel} disabled={isLoading}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                                onClick={() => router.push(`/operator/routes/${route.id}`)}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Route
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => router.push(`/operator/routes/${route.id}/stops`)}
                                className="cursor-pointer"
                            >
                                <MapPin className="mr-2 h-4 w-4" />
                                Manage Stops
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onToggleStatus} className="cursor-pointer">
                                <Activity className="mr-2 h-4 w-4" />
                                {route.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50" 
                                onClick={onDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Route
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </td>
        </tr>
    )
})

RouteTableRow.displayName = 'RouteTableRow'

// ✅ LOADING SKELETON
function RoutesTableSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
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
