import { Metadata } from 'next'
import { LiveBusTrackingClient } from '@/components/operator/LiveBusTrackingClient'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Live Bus Tracking - TransitLK Operator',
  description: 'Real-time GPS tracking of your bus fleet',
}

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

// ✅ Fast server-side data loading
async function getPageData() {
  try {
    // ✅ Use upsert for guaranteed operator creation
    const operator = await prisma.operator.upsert({
      where: { id: DEFAULT_OPERATOR_ID },
      update: { isActive: true }, // Ensure it's active
      create: {
        id: DEFAULT_OPERATOR_ID,
        name: 'TransitLK Operator',
        licenseNo: 'TLK001',
        contactInfo: 'contact@transitlk.com',
        isActive: true
      },
      select: {
        id: true,
        name: true
      }
    })

    // ✅ Fast parallel stats calculation
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

    const [
      totalBuses,
      activeBuses,
      connectedDevices,
      recentPositions,
      totalDevices
    ] = await Promise.all([
      prisma.bus.count({
        where: { operatorId: DEFAULT_OPERATOR_ID }
      }),
      prisma.bus.count({
        where: { 
          operatorId: DEFAULT_OPERATOR_ID,
          isActive: true 
        }
      }),
      prisma.device.count({
        where: {
          isActive: true,
          bus: {
            operatorId: DEFAULT_OPERATOR_ID,
            isActive: true
          },
          lastSeen: {
            gte: fiveMinutesAgo // Only count recently active devices
          }
        }
      }),
      prisma.position.count({
        where: {
          timestamp: {
            gte: fiveMinutesAgo
          },
          device: {
            bus: {
              operatorId: DEFAULT_OPERATOR_ID
            }
          }
        }
      }),
      prisma.device.count({
        where: {
          bus: {
            operatorId: DEFAULT_OPERATOR_ID,
            isActive: true
          }
        }
      })
    ])

    const stats = {
      totalBuses,
      activeBuses,
      connectedDevices,
      recentPositions,
      offlineBuses: Math.max(0, totalDevices - connectedDevices)
    }

    return { operator, stats }
  } catch (error) {
    console.error('❌ Error fetching page data:', error)
    
    // ✅ Return fallback data instead of throwing
    return {
      operator: { id: DEFAULT_OPERATOR_ID, name: 'TransitLK Operator' },
      stats: {
        totalBuses: 0,
        activeBuses: 0,
        connectedDevices: 0,
        recentPositions: 0,
        offlineBuses: 0
      }
    }
  }
}

// ✅ Loading component for instant feedback
function TrackingPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              🚌
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Loading Live Bus Tracking
          </h2>
          <p className="text-slate-600">Initializing GPS network...</p>
        </div>
      </div>
    </div>
  )
}

// ✅ Main page component with proper data loading
export default async function LiveBusTrackingPage() {
  const { operator, stats } = await getPageData()

  return (
    <Suspense fallback={<TrackingPageLoading />}>
      <LiveBusTrackingClient 
        operator={operator}
        stats={stats}
      />
    </Suspense>
  )
}










