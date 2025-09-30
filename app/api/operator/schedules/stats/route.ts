import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

// ✅ GET SCHEDULES STATISTICS
export async function GET() {
  try {
    console.log('📊 Calculating schedules statistics...')

    const [
      totalSchedules,
      activeSchedules,
      schedulesWithBookings,
      routesScheduled,
      busesScheduled,
      recentSchedules,
      upcomingSchedules
    ] = await Promise.all([
      // Total schedules count
      prisma.schedule.count({
        where: { route: { operatorId: DEFAULT_OPERATOR_ID } }
      }),

      // Active schedules count
      prisma.schedule.count({
        where: {
          route: { operatorId: DEFAULT_OPERATOR_ID },
          isActive: true
        }
      }),

      // Schedules with bookings
      prisma.schedule.count({
        where: {
          route: { operatorId: DEFAULT_OPERATOR_ID },
          bookings: { some: {} }
        }
      }),

      // Unique routes with schedules
      prisma.schedule.findMany({
        where: { route: { operatorId: DEFAULT_OPERATOR_ID } },
        select: { routeId: true },
        distinct: ['routeId']
      }),

      // Unique buses with schedules
      prisma.schedule.findMany({
        where: { route: { operatorId: DEFAULT_OPERATOR_ID } },
        select: { busId: true },
        distinct: ['busId']
      }),

      // Recent schedules (last 7 days)
      prisma.schedule.count({
        where: {
          route: { operatorId: DEFAULT_OPERATOR_ID },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Upcoming active schedules
      prisma.schedule.count({
        where: {
          route: { operatorId: DEFAULT_OPERATOR_ID },
          isActive: true,
          bookings: {
            some: {
              status: { in: ['PENDING', 'CONFIRMED'] },
              journeyDate: { gte: new Date() }
            }
          }
        }
      })
    ])

    const inactiveSchedules = totalSchedules - activeSchedules

    const stats = {
      totalSchedules,
      activeSchedules,
      inactiveSchedules,
      schedulesWithBookings,
      routesScheduled: routesScheduled.length,
      busesScheduled: busesScheduled.length,
      recentSchedules,
      upcomingSchedules,
      utilizationRate: totalSchedules > 0 
        ? Math.round((schedulesWithBookings / totalSchedules) * 100)
        : 0,
      lastUpdated: new Date().toISOString()
    }

    console.log('✅ Schedules stats calculated')

    return NextResponse.json(stats)

  } catch (error) {
    console.error('❌ Get schedules stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get schedules statistics' },
      { status: 500 }
    )
  }
}
