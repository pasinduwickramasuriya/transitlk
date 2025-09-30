import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

// ✅ GET STOPS STATISTICS
export async function GET() {
  try {
    console.log('📊 Calculating stops statistics...')

    const [
      totalStops,
      routesWithStops,
      routesWithoutStops,
      stopsPerRoute,
      recentStops
    ] = await Promise.all([
      // Total stops count
      prisma.stop.count({
        where: { route: { operatorId: DEFAULT_OPERATOR_ID } }
      }),

      // Routes with stops
      prisma.route.count({
        where: {
          operatorId: DEFAULT_OPERATOR_ID,
          stops: { some: {} }
        }
      }),

      // Routes without stops
      prisma.route.count({
        where: {
          operatorId: DEFAULT_OPERATOR_ID,
          stops: { none: {} }
        }
      }),

      // Stops per route breakdown
      prisma.route.findMany({
        where: { operatorId: DEFAULT_OPERATOR_ID },
        select: {
          routeNumber: true,
          _count: {
            select: { stops: true }
          }
        },
        orderBy: { routeNumber: 'asc' }
      }),

      // Recent stops (last 7 days)
      prisma.stop.count({
        where: {
          route: { operatorId: DEFAULT_OPERATOR_ID },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    const totalRoutes = routesWithStops + routesWithoutStops
    const averageStopsPerRoute = totalRoutes > 0 
      ? Math.round((totalStops / totalRoutes) * 10) / 10 
      : 0

    const stats = {
      totalStops,
      totalRoutes,
      routesWithStops,
      routesWithoutStops,
      averageStopsPerRoute,
      recentStops,
      stopsPerRoute: stopsPerRoute.map(route => ({
        routeNumber: route.routeNumber,
        stopsCount: route._count.stops
      })),
      completionPercentage: totalRoutes > 0 
        ? Math.round((routesWithStops / totalRoutes) * 100)
        : 0
    }

    console.log('✅ Stops stats calculated')

    return NextResponse.json(stats)

  } catch (error) {
    console.error('❌ Get stops stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get stops statistics' },
      { status: 500 }
    )
  }
}
