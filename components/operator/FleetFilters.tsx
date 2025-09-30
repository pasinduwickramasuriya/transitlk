// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter, useSearchParams, usePathname } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { Card, CardContent } from '@/components/ui/card'
// import { 
//   Search, 
//   Filter, 
//   X,
//   Bus,
//   Activity,
//   AlertTriangle,
//   Clock,
//   CheckCircle,
//   Wifi,
//   WifiOff
// } from 'lucide-react'

// interface FilterOption {
//   value: string
//   label: string
//   count?: number
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
// }

// export function FleetFilters() {
//   const router = useRouter()
//   const pathname = usePathname()
//   const searchParams = useSearchParams()
  
//   // ✅ CURRENT FILTER VALUES
//   const [search, setSearch] = useState(searchParams.get('search') || '')
//   const [busType, setBusType] = useState(searchParams.get('busType') || 'all')
//   const [status, setStatus] = useState(searchParams.get('status') || 'all')
//   const [hasDevice, setHasDevice] = useState(searchParams.get('hasDevice') || 'all')

//   // ✅ UPDATE LOCAL STATE WHEN URL CHANGES
//   useEffect(() => {
//     setSearch(searchParams.get('search') || '')
//     setBusType(searchParams.get('busType') || 'all')
//     setStatus(searchParams.get('status') || 'all')
//     setHasDevice(searchParams.get('hasDevice') || 'all')
//   }, [searchParams])

//   // ✅ FILTER OPTIONS
//   const busTypeOptions: FilterOption[] = [
//     { value: 'all', label: 'All Types' },
//     { value: 'AC Luxury', label: 'AC Luxury', count: 8 },
//     { value: 'Semi Luxury', label: 'Semi Luxury', count: 12 },
//     { value: 'Normal', label: 'Normal', count: 15 },
//     { value: 'Express', label: 'Express', count: 5 }
//   ]

//   const statusOptions: FilterOption[] = [
//     { value: 'all', label: 'All Status', icon: Filter },
//     { value: 'active', label: 'Active', icon: Activity, color: 'text-green-600' },
//     { value: 'inactive', label: 'Inactive', icon: Clock, color: 'text-red-600' },
//     { value: 'offline', label: 'Offline', icon: AlertTriangle, color: 'text-yellow-600' }
//   ]

//   const deviceOptions: FilterOption[] = [
//     { value: 'all', label: 'All Buses' },
//     { value: 'yes', label: 'With GPS', icon: Wifi, color: 'text-green-600' },
//     { value: 'no', label: 'Without GPS', icon: WifiOff, color: 'text-red-600' }
//   ]

//   // ✅ APPLY FILTERS FUNCTION
//   const applyFilters = () => {
//     const params = new URLSearchParams()
    
//     if (search.trim()) params.set('search', search.trim())
//     if (busType !== 'all') params.set('busType', busType)
//     if (status !== 'all') params.set('status', status)
//     if (hasDevice !== 'all') params.set('hasDevice', hasDevice)
    
//     const queryString = params.toString()
//     const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
//     router.push(newUrl)
//   }

//   // ✅ CLEAR ALL FILTERS
//   const clearFilters = () => {
//     setSearch('')
//     setBusType('all')
//     setStatus('all')
//     setHasDevice('all')
//     router.push(pathname)
//   }

//   // ✅ QUICK FILTER APPLICATION
//   const applyQuickFilter = (key: string, value: string) => {
//     const params = new URLSearchParams(searchParams.toString())
    
//     if (value === 'all') {
//       params.delete(key)
//     } else {
//       params.set(key, value)
//     }
    
//     const queryString = params.toString()
//     const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
//     router.push(newUrl)
//   }

//   // ✅ HANDLE SEARCH INPUT
//   const handleSearchKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       applyFilters()
//     }
//   }

//   // ✅ COUNT ACTIVE FILTERS
//   const activeFiltersCount = [
//     search.trim(),
//     busType !== 'all' ? busType : null,
//     status !== 'all' ? status : null,
//     hasDevice !== 'all' ? hasDevice : null
//   ].filter(Boolean).length

//   return (
//     <Card>
//       <CardContent className="p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-2">
//             <Filter className="h-5 w-5 text-blue-600" />
//             <h3 className="font-semibold text-gray-900">Filter Fleet</h3>
//             {activeFiltersCount > 0 && (
//               <Badge variant="secondary" className="bg-blue-100 text-blue-800">
//                 {activeFiltersCount} active
//               </Badge>
//             )}
//           </div>
//           {activeFiltersCount > 0 && (
//             <Button variant="outline" size="sm" onClick={clearFilters}>
//               <X className="h-4 w-4 mr-1" />
//               Clear All
//             </Button>
//           )}
//         </div>

//         {/* Search Bar */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               placeholder="Search by bus number, type, or route..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyPress={handleSearchKeyPress}
//               className="pl-10"
//             />
//           </div>
//         </div>

//         {/* Filter Options */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
//           {/* Bus Type Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Bus Type
//             </label>
//             <select
//               value={busType}
//               onChange={(e) => setBusType(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
//             >
//               {busTypeOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label} {option.count ? `(${option.count})` : ''}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Status Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Status
//             </label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
//             >
//               {statusOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* GPS Device Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               GPS Device
//             </label>
//             <select
//               value={hasDevice}
//               onChange={(e) => setHasDevice(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
//             >
//               {deviceOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Quick Filter Badges */}
//         <div className="mb-6">
//           <h4 className="text-sm font-medium text-gray-600 mb-3">Quick Filters:</h4>
//           <div className="flex flex-wrap gap-2">
//             <QuickFilterBadge
//               label="Active Buses"
//               icon={Activity}
//               color="bg-green-100 text-green-800 hover:bg-green-200"
//               onClick={() => applyQuickFilter('status', 'active')}
//               isActive={status === 'active'}
//             />
//             <QuickFilterBadge
//               label="AC Luxury"
//               icon={Bus}
//               color="bg-blue-100 text-blue-800 hover:bg-blue-200"
//               onClick={() => applyQuickFilter('busType', 'AC Luxury')}
//               isActive={busType === 'AC Luxury'}
//             />
//             <QuickFilterBadge
//               label="Needs GPS"
//               icon={AlertTriangle}
//               color="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
//               onClick={() => applyQuickFilter('hasDevice', 'no')}
//               isActive={hasDevice === 'no'}
//             />
//             <QuickFilterBadge
//               label="Offline"
//               icon={Clock}
//               color="bg-red-100 text-red-800 hover:bg-red-200"
//               onClick={() => applyQuickFilter('status', 'offline')}
//               isActive={status === 'offline'}
//             />
//           </div>
//         </div>

//         {/* Apply Button */}
//         <div className="flex justify-end pt-4 border-t border-gray-100">
//           <Button onClick={applyFilters} className="flex items-center">
//             <Filter className="h-4 w-4 mr-2" />
//             Apply Filters
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // ✅ QUICK FILTER BADGE COMPONENT
// interface QuickFilterBadgeProps {
//   label: string
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   onClick: () => void
//   isActive?: boolean
// }

// function QuickFilterBadge({ label, icon: Icon, color, onClick, isActive = false }: QuickFilterBadgeProps) {
//   return (
//     <button
//       onClick={onClick}
//       className={`
//         inline-flex items-center px-3 py-2 rounded-full text-sm font-medium 
//         transition-all duration-200 border
//         ${isActive 
//           ? 'border-blue-500 bg-blue-500 text-white shadow-md' 
//           : `border-transparent ${color}`
//         }
//       `}
//     >
//       <Icon className="h-3 w-3 mr-1" />
//       {label}
//       {isActive && <CheckCircle className="h-3 w-3 ml-1" />}
//     </button>
//   )
// }





'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, 
  Filter, 
  X,
  Bus,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle,
  Wifi,
  WifiOff,
  Loader2,
  RefreshCcw
} from 'lucide-react'

// ✅ TYPES FOR BACKEND DATA
interface FleetStats {
  busTypes: {
    'AC Luxury': number
    'Semi Luxury': number
    'Normal': number
    'Express': number
  }
  status: {
    active: number
    inactive: number
    offline: number
  }
  devices: {
    withGPS: number
    withoutGPS: number
  }
  totalBuses: number
  totalBookings: number
  totalActiveRoutes: number
}

interface FilterOption {
  value: string
  label: string
  count?: number
  icon?: React.ComponentType<{ className?: string }>
  color?: string
}

export function FleetFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // ✅ STATE FOR BACKEND DATA
  const [stats, setStats] = useState<FleetStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // ✅ CURRENT FILTER VALUES
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [busType, setBusType] = useState(searchParams.get('busType') || 'all')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [hasDevice, setHasDevice] = useState(searchParams.get('hasDevice') || 'all')

  // ✅ FETCH FLEET STATISTICS FROM BACKEND
  const fetchFleetStats = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('📊 Fetching fleet statistics...')
      
      const response = await fetch('/api/operator/fleet-stats', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })

      console.log('📊 Fleet stats response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Fleet stats received:', data)
      
      setStats(data)
    } catch (err) {
      console.error('❌ Error fetching fleet stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  // ✅ LOAD STATS ON COMPONENT MOUNT
  useEffect(() => {
    fetchFleetStats()
  }, [])

  // ✅ UPDATE LOCAL STATE WHEN URL CHANGES
  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setBusType(searchParams.get('busType') || 'all')
    setStatus(searchParams.get('status') || 'all')
    setHasDevice(searchParams.get('hasDevice') || 'all')
  }, [searchParams])

  // ✅ DYNAMIC FILTER OPTIONS WITH REAL DATA
  const getBusTypeOptions = (): FilterOption[] => {
    if (!stats) return [{ value: 'all', label: 'All Types' }]
    
    return [
      { value: 'all', label: 'All Types' },
      { value: 'AC Luxury', label: 'AC Luxury', count: stats.busTypes['AC Luxury'] },
      { value: 'Semi Luxury', label: 'Semi Luxury', count: stats.busTypes['Semi Luxury'] },
      { value: 'Normal', label: 'Normal', count: stats.busTypes['Normal'] },
      { value: 'Express', label: 'Express', count: stats.busTypes['Express'] }
    ].filter(option => option.value === 'all' || (option.count && option.count > 0))
  }

  const getStatusOptions = (): FilterOption[] => {
    if (!stats) return [{ value: 'all', label: 'All Status' }]
    
    return [
      { value: 'all', label: 'All Status', icon: Filter },
      { value: 'active', label: 'Active', icon: Activity, color: 'text-green-600', count: stats.status.active },
      { value: 'inactive', label: 'Inactive', icon: Clock, color: 'text-red-600', count: stats.status.inactive },
      { value: 'offline', label: 'Offline', icon: AlertTriangle, color: 'text-yellow-600', count: stats.status.offline }
    ]
  }

  const getDeviceOptions = (): FilterOption[] => {
    if (!stats) return [{ value: 'all', label: 'All Buses' }]
    
    return [
      { value: 'all', label: 'All Buses' },
      { value: 'yes', label: 'With GPS', icon: Wifi, color: 'text-green-600', count: stats.devices.withGPS },
      { value: 'no', label: 'Without GPS', icon: WifiOff, color: 'text-red-600', count: stats.devices.withoutGPS }
    ]
  }

  // ✅ APPLY FILTERS FUNCTION
  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (search.trim()) params.set('search', search.trim())
    if (busType !== 'all') params.set('busType', busType)
    if (status !== 'all') params.set('status', status)
    if (hasDevice !== 'all') params.set('hasDevice', hasDevice)
    
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    router.push(newUrl)
  }

  // ✅ CLEAR ALL FILTERS
  const clearFilters = () => {
    setSearch('')
    setBusType('all')
    setStatus('all')
    setHasDevice('all')
    router.push(pathname)
  }

  // ✅ QUICK FILTER APPLICATION
  const applyQuickFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    router.push(newUrl)
  }

  // ✅ HANDLE SEARCH INPUT
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters()
    }
  }

  // ✅ COUNT ACTIVE FILTERS
  const activeFiltersCount = [
    search.trim(),
    busType !== 'all' ? busType : null,
    status !== 'all' ? status : null,
    hasDevice !== 'all' ? hasDevice : null
  ].filter(Boolean).length

  // ✅ RENDER ERROR STATE
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Error Loading Filters</h3>
            <p className="text-sm text-gray-600 mb-3">{error}</p>
            <Button onClick={fetchFleetStats} size="sm">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ✅ RENDER LOADING STATE
  if (loading || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const busTypeOptions = getBusTypeOptions()
  const statusOptions = getStatusOptions()
  const deviceOptions = getDeviceOptions()

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header with Real Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Filter Fleet</h3>
            <Badge variant="outline" className="bg-gray-50">
              {stats.totalBuses} total buses
            </Badge>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={fetchFleetStats} variant="ghost" size="sm" disabled={loading}>
              <RefreshCcw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by bus number, type, or route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Options with Real Counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Bus Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus Type
            </label>
            <select
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {busTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count ? `(${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count !== undefined ? `(${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* GPS Device Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GPS Device
            </label>
            <select
              value={hasDevice}
              onChange={(e) => setHasDevice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {deviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count !== undefined ? `(${option.count})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Badges with Real Data */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Quick Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {stats.status.active > 0 && (
              <QuickFilterBadge
                label={`Active Buses (${stats.status.active})`}
                icon={Activity}
                color="bg-green-100 text-green-800 hover:bg-green-200"
                onClick={() => applyQuickFilter('status', 'active')}
                isActive={status === 'active'}
              />
            )}
            {stats.busTypes['AC Luxury'] > 0 && (
              <QuickFilterBadge
                label={`AC Luxury (${stats.busTypes['AC Luxury']})`}
                icon={Bus}
                color="bg-blue-100 text-blue-800 hover:bg-blue-200"
                onClick={() => applyQuickFilter('busType', 'AC Luxury')}
                isActive={busType === 'AC Luxury'}
              />
            )}
            {stats.devices.withoutGPS > 0 && (
              <QuickFilterBadge
                label={`Needs GPS (${stats.devices.withoutGPS})`}
                icon={AlertTriangle}
                color="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                onClick={() => applyQuickFilter('hasDevice', 'no')}
                isActive={hasDevice === 'no'}
              />
            )}
            {stats.status.offline > 0 && (
              <QuickFilterBadge
                label={`Offline (${stats.status.offline})`}
                icon={Clock}
                color="bg-red-100 text-red-800 hover:bg-red-200"
                onClick={() => applyQuickFilter('status', 'offline')}
                isActive={status === 'offline'}
              />
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Fleet Summary:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-600">{stats.totalBuses}</div>
              <div className="text-gray-600">Total Buses</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">{stats.status.active}</div>
              <div className="text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">{stats.devices.withGPS}</div>
              <div className="text-gray-600">With GPS</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-600">{stats.totalBookings}</div>
              <div className="text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button onClick={applyFilters} className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ✅ QUICK FILTER BADGE COMPONENT
interface QuickFilterBadgeProps {
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  onClick: () => void
  isActive?: boolean
}

function QuickFilterBadge({ label, icon: Icon, color, onClick, isActive = false }: QuickFilterBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-2 rounded-full text-sm font-medium 
        transition-all duration-200 border
        ${isActive 
          ? 'border-blue-500 bg-blue-500 text-white shadow-md' 
          : `border-transparent ${color}`
        }
      `}
    >
      <Icon className="h-3 w-3 mr-1" />
      {label}
      {isActive && <CheckCircle className="h-3 w-3 ml-1" />}
    </button>
  )
}
