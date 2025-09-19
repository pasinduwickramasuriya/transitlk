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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    let whereClause: any = { userId: user.id }

    if (status && status !== 'all') {
      whereClause.status = status.toUpperCase()
    }

    if (search) {
      whereClause.OR = [
        {
          schedule: {
            route: {
              OR: [
                { startLocation: { contains: search, mode: 'insensitive' } },
                { endLocation: { contains: search, mode: 'insensitive' } }
              ]
            }
          }
        },
        {
          schedule: {
            bus: {
              busNumber: { contains: search, mode: 'insensitive' }
            }
          }
        }
      ]
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: whereClause,
        include: {
          schedule: {
            include: {
              route: {
                include: {
                  operator: true
                }
              },
              bus: true
            }
          },
          payment: true,
          ticket: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.booking.count({ where: whereClause })
    ])

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      bookingRef: `TLK-${booking.id.slice(-6).toUpperCase()}`,
      route: `${booking.schedule.route.startLocation} → ${booking.schedule.route.endLocation}`,
      origin: booking.schedule.route.startLocation,
      destination: booking.schedule.route.endLocation,
      date: booking.journeyDate.toISOString().split('T')[0],
      time: booking.schedule.departureTime,
      busNumber: booking.schedule.bus.busNumber,
      seats: booking.seatNumber ? [booking.seatNumber.toString()] : [],
      status: booking.status.toLowerCase(),
      amount: booking.totalAmount,
      paymentMethod: booking.payment?.method || 'Unknown',
      createdAt: booking.createdAt.toISOString()
    }))

    return NextResponse.json({
      bookings: formattedBookings,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Bookings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
