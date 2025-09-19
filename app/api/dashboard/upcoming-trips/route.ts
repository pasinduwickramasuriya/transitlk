import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const upcomingTrips = await prisma.booking.findMany({
      where: { 
        userId: user.id,
        status: 'CONFIRMED',
        journeyDate: {
          gte: new Date()
        }
      },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true
          }
        }
      },
      orderBy: { journeyDate: 'asc' },
      take: 5
    })

    const formattedTrips = upcomingTrips.map(trip => ({
      id: trip.id,
      route: `${trip.schedule.route.startLocation} → ${trip.schedule.route.endLocation}`,
      date: trip.journeyDate.toISOString().split('T')[0],
      time: trip.schedule.departureTime,
      busNumber: trip.schedule.bus.busNumber,
      status: trip.status.toLowerCase()
    }))

    return NextResponse.json(formattedTrips)

  } catch (error) {
    console.error('Upcoming trips error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
