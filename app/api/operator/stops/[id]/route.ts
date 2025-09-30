import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

// ✅ GET SINGLE STOP
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📍 Getting stop:', params.id)

    const stop = await prisma.stop.findUnique({
      where: { id: params.id },
      include: {
        route: {
          select: {
            id: true,
            routeNumber: true,
            startLocation: true,
            endLocation: true,
            isActive: true,
            operatorId: true,
            distance: true,
            estimatedTime: true
          }
        }
      }
    })

    if (!stop) {
      return NextResponse.json(
        { error: 'Stop not found' },
        { status: 404 }
      )
    }

    // Verify operator access
    if (stop.route.operatorId !== DEFAULT_OPERATOR_ID) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get neighboring stops for context
    const [previousStop, nextStop] = await Promise.all([
      prisma.stop.findFirst({
        where: {
          routeId: stop.routeId,
          order: { lt: stop.order }
        },
        orderBy: { order: 'desc' },
        select: { id: true, name: true, order: true }
      }),
      prisma.stop.findFirst({
        where: {
          routeId: stop.routeId,
          order: { gt: stop.order }
        },
        orderBy: { order: 'asc' },
        select: { id: true, name: true, order: true }
      })
    ])

    const stopWithContext = {
      ...stop,
      neighbors: {
        previous: previousStop,
        next: nextStop
      }
    }

    console.log('✅ Stop found:', stop.name)

    return NextResponse.json(stopWithContext)

  } catch (error) {
    console.error('❌ Get stop error:', error)
    return NextResponse.json(
      { error: 'Failed to get stop' },
      { status: 500 }
    )
  }
}

// ✅ UPDATE STOP
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📍 Updating stop:', params.id)

    const body = await request.json()
    const { name, latitude, longitude, order } = body

    // Check if stop exists
    const existingStop = await prisma.stop.findUnique({
      where: { id: params.id },
      include: {
        route: {
          select: { operatorId: true, routeNumber: true }
        }
      }
    })

    if (!existingStop) {
      return NextResponse.json(
        { error: 'Stop not found' },
        { status: 404 }
      )
    }

    // Verify operator access
    if (existingStop.route.operatorId !== DEFAULT_OPERATOR_ID) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Validate coordinates if provided
    if (latitude !== undefined) {
      const lat = parseFloat(latitude)
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return NextResponse.json(
          { error: 'Latitude must be a number between -90 and 90' },
          { status: 400 }
        )
      }
    }

    if (longitude !== undefined) {
      const lng = parseFloat(longitude)
      if (isNaN(lng) || lng < -180 || lng > 180) {
        return NextResponse.json(
          { error: 'Longitude must be a number between -180 and 180' },
          { status: 400 }
        )
      }
    }

    // Check for duplicate name within same route (if changing name)
    if (name && name.trim() !== existingStop.name) {
      const duplicateName = await prisma.stop.findFirst({
        where: {
          routeId: existingStop.routeId,
          name: name.trim(),
          id: { not: params.id }
        }
      })

      if (duplicateName) {
        return NextResponse.json(
          { error: 'A stop with this name already exists on this route' },
          { status: 409 }
        )
      }
    }

    // Handle order changes
    if (order !== undefined && parseInt(order) !== existingStop.order) {
      const newOrder = parseInt(order)
      
      if (newOrder <= 0) {
        return NextResponse.json(
          { error: 'Stop order must be greater than 0' },
          { status: 400 }
        )
      }

      // Get max order for the route
      const maxOrderStop = await prisma.stop.findFirst({
        where: { routeId: existingStop.routeId },
        orderBy: { order: 'desc' }
      })

      const maxOrder = maxOrderStop?.order || 1

      if (newOrder > maxOrder + 1) {
        return NextResponse.json(
          { error: `Stop order cannot exceed ${maxOrder + 1}` },
          { status: 400 }
        )
      }

      // Reorder stops
      await prisma.$transaction(async (tx) => {
        if (newOrder > existingStop.order) {
          // Moving down: shift stops up
          await tx.stop.updateMany({
            where: {
              routeId: existingStop.routeId,
              order: {
                gt: existingStop.order,
                lte: newOrder
              }
            },
            data: { order: { decrement: 1 } }
          })
        } else {
          // Moving up: shift stops down
          await tx.stop.updateMany({
            where: {
              routeId: existingStop.routeId,
              order: {
                gte: newOrder,
                lt: existingStop.order
              }
            },
            data: { order: { increment: 1 } }
          })
        }

        // Update the current stop
        await tx.stop.update({
          where: { id: params.id },
          data: { order: newOrder }
        })
      })
    }

    // Check coordinates proximity if changing location
    if ((latitude !== undefined || longitude !== undefined)) {
      const newLat = latitude !== undefined ? parseFloat(latitude) : existingStop.latitude
      const newLng = longitude !== undefined ? parseFloat(longitude) : existingStop.longitude

      const nearbyStops = await prisma.stop.findMany({
        where: {
          routeId: existingStop.routeId,
          id: { not: params.id },
          AND: [
            { latitude: { gte: newLat - 0.001, lte: newLat + 0.001 } },
            { longitude: { gte: newLng - 0.001, lte: newLng + 0.001 } }
          ]
        }
      })

      if (nearbyStops.length > 0) {
        return NextResponse.json(
          { error: 'Another stop already exists very close to these coordinates (within ~100m)' },
          { status: 409 }
        )
      }
    }

    // Update stop (excluding order if already handled above)
    const updateData: any = {}
    if (name) updateData.name = name.trim()
    if (latitude !== undefined) updateData.latitude = parseFloat(latitude)
    if (longitude !== undefined) updateData.longitude = parseFloat(longitude)

    const updatedStop = await prisma.stop.update({
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
        }
      }
    })

    console.log('✅ Stop updated:', updatedStop.name)

    return NextResponse.json(updatedStop)

  } catch (error) {
    console.error('❌ Update stop error:', error)
    return NextResponse.json(
      { error: 'Failed to update stop' },
      { status: 500 }
    )
  }
}

// ✅ DELETE STOP
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📍 Deleting stop:', params.id)

    // Check if stop exists
    const existingStop = await prisma.stop.findUnique({
      where: { id: params.id },
      include: {
        route: {
          select: { 
            operatorId: true, 
            routeNumber: true 
          }
        }
      }
    })

    if (!existingStop) {
      return NextResponse.json(
        { error: 'Stop not found' },
        { status: 404 }
      )
    }

    // Verify operator access
    if (existingStop.route.operatorId !== DEFAULT_OPERATOR_ID) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check if this is the only stop on the route
    const stopsCount = await prisma.stop.count({
      where: { routeId: existingStop.routeId }
    })

    // Delete stop and reorder remaining stops
    await prisma.$transaction(async (tx) => {
      // Delete the stop
      await tx.stop.delete({
        where: { id: params.id }
      })

      // Reorder remaining stops
      await tx.stop.updateMany({
        where: {
          routeId: existingStop.routeId,
          order: { gt: existingStop.order }
        },
        data: {
          order: { decrement: 1 }
        }
      })
    })

    console.log('✅ Stop deleted:', existingStop.name)

    return NextResponse.json({
      message: 'Stop deleted successfully',
      stopName: existingStop.name,
      routeNumber: existingStop.route.routeNumber,
      remainingStopsCount: stopsCount - 1
    })

  } catch (error) {
    console.error('❌ Delete stop error:', error)
    return NextResponse.json(
      { error: 'Failed to delete stop' },
      { status: 500 }
    )
  }
}
