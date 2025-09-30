import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ✅ SIMPLE DEFAULT OPERATOR
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
    } catch (error) {
      console.log('⚠️ Operator creation failed')
    }
  }
  return DEFAULT_OPERATOR_ID
}

// ✅ GET ALL STOPS
export async function GET(request: NextRequest) {
  try {
    console.log('📍 Getting stops...')

    const operatorId = await ensureDefaultOperator()

    // Get search parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const routeId = searchParams.get('routeId') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      route: { operatorId }
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (routeId) {
      where.routeId = routeId
    }

    // Build order by clause
    let orderBy: any = {}
    if (sortBy === 'route') {
      orderBy = { route: { routeNumber: sortOrder } }
    } else if (sortBy === 'order') {
      orderBy = [
        { routeId: 'asc' },
        { order: sortOrder }
      ]
    } else {
      orderBy = { [sortBy]: sortOrder }
    }

    const [stops, total] = await Promise.all([
      prisma.stop.findMany({
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
              isActive: true,
              operatorId: true
            }
          }
        }
      }),
      prisma.stop.count({ where })
    ])

    console.log('✅ Found stops:', stops.length)

    return NextResponse.json({
      stops,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    })

  } catch (error) {
    console.error('❌ Get stops error:', error)
    return NextResponse.json(
      { error: 'Failed to get stops' },
      { status: 500 }
    )
  }
}

// ✅ CREATE STOP
export async function POST(request: NextRequest) {
  try {
    console.log('📍 Creating stop...')

    const body = await request.json()
    const { name, latitude, longitude, order, routeId } = body

    // Simple validation
    if (!name || !routeId) {
      return NextResponse.json(
        { error: 'Stop name and route ID are required' },
        { status: 400 }
      )
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Valid latitude and longitude coordinates are required' },
        { status: 400 }
      )
    }

    // Validate coordinates range
    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        { error: 'Latitude must be between -90 and 90' },
        { status: 400 }
      )
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Longitude must be between -180 and 180' },
        { status: 400 }
      )
    }

    const operatorId = await ensureDefaultOperator()

    // Verify route exists and belongs to operator
    const route = await prisma.route.findFirst({
      where: {
        id: routeId,
        operatorId
      }
    })

    if (!route) {
      return NextResponse.json(
        { error: 'Route not found or access denied' },
        { status: 404 }
      )
    }

    // Check for duplicate stop name within the same route
    const existingStop = await prisma.stop.findFirst({
      where: {
        routeId,
        name: name.trim()
      }
    })

    if (existingStop) {
      return NextResponse.json(
        { error: 'A stop with this name already exists on this route' },
        { status: 409 }
      )
    }

    // If no order specified, get next order number
    let stopOrder = order || 1
    if (!order || order <= 0) {
      const lastStop = await prisma.stop.findFirst({
        where: { routeId },
        orderBy: { order: 'desc' }
      })
      stopOrder = lastStop ? lastStop.order + 1 : 1
    } else {
      // Check if order already exists
      const existingOrderStop = await prisma.stop.findFirst({
        where: { routeId, order: parseInt(order) }
      })

      if (existingOrderStop) {
        // Shift existing stops to make room
        await prisma.stop.updateMany({
          where: {
            routeId,
            order: { gte: parseInt(order) }
          },
          data: {
            order: { increment: 1 }
          }
        })
      }
      stopOrder = parseInt(order)
    }

    // Validate coordinates are not too close to existing stops on same route
    const nearbyStops = await prisma.stop.findMany({
      where: {
        routeId,
        AND: [
          { latitude: { gte: latitude - 0.001, lte: latitude + 0.001 } },
          { longitude: { gte: longitude - 0.001, lte: longitude + 0.001 } }
        ]
      }
    })

    if (nearbyStops.length > 0) {
      return NextResponse.json(
        { error: 'A stop already exists very close to these coordinates (within ~100m)' },
        { status: 409 }
      )
    }

    // Create stop
    const newStop = await prisma.stop.create({
      data: {
        name: name.trim(),
        latitude: parseFloat(latitude.toString()),
        longitude: parseFloat(longitude.toString()),
        order: stopOrder,
        routeId
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
        }
      }
    })

    console.log('✅ Stop created:', newStop.name)

    return NextResponse.json(newStop, { status: 201 })

  } catch (error) {
    console.error('❌ Create stop error:', error)
    return NextResponse.json(
      { error: 'Failed to create stop' },
      { status: 500 }
    )
  }
}
