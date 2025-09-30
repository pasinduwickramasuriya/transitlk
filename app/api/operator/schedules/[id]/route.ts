import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

// ✅ GET SINGLE SCHEDULE
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📅 Getting schedule details:', params.id)

    const schedule = await prisma.schedule.findUnique({
      where: { id: params.id },
      include: {
        route: {
          select: {
            id: true,
            routeNumber: true,
            startLocation: true,
            endLocation: true,
            isActive: true,
            operatorId: true
          }
        },
        bus: {
          select: {
            id: true,
            busNumber: true,
            capacity: true,
            busType: true,
            isActive: true,
            operatorId: true
          }
        },
        bookings: {
          where: { status: { in: ['PENDING', 'CONFIRMED'] } },
          select: {
            id: true,
            status: true,
            passengerName: true,
            seatNumber: true,
            journeyDate: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Verify operator access
    if (schedule.route.operatorId !== DEFAULT_OPERATOR_ID || schedule.bus.operatorId !== DEFAULT_OPERATOR_ID) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    console.log(`✅ Schedule details found: ${schedule.route.routeNumber} - ${schedule.bus.busNumber}`)

    return NextResponse.json({
      ...schedule,
      success: true
    })

  } catch (error) {
    console.error('❌ Get schedule details error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get schedule details',
        success: false
      },
      { status: 500 }
    )
  }
}

// ✅ UPDATE SCHEDULE (Used by SchedulesTable edit dialog)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📅 Updating schedule:', params.id)

    const body = await request.json()
    const { departureTime, arrivalTime, frequency, isActive } = body

    // Check if schedule exists
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id: params.id },
      include: {
        route: {
          select: { 
            operatorId: true, 
            routeNumber: true,
            isActive: true
          }
        },
        bus: {
          select: {
            operatorId: true,
            busNumber: true,
            isActive: true
          }
        }
      }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Verify operator access
    if (existingSchedule.route.operatorId !== DEFAULT_OPERATOR_ID || existingSchedule.bus.operatorId !== DEFAULT_OPERATOR_ID) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Validate time formats if provided
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    
    if (departureTime && !timeRegex.test(departureTime)) {
      return NextResponse.json(
        { error: 'Invalid departure time format. Use HH:MM format' },
        { status: 400 }
      )
    }

    if (arrivalTime && !timeRegex.test(arrivalTime)) {
      return NextResponse.json(
        { error: 'Invalid arrival time format. Use HH:MM format' },
        { status: 400 }
      )
    }

    // Check for schedule conflicts if times are being changed
    if (departureTime || arrivalTime) {
      const newDepartureTime = departureTime || existingSchedule.departureTime
      const newArrivalTime = arrivalTime || existingSchedule.arrivalTime

      const conflictingSchedules = await prisma.schedule.findMany({
        where: {
          busId: existingSchedule.busId,
          isActive: true,
          id: { not: params.id }, // Exclude current schedule
          OR: [
            {
              AND: [
                { departureTime: { lte: newDepartureTime } },
                { arrivalTime: { gte: newDepartureTime } }
              ]
            },
            {
              AND: [
                { departureTime: { lte: newArrivalTime } },
                { arrivalTime: { gte: newArrivalTime } }
              ]
            },
            {
              AND: [
                { departureTime: { gte: newDepartureTime } },
                { arrivalTime: { lte: newArrivalTime } }
              ]
            }
          ]
        },
        include: {
          route: {
            select: { routeNumber: true }
          }
        }
      })

      if (conflictingSchedules.length > 0) {
        const conflictInfo = conflictingSchedules[0]
        return NextResponse.json(
          { 
            error: `Schedule conflict: Bus ${existingSchedule.bus.busNumber} is already scheduled for route ${conflictInfo.route.routeNumber} during this time (${conflictInfo.departureTime} - ${conflictInfo.arrivalTime})` 
          },
          { status: 409 }
        )
      }
    }

    // Validate frequency if provided
    let validatedFrequency = undefined
    if (frequency !== undefined) {
      if (frequency === null || frequency === '') {
        validatedFrequency = null
      } else {
        const parsedFrequency = parseInt(frequency)
        if (isNaN(parsedFrequency) || parsedFrequency < 5 || parsedFrequency > 1440) {
          return NextResponse.json(
            { error: 'Frequency must be between 5 and 1440 minutes' },
            { status: 400 }
          )
        }
        validatedFrequency = parsedFrequency
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (departureTime) updateData.departureTime = departureTime
    if (arrivalTime) updateData.arrivalTime = arrivalTime
    if (validatedFrequency !== undefined) updateData.frequency = validatedFrequency
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedSchedule = await prisma.schedule.update({
      where: { id: params.id },
      data: updateData,
      include: {
        route: {
          select: {
            id: true,
            routeNumber: true,
            startLocation: true,
            endLocation: true,
            isActive: true
          }
        },
        bus: {
          select: {
            id: true,
            busNumber: true,
            capacity: true,
            busType: true,
            isActive: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    console.log(`✅ Schedule updated: ${updatedSchedule.route.routeNumber} - ${updatedSchedule.bus.busNumber}`)

    return NextResponse.json({
      ...updatedSchedule,
      success: true,
      message: `Schedule updated successfully for route ${updatedSchedule.route.routeNumber}`
    })

  } catch (error) {
    console.error('❌ Update schedule error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update schedule',
        success: false
      },
      { status: 500 }
    )
  }
}

// ✅ DELETE SCHEDULE (Used by SchedulesTable delete action)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📅 Deleting schedule:', params.id)

    // Check if schedule exists
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id: params.id },
      include: {
        route: {
          select: { 
            operatorId: true, 
            routeNumber: true,
            isActive: true
          }
        },
        bus: {
          select: {
            operatorId: true,
            busNumber: true,
            isActive: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Verify operator access
    if (existingSchedule.route.operatorId !== DEFAULT_OPERATOR_ID || existingSchedule.bus.operatorId !== DEFAULT_OPERATOR_ID) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check for active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        scheduleId: params.id,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    })

    if (activeBookings > 0) {
      return NextResponse.json(
        { error: `Cannot delete schedule with ${activeBookings} active bookings. Please cancel or complete bookings first.` },
        { status: 400 }
      )
    }

    // Delete schedule and related data in a transaction
    await prisma.$transaction(async (tx) => {
      // Cancel all pending bookings for this schedule
      await tx.booking.updateMany({
        where: { scheduleId: params.id },
        data: { status: 'CANCELLED' }
      })

      // Delete the schedule
      await tx.schedule.delete({
        where: { id: params.id }
      })
    })

    console.log(`✅ Schedule deleted: ${existingSchedule.route.routeNumber} - ${existingSchedule.bus.busNumber}`)

    return NextResponse.json({
      success: true,
      message: `Schedule deleted successfully`,
      routeNumber: existingSchedule.route.routeNumber,
      busNumber: existingSchedule.bus.busNumber,
      cancelledBookings: existingSchedule._count.bookings
    })

  } catch (error) {
    console.error('❌ Delete schedule error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete schedule',
        success: false
      },
      { status: 500 }
    )
  }
}
