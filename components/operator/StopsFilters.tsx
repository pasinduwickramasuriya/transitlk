// 'use client'

// import React, { useState, useCallback, useEffect, useMemo } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select'
// import {
//     MapPin,
//     Search,
//     Filter,
//     RefreshCcw,
//     Route,
//     Clock,
//     Activity,
//     AlertTriangle,
//     Navigation,
//     TrendingUp,
//     X,
//     Globe,
//     Target
// } from 'lucide-react'
// import { cn } from '@/lib/utils'

// // ✅ TYPES FOR STOPS STATISTICS
// interface StopStats {
//     totalStops: number
//     routesWithStops: number
//     routesWithoutStops: number
//     averageStopsPerRoute: number
//     recentStops: number
//     completionPercentage: number
//     coordinateBounds: {
//         minLat: number
//         maxLat: number
//         minLng: number
//         maxLng: number
//     } | null
//     topRoutesByStops: Array<{
//         routeNumber: string
//         startLocation: string
//         endLocation: string
//         stopsCount: number
//     }>
//     stopsPerRoute: Array<{
//         routeNumber: string
//         stopsCount: number
//     }>
// }

// interface FilterOptions {
//     search: string
//     routeId: 'all' | string
//     sortBy: 'createdAt' | 'name' | 'order' | 'route'
//     sortOrder: 'asc' | 'desc'
//     coordinateFilter: 'all' | 'valid' | 'colombo' | 'outbound'
// }

// interface RouteOption {
//     id: string
//     routeNumber: string
//     startLocation: string
//     endLocation: string
//     _count?: {
//         stops: number
//     }
// }

// // ✅ FILTER OPTIONS
// const SORT_BY_OPTIONS = [
//     { value: 'createdAt', label: 'Date Created' },
//     { value: 'name', label: 'Stop Name' },
//     { value: 'order', label: 'Stop Order' },
//     { value: 'route', label: 'Route Number' }
// ] as const

// const COORDINATE_OPTIONS = [
//     { value: 'all', label: 'All Locations', color: 'bg-gray-100 text-gray-800' },
//     { value: 'valid', label: 'Valid Coordinates', color: 'bg-green-100 text-green-800' },
//     { value: 'colombo', label: 'Colombo Area', color: 'bg-blue-100 text-blue-800' },
//     { value: 'outbound', label: 'Outside Colombo', color: 'bg-orange-100 text-orange-800' }
// ] as const

// export function StopsFilters() {
//     const [stats, setStats] = useState<StopStats | null>(null)
//     const [routes, setRoutes] = useState<RouteOption[]>([])
//     const [loading, setLoading] = useState(true)
//     const [routesLoading, setRoutesLoading] = useState(false)
//     const [error, setError] = useState<string | null>(null)
//     const [filters, setFilters] = useState<FilterOptions>({
//         search: '',
//         routeId: 'all',
//         sortBy: 'createdAt',
//         sortOrder: 'desc',
//         coordinateFilter: 'all'
//     })

//     const router = useRouter()
//     const searchParams = useSearchParams()

//     // ✅ SYNC FILTERS WITH URL PARAMS
//     useEffect(() => {
//         setFilters({
//             search: searchParams.get('search') || '',
//             routeId: searchParams.get('routeId') || 'all',
//             sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || 'createdAt',
//             sortOrder: (searchParams.get('sortOrder') as FilterOptions['sortOrder']) || 'desc',
//             coordinateFilter: (searchParams.get('coordinateFilter') as FilterOptions['coordinateFilter']) || 'all'
//         })
//     }, [searchParams])

//     // ✅ FETCH STOPS STATISTICS FROM API
//     const fetchStopsStats = useCallback(async () => {
//         setLoading(true)
//         setError(null)

//         try {
//             console.log('📊 Fetching stops statistics...')

//             const response = await fetch('/api/operator/stops/stats', {
//                 method: 'GET',
//                 headers: { 'Content-Type': 'application/json' },
//                 cache: 'no-store'
//             })

//             console.log('📈 Stops stats response status:', response.status)

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({ 
//                     error: `HTTP ${response.status}: ${response.statusText}` 
//                 }))
//                 throw new Error(errorData.error || 'Failed to fetch statistics')
//             }

//             const data = await response.json()
//             console.log('✅ Stops stats received:', data)

//             setStats(data)

//         } catch (err) {
//             console.error('❌ Error fetching stops stats:', err)
//             const message = err instanceof Error ? err.message : 'Failed to load statistics'
//             setError(message)
//         } finally {
//             setLoading(false)
//         }
//     }, [])

//     // ✅ FETCH ROUTES FOR FILTER DROPDOWN
//     const fetchRoutes = useCallback(async () => {
//         setRoutesLoading(true)
//         try {
//             console.log('🚌 Fetching routes for filter...')

//             const response = await fetch('/api/operator/routes?limit=100&includeStats=true', {
//                 method: 'GET',
//                 headers: { 'Content-Type': 'application/json' },
//                 cache: 'no-store'
//             })

//             if (response.ok) {
//                 const data = await response.json()
//                 setRoutes(data.routes || [])
//                 console.log(`✅ Loaded ${data.routes?.length || 0} routes for filter`)
//             } else {
//                 console.error('Failed to fetch routes for filter')
//             }
//         } catch (error) {
//             console.error('Error fetching routes:', error)
//         } finally {
//             setRoutesLoading(false)
//         }
//     }, [])

//     // ✅ LOAD STATS AND ROUTES ON MOUNT
//     useEffect(() => {
//         fetchStopsStats()
//         fetchRoutes()
//     }, [fetchStopsStats, fetchRoutes])

//     // ✅ UPDATE URL WITH FILTER CHANGES
//     const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
//         const updatedFilters = { ...filters, ...newFilters }
//         setFilters(updatedFilters)

//         // Update URL params
//         const params = new URLSearchParams()
        
//         if (updatedFilters.search) params.set('search', updatedFilters.search)
//         if (updatedFilters.routeId !== 'all') params.set('routeId', updatedFilters.routeId)
//         if (updatedFilters.sortBy !== 'createdAt') params.set('sortBy', updatedFilters.sortBy)
//         if (updatedFilters.sortOrder !== 'desc') params.set('sortOrder', updatedFilters.sortOrder)
//         if (updatedFilters.coordinateFilter !== 'all') params.set('coordinateFilter', updatedFilters.coordinateFilter)

//         // Reset to page 1 when filters change
//         params.set('page', '1')

//         router.push(`?${params.toString()}`)
//     }, [filters, router])

//     // ✅ CLEAR ALL FILTERS
//     const clearFilters = useCallback(() => {
//         setFilters({
//             search: '',
//             routeId: 'all',
//             sortBy: 'createdAt',
//             sortOrder: 'desc',
//             coordinateFilter: 'all'
//         })
//         router.push(window.location.pathname)
//     }, [router])

//     // ✅ CALCULATE ACTIVE FILTERS COUNT
//     const activeFiltersCount = useMemo(() => {
//         let count = 0
//         if (filters.search) count++
//         if (filters.routeId !== 'all') count++
//         if (filters.sortBy !== 'createdAt') count++
//         if (filters.sortOrder !== 'desc') count++
//         if (filters.coordinateFilter !== 'all') count++
//         return count
//     }, [filters])

//     // ✅ HANDLE SEARCH INPUT
//     const handleSearchChange = useCallback((value: string) => {
//         updateFilters({ search: value })
//     }, [updateFilters])

//     // ✅ DEBOUNCED SEARCH
//     useEffect(() => {
//         const timeoutId = setTimeout(() => {
//             if (filters.search !== (searchParams.get('search') || '')) {
//                 updateFilters({ search: filters.search })
//             }
//         }, 300)

//         return () => clearTimeout(timeoutId)
//     }, [filters.search, searchParams, updateFilters])

//     // ✅ REFRESH ALL DATA
//     const refreshAllData = useCallback(() => {
//         fetchStopsStats()
//         fetchRoutes()
//     }, [fetchStopsStats, fetchRoutes])

//     return (
//         <div className="space-y-6">
//             {/* ✅ STOPS STATISTICS CARDS */}
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                 <StatsCard
//                     title="Total Stops"
//                     value={stats?.totalStops || 0}
//                     icon={MapPin}
//                     color="text-purple-600"
//                     bgColor="bg-purple-50"
//                     loading={loading}
//                 />
//                 <StatsCard
//                     title="Routes w/ Stops"
//                     value={stats?.routesWithStops || 0}
//                     icon={Route}
//                     color="text-green-600"
//                     bgColor="bg-green-50"
//                     loading={loading}
//                 />
//                 <StatsCard
//                     title="Avg Stops/Route"
//                     value={stats?.averageStopsPerRoute ? stats.averageStopsPerRoute.toFixed(1) : '0'}
//                     icon={Activity}
//                     color="text-blue-600"
//                     bgColor="bg-blue-50"
//                     loading={loading}
//                     isText={true}
//                 />
//                 <StatsCard
//                     title="Completion Rate"
//                     value={stats?.completionPercentage ? `${stats.completionPercentage}%` : '0%'}
//                     icon={Target}
//                     color="text-orange-600"
//                     bgColor="bg-orange-50"
//                     loading={loading}
//                     isText={true}
//                 />
//                 <StatsCard
//                     title="Coverage Area"
//                     value={stats?.coordinateBounds ? 'Mapped' : 'Unknown'}
//                     icon={Globe}
//                     color="text-indigo-600"
//                     bgColor="bg-indigo-50"
//                     loading={loading}
//                     isText={true}
//                 />
//                 <StatsCard
//                     title="Recent Stops"
//                     value={stats?.recentStops || 0}
//                     icon={TrendingUp}
//                     color="text-pink-600"
//                     bgColor="bg-pink-50"
//                     loading={loading}
//                     subtitle="This week"
//                 />
//             </div>

//             {/* ✅ FILTERS SECTION */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                             <Filter className="h-5 w-5 text-gray-600" />
//                             <span>Stops Filters</span>
//                             {activeFiltersCount > 0 && (
//                                 <Badge variant="secondary" className="ml-2">
//                                     {activeFiltersCount} active
//                                 </Badge>
//                             )}
//                         </div>
//                         <Button 
//                             onClick={refreshAllData} 
//                             variant="outline" 
//                             size="sm" 
//                             disabled={loading || routesLoading}
//                         >
//                             <RefreshCcw className={cn(
//                                 "h-4 w-4 mr-2", 
//                                 (loading || routesLoading) && "animate-spin"
//                             )} />
//                             Refresh
//                         </Button>
//                     </CardTitle>
//                 </CardHeader>

//                 <CardContent className="space-y-4">
//                     {/* Search Input */}
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                         <Input
//                             placeholder="Search stops by name..."
//                             value={filters.search}
//                             onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
//                             className="pl-10 pr-10"
//                         />
//                         {filters.search && (
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
//                                 onClick={() => handleSearchChange('')}
//                             >
//                                 <X className="h-4 w-4" />
//                             </Button>
//                         )}
//                     </div>

//                     {/* Filter Dropdowns */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         {/* Route Filter */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Route</label>
//                             <Select
//                                 value={filters.routeId}
//                                 onValueChange={(value: string) => 
//                                     updateFilters({ routeId: value })
//                                 }
//                                 disabled={routesLoading}
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select route" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">
//                                         <div className="flex items-center">
//                                             <Route className="h-4 w-4 mr-2 text-gray-400" />
//                                             All Routes
//                                         </div>
//                                     </SelectItem>
//                                     {routes.map((route) => (
//                                         <SelectItem key={route.id} value={route.id}>
//                                             <div className="flex items-center justify-between w-full">
//                                                 <span>{route.routeNumber}</span>
//                                                 {route._count && (
//                                                     <Badge variant="outline" className="ml-2 text-xs">
//                                                         {route._count.stops}
//                                                     </Badge>
//                                                 )}
//                                             </div>
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         {/* Sort By Filter */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Sort By</label>
//                             <Select
//                                 value={filters.sortBy}
//                                 onValueChange={(value: FilterOptions['sortBy']) => 
//                                     updateFilters({ sortBy: value })
//                                 }
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select sort" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {SORT_BY_OPTIONS.map((option) => (
//                                         <SelectItem key={option.value} value={option.value}>
//                                             {option.label}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         {/* Sort Order Filter */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Sort Order</label>
//                             <Select
//                                 value={filters.sortOrder}
//                                 onValueChange={(value: FilterOptions['sortOrder']) => 
//                                     updateFilters({ sortOrder: value })
//                                 }
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select order" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="desc">Descending (Z-A, New-Old)</SelectItem>
//                                     <SelectItem value="asc">Ascending (A-Z, Old-New)</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         {/* Coordinate Filter */}
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700">Location</label>
//                             <Select
//                                 value={filters.coordinateFilter}
//                                 onValueChange={(value: FilterOptions['coordinateFilter']) => 
//                                     updateFilters({ coordinateFilter: value })
//                                 }
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select location filter" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {COORDINATE_OPTIONS.map((option) => (
//                                         <SelectItem key={option.value} value={option.value}>
//                                             <div className="flex items-center">
//                                                 <span className={cn(
//                                                     "w-2 h-2 rounded-full mr-2",
//                                                     option.value === 'valid' && "bg-green-500",
//                                                     option.value === 'colombo' && "bg-blue-500",
//                                                     option.value === 'outbound' && "bg-orange-500",
//                                                     option.value === 'all' && "bg-gray-500"
//                                                 )} />
//                                                 {option.label}
//                                             </div>
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

//                     {/* Active Filters & Clear Button */}
//                     {activeFiltersCount > 0 && (
//                         <div className="flex items-center justify-between pt-4 border-t">
//                             <div className="flex items-center space-x-2">
//                                 <span className="text-sm text-gray-600">Active filters:</span>
//                                 <div className="flex items-center space-x-2 flex-wrap">
//                                     {filters.search && (
//                                         <Badge variant="outline" className="text-xs">
//                                             Search: "{filters.search}"
//                                         </Badge>
//                                     )}
//                                     {filters.routeId !== 'all' && (
//                                         <Badge variant="outline" className="text-xs">
//                                             Route: {routes.find(r => r.id === filters.routeId)?.routeNumber || 'Unknown'}
//                                         </Badge>
//                                     )}
//                                     {filters.sortBy !== 'createdAt' && (
//                                         <Badge variant="outline" className="text-xs">
//                                             Sort: {SORT_BY_OPTIONS.find(o => o.value === filters.sortBy)?.label}
//                                         </Badge>
//                                     )}
//                                     {filters.sortOrder !== 'desc' && (
//                                         <Badge variant="outline" className="text-xs">
//                                             Order: Ascending
//                                         </Badge>
//                                     )}
//                                     {filters.coordinateFilter !== 'all' && (
//                                         <Badge variant="outline" className="text-xs">
//                                             Location: {COORDINATE_OPTIONS.find(o => o.value === filters.coordinateFilter)?.label}
//                                         </Badge>
//                                     )}
//                                 </div>
//                             </div>
//                             <Button variant="outline" size="sm" onClick={clearFilters}>
//                                 <X className="h-4 w-4 mr-1" />
//                                 Clear All
//                             </Button>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>

//             {/* ✅ TOP ROUTES BY STOPS SECTION */}
//             {stats?.topRoutesByStops && stats.topRoutesByStops.length > 0 && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <TopRoutesCard
//                         title="Routes with Most Stops"
//                         routes={stats.topRoutesByStops}
//                         loading={loading}
//                     />
//                     <CoordinatesInfoCard
//                         title="Geographic Coverage"
//                         bounds={stats.coordinateBounds}
//                         totalStops={stats.totalStops}
//                         loading={loading}
//                     />
//                 </div>
//             )}

//             {/* ✅ ERROR STATE */}
//             {error && (
//                 <Card className="border-red-200">
//                     <CardContent className="p-4">
//                         <div className="flex items-center text-red-600">
//                             <AlertTriangle className="h-5 w-5 mr-2" />
//                             <span className="text-sm">{error}</span>
//                             <Button 
//                                 variant="outline" 
//                                 size="sm" 
//                                 className="ml-auto"
//                                 onClick={fetchStopsStats}
//                             >
//                                 Retry
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     )
// }

// // ✅ STATS CARD COMPONENT
// interface StatsCardProps {
//     title: string
//     value: string | number
//     icon: React.ComponentType<{ className?: string }>
//     color: string
//     bgColor: string
//     loading?: boolean
//     subtitle?: string
//     isText?: boolean
// }

// function StatsCard({ 
//     title, 
//     value, 
//     icon: Icon, 
//     color, 
//     bgColor, 
//     loading = false,
//     subtitle,
//     isText = false
// }: StatsCardProps) {
//     return (
//         <Card className="hover:shadow-md transition-shadow">
//             <CardContent className="p-4">
//                 <div className="flex items-center space-x-3">
//                     <div className={cn("p-2 rounded-lg", bgColor)}>
//                         <Icon className={cn("h-5 w-5", color)} />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                         {loading ? (
//                             <>
//                                 <div className="h-6 bg-gray-200 rounded w-12 animate-pulse mb-1"></div>
//                                 <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
//                             </>
//                         ) : (
//                             <>
//                                 <p className={cn(
//                                     "font-semibold text-gray-900",
//                                     isText ? "text-lg" : "text-xl"
//                                 )}>
//                                     {value}
//                                 </p>
//                                 <p className="text-xs text-gray-600 truncate">{title}</p>
//                                 {subtitle && (
//                                     <p className="text-xs text-gray-500">{subtitle}</p>
//                                 )}
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// // ✅ TOP ROUTES BY STOPS CARD
// interface TopRoutesCardProps {
//     title: string
//     routes: Array<{
//         routeNumber: string
//         startLocation: string
//         endLocation: string
//         stopsCount: number
//     }>
//     loading: boolean
// }

// function TopRoutesCard({ title, routes, loading }: TopRoutesCardProps) {
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle className="text-lg flex items-center">
//                     <Route className="h-5 w-5 text-purple-600 mr-2" />
//                     {title}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 {loading ? (
//                     <div className="space-y-3">
//                         {Array.from({ length: 3 }).map((_, i) => (
//                             <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
//                         ))}
//                     </div>
//                 ) : routes.length > 0 ? (
//                     <div className="space-y-3">
//                         {routes.slice(0, 5).map((route, index) => (
//                             <div key={route.routeNumber} className="flex items-center justify-between">
//                                 <div className="flex items-center space-x-3">
//                                     <span className="text-sm font-medium text-gray-500">
//                                         #{index + 1}
//                                     </span>
//                                     <div>
//                                         <span className="text-sm font-medium text-gray-900">
//                                             {route.routeNumber}
//                                         </span>
//                                         <p className="text-xs text-gray-500 truncate max-w-[200px]">
//                                             {route.startLocation} → {route.endLocation}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <Badge variant="secondary" className="text-xs">
//                                     {route.stopsCount} stops
//                                 </Badge>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="text-sm text-gray-500 text-center py-4">
//                         No route data available
//                     </p>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }

// // ✅ COORDINATES INFO CARD
// interface CoordinatesInfoCardProps {
//     title: string
//     bounds: StopStats['coordinateBounds']
//     totalStops: number
//     loading: boolean
// }

// function CoordinatesInfoCard({ title, bounds, totalStops, loading }: CoordinatesInfoCardProps) {
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle className="text-lg flex items-center">
//                     <Globe className="h-5 w-5 text-blue-600 mr-2" />
//                     {title}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 {loading ? (
//                     <div className="space-y-2">
//                         {Array.from({ length: 3 }).map((_, i) => (
//                             <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
//                         ))}
//                     </div>
//                 ) : bounds ? (
//                     <div className="space-y-3">
//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                             <div>
//                                 <span className="text-gray-600">North:</span>
//                                 <p className="font-mono text-xs">{bounds.maxLat.toFixed(6)}</p>
//                             </div>
//                             <div>
//                                 <span className="text-gray-600">South:</span>
//                                 <p className="font-mono text-xs">{bounds.minLat.toFixed(6)}</p>
//                             </div>
//                             <div>
//                                 <span className="text-gray-600">East:</span>
//                                 <p className="font-mono text-xs">{bounds.maxLng.toFixed(6)}</p>
//                             </div>
//                             <div>
//                                 <span className="text-gray-600">West:</span>
//                                 <p className="font-mono text-xs">{bounds.minLng.toFixed(6)}</p>
//                             </div>
//                         </div>
//                         <div className="pt-2 border-t">
//                             <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-600">Coverage:</span>
//                                 <Badge variant="outline">
//                                     {totalStops} stops mapped
//                                 </Badge>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <p className="text-sm text-gray-500 text-center py-4">
//                         No geographic data available
//                     </p>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }




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
    MapPin,
    Search,
    Filter,
    RefreshCcw,
    Route,
    AlertTriangle,
    TrendingUp,
    X,
    Globe,
    Target,
    Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ✅ TYPES FOR STOPS STATISTICS (Matching API Response)
interface StopStats {
    totalStops: number
    routesWithStops: number
    routesWithoutStops: number
    averageStopsPerRoute: number
    recentStops: number
    completionPercentage: number
    stopsPerRoute: Array<{
        routeNumber: string
        stopsCount: number
    }>
}

interface FilterOptions {
    search: string
    routeId: 'all' | string
}

interface RouteOption {
    id: string
    routeNumber: string
    startLocation: string
    endLocation: string
}

export function StopsFilters() {
    const [stats, setStats] = useState<StopStats | null>(null)
    const [routes, setRoutes] = useState<RouteOption[]>([])
    const [loading, setLoading] = useState(true)
    const [routesLoading, setRoutesLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<FilterOptions>({
        search: '',
        routeId: 'all'
    })

    const router = useRouter()
    const searchParams = useSearchParams()

    // ✅ SYNC FILTERS WITH URL PARAMS (Matching StopsTable)
    useEffect(() => {
        setFilters({
            search: searchParams.get('search') || '',
            routeId: searchParams.get('routeId') || 'all'
        })
    }, [searchParams])

    // ✅ FETCH STOPS STATISTICS FROM API
    const fetchStopsStats = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            console.log('📊 Fetching stops statistics...')

            const response = await fetch('/api/operator/stops/stats', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store'
            })

            console.log('📈 Stops stats response status:', response.status)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ 
                    error: `HTTP ${response.status}: ${response.statusText}` 
                }))
                throw new Error(errorData.error || 'Failed to fetch statistics')
            }

            const data = await response.json()
            console.log('✅ Stops stats received:', data)

            setStats(data)

        } catch (err) {
            console.error('❌ Error fetching stops stats:', err)
            const message = err instanceof Error ? err.message : 'Failed to load statistics'
            setError(message)
        } finally {
            setLoading(false)
        }
    }, [])

    // ✅ FETCH ROUTES FOR FILTER DROPDOWN (Matching StopsTable)
    const fetchRoutes = useCallback(async () => {
        setRoutesLoading(true)
        try {
            console.log('🚌 Fetching routes for filter...')

            const response = await fetch('/api/operator/routes?limit=100', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
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

    // ✅ LOAD STATS AND ROUTES ON MOUNT
    useEffect(() => {
        fetchStopsStats()
        fetchRoutes()
    }, [fetchStopsStats, fetchRoutes])

    // ✅ UPDATE URL WITH FILTER CHANGES (Matching StopsTable params)
    const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
        const updatedFilters = { ...filters, ...newFilters }
        setFilters(updatedFilters)

        // Update URL params to match what StopsTable expects
        const params = new URLSearchParams()
        
        if (updatedFilters.search) params.set('search', updatedFilters.search)
        if (updatedFilters.routeId !== 'all') params.set('routeId', updatedFilters.routeId)

        // Reset to page 1 when filters change
        params.set('page', '1')

        router.push(`?${params.toString()}`)
    }, [filters, router])

    // ✅ CLEAR ALL FILTERS
    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            routeId: 'all'
        })
        router.push(window.location.pathname)
    }, [router])

    // ✅ CALCULATE ACTIVE FILTERS COUNT
    const activeFiltersCount = useMemo(() => {
        let count = 0
        if (filters.search) count++
        if (filters.routeId !== 'all') count++
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
        fetchStopsStats()
        fetchRoutes()
    }, [fetchStopsStats, fetchRoutes])

    return (
        <div className="space-y-6">
            {/* ✅ STOPS STATISTICS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatsCard
                    title="Total Stops"
                    value={stats?.totalStops || 0}
                    icon={MapPin}
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                    loading={loading}
                />
                <StatsCard
                    title="Routes w/ Stops"
                    value={stats?.routesWithStops || 0}
                    icon={Route}
                    color="text-green-600"
                    bgColor="bg-green-50"
                    loading={loading}
                />
                <StatsCard
                    title="Avg Stops/Route"
                    value={stats?.averageStopsPerRoute ? stats.averageStopsPerRoute.toFixed(1) : '0'}
                    icon={Activity}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    loading={loading}
                    isText={true}
                />
                <StatsCard
                    title="Completion Rate"
                    value={stats?.completionPercentage ? `${stats.completionPercentage}%` : '0%'}
                    icon={Target}
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                    loading={loading}
                    isText={true}
                />
                <StatsCard
                    title="Routes Missing"
                    value={stats?.routesWithoutStops || 0}
                    icon={AlertTriangle}
                    color="text-red-600"
                    bgColor="bg-red-50"
                    loading={loading}
                />
                <StatsCard
                    title="Recent Stops"
                    value={stats?.recentStops || 0}
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
                            <span>Stops Filters</span>
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
                            disabled={loading || routesLoading}
                        >
                            <RefreshCcw className={cn(
                                "h-4 w-4 mr-2", 
                                (loading || routesLoading) && "animate-spin"
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
                            placeholder="Search stops by name..."
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

                    {/* Filter Dropdown - Route Only (Matching StopsTable) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            <div className="flex flex-col">
                                                <span className="font-medium">{route.routeNumber}</span>
                                                <span className="text-xs text-gray-500">
                                                    {route.startLocation} → {route.endLocation}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Apply Button */}
                        <div className="flex items-end">
                            <Button 
                                onClick={() => updateFilters({})} 
                                className="w-full"
                                disabled={loading}
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Apply Filters
                            </Button>
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

            {/* ✅ TOP ROUTES BY STOPS SECTION */}
            {stats?.stopsPerRoute && stats.stopsPerRoute.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TopRoutesCard
                        title="Routes with Most Stops"
                        routes={stats.stopsPerRoute.slice(0, 10)}
                        loading={loading}
                    />
                    <RoutesCoverageCard
                        title="Route Coverage Summary"
                        routesWithStops={stats.routesWithStops}
                        routesWithoutStops={stats.routesWithoutStops}
                        completionPercentage={stats.completionPercentage}
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
                                onClick={fetchStopsStats}
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
                                    <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ✅ TOP ROUTES BY STOPS CARD
interface TopRoutesCardProps {
    title: string
    routes: Array<{
        routeNumber: string
        stopsCount: number
    }>
    loading: boolean
}

function TopRoutesCard({ title, routes, loading }: TopRoutesCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <Route className="h-5 w-5 text-purple-600 mr-2" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : routes.length > 0 ? (
                    <div className="space-y-3">
                        {routes.slice(0, 8).map((route, index) => (
                            <div key={route.routeNumber} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-gray-500 w-6">
                                        #{index + 1}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {route.routeNumber}
                                    </span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {route.stopsCount} stops
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

// ✅ ROUTES COVERAGE CARD
interface RoutesCoverageCardProps {
    title: string
    routesWithStops: number
    routesWithoutStops: number
    completionPercentage: number
    loading: boolean
}

function RoutesCoverageCard({ 
    title, 
    routesWithStops, 
    routesWithoutStops, 
    completionPercentage, 
    loading 
}: RoutesCoverageCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <Globe className="h-5 w-5 text-blue-600 mr-2" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {routesWithStops}
                                </div>
                                <div className="text-sm text-green-700">
                                    With Stops
                                </div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                    {routesWithoutStops}
                                </div>
                                <div className="text-sm text-red-700">
                                    Missing Stops
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-3 border-t">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">Overall Completion:</span>
                                <span className="font-semibold">{completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
