import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch all bookings for stats
    const allBookings = await prisma.booking.findMany({
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
      orderBy: { createdAt: 'desc' }
    })

    // Calculate stats
    const now = new Date()
    const completedTrips = allBookings.filter(b => b.status === 'COMPLETED').length
    const upcomingTrips = allBookings.filter(b => 
      b.status === 'CONFIRMED' && new Date(b.journeyDate) >= now
    ).length
    const totalSpent = allBookings
      .filter(b => b.payment?.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalAmount, 0)

    // Get recent bookings (last 5)
    const recentBookings = allBookings.slice(0, 5).map(booking => ({
      id: booking.id,
      route: `${booking.schedule.route.startLocation} → ${booking.schedule.route.endLocation}`,
      date: booking.journeyDate.toISOString().split('T')[0],
      time: booking.schedule.departureTime,
      status: booking.status.toLowerCase(),
      amount: booking.totalAmount
    }))

    // Get upcoming trips
    const upcomingBookings = allBookings
      .filter(b => b.status === 'CONFIRMED' && new Date(b.journeyDate) >= now)
      .slice(0, 5)
      .map(booking => ({
        id: booking.id,
        route: `${booking.schedule.route.startLocation} → ${booking.schedule.route.endLocation}`,
        date: booking.journeyDate.toISOString().split('T')[0],
        time: booking.schedule.departureTime,
        busNumber: booking.schedule.bus.busNumber,
        status: booking.status.toLowerCase()
      }))

    const dashboardData = {
      stats: {
        totalBookings: allBookings.length,
        completedTrips,
        upcomingTrips,
        totalSpent
      },
      recentBookings,
      upcomingTrips: upcomingBookings
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
