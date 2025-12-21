import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth' // Adjust this path to your auth config
import { startOfDay, endOfDay } from 'date-fns'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // 1. Security: Ensure user is an Operator
    if (!session || session.user.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get Date Filter
    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get('date')
    const date = dateParam ? new Date(dateParam) : new Date()

    // 3. Find the Operator ID linked to this user
    // (Adjust this query if your schema links User -> Operator differently)
    const operator = await prisma.operator.findFirst({
      where: { isActive: true } // Replace with: userId: session.user.id if needed
    })

    if (!operator) {
      return NextResponse.json({ error: 'Operator profile not found' }, { status: 404 })
    }

    // 4. Fetch Live Data
    const bookings = await prisma.booking.findMany({
      where: {
        journeyDate: {
          gte: startOfDay(date),
          lte: endOfDay(date)
        },
        bus: { operatorId: operator.id }
      },
      include: {
        user: { select: { name: true, email: true, image: true } }, // Minimal user info
        schedule: {
          include: { route: true }
        },
        bus: true,
        payment: true,
        ticket: true
      },
      orderBy: { updatedAt: 'desc' } // Newest updates first
    })

    // 5. Calculate Stats
    const stats = {
      totalBookings: bookings.length,
      confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
      revenue: bookings.reduce((sum, b) => sum + (b.payment?.status === 'COMPLETED' ? b.totalAmount : 0), 0),
      pending: bookings.filter(b => b.status === 'PENDING').length
    }

    return NextResponse.json({ bookings, stats })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}