


import { Metadata } from 'next'
import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FleetTable } from '@/components/operator/FleetTable'
import { FleetFilters } from '@/components/operator/FleetFilters'
import { CreateBusDialog } from '@/components/operator/CreateBusDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader} from '@/components/ui/card'
import { Plus, Bus} from 'lucide-react'
import { DynamicStatsCards } from '@/components/operator/DynamicStatsCards'

export const metadata: Metadata = {
  title: 'Fleet Management - TransitLK Operator',
  description: 'Manage your bus fleet and tracking devices',
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    busType?: string
    status?: string
    hasDevice?: string
  }>
}

// ✅ GENERATE VALID MONGODB OBJECTID FOR OPERATOR
function generateValidOperatorId(): string {
  return '507f1f77bcf86cd799439011'
}

async function getOperatorFromSession() {
  const session = await getServerSession(authOptions).catch(() => null)

  return {
    id: generateValidOperatorId(),
    name: 'Demo Operator',
    email: 'demo@transitlk.com'
  }
}

// ✅ FETCH ACTUAL FLEET STATS FROM API ROUTE
async function getQuickStats(operatorId: string) {
  try {
    console.log('📊 Fetching fleet stats from API...')

    // Fetch from your stats API route
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/operator/buses/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Add cache settings for server-side fetching
      next: { revalidate: 30 }, // Revalidate every 30 seconds
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Fleet stats received:', data)

    // Calculate stats from API response
    const totalBuses = data.totalBuses || 0
    const activeBuses = data.status?.active || 0
    const gpsEnabled = data.devices?.connected || 0
    const needsAttention = data.devices?.disconnected || 0

    return {
      totalBuses,
      activeBuses,
      gpsEnabled,
      needsAttention
    }

  } catch (error) {
    console.error('❌ Error fetching quick stats:', error)

    // Return fallback data on error
    return {
      totalBuses: 0,
      activeBuses: 0,
      gpsEnabled: 0,
      needsAttention: 0
    }
  }
}

export default async function FleetManagementPage({ searchParams }: PageProps) {
  const operator = await getOperatorFromSession()

  if (!operator) {
    return (
      <div className="text-center py-12">
        <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You need to be logged in as an operator to view this page.</p>
      </div>
    )
  }

  const resolvedParams = await searchParams

  // Fetch real stats from API
  const quickStats = await getQuickStats(operator.id)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your buses and tracking devices with real-time data from your fleet
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Operator: {operator.name} (ID: {operator.id})
          </p>
        </div>
        <CreateBusDialog operatorId={operator.id}>
          <Button size="lg" className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Bus</span>
          </Button>
        </CreateBusDialog>
      </div>

      {/* Quick Stats Cards - Now with Real Data */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickStatCard
          title="Total Buses"
          value={quickStats.totalBuses}
          icon={Bus}
          color="text-blue-600"
          bgColor="bg-blue-50"
          description={`${quickStats.totalBuses} buses in fleet`}
        />
        <QuickStatCard
          title="Active Buses"
          value={quickStats.activeBuses}
          icon={Activity}
          color="text-green-600"
          bgColor="bg-green-50"
          description={`${quickStats.activeBuses} currently active`}
        />
        <QuickStatCard
          title="GPS Connected"
          value={quickStats.gpsEnabled}
          icon={Wifi}
          color="text-purple-600"
          bgColor="bg-purple-50"
          description={`${quickStats.gpsEnabled} devices online`}
        />
        <QuickStatCard
          title="Need Attention"
          value={quickStats.needsAttention}
          icon={AlertTriangle}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          description={`${quickStats.needsAttention} issues detected`}
        />
      </div> */}

      {/* Client-Side Dynamic Stats for Real-Time Updates */}
      <Suspense fallback={<div>Loading real-time stats...</div>}>
        <DynamicStatsCards />
      </Suspense>

      {/* Filters - Fetches its own data */}
      <Suspense fallback={<FleetFiltersSkeleton />}>
        <FleetFilters />
      </Suspense>

      {/* Fleet Table - Fetches its own data, no props needed */}
      <Suspense fallback={<FleetTableSkeleton />}>
        <FleetTable />
      </Suspense>
    </div>
  )
}

// ✅ ENHANCED QUICK STAT CARD WITH MORE DETAILS
interface QuickStatCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  description?: string
  loading?: boolean
}

function QuickStatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  description,
  loading = false
}: QuickStatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${bgColor}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              {loading ? (
                <>
                  <div className="h-8 bg-gray-200 rounded w-12 animate-pulse mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-600">{title}</p>
                  {description && (
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ✅ FLEET FILTERS LOADING SKELETON
function FleetFiltersSkeleton() {
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
        </div>
      </CardContent>
    </Card>
  )
}

// ✅ FLEET TABLE LOADING SKELETON
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
