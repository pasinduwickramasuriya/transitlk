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

    // Get dashboard statistics
    const [
      totalBookings,
      completedBookings,
      upcomingBookings,
      totalSpent
    ] = await Promise.all([
      // Total bookings count
      prisma.booking.count({
        where: { userId: user.id }
      }),
      
      // Completed bookings count
      prisma.booking.count({
        where: { 
          userId: user.id,
          status: 'COMPLETED'
        }
      }),
      
      // Upcoming bookings count
      prisma.booking.count({
        where: { 
          userId: user.id,
          status: 'CONFIRMED',
          journeyDate: {
            gte: new Date()
          }
        }
      }),
      
      // Total amount spent
      prisma.payment.aggregate({
        where: { 
          booking: { userId: user.id },
          status: 'COMPLETED'
        },
        _sum: { amount: true }
      })
    ])

    return NextResponse.json({
      totalBookings,
      completedTrips: completedBookings,
      upcomingTrips: upcomingBookings,
      totalSpent: totalSpent._sum.amount || 0
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
