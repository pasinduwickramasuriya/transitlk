import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface SeatAvailability {
  seatNumber: number
  isAvailable: boolean
  isOccupied: boolean
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const { scheduleId } = await params
    const url = new URL(request.url)
    const journeyDate = url.searchParams.get('journeyDate')

    console.log('🪑 Seat API called:', { scheduleId, journeyDate })

    if (!scheduleId || !journeyDate) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 })
    }

    // Get schedule
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        bus: true,
        route: { include: { operator: true } }
      }
    })

    if (!schedule) {
      return NextResponse.json({ success: false, error: 'Schedule not found' }, { status: 404 })
    }

    console.log('✅ Schedule:', schedule.bus.busNumber, 'Capacity:', schedule.bus.capacity)

    // Check if journey date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const journeyDateObj = new Date(journeyDate)
    journeyDateObj.setHours(0, 0, 0, 0)
    
    const isPastDate = journeyDateObj < today

    console.log('📅 Date check:', {
      journey: journeyDate,
      isPast: isPastDate
    })

    // Only get bookings for today or future dates
    let bookings: any[] = []
    if (!isPastDate) {
      bookings = await prisma.booking.findMany({
        where: {
          scheduleId,
          journeyDate: {
            gte: new Date(journeyDate + 'T00:00:00.000Z'),
            lte: new Date(journeyDate + 'T23:59:59.999Z')
          },
          status: { in: ['CONFIRMED', 'PENDING'] }
        }
      })
      console.log('📊 Found', bookings.length, 'bookings')
    } else {
      console.log('📅 Past date - showing all seats available')
    }

    // Parse seatNumbers string and build occupied set
    const occupiedSeats = new Set<number>()
    bookings.forEach(booking => {
      if (booking.seatNumbers) {
        // Parse "1,2,3" -> [1, 2, 3]
        const seats = booking.seatNumbers.split(',').map((s: string) => parseInt(s.trim()))
        seats.forEach((seat: number) => {
          if (!isNaN(seat)) {
            occupiedSeats.add(seat)
          }
        })
      }
    })

    console.log('🪑 Occupied seats:', Array.from(occupiedSeats).sort((a, b) => a - b))

    // Generate all seats
    const seats: SeatAvailability[] = []
    for (let i = 1; i <= schedule.bus.capacity; i++) {
      seats.push({
        seatNumber: i,
        isAvailable: !occupiedSeats.has(i),
        isOccupied: occupiedSeats.has(i)
      })
    }

    const availableCount = seats.filter(s => s.isAvailable).length
    console.log('✅ Seats generated:', {
      total: seats.length,
      available: availableCount,
      occupied: occupiedSeats.size
    })

    return NextResponse.json({
      success: true,
      schedule: {
        id: schedule.id,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        bus: {
          id: schedule.bus.id,
          busNumber: schedule.bus.busNumber,
          busType: schedule.bus.busType,
          capacity: schedule.bus.capacity
        },
        route: {
          id: schedule.route.id,
          routeNumber: schedule.route.routeNumber,
          startLocation: schedule.route.startLocation,
          endLocation: schedule.route.endLocation,
          operator: schedule.route.operator
        }
      },
      seats,
      statistics: {
        totalSeats: seats.length,
        availableSeats: availableCount,
        occupiedSeats: occupiedSeats.size,
        isPastDate,
        lastUpdated: new Date().toISOString()
      },
      journeyDate
    })

  } catch (error: any) {
    console.error('❌ Seat API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  try {
    const { scheduleId } = await params
    const { seatNumber, journeyDate } = await request.json()

    if (!seatNumber || !journeyDate) {
      return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 })
    }

    // Get all bookings for this date
    const bookings = await prisma.booking.findMany({
      where: {
        scheduleId,
        journeyDate: {
          gte: new Date(journeyDate + 'T00:00:00.000Z'),
          lte: new Date(journeyDate + 'T23:59:59.999Z')
        },
        status: { in: ['CONFIRMED', 'PENDING'] }
      }
    })

    // Check if seat is in any booking's seatNumbers
    const isOccupied = bookings.some(booking => {
      if (!booking.seatNumbers) return false
      const seats = booking.seatNumbers.split(',').map(s => parseInt(s.trim()))
      return seats.includes(parseInt(seatNumber))
    })

    return NextResponse.json({
      success: true,
      isOccupied,
      seatNumber: parseInt(seatNumber)
    })

  } catch (error: any) {
    console.error('❌ Check seat error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
