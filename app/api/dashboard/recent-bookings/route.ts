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

    const recentBookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true
          }
        },
        payment: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    const formattedBookings = recentBookings.map(booking => ({
      id: booking.id,
      route: `${booking.schedule.route.startLocation} → ${booking.schedule.route.endLocation}`,
      date: booking.journeyDate.toISOString().split('T')[0],
      time: booking.schedule.departureTime,
      status: booking.status.toLowerCase(),
      amount: booking.totalAmount
    }))

    return NextResponse.json(formattedBookings)

  } catch (error) {
    console.error('Recent bookings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
