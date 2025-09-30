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
    Route,
    Search,
    Filter,
    RefreshCcw,
    MapPin,
    Clock,
    Activity,
    AlertTriangle,
    Navigation,
    TrendingUp,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ✅ TYPES FOR ROUTE STATISTICS
interface RouteStats {
    totalRoutes: number
    activeRoutes: number
    inactiveRoutes: number
    totalStops: number
    averageDistance: number
    averageTime: number
    popularLocations: {
        startLocations: Array<{ location: string; count: number }>
        endLocations: Array<{ location: string; count: number }>
    }
    recentRoutes: number
}

interface FilterOptions {
    search: string
    status: 'all' | 'active' | 'inactive'
    hasStops: 'all' | 'yes' | 'no'
    hasSchedules: 'all' | 'yes' | 'no'
}

// ✅ FILTER STATUS OPTIONS
const STATUS_OPTIONS = [
    { value: 'all', label: 'All Routes', color: 'bg-gray-100 text-gray-800' },
    { value: 'active', label: 'Active Routes', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inactive Routes', color: 'bg-red-100 text-red-800' }
] as const

const STOPS_OPTIONS = [
    { value: 'all', label: 'All Routes' },
    { value: 'yes', label: 'With Stops' },
    { value: 'no', label: 'Without Stops' }
] as const

const SCHEDULES_OPTIONS = [
    { value: 'all', label: 'All Routes' },
    { value: 'yes', label: 'With Schedules' },
    { value: 'no', label: 'Without Schedules' }
] as const

export function RoutesFilters() {
    const [stats, setStats] = useState<RouteStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<FilterOptions>({
        search: '',
        status: 'all',
        hasStops: 'all',
        hasSchedules: 'all'
    })

    const router = useRouter()
    const searchParams = useSearchParams()

    // ✅ SYNC FILTERS WITH URL PARAMS
    useEffect(() => {
        setFilters({
            search: searchParams.get('search') || '',
            status: (searchParams.get('status') as FilterOptions['status']) || 'all',
            hasStops: (searchParams.get('hasStops') as FilterOptions['hasStops']) || 'all',
            hasSchedules: (searchParams.get('hasSchedules') as FilterOptions['hasSchedules']) || 'all'
        })
    }, [searchParams])

    // ✅ FETCH ROUTE STATISTICS FROM API
    const fetchRouteStats = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            console.log('📊 Fetching route statistics...')

            const response = await fetch('/api/operator/routes/stats', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            })

            console.log('📈 Route stats response status:', response.status)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ 
                    error: `HTTP ${response.status}: ${response.statusText}` 
                }))
                throw new Error(errorData.error || 'Failed to fetch statistics')
            }

            const data = await response.json()
            console.log('✅ Route stats received:', data)

            setStats(data)

        } catch (err) {
            console.error('❌ Error fetching route stats:', err)
            const message = err instanceof Error ? err.message : 'Failed to load statistics'
            setError(message)
        } finally {
            setLoading(false)
        }
    }, [])

    // ✅ LOAD STATS ON MOUNT
    useEffect(() => {
        fetchRouteStats()
    }, [fetchRouteStats])

    // ✅ UPDATE URL WITH FILTER CHANGES
    const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
        const updatedFilters = { ...filters, ...newFilters }
        setFilters(updatedFilters)

        // Update URL params
        const params = new URLSearchParams()
        
        if (updatedFilters.search) params.set('search', updatedFilters.search)
        if (updatedFilters.status !== 'all') params.set('status', updatedFilters.status)
        if (updatedFilters.hasStops !== 'all') params.set('hasStops', updatedFilters.hasStops)
        if (updatedFilters.hasSchedules !== 'all') params.set('hasSchedules', updatedFilters.hasSchedules)

        // Reset to page 1 when filters change
        params.set('page', '1')

        router.push(`?${params.toString()}`)
    }, [filters, router])

    // ✅ CLEAR ALL FILTERS
    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            status: 'all',
            hasStops: 'all',
            hasSchedules: 'all'
        })
        router.push(window.location.pathname)
    }, [router])

    // ✅ CALCULATE ACTIVE FILTERS COUNT
    const activeFiltersCount = useMemo(() => {
        let count = 0
        if (filters.search) count++
        if (filters.status !== 'all') count++
        if (filters.hasStops !== 'all') count++
        if (filters.hasSchedules !== 'all') count++
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

    return (
        <div className="space-y-6">
            {/* ✅ ROUTE STATISTICS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatsCard
                    title="Total Routes"
                    value={stats?.totalRoutes || 0}
                    icon={Route}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    loading={loading}
                />
                <StatsCard
                    title="Active Routes"
                    value={stats?.activeRoutes || 0}
                    icon={Activity}
                    color="text-green-600"
                    bgColor="bg-green-50"
                    loading={loading}
                />
                <StatsCard
                    title="Total Stops"
                    value={stats?.totalStops || 0}
                    icon={MapPin}
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                    loading={loading}
                />
                <StatsCard
                    title="Avg Distance"
                    value={stats?.averageDistance ? `${stats.averageDistance.toFixed(1)}km` : '0km'}
                    icon={Navigation}
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                    loading={loading}
                    isText={true}
                />
                <StatsCard
                    title="Avg Time"
                    value={stats?.averageTime ? `${Math.round(stats.averageTime)}min` : '0min'}
                    icon={Clock}
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                    loading={loading}
                    isText={true}
                />
                <StatsCard
                    title="Recent Routes"
                    value={stats?.recentRoutes || 0}
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
                            <span>Route Filters</span>
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {activeFiltersCount} active
                                </Badge>
                            )}
                        </div>
                        <Button 
                            onClick={fetchRouteStats} 
                            variant="outline" 
                            size="sm" 
                            disabled={loading}
                        >
                            <RefreshCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                            Refresh
                        </Button>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search routes by number, start or end location..."
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                        {/* Stops Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Stops</label>
                            <Select
                                value={filters.hasStops}
                                onValueChange={(value: FilterOptions['hasStops']) => 
                                    updateFilters({ hasStops: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select stops filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STOPS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Schedules Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Schedules</label>
                            <Select
                                value={filters.hasSchedules}
                                onValueChange={(value: FilterOptions['hasSchedules']) => 
                                    updateFilters({ hasSchedules: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select schedules filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SCHEDULES_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filters & Clear Button */}
                    {activeFiltersCount > 0 && (
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Active filters:</span>
                                <div className="flex items-center space-x-2">
                                    {filters.search && (
                                        <Badge variant="outline" className="text-xs">
                                            Search: "{filters.search}"
                                        </Badge>
                                    )}
                                    {filters.status !== 'all' && (
                                        <Badge variant="outline" className="text-xs">
                                            Status: {filters.status}
                                        </Badge>
                                    )}
                                    {filters.hasStops !== 'all' && (
                                        <Badge variant="outline" className="text-xs">
                                            Stops: {filters.hasStops === 'yes' ? 'With stops' : 'Without stops'}
                                        </Badge>
                                    )}
                                    {filters.hasSchedules !== 'all' && (
                                        <Badge variant="outline" className="text-xs">
                                            Schedules: {filters.hasSchedules === 'yes' ? 'With schedules' : 'Without schedules'}
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

            {/* ✅ POPULAR LOCATIONS SECTION */}
            {stats?.popularLocations && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PopularLocationsCard
                        title="Popular Start Locations"
                        locations={stats.popularLocations.startLocations}
                        loading={loading}
                    />
                    <PopularLocationsCard
                        title="Popular End Locations"
                        locations={stats.popularLocations.endLocations}
                        loading={loading}
                    />
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
                                onClick={fetchRouteStats}
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

// ✅ POPULAR LOCATIONS CARD
interface PopularLocationsCardProps {
    title: string
    locations: Array<{ location: string; count: number }>
    loading: boolean
}

function PopularLocationsCard({ title, locations, loading }: PopularLocationsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : locations.length > 0 ? (
                    <div className="space-y-2">
                        {locations.slice(0, 5).map((location, index) => (
                            <div key={location.location} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        #{index + 1}
                                    </span>
                                    <span className="text-sm text-gray-900 truncate">
                                        {location.location}
                                    </span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {location.count}
                                </Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No location data available
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
