import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const booking = await prisma.booking.findFirst({
      where: { 
        id,
        userId: user.id 
      },
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
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const bookingDetails = {
      id: booking.id,
      bookingRef: `TLK-${booking.id.slice(-6).toUpperCase()}`,
      route: `${booking.schedule.route.startLocation} → ${booking.schedule.route.endLocation}`,
      origin: booking.schedule.route.startLocation,
      destination: booking.schedule.route.endLocation,
      date: booking.journeyDate.toISOString().split('T')[0],
      time: booking.schedule.departureTime,
      busNumber: booking.schedule.bus.busNumber,
      busOperator: booking.schedule.route.operator.name,
      seats: booking.seatNumber ? [booking.seatNumber.toString()] : [],
      passengers: [{
        name: booking.passengerName,
        phone: booking.passengerPhone,
        age: 25, // Default age, you might want to add this field to your schema
        gender: 'Not specified' // Default, you might want to add this field
      }],
      status: booking.status.toLowerCase(),
      amount: booking.totalAmount,
      breakdown: {
        baseFare: booking.totalAmount * 0.85, // Calculate based on your logic
        taxes: booking.totalAmount * 0.1,
        serviceFee: booking.totalAmount * 0.05,
        discount: 0
      },
      paymentMethod: booking.payment?.method || 'Unknown',
      paymentStatus: booking.payment?.status || 'Unknown',
      createdAt: booking.createdAt.toISOString(),
      ticketNumber: booking.ticket?.ticketNumber,
      qrCode: booking.ticket?.qrCode
    }

    return NextResponse.json(bookingDetails)

  } catch (error) {
    console.error('Booking details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const booking = await prisma.booking.findFirst({
      where: { 
        id,
        userId: user.id,
        status: 'CONFIRMED' // Only allow canceling confirmed bookings
      }
    })

    if (!booking) {
      return NextResponse.json({ 
        error: 'Booking not found or cannot be cancelled' 
      }, { status: 404 })
    }

    // Update booking status to cancelled
    await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' }
    })

    return NextResponse.json({ message: 'Booking cancelled successfully' })

  } catch (error) {
    console.error('Cancel booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
