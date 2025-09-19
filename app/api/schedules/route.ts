import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const routeId = searchParams.get('routeId')
    const date = searchParams.get('date')

    if (!routeId) {
      return NextResponse.json(
        { error: 'Route ID is required' },
        { status: 400 }
      )
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        routeId,
        isActive: true
      },
      include: {
        route: true,
        bus: true,
        bookings: {
          where: date ? {
            journeyDate: {
              gte: new Date(date),
              lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
            }
          } : undefined
        }
      }
    })

    const schedulesWithAvailability = schedules.map(schedule => ({
      ...schedule,
      availableSeats: schedule.bus.capacity - schedule.bookings.length,
      occupiedSeats: schedule.bookings.length
    }))

    return NextResponse.json(schedulesWithAvailability)

  } catch (error) {
    console.error('Schedules error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
