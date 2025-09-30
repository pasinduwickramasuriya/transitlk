'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Calendar,
    Search,
    Filter,
    RefreshCcw,
    Route,
    Bus,
    Clock,
    Activity,
    AlertTriangle,
    TrendingUp,
    X,
    Users,
    Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ✅ TYPES FOR SCHEDULE STATISTICS
interface ScheduleStats {
    totalSchedules: number
    activeSchedules: number
    inactiveSchedules: number
    schedulesWithBookings: number
    routesScheduled: number
    busesScheduled: number
    recentSchedules: number
    upcomingSchedules: number
    utilizationRate: number
    averageFrequency: number
    peakHours: Array<{
        hour: number
        count: number
    }>
    topRoutesBySchedules: Array<{
        routeNumber: string
        startLocation: string
        endLocation: string
        schedulesCount: number
    }>
    topBusesBySchedules: Array<{
        busNumber: string
        busType: string
        capacity: number
        schedulesCount: number
    }>
}

interface FilterOptions {
    search: string
    routeId: 'all' | string
    busId: 'all' | string
    status: 'all' | 'active' | 'inactive'
    sortBy: 'createdAt' | 'departureTime' | 'route' | 'bus'
    sortOrder: 'asc' | 'desc'
    timeFilter: 'all' | 'morning' | 'afternoon' | 'evening' | 'night'
}

interface RouteOption {
    id: string
    routeNumber: string
    startLocation: string
    endLocation: string
    _count?: {
        schedules: number
    }
}

interface BusOption {
    id: string
    busNumber: string
    busType: string
    capacity: number
    _count?: {
        schedules: number
    }
}

// ✅ FILTER OPTIONS
const STATUS_OPTIONS = [
    { value: 'all', label: 'All Schedules', color: 'bg-gray-100 text-gray-800' },
    { value: 'active', label: 'Active Schedules', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inactive Schedules', color: 'bg-red-100 text-red-800' }
] as const

const SORT_BY_OPTIONS = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'departureTime', label: 'Departure Time' },
    { value: 'route', label: 'Route Number' },
    { value: 'bus', label: 'Bus Number' }
] as const

const TIME_FILTER_OPTIONS = [
    { value: 'all', label: 'All Times' },
    { value: 'morning', label: 'Morning (5AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
    { value: 'evening', label: 'Evening (5PM-10PM)' },
    { value: 'night', label: 'Night (10PM-5AM)' }
] as const

export function SchedulesFilters() {
    const [stats, setStats] = useState<ScheduleStats | null>(null)
    const [routes, setRoutes] = useState<RouteOption[]>([])
    const [buses, setBuses] = useState<BusOption[]>([])
    const [loading, setLoading] = useState(true)
    const [routesLoading, setRoutesLoading] = useState(false)
    const [busesLoading, setBusesLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<FilterOptions>({
        search: '',
        routeId: 'all',
        busId: 'all',
        status: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        timeFilter: 'all'
    })

    const router = useRouter()
    const searchParams = useSearchParams()

    // ✅ SYNC FILTERS WITH URL PARAMS
    useEffect(() => {
        setFilters({
            search: searchParams.get('search') || '',
            routeId: searchParams.get('routeId') || 'all',
            busId: searchParams.get('busId') || 'all',
            status: (searchParams.get('status') as FilterOptions['status']) || 'all',
            sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || 'createdAt',
            sortOrder: (searchParams.get('sortOrder') as FilterOptions['sortOrder']) || 'desc',
            timeFilter: (searchParams.get('timeFilter') as FilterOptions['timeFilter']) || 'all'
        })
    }, [searchParams])

    // ✅ FETCH SCHEDULE STATISTICS FROM API
    const fetchScheduleStats = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            console.log('📊 Fetching schedule statistics...')

            const response = await fetch('/api/operator/schedules/stats', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            })

            console.log('📈 Schedule stats response status:', response.status)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ 
                    error: `HTTP ${response.status}: ${response.statusText}` 
                }))
                throw new Error(errorData.error || 'Failed to fetch statistics')
            }

            const data = await response.json()
            console.log('✅ Schedule stats received:', data)

            setStats(data)

        } catch (err) {
            console.error('❌ Error fetching schedule stats:', err)
            const message = err instanceof Error ? err.message : 'Failed to load statistics'
            setError(message)
        } finally {
            setLoading(false)
        }
    }, [])

    // ✅ FETCH ROUTES FOR FILTER DROPDOWN
    const fetchRoutes = useCallback(async () => {
        setRoutesLoading(true)
        try {
            console.log('🚌 Fetching routes for filter...')

            const response = await fetch('/api/operator/routes?limit=100&includeStats=true', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            })

            if (response.ok) {
                const data = await response.json()
                setRoutes(data.routes || [])
                console.log(`✅ Loaded ${data.routes?.length || 0} routes for filter`)
            } else {
                console.error('Failed to fetch routes for filter')
            }
        } catch (error) {
            console.error('Error fetching routes:', error)
        } finally {
            setRoutesLoading(false)
        }
    }, [])

    // ✅ FETCH BUSES FOR FILTER DROPDOWN
    const fetchBuses = useCallback(async () => {
        setBusesLoading(true)
        try {
            console.log('🚐 Fetching buses for filter...')

            const response = await fetch('/api/operator/buses?limit=100&includeStats=true', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            })

            if (response.ok) {
                const data = await response.json()
                setBuses(data.buses || [])
                console.log(`✅ Loaded ${data.buses?.length || 0} buses for filter`)
            } else {
                console.error('Failed to fetch buses for filter')
            }
        } catch (error) {
            console.error('Error fetching buses:', error)
        } finally {
            setBusesLoading(false)
        }
    }, [])

    // ✅ LOAD STATS AND OPTIONS ON MOUNT
    useEffect(() => {
        fetchScheduleStats()
        fetchRoutes()
        fetchBuses()
    }, [fetchScheduleStats, fetchRoutes, fetchBuses])

    // ✅ UPDATE URL WITH FILTER CHANGES
    const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
        const updatedFilters = { ...filters, ...newFilters }
        setFilters(updatedFilters)

        // Update URL params
        const params = new URLSearchParams()
        
        if (updatedFilters.search) params.set('search', updatedFilters.search)
        if (updatedFilters.routeId !== 'all') params.set('routeId', updatedFilters.routeId)
        if (updatedFilters.busId !== 'all') params.set('busId', updatedFilters.busId)
        if (updatedFilters.status !== 'all') params.set('status', updatedFilters.status)
        if (updatedFilters.sortBy !== 'createdAt') params.set('sortBy', updatedFilters.sortBy)
        if (updatedFilters.sortOrder !== 'desc') params.set('sortOrder', updatedFilters.sortOrder)
        if (updatedFilters.timeFilter !== 'all') params.set('timeFilter', updatedFilters.timeFilter)

        // Reset to page 1 when filters change
        params.set('page', '1')

        router.push(`?${params.toString()}`)
    }, [filters, router])

    // ✅ CLEAR ALL FILTERS
    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            routeId: 'all',
            busId: 'all',
            status: 'all',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            timeFilter: 'all'
        })
        router.push(window.location.pathname)
    }, [router])

    // ✅ CALCULATE ACTIVE FILTERS COUNT
    const activeFiltersCount = useMemo(() => {
        let count = 0
        if (filters.search) count++
        if (filters.routeId !== 'all') count++
        if (filters.busId !== 'all') count++
        if (filters.status !== 'all') count++
        if (filters.sortBy !== 'createdAt') count++
        if (filters.sortOrder !== 'desc') count++
        if (filters.timeFilter !== 'all') count++
        return count
    }, [filters])

    // ✅ HANDLE SEARCH INPUT
    const handleSearchChange = useCallback((value: string) => {
        updateFilters({ search: value })
    }, [updateFilters])

    // ✅ DEBOUNCED SEARCH
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (filters.search !== (searchParams.get('search') || '')) {
                updateFilters({ search: filters.search })
            }
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [filters.search, searchParams, updateFilters])

    // ✅ REFRESH ALL DATA
    const refreshAllData = useCallback(() => {
        fetchScheduleStats()
        fetchRoutes()
        fetchBuses()
    }, [fetchScheduleStats, fetchRoutes, fetchBuses])

    return (
        <div className="space-y-6">
            {/* ✅ SCHEDULE STATISTICS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatsCard
                    title="Total Schedules"
                    value={stats?.totalSchedules || 0}
                    icon={Calendar}
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                    loading={loading}
                />
                <StatsCard
                    title="Active Schedules"
                    value={stats?.activeSchedules || 0}
                    icon={Activity}
                    color="text-green-600"
                    bgColor="bg-green-50"
                    loading={loading}
                />
                <StatsCard
                    title="Routes Scheduled"
                    value={stats?.routesScheduled || 0}
                    icon={Route}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    loading={loading}
                />
                <StatsCard
                    title="Buses Scheduled"
                    value={stats?.busesScheduled || 0}
                    icon={Bus}
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                    loading={loading}
                />
                <StatsCard
                    title="Utilization Rate"
                    value={stats?.utilizationRate ? `${stats.utilizationRate}%` : '0%'}
                    icon={Zap}
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                    loading={loading}
                    isText={true}
                />
                <StatsCard
                    title="Recent Schedules"
                    value={stats?.recentSchedules || 0}
                    icon={TrendingUp}
                    color="text-pink-600"
                    bgColor="bg-pink-50"
                    loading={loading}
                    subtitle="This week"
                />
            </div>

            {/* ✅ FILTERS SECTION */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-5 w-5 text-gray-600" />
                            <span>Schedule Filters</span>
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {activeFiltersCount} active
                                </Badge>
                            )}
                        </div>
                        <Button 
                            onClick={refreshAllData} 
                            variant="outline" 
                            size="sm" 
                            disabled={loading || routesLoading || busesLoading}
                        >
                            <RefreshCcw className={cn(
                                "h-4 w-4 mr-2", 
                                (loading || routesLoading || busesLoading) && "animate-spin"
                            )} />
                            Refresh
                        </Button>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search by route number, bus number, or locations..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="pl-10 pr-10"
                        />
                        {filters.search && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                onClick={() => handleSearchChange('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Route Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Route</label>
                            <Select
                                value={filters.routeId}
                                onValueChange={(value: string) => 
                                    updateFilters({ routeId: value })
                                }
                                disabled={routesLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select route" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        <div className="flex items-center">
                                            <Route className="h-4 w-4 mr-2 text-gray-400" />
                                            All Routes
                                        </div>
                                    </SelectItem>
                                    {routes.map((route) => (
                                        <SelectItem key={route.id} value={route.id}>
                                            <div className="flex items-center justify-between w-full">
                                                <span>{route.routeNumber}</span>
                                                {route._count && (
                                                    <Badge variant="outline" className="ml-2 text-xs">
                                                        {route._count.schedules}
                                                    </Badge>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bus Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Bus</label>
                            <Select
                                value={filters.busId}
                                onValueChange={(value: string) => 
                                    updateFilters({ busId: value })
                                }
                                disabled={busesLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select bus" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        <div className="flex items-center">
                                            <Bus className="h-4 w-4 mr-2 text-gray-400" />
                                            All Buses
                                        </div>
                                    </SelectItem>
                                    {buses.map((bus) => (
                                        <SelectItem key={bus.id} value={bus.id}>
                                            <div className="flex items-center justify-between w-full">
                                                <div>
                                                    <span>{bus.busNumber}</span>
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({bus.busType})
                                                    </span>
                                                </div>
                                                {bus._count && (
                                                    <Badge variant="outline" className="ml-2 text-xs">
                                                        {bus._count.schedules}
                                                    </Badge>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <Select
                                value={filters.status}
                                onValueChange={(value: FilterOptions['status']) => 
                                    updateFilters({ status: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center">
                                                <span className={cn(
                                                    "w-2 h-2 rounded-full mr-2",
                                                    option.value === 'active' && "bg-green-500",
                                                    option.value === 'inactive' && "bg-red-500",
                                                    option.value === 'all' && "bg-gray-500"
                                                )} />
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Time Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Time Period</label>
                            <Select
                                value={filters.timeFilter}
                                onValueChange={(value: FilterOptions['timeFilter']) => 
                                    updateFilters({ timeFilter: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_FILTER_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Sort By</label>
                            <Select
                                value={filters.sortBy}
                                onValueChange={(value: FilterOptions['sortBy']) => 
                                    updateFilters({ sortBy: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select sort" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_BY_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Sort Order</label>
                            <Select
                                value={filters.sortOrder}
                                onValueChange={(value: FilterOptions['sortOrder']) => 
                                    updateFilters({ sortOrder: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select order" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Descending (Z-A, New-Old)</SelectItem>
                                    <SelectItem value="asc">Ascending (A-Z, Old-New)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filters & Clear Button */}
                    {activeFiltersCount > 0 && (
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Active filters:</span>
                                <div className="flex items-center space-x-2 flex-wrap">
                                    {filters.search && (
                                        <Badge variant="outline" className="text-xs">
                                            Search: "{filters.search}"
                                        </Badge>
                                    )}
                                    {filters.routeId !== 'all' && (
                                        <Badge variant="outline" className="text-xs">
                                            Route: {routes.find(r => r.id === filters.routeId)?.routeNumber || 'Unknown'}
                                        </Badge>
                                    )}
                                    {filters.busId !== 'all' && (
                                        <Badge variant="outline" className="text-xs">
                                            Bus: {buses.find(b => b.id === filters.busId)?.busNumber || 'Unknown'}
                                        </Badge>
                                    )}
                                    {filters.status !== 'all' && (
                                        <Badge variant="outline" className="text-xs">
                                            Status: {filters.status}
                                        </Badge>
                                    )}
                                    {filters.timeFilter !== 'all' && (
                                        <Badge variant="outline" className="text-xs">
                                            Time: {TIME_FILTER_OPTIONS.find(o => o.value === filters.timeFilter)?.label}
                                        </Badge>
                                    )}
                                    {filters.sortBy !== 'createdAt' && (
                                        <Badge variant="outline" className="text-xs">
                                            Sort: {SORT_BY_OPTIONS.find(o => o.value === filters.sortBy)?.label}
                                        </Badge>
                                    )}
                                    {filters.sortOrder !== 'desc' && (
                                        <Badge variant="outline" className="text-xs">
                                            Order: Ascending
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={clearFilters}>
                                <X className="h-4 w-4 mr-1" />
                                Clear All
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ✅ TOP ROUTES AND BUSES SECTION */}
            {((stats?.topRoutesBySchedules && stats.topRoutesBySchedules.length > 0) || 
              (stats?.topBusesBySchedules && stats.topBusesBySchedules.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats?.topRoutesBySchedules && stats.topRoutesBySchedules.length > 0 && (
                        <TopRoutesCard
                            title="Most Scheduled Routes"
                            routes={stats.topRoutesBySchedules}
                            loading={loading}
                        />
                    )}
                    {stats?.topBusesBySchedules && stats.topBusesBySchedules.length > 0 && (
                        <TopBusesCard
                            title="Most Scheduled Buses"
                            buses={stats.topBusesBySchedules}
                            loading={loading}
                        />
                    )}
                </div>
            )}

            {/* ✅ ERROR STATE */}
            {error && (
                <Card className="border-red-200">
                    <CardContent className="p-4">
                        <div className="flex items-center text-red-600">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            <span className="text-sm">{error}</span>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="ml-auto"
                                onClick={fetchScheduleStats}
                            >
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

// ✅ STATS CARD COMPONENT
interface StatsCardProps {
    title: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    color: string
    bgColor: string
    loading?: boolean
    subtitle?: string
    isText?: boolean
}

function StatsCard({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    bgColor, 
    loading = false,
    subtitle,
    isText = false
}: StatsCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-lg", bgColor)}>
                        <Icon className={cn("h-5 w-5", color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <>
                                <div className="h-6 bg-gray-200 rounded w-12 animate-pulse mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                            </>
                        ) : (
                            <>
                                <p className={cn(
                                    "font-semibold text-gray-900",
                                    isText ? "text-lg" : "text-xl"
                                )}>
                                    {value}
                                </p>
                                <p className="text-xs text-gray-600 truncate">{title}</p>
                                {subtitle && (
                                    <p className="text-xs text-gray-500">{subtitle}</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ✅ TOP ROUTES BY SCHEDULES CARD
interface TopRoutesCardProps {
    title: string
    routes: Array<{
        routeNumber: string
        startLocation: string
        endLocation: string
        schedulesCount: number
    }>
    loading: boolean
}

function TopRoutesCard({ title, routes, loading }: TopRoutesCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <Route className="h-5 w-5 text-orange-600 mr-2" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : routes.length > 0 ? (
                    <div className="space-y-3">
                        {routes.slice(0, 5).map((route, index) => (
                            <div key={route.routeNumber} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-gray-500">
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {route.routeNumber}
                                        </span>
                                        <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                            {route.startLocation} → {route.endLocation}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {route.schedulesCount} schedules
                                </Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No route data available
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

// ✅ TOP BUSES BY SCHEDULES CARD
interface TopBusesCardProps {
    title: string
    buses: Array<{
        busNumber: string
        busType: string
        capacity: number
        schedulesCount: number
    }>
    loading: boolean
}

function TopBusesCard({ title, buses, loading }: TopBusesCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <Bus className="h-5 w-5 text-green-600 mr-2" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : buses.length > 0 ? (
                    <div className="space-y-3">
                        {buses.slice(0, 5).map((bus, index) => (
                            <div key={bus.busNumber} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-gray-500">
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {bus.busNumber}
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            {bus.busType} • {bus.capacity} seats
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {bus.schedulesCount} schedules
                                </Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No bus data available
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
