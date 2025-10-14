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
    Bus,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Users,
    Activity,
    AlertTriangle,
    Clock,
    Save,
    X,
    Loader2,
    RefreshCcw,
    Wifi,
    WifiOff,
    MapPin,
    Plus,
    Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '../ui/checkbok'

// ✅ TYPES FOR BACKEND DATA
interface BusDevice {
    id: string
    deviceId: string
    name: string
    isActive: boolean
    lastSeen: string
}

interface BusPosition {
    id: string
    latitude: number
    longitude: number
    speed?: number | null
    heading?: number | null
    timestamp: string
}

interface BusRoute {
    id: string
    routeNumber: string
    startLocation: string
    endLocation: string
}

interface BusSchedule {
    id: string
    departureTime: string
    arrivalTime: string
    isActive: boolean
    route: BusRoute
}

interface BusOperator {
    id: string
    name: string
    licenseNo: string
}

interface BusWithDetails {
    id: string
    busNumber: string
    capacity: number
    busType: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    operator: BusOperator
    device?: BusDevice | null
    positions?: BusPosition[]
    schedules?: BusSchedule[]
    _count: {
        bookings: number
        positions: number
        schedules: number
    }
}

interface FleetData {
    buses: BusWithDetails[]
    pagination: {
        currentPage: number
        totalPages: number
        totalCount: number
        limit: number
        hasMore: boolean
    }
}

interface EditBusData {
    busNumber?: string
    capacity?: number
    busType?: string
    isActive?: boolean
}

interface DeviceFormData {
    deviceId: string
    name: string
    isActive: boolean
}

interface StatusConfig {
    color: string
    label: string
    icon: React.ReactNode
}

// ✅ BUS TYPE OPTIONS
const BUS_TYPES = [
    { value: 'AC Luxury', label: 'AC Luxury' },
    { value: 'Semi Luxury', label: 'Semi Luxury' },
    { value: 'Normal', label: 'Normal' },
    { value: 'Express', label: 'Express' }
] as const

// ✅ NOTIFICATION FUNCTION
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const prefix = type === 'error' ? '❌ Error: ' : '✅ Success: '
    console.log(`${type.toUpperCase()}: ${message}`)
    alert(prefix + message)
}

export function FleetTable() {
    // ✅ STATE MANAGEMENT
    const [fleetData, setFleetData] = useState<FleetData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    
    // Bus editing state
    const [editingBus, setEditingBus] = useState<string | null>(null)
    const [editData, setEditData] = useState<EditBusData>({})
    
    // Device management state
    const [deviceDialog, setDeviceDialog] = useState({
        open: false,
        busId: null as string | null,
        device: null as BusDevice | null,
        mode: 'create' as 'create' | 'edit'
    })
    const [deviceData, setDeviceData] = useState<DeviceFormData>({
        deviceId: '',
        name: '',
        isActive: true
    })

    const router = useRouter()
    const searchParams = useSearchParams()

    // ✅ FETCH FLEET DATA FROM BACKEND
    const fetchFleetData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            console.log('🚌 Fetching fleet data from backend...')

            const queryParams = new URLSearchParams({
                page: searchParams.get('page') || '1',
                limit: '10',
                search: searchParams.get('search') || '',
                busType: searchParams.get('busType') || 'all',
                status: searchParams.get('status') || 'all',
                hasDevice: searchParams.get('hasDevice') || 'all'
            })

            const response = await fetch(`/api/operator/buses?${queryParams}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            })

            console.log('📊 Fleet API response status:', response.status)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ 
                    error: `HTTP ${response.status}: ${response.statusText}` 
                }))
                throw new Error(errorData.error || `Request failed with status ${response.status}`)
            }

            const data = await response.json()
            console.log('✅ Fleet data received:', { 
                busCount: data.buses?.length || 0, 
                pagination: data.pagination 
            })

            setFleetData(data)
        } catch (err) {
            console.error('❌ Error fetching fleet data:', err)
            const message = err instanceof Error ? err.message : 'Failed to load fleet data'
            setError(message)
            showNotification(message, 'error')
        } finally {
            setLoading(false)
        }
    }, [searchParams])

    // ✅ LOAD DATA ON MOUNT AND PARAMS CHANGE
    useEffect(() => {
        fetchFleetData()
    }, [fetchFleetData])

    // ✅ UTILITY FUNCTIONS
    const getBusStatusConfig = useCallback((bus: BusWithDetails): StatusConfig => {
        if (!bus.isActive) {
            return {
                color: 'bg-red-100 text-red-800 border-red-200',
                label: 'Inactive',
                icon: <Clock className="h-3 w-3" />
            }
        }

        if (bus.device?.isActive) {
            return {
                color: 'bg-green-100 text-green-800 border-green-200',
                label: 'Active',
                icon: <Activity className="h-3 w-3" />
            }
        }

        return {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            label: 'Offline',
            icon: <AlertTriangle className="h-3 w-3" />
        }
    }, [])

    const formatLastSeen = useCallback((positions: BusPosition[] = []): string => {
        if (!positions || positions.length === 0) return 'No GPS data'

        try {
            const lastPosition = positions[0]
            const now = new Date()
            const lastSeen = new Date(lastPosition.timestamp)
            const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60))

            if (diffMinutes < 1) return 'Just now'
            if (diffMinutes < 60) return `${diffMinutes}m ago`

            const hours = Math.floor(diffMinutes / 60)
            if (hours < 24) return `${hours}h ago`

            const days = Math.floor(hours / 24)
            return `${days}d ago`
        } catch {
            return 'Unknown'
        }
    }, [])

    const getActiveRoutesCount = useCallback((schedules: BusSchedule[] = []): number => {
        return schedules?.filter(schedule => schedule.isActive)?.length || 0
    }, [])

    // ✅ BUS CRUD OPERATIONS
    const handleDeleteBus = useCallback(async (id: string, busNumber: string) => {
        const confirmed = window.confirm(
            `⚠️ DELETE BUS ${busNumber}\n\nThis will permanently remove:\n• Bus record\n• GPS device (if attached)\n• Position history\n• Route assignments\n\nThis action CANNOT be undone!\n\nClick OK to proceed.`
        )

        if (!confirmed) return

        setActionLoading(id)

        try {
            console.log('🗑️ Deleting bus:', id)

            const response = await fetch(`/api/operator/buses/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                const result = await response.json()
                console.log('✅ Bus deleted successfully:', result)
                showNotification(`Bus ${busNumber} deleted successfully`)
                await fetchFleetData()
            } else {
                const errorData = await response.json().catch(() => ({ 
                    error: 'Failed to delete bus' 
                }))
                throw new Error(errorData.error || 'Delete operation failed')
            }
        } catch (error) {
            console.error('❌ Error deleting bus:', error)
            const message = error instanceof Error ? error.message : 'Failed to delete bus'
            showNotification(message, 'error')
        } finally {
            setActionLoading(null)
        }
    }, [fetchFleetData])

    const startEdit = useCallback((bus: BusWithDetails) => {
        setEditingBus(bus.id)
        setEditData({
            busNumber: bus.busNumber,
            capacity: bus.capacity,
            busType: bus.busType,
            isActive: bus.isActive
        })
    }, [])

    const saveEdit = useCallback(async (id: string) => {
        // ✅ VALIDATION
        if (!editData.busNumber?.trim()) {
            showNotification('Bus number is required', 'error')
            return
        }

        if (!editData.capacity || editData.capacity <= 0 || editData.capacity > 100) {
            showNotification('Capacity must be between 1 and 100', 'error')
            return
        }

        if (!editData.busType) {
            showNotification('Bus type is required', 'error')
            return
        }

        setActionLoading(id)

        try {
            console.log('💾 Updating bus:', id, editData)

            const response = await fetch(`/api/operator/buses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            })

            if (response.ok) {
                const result = await response.json()
                console.log('✅ Bus updated successfully:', result.busNumber)
                setEditingBus(null)
                setEditData({})
                showNotification('Bus updated successfully')
                await fetchFleetData()
            } else {
                const errorData = await response.json().catch(() => ({ 
                    error: 'Failed to update bus' 
                }))
                throw new Error(errorData.error || 'Update operation failed')
            }
        } catch (error) {
            console.error('❌ Error updating bus:', error)
            const message = error instanceof Error ? error.message : 'Failed to update bus'
            showNotification(message, 'error')
        } finally {
            setActionLoading(null)
        }
    }, [editData, fetchFleetData])

    const cancelEdit = useCallback(() => {
        setEditingBus(null)
        setEditData({})
    }, [])

    const toggleBusStatus = useCallback(async (id: string, currentStatus: boolean) => {
        setActionLoading(id)

        try {
            console.log('🔄 Toggling bus status:', id, !currentStatus)

            const response = await fetch(`/api/operator/buses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            })

            if (response.ok) {
                console.log('✅ Bus status updated')
                showNotification(`Bus ${currentStatus ? 'deactivated' : 'activated'} successfully`)
                await fetchFleetData()
            } else {
                const errorData = await response.json().catch(() => ({ 
                    error: 'Failed to update bus status' 
                }))
                throw new Error(errorData.error || 'Status update failed')
            }
        } catch (error) {
            console.error('❌ Error updating status:', error)
            const message = error instanceof Error ? error.message : 'Failed to update bus status'
            showNotification(message, 'error')
        } finally {
            setActionLoading(null)
        }
    }, [fetchFleetData])

    // ✅ DEVICE CRUD OPERATIONS
    const openDeviceDialog = useCallback((busId: string, device?: BusDevice) => {
        setDeviceDialog({
            open: true,
            busId,
            device: device || null,
            mode: device ? 'edit' : 'create'
        })
        
        if (device) {
            setDeviceData({
                deviceId: device.deviceId,
                name: device.name,
                isActive: device.isActive
            })
        } else {
            setDeviceData({
                deviceId: '',
                name: '',
                isActive: true
            })
        }
    }, [])

    const closeDeviceDialog = useCallback(() => {
        setDeviceDialog({
            open: false,
            busId: null,
            device: null,
            mode: 'create'
        })
        setDeviceData({ deviceId: '', name: '', isActive: true })
    }, [])

    const saveDevice = useCallback(async () => {
        if (!deviceDialog.busId) return

        // ✅ VALIDATION
        if (!deviceData.deviceId.trim()) {
            showNotification('Device ID is required', 'error')
            return
        }

        if (!deviceData.name.trim()) {
            showNotification('Device name is required', 'error')
            return
        }

        setActionLoading(deviceDialog.busId)

        try {
            const isUpdate = deviceDialog.mode === 'edit' && deviceDialog.device
            const url = isUpdate 
                ? `/api/operator/devices/${deviceDialog.device!.id}`
                : '/api/operator/devices'
            
            const method = isUpdate ? 'PUT' : 'POST'
            const payload = isUpdate 
                ? deviceData
                : { ...deviceData, busId: deviceDialog.busId }

            console.log(`${isUpdate ? '💾 Updating' : '🆕 Creating'} device:`, payload)

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                const result = await response.json()
                console.log(`✅ Device ${isUpdate ? 'updated' : 'created'} successfully:`, result)
                closeDeviceDialog()
                showNotification(`Device ${isUpdate ? 'updated' : 'created'} successfully`)
                await fetchFleetData()
            } else {
                const errorData = await response.json().catch(() => ({ 
                    error: `Failed to ${isUpdate ? 'update' : 'create'} device` 
                }))
                throw new Error(errorData.error)
            }
        } catch (error) {
            console.error(`❌ Error ${deviceDialog.mode}ing device:`, error)
            const message = error instanceof Error ? error.message : `Failed to ${deviceDialog.mode} device`
            showNotification(message, 'error')
        } finally {
            setActionLoading(null)
        }
    }, [deviceDialog, deviceData, closeDeviceDialog, fetchFleetData])

    const deleteDevice = useCallback(async (deviceId: string, busId: string) => {
        const confirmed = window.confirm(
            '⚠️ REMOVE GPS DEVICE\n\nThis will:\n• Disconnect GPS tracking\n• Remove position history\n• Stop real-time location updates\n\nThis action cannot be undone!\n\nClick OK to proceed.'
        )

        if (!confirmed) return

        setActionLoading(busId)

        try {
            console.log('🗑️ Deleting device:', deviceId)

            const response = await fetch(`/api/operator/devices/${deviceId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                console.log('✅ Device deleted successfully')
                showNotification('GPS device removed successfully')
                await fetchFleetData()
            } else {
                const errorData = await response.json().catch(() => ({ 
                    error: 'Failed to delete device' 
                }))
                throw new Error(errorData.error)
            }
        } catch (error) {
            console.error('❌ Error deleting device:', error)
            const message = error instanceof Error ? error.message : 'Failed to delete device'
            showNotification(message, 'error')
        } finally {
            setActionLoading(null)
        }
    }, [fetchFleetData])

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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Fleet Data</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchFleetData} disabled={loading}>
                        <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // ✅ LOADING STATE
    if (loading || !fleetData) {
        return <FleetTableSkeleton />
    }

    const { buses, pagination } = fleetData

    // ✅ MAIN RENDER
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Bus className="h-5 w-5 text-blue-600" />
                            <span>Fleet Management</span>
                            <Badge variant="secondary">
                                {buses.length} {buses.length === 1 ? 'bus' : 'buses'}
                                {pagination.totalCount > buses.length && ` of ${pagination.totalCount}`}
                            </Badge>
                        </div>
                        <Button onClick={fetchFleetData} variant="outline" size="sm" disabled={loading}>
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
                                    <th className="text-left p-4 font-medium text-gray-700">Bus Details</th>
                                    <th className="text-left p-4 font-medium text-gray-700">Type & Capacity</th>
                                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                                    <th className="text-left p-4 font-medium text-gray-700">GPS Device</th>
                                    <th className="text-center p-4 font-medium text-gray-700">Routes</th>
                                    <th className="text-center p-4 font-medium text-gray-700">Bookings</th>
                                    <th className="text-right p-4 font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {buses.map((bus) => (
                                    <BusTableRow
                                        key={bus.id}
                                        bus={bus}
                                        isEditing={editingBus === bus.id}
                                        editData={editData}
                                        isLoading={actionLoading === bus.id}
                                        statusConfig={getBusStatusConfig(bus)}
                                        onEdit={() => startEdit(bus)}
                                        onSave={() => saveEdit(bus.id)}
                                        onCancel={cancelEdit}
                                        onDelete={() => handleDeleteBus(bus.id, bus.busNumber)}
                                        onToggleStatus={() => toggleBusStatus(bus.id, bus.isActive)}
                                        onEditDataChange={setEditData}
                                        onAddDevice={() => openDeviceDialog(bus.id)}
                                        onEditDevice={() => openDeviceDialog(bus.id, bus.device!)}
                                        onDeleteDevice={() => deleteDevice(bus.device!.id, bus.id)}
                                        formatLastSeen={formatLastSeen}
                                        getActiveRoutesCount={getActiveRoutesCount}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ EMPTY STATE */}
                    {buses.length === 0 && (
                        <div className="text-center py-12 px-4">
                            <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
                            <p className="text-gray-500 mb-6">
                                Add your first bus to get started with fleet management
                            </p>
                        </div>
                    )}

                    {/* ✅ PAGINATION */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                            <p className="text-sm text-gray-600">
                                Page {pagination.currentPage} of {pagination.totalPages} 
                                ({pagination.totalCount} total buses)
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.currentPage <= 1}
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                >
                                    Previous
                                </Button>

                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        const pageNum = Math.max(1, pagination.currentPage - 2) + i
                                        if (pageNum > pagination.totalPages) return null

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={pagination.currentPage === pageNum ? "default" : "outline"}
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
                                    disabled={pagination.currentPage >= pagination.totalPages}
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ✅ DEVICE MANAGEMENT DIALOG */}
            <Dialog open={deviceDialog.open} onOpenChange={closeDeviceDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Settings className="h-5 w-5 text-blue-600" />
                            <span>
                                {deviceDialog.mode === 'edit' ? 'Edit GPS Device' : 'Add GPS Device'}
                            </span>
                        </DialogTitle>
                        <DialogDescription>
                            {deviceDialog.mode === 'edit' 
                                ? 'Update the GPS device information for this bus.' 
                                : 'Add a GPS tracking device to enable real-time location monitoring.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="deviceId">Device ID *</Label>
                            <Input
                                id="deviceId"
                                value={deviceData.deviceId}
                                onChange={(e) => setDeviceData(prev => ({ ...prev, deviceId: e.target.value.trim() }))}
                                placeholder="e.g., GPS001, TRK-456"
                                disabled={actionLoading === deviceDialog.busId}
                                maxLength={20}
                            />
                            <p className="text-xs text-muted-foreground">
                                Unique identifier for the GPS tracking device
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deviceName">Device Name *</Label>
                            <Input
                                id="deviceName"
                                value={deviceData.name}
                                onChange={(e) => setDeviceData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., Main GPS Tracker"
                                disabled={actionLoading === deviceDialog.busId}
                                maxLength={50}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="deviceActive"
                                checked={deviceData.isActive}
                                onCheckedChange={(checked) => 
                                    setDeviceData(prev => ({ ...prev, isActive: checked as boolean }))
                                }
                                disabled={actionLoading === deviceDialog.busId}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="deviceActive" className="text-sm font-medium cursor-pointer">
                                    Active Device
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Enable real-time GPS tracking and location updates
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button 
                            variant="outline" 
                            onClick={closeDeviceDialog}
                            disabled={actionLoading === deviceDialog.busId}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={saveDevice}
                            disabled={actionLoading === deviceDialog.busId}
                        >
                            {actionLoading === deviceDialog.busId ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {deviceDialog.mode === 'edit' ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {deviceDialog.mode === 'edit' ? 'Update Device' : 'Create Device'}
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

// ✅ BUS TABLE ROW COMPONENT
interface BusTableRowProps {
    bus: BusWithDetails
    isEditing: boolean
    editData: EditBusData
    isLoading: boolean
    statusConfig: StatusConfig
    onEdit: () => void
    onSave: () => void
    onCancel: () => void
    onDelete: () => void
    onToggleStatus: () => void
    onEditDataChange: (data: EditBusData) => void
    onAddDevice: () => void
    onEditDevice: () => void
    onDeleteDevice: () => void
    formatLastSeen: (positions: BusPosition[]) => string
    getActiveRoutesCount: (schedules: BusSchedule[]) => number
}

const BusTableRow = React.memo<BusTableRowProps>(({
    bus,
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
    onAddDevice,
    onEditDevice,
    onDeleteDevice,
    formatLastSeen,
    getActiveRoutesCount
}) => {
    const router = useRouter()

    const positions = bus.positions || []
    const schedules = bus.schedules || []
    const bookingsCount = bus._count?.bookings || 0
    const routesCount = getActiveRoutesCount(schedules)

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            {/* Bus Details */}
            <td className="p-4">
                {isEditing ? (
                    <Input
                        value={editData.busNumber || ''}
                        onChange={(e) => onEditDataChange({ 
                            ...editData, 
                            busNumber: e.target.value.toUpperCase() 
                        })}
                        placeholder="Bus Number"
                        disabled={isLoading}
                        className="text-sm"
                        maxLength={20}
                    />
                ) : (
                    <div>
                        <div className="font-semibold text-gray-900 text-lg">{bus.busNumber}</div>
                        <div className="text-xs text-gray-500">
                            Added {new Date(bus.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                            By {bus.operator?.name || 'Unknown Operator'}
                        </div>
                    </div>
                )}
            </td>

            {/* Type & Capacity */}
            <td className="p-4">
                {isEditing ? (
                    <div className="space-y-2">
                        <select
                            value={editData.busType || ''}
                            onChange={(e) => onEditDataChange({ ...editData, busType: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                        >
                            <option value="">Select Type</option>
                            {BUS_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        <Input
                            type="number"
                            min="1"
                            max="100"
                            value={editData.capacity || ''}
                            onChange={(e) => {
                                const value = parseInt(e.target.value)
                                onEditDataChange({ 
                                    ...editData, 
                                    capacity: isNaN(value) ? 0 : Math.max(1, Math.min(100, value))
                                })
                            }}
                            placeholder="Capacity"
                            disabled={isLoading}
                            className="text-sm"
                        />
                    </div>
                ) : (
                    <div>
                        <Badge variant="outline" className="mb-1">
                            {bus.busType}
                        </Badge>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                            <Users className="h-3 w-3 mr-1" />
                            {bus.capacity} seats
                        </div>
                    </div>
                )}
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

            {/* GPS Device */}
            <td className="p-4">
                {bus.device ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-green-600">
                            <Wifi className="h-4 w-4 mr-1" />
                            <div>
                                <div className="text-sm font-medium">Connected</div>
                                <div className="text-xs text-gray-500">{bus.device.deviceId}</div>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onEditDevice}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Device
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onDeleteDevice} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Device
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-400">
                            <WifiOff className="h-4 w-4 mr-1" />
                            <span className="text-sm">No GPS</span>
                        </div>
                        <Button 
                            onClick={onAddDevice} 
                            variant="ghost" 
                            size="sm"
                            title="Add GPS Device"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </td>

            {/* Routes */}
            <td className="p-4 text-center">
                <div className="font-medium text-gray-900">{routesCount}</div>
                <div className="text-xs text-gray-500">routes</div>
            </td>

            {/* Bookings */}
            <td className="p-4 text-center">
                <div className="font-medium text-gray-900">{bookingsCount}</div>
                <div className="text-xs text-gray-500">bookings</div>
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
                                onClick={() => router.push(`/operator/buses/${bus.id}`)}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Bus
                            </DropdownMenuItem>
                            {bus.device && (
                                <DropdownMenuItem 
                                    onClick={() => router.push(`/operator/tracking?bus=${bus.id}`)}
                                    className="cursor-pointer"
                                >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Track Location
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onToggleStatus} className="cursor-pointer">
                                <Activity className="mr-2 h-4 w-4" />
                                {bus.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50" 
                                onClick={onDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Bus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </td>
        </tr>
    )
})

BusTableRow.displayName = 'BusTableRow'

// ✅ LOADING SKELETON
function FleetTableSkeleton() {
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
