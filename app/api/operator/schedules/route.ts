import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ✅ DEFAULT OPERATOR SETUP
const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

async function ensureDefaultOperator() {
  let operator = await prisma.operator.findUnique({
    where: { id: DEFAULT_OPERATOR_ID }
  }).catch(() => null)

  if (!operator) {
    try {
      operator = await prisma.operator.create({
        data: {
          id: DEFAULT_OPERATOR_ID,
          name: 'Default Operator',
          licenseNo: 'DEFAULT001',
          contactInfo: 'default@transitlk.com',
          isActive: true
        }
      })
      console.log('✅ Created default operator')
    } catch (error) {
      console.log('⚠️ Operator creation failed, might already exist')
    }
  }
  return DEFAULT_OPERATOR_ID
}

// ✅ GET ALL SCHEDULES (Used by SchedulesTable)
export async function GET(request: NextRequest) {
  try {
    console.log('📅 Getting schedules...')

    const operatorId = await ensureDefaultOperator()

    // Extract search parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const routeId = searchParams.get('routeId') || ''
    const busId = searchParams.get('busId') || ''
    const status = searchParams.get('status') || 'all'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: any = {
      route: { 
        operatorId,
        isActive: true
      },
      bus: {
        operatorId,
        isActive: true
      }
    }

    // Add search filter
    if (search.trim()) {
      where.OR = [
        { route: { routeNumber: { contains: search.trim(), mode: 'insensitive' } } },
        { bus: { busNumber: { contains: search.trim(), mode: 'insensitive' } } },
        { route: { startLocation: { contains: search.trim(), mode: 'insensitive' } } },
        { route: { endLocation: { contains: search.trim(), mode: 'insensitive' } } }
      ]
    }

    // Add route filter
    if (routeId) {
      where.routeId = routeId
    }

    // Add bus filter
    if (busId) {
      where.busId = busId
    }

    // Add status filter
    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    // Build order by clause
    let orderBy: any = {}
    if (sortBy === 'route') {
      orderBy = { route: { routeNumber: sortOrder } }
    } else if (sortBy === 'bus') {
      orderBy = { bus: { busNumber: sortOrder } }
    } else if (sortBy === 'departureTime') {
      orderBy = { departureTime: sortOrder }
    } else {
      orderBy = { [sortBy]: sortOrder }
    }

    // Fetch schedules and total count
    const [schedules, total] = await Promise.all([
      prisma.schedule.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
      }),
      prisma.schedule.count({ where })
    ])

    console.log(`✅ Found ${schedules.length} schedules (${total} total)`)

    return NextResponse.json({
      schedules,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      success: true
    })

  } catch (error) {
    console.error('❌ Get schedules error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to load schedules',
        schedules: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        success: false
      },
      { status: 500 }
    )
  }
}

// ✅ CREATE SCHEDULE (Used by SchedulesTable create dialog)
export async function POST(request: NextRequest) {
  try {
    console.log('📅 Creating new schedule...')

    const operatorId = await ensureDefaultOperator()
    const body = await request.json()
    const { routeId, busId, departureTime, arrivalTime, frequency, isActive = true } = body

    // Validation
    if (!routeId) {
      return NextResponse.json(
        { error: 'Route selection is required' },
        { status: 400 }
      )
    }

    if (!busId) {
      return NextResponse.json(
        { error: 'Bus selection is required' },
        { status: 400 }
      )
    }

    if (!departureTime) {
      return NextResponse.json(
        { error: 'Departure time is required' },
        { status: 400 }
      )
    }

    if (!arrivalTime) {
      return NextResponse.json(
        { error: 'Arrival time is required' },
        { status: 400 }
      )
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(departureTime)) {
      return NextResponse.json(
        { error: 'Invalid departure time format. Use HH:MM format' },
        { status: 400 }
      )
    }

    if (!timeRegex.test(arrivalTime)) {
      return NextResponse.json(
        { error: 'Invalid arrival time format. Use HH:MM format' },
        { status: 400 }
      )
    }

    // Verify route exists and belongs to operator
    const route = await prisma.route.findFirst({
      where: {
        id: routeId,
        operatorId,
        isActive: true
      }
    })

    if (!route) {
      return NextResponse.json(
        { error: 'Selected route not found or is inactive' },
        { status: 404 }
      )
    }

    // Verify bus exists and belongs to operator
    const bus = await prisma.bus.findFirst({
      where: {
        id: busId,
        operatorId,
        isActive: true
      }
    })

    if (!bus) {
      return NextResponse.json(
        { error: 'Selected bus not found or is inactive' },
        { status: 404 }
      )
    }

    // Check for schedule conflicts (same bus at overlapping times)
    const conflictingSchedules = await prisma.schedule.findMany({
      where: {
        busId,
        isActive: true,
        OR: [
          {
            AND: [
              { departureTime: { lte: departureTime } },
              { arrivalTime: { gte: departureTime } }
            ]
          },
          {
            AND: [
              { departureTime: { lte: arrivalTime } },
              { arrivalTime: { gte: arrivalTime } }
            ]
          },
          {
            AND: [
              { departureTime: { gte: departureTime } },
              { arrivalTime: { lte: arrivalTime } }
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
          error: `Schedule conflict: Bus ${bus.busNumber} is already scheduled for route ${conflictInfo.route.routeNumber} during this time (${conflictInfo.departureTime} - ${conflictInfo.arrivalTime})` 
        },
        { status: 409 }
      )
    }

    // Validate frequency if provided
    let validatedFrequency = null
    if (frequency !== undefined && frequency !== null && frequency !== '') {
      const parsedFrequency = parseInt(frequency.toString())
      if (isNaN(parsedFrequency) || parsedFrequency < 5 || parsedFrequency > 1440) {
        return NextResponse.json(
          { error: 'Frequency must be between 5 and 1440 minutes' },
          { status: 400 }
        )
      }
      validatedFrequency = parsedFrequency
    }

    // Create the schedule
    const newSchedule = await prisma.schedule.create({
      data: {
        routeId,
        busId,
        departureTime,
        arrivalTime,
        frequency: validatedFrequency,
        isActive
      },
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

    console.log(`✅ Schedule created: Route ${newSchedule.route.routeNumber} - Bus ${newSchedule.bus.busNumber}`)

    return NextResponse.json({
      ...newSchedule,
      success: true,
      message: `Schedule created successfully for route ${newSchedule.route.routeNumber} with bus ${newSchedule.bus.busNumber}`
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Create schedule error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create schedule',
        success: false
      },
      { status: 500 }
    )
  }
}
