'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bus, 
  Users, 
  Route, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsData {
  totalBuses: number
  activeBuses: number
  totalRoutes: number
  dailyPassengers: number
  monthlyRevenue: number
  dailyBookings: number
  onTimePerformance: number
  fuelEfficiency: number
}

interface OperatorStatsCardsProps {
  stats?: StatsData
  loading?: boolean
}

export function OperatorStatsCards({ stats, loading = false }: OperatorStatsCardsProps) {
  // ✅ DEFAULT DATA (fallback)
  const defaultStats: StatsData = {
    totalBuses: 15,
    activeBuses: 12,
    totalRoutes: 8,
    dailyPassengers: 342,
    monthlyRevenue: 1250000,
    dailyBookings: 89,
    onTimePerformance: 87,
    fuelEfficiency: 12.5
  }

  const currentStats = stats || defaultStats

  // ✅ CALCULATE DERIVED METRICS
  const busUtilization = Math.round((currentStats.activeBuses / currentStats.totalBuses) * 100)
  const avgPassengersPerBus = Math.round(currentStats.dailyPassengers / currentStats.activeBuses)
  const revenueGrowth = 8.5 // Mock growth percentage
  const bookingGrowth = 12.3 // Mock growth percentage

  // ✅ FIXED: Helper functions to ensure proper typing
  const getBusUtilizationChangeType = (utilization: number): 'positive' | 'negative' | 'neutral' => {
    if (utilization > 80) return 'positive'
    if (utilization > 60) return 'neutral'
    return 'negative'
  }

  const getBusUtilizationBadge = (utilization: number): string => {
    if (utilization > 85) return 'Excellent'
    if (utilization > 70) return 'Good'
    return 'Low'
  }

  const getPerformanceChangeType = (performance: number): 'positive' | 'negative' | 'neutral' => {
    return performance > 85 ? 'positive' : 'negative'
  }

  const getPerformanceBadge = (performance: number): string => {
    if (performance > 90) return 'Excellent'
    if (performance > 80) return 'Good'
    return 'Poor'
  }

  // ✅ FIXED: Properly typed stats cards array
  const statsCards = [
    {
      title: 'Fleet Status',
      value: `${currentStats.activeBuses}/${currentStats.totalBuses}`,
      subtitle: 'Active Buses',
      icon: Bus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: `${busUtilization}% utilization`,
      changeType: getBusUtilizationChangeType(busUtilization),
      badge: getBusUtilizationBadge(busUtilization)
    },
    {
      title: 'Daily Passengers',
      value: currentStats.dailyPassengers.toLocaleString(),
      subtitle: `Avg ${avgPassengersPerBus} per bus`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: `+${bookingGrowth}% from yesterday`,
      changeType: 'positive' as const,
      badge: 'Today'
    },
    {
      title: 'Active Routes',
      value: currentStats.totalRoutes.toString(),
      subtitle: '6 high-traffic routes',
      icon: Route,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'All routes operational',
      changeType: 'positive' as const,
      badge: 'Live'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(currentStats.monthlyRevenue / 1000).toFixed(0)}K`,
      subtitle: 'This month',
      icon: IndianRupee,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: `+${revenueGrowth}% vs last month`,
      changeType: 'positive' as const,
      badge: 'Growing'
    },
    {
      title: 'Daily Bookings',
      value: currentStats.dailyBookings.toString(),
      subtitle: '23 pending confirmations',
      icon: Calendar,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      change: '+15 from yesterday',
      changeType: 'positive' as const,
      badge: 'Active'
    },
    {
      title: 'On-Time Performance',
      value: `${currentStats.onTimePerformance}%`,
      subtitle: 'This week average',
      icon: Clock,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: currentStats.onTimePerformance > 85 ? 'Excellent' : 'Needs improvement',
      changeType: getPerformanceChangeType(currentStats.onTimePerformance),
      badge: getPerformanceBadge(currentStats.onTimePerformance)
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickMetric
          label="Fuel Efficiency"
          value={`${currentStats.fuelEfficiency} km/l`}
          icon={Activity}
          color="text-blue-600"
        />
        <QuickMetric
          label="Active Drivers"
          value="12"
          icon={Users}
          color="text-green-600"
        />
        <QuickMetric
          label="Maintenance Due"
          value="3 buses"
          icon={AlertTriangle}
          color="text-yellow-600"
        />
        <QuickMetric
          label="Route Coverage"
          value="85%"
          icon={MapPin}
          color="text-purple-600"
        />
      </div>
    </div>
  )
}

// ✅ INDIVIDUAL STATS CARD COMPONENT - Fixed Interface
interface StatsCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  badge: string
}

function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  bgColor, 
  change, 
  changeType,
  badge 
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'negative':
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Activity className="h-3 w-3 text-gray-600" />
    }
  }

  const getBadgeColor = () => {
    switch (badge.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800'
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'poor':
      case 'low':
        return 'bg-red-100 text-red-800'
      case 'live':
      case 'active':
        return 'bg-emerald-100 text-emerald-800 animate-pulse'
      case 'growing':
        return 'bg-orange-100 text-orange-800'
      case 'today':
        return 'bg-cyan-100 text-cyan-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("rounded-lg p-3", bgColor)}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
          <Badge className={getBadgeColor()}>
            {badge}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-600 text-sm">{title}</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {value}
            </span>
          </div>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
          {getTrendIcon()}
          <span className={cn(
            "text-xs ml-1",
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          )}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// ✅ QUICK METRIC COMPONENT
interface QuickMetricProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

function QuickMetric({ label, value, icon: Icon, color }: QuickMetricProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-3">
        <Icon className={cn("h-5 w-5", color)} />
        <div>
          <p className="font-semibold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  )
}

// ✅ LOADING SKELETON
function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-lg bg-gray-200 h-12 w-12"></div>
            <div className="bg-gray-200 rounded-full h-5 w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
