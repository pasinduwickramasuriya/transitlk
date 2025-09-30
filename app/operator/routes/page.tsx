



import { Metadata } from 'next'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Route, MapPin, Clock, Activity } from 'lucide-react'
import { RoutesTable } from '@/components/operator/RoutesTable'
import { RoutesFilters } from '@/components/operator/RoutesFilters'
import { CreateRouteDialog } from '@/components/operator/CreateRouteDialog'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Route Management - TransitLK Operator',
  description: 'Manage your bus routes and stops',
}

interface RouteManagementPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
  }>
}

// ✅ SIMPLE DEFAULT OPERATOR
const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

async function ensureDefaultOperator() {
  let operator = await prisma.operator.findUnique({
    where: { id: DEFAULT_OPERATOR_ID }
  }).catch(() => null)

  if (!operator) {
    try {
      operator = await prisma.operator.create({
        data: {
          id: DEFAULT_OPERATOR_ID,
          name: 'Default Operator',
          licenseNo: 'DEFAULT001',
          contactInfo: 'default@transitlk.com',
          isActive: true
        }
      })
    } catch (error) {
      console.log('⚠️ Operator might already exist')
    }
  }
  return operator || { id: DEFAULT_OPERATOR_ID, name: 'Default Operator' }
}

// ✅ GET ROUTE STATISTICS FOR DASHBOARD
async function getRouteStats() {
  const operatorId = DEFAULT_OPERATOR_ID
  
  try {
    const [totalRoutes, activeRoutes, totalStops, recentRoutes] = await Promise.all([
      prisma.route.count({
        where: { operatorId }
      }),
      prisma.route.count({
        where: { operatorId, isActive: true }
      }),
      prisma.stop.count({
        where: { route: { operatorId } }
      }),
      prisma.route.count({
        where: {
          operatorId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ])

    return {
      totalRoutes,
      activeRoutes,
      inactiveRoutes: totalRoutes - activeRoutes,
      totalStops,
      recentRoutes
    }
  } catch (error) {
    console.error('Error fetching route stats:', error)
    return {
      totalRoutes: 0,
      activeRoutes: 0,
      inactiveRoutes: 0,
      totalStops: 0,
      recentRoutes: 0
    }
  }
}

export default async function RouteManagementPage({ searchParams }: RouteManagementPageProps) {
  // Ensure operator exists
  const operator = await ensureDefaultOperator()
  
  // Get route statistics
  const stats = await getRouteStats()
  
  // Resolve search params
  const resolvedParams = await searchParams

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your bus routes and stops with comprehensive route planning tools
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Operator: {operator.name} (ID: {operator.id})
          </p>
        </div>
        <CreateRouteDialog operatorId={operator.id}>
          <Button size="lg" className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Route</span>
          </Button>
        </CreateRouteDialog>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Routes"
          value={stats.totalRoutes}
          icon={Route}
          color="text-blue-600"
          bgColor="bg-blue-50"
          description={`${stats.totalRoutes} routes configured`}
        />
        <StatsCard
          title="Active Routes"
          value={stats.activeRoutes}
          icon={Activity}
          color="text-green-600"
          bgColor="bg-green-50"
          description={`${stats.activeRoutes} currently active`}
        />
        <StatsCard
          title="Total Stops"
          value={stats.totalStops}
          icon={MapPin}
          color="text-purple-600"
          bgColor="bg-purple-50"
          description={`${stats.totalStops} stops across all routes`}
        />
        <StatsCard
          title="Recent Routes"
          value={stats.recentRoutes}
          icon={Clock}
          color="text-orange-600"
          bgColor="bg-orange-50"
          description="Added this week"
        />
      </div>

      {/* Filters - Fetches its own data */}
      <Suspense fallback={<RoutesFiltersSkeleton />}>
        <RoutesFilters />
      </Suspense>

      {/* Routes Table - Fetches its own data based on URL params */}
      <Suspense fallback={<RoutesTableSkeleton />}>
        <RoutesTable />
      </Suspense>
    </div>
  )
}

// ✅ STATS CARD COMPONENT
interface StatsCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  description?: string
}

function StatsCard({ title, value, icon: Icon, color, bgColor, description }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600 truncate">{title}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ✅ ROUTES FILTERS SKELETON
function RoutesFiltersSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Search and Filters Skeleton */}
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ✅ ROUTES TABLE SKELETON
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
        {/* Table Header Skeleton */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Table Rows Skeleton */}
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b border-gray-100 p-4">
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 7 }).map((_, j) => (
                  <div key={j} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
