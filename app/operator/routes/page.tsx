

import { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { RouteManagementClient } from '@/components/operator/RouteManagementClient'
// import { RouteManagementClient } from '@/components/operator/RouteManagementClient'

export const metadata: Metadata = {
  title: 'Route Management - TransitLK Operator',
  description: 'Manage your bus routes, stops, and schedules',
}

interface RouteManagementPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
    tab?: string
    routeId?: string
    busId?: string
  }>
}

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
      console.log('✅ Created default operator')
    } catch (error) {
      console.log('⚠️ Operator might already exist:', error)
    }
  }
  return operator || { id: DEFAULT_OPERATOR_ID, name: 'Default Operator' }
}

// ✅ GET COMPREHENSIVE STATISTICS
async function getComprehensiveStats() {
  const operatorId = DEFAULT_OPERATOR_ID

  try {
    const [
      totalRoutes,
      activeRoutes,
      totalStops,
      totalSchedules,
      activeSchedules,
      recentRoutes,
      totalBuses,
      recentStops,
      recentSchedules
    ] = await Promise.all([
      prisma.route.count({
        where: { operatorId }
      }),
      prisma.route.count({
        where: { operatorId, isActive: true }
      }),
      prisma.stop.count({
        where: { route: { operatorId } }
      }),
      prisma.schedule.count({
        where: { route: { operatorId } }
      }),
      prisma.schedule.count({
        where: {
          route: { operatorId },
          isActive: true
        }
      }),
      prisma.route.count({
        where: {
          operatorId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.bus.count({
        where: { operatorId }
      }),
      prisma.stop.count({
        where: {
          route: { operatorId },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.schedule.count({
        where: {
          route: { operatorId },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    return {
      totalRoutes,
      activeRoutes,
      inactiveRoutes: totalRoutes - activeRoutes,
      totalStops,
      totalSchedules,
      activeSchedules,
      inactiveSchedules: totalSchedules - activeSchedules,
      recentRoutes,
      recentStops,
      recentSchedules,
      totalBuses
    }
  } catch (error) {
    console.error('Error fetching comprehensive stats:', error)
    return {
      totalRoutes: 0,
      activeRoutes: 0,
      inactiveRoutes: 0,
      totalStops: 0,
      totalSchedules: 0,
      activeSchedules: 0,
      inactiveSchedules: 0,
      recentRoutes: 0,
      recentStops: 0,
      recentSchedules: 0,
      totalBuses: 0
    }
  }
}

export default async function RouteManagementPage({ searchParams }: RouteManagementPageProps) {
  const operator = await ensureDefaultOperator()
  const stats = await getComprehensiveStats()
  const resolvedParams = await searchParams

  return (
    <RouteManagementClient
      operator={operator}
      stats={stats}
      initialSearchParams={resolvedParams}
    />
  )
}
