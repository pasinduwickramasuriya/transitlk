


// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'
// import { z } from 'zod'

// // ✅ VALIDATION SCHEMA
// const updateBusSchema = z.object({
//     busNumber: z.string().min(1).max(20).optional(),
//     busType: z.enum(['AC Luxury', 'Semi Luxury', 'Normal', 'Express']).optional(),
//     capacity: z.number().min(1).max(100).optional(),
//     isActive: z.boolean().optional()
// })

// // ✅ HELPER FUNCTION: Verify operator ownership
// async function verifyOperatorOwnership(session: any, operatorId: string) {
//     return await prisma.operator.findFirst({
//         where: {
//             AND: [
//                 { id: operatorId },
//                 {
//                     OR: [
//                         { name: session.user.name || '' },
//                         { contactInfo: session.user.email || '' }
//                     ]
//                 }
//             ]
//         }
//     })
// }

// // ✅ GET SINGLE BUS
// export async function GET(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         console.log('🚌 GET /api/operator/buses/[id] called for:', params.id)

//         // Verify authentication
//         const session = await getServerSession(authOptions)

//         if (!session || session.user.role !== 'OPERATOR') {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//         }

//         // Find bus with all related data
//         const bus = await prisma.bus.findUnique({
//             where: { id: params.id },
//             include: {
//                 operator: {
//                     select: {
//                         id: true,
//                         name: true,
//                         licenseNo: true,
//                         contactInfo: true
//                     }
//                 },
//                 device: true,
//                 positions: {
//                     take: 10,
//                     orderBy: { timestamp: 'desc' }
//                 },
//                 schedules: {
//                     include: {
//                         route: {
//                             select: {
//                                 id: true,
//                                 routeNumber: true,
//                                 startLocation: true,
//                                 endLocation: true
//                             }
//                         }
//                     }
//                 },
//                 bookings: {
//                     take: 5,
//                     orderBy: { createdAt: 'desc' },
//                     include: {
//                         user: {
//                             select: {
//                                 id: true,
//                                 name: true,
//                                 email: true
//                             }
//                         }
//                     }
//                 },
//                 _count: {
//                     select: {
//                         bookings: true,
//                         positions: true,
//                         schedules: true
//                     }
//                 }
//             }
//         })

//         if (!bus) {
//             return NextResponse.json({ error: 'Bus not found' }, { status: 404 })
//         }

//         // Verify operator ownership
//         const operator = await verifyOperatorOwnership(session, bus.operatorId)

//         if (!operator) {
//             return NextResponse.json({ error: 'Access denied' }, { status: 403 })
//         }

//         console.log('✅ Bus found:', bus.busNumber)
//         return NextResponse.json(bus)

//     } catch (error) {
//         console.error('❌ GET /api/operator/buses/[id] error:', error)
//         return NextResponse.json(
//             { error: 'Failed to fetch bus details' },
//             { status: 500 }
//         )
//     }
// }

// // ✅ UPDATE BUS
// export async function PUT(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         console.log('🚌 PUT /api/operator/buses/[id] called for:', params.id)

//         // Verify authentication
//         const session = await getServerSession(authOptions)

//         if (!session || session.user.role !== 'OPERATOR') {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//         }

//         // Parse and validate request body
//         const body = await request.json()
//         const validatedData = updateBusSchema.parse(body)

//         // Find existing bus
//         const existingBus = await prisma.bus.findUnique({
//             where: { id: params.id },
//             include: {
//                 operator: true
//             }
//         })

//         if (!existingBus) {
//             return NextResponse.json({ error: 'Bus not found' }, { status: 404 })
//         }

//         // Verify operator ownership
//         const operator = await verifyOperatorOwnership(session, existingBus.operatorId)

//         if (!operator) {
//             return NextResponse.json({ error: 'Access denied' }, { status: 403 })
//         }

//         // Check for duplicate bus number if updating
//         if (validatedData.busNumber && validatedData.busNumber !== existingBus.busNumber) {
//             const duplicateBus = await prisma.bus.findUnique({
//                 where: { busNumber: validatedData.busNumber }
//             })

//             if (duplicateBus) {
//                 return NextResponse.json(
//                     { error: 'Bus number already exists' },
//                     { status: 409 }
//                 )
//             }
//         }

//         // Update bus
//         const updatedBus = await prisma.bus.update({
//             where: { id: params.id },
//             data: {
//                 ...validatedData,
//                 updatedAt: new Date()
//             },
//             include: {
//                 operator: {
//                     select: {
//                         id: true,
//                         name: true,
//                         licenseNo: true
//                     }
//                 },
//                 device: true,
//                 positions: {
//                     take: 1,
//                     orderBy: { timestamp: 'desc' }
//                 },
//                 schedules: {
//                     where: { isActive: true },
//                     include: {
//                         route: {
//                             select: {
//                                 id: true,
//                                 routeNumber: true,
//                                 startLocation: true,
//                                 endLocation: true
//                             }
//                         }
//                     }
//                 },
//                 _count: {
//                     select: {
//                         bookings: true,
//                         positions: true,
//                         schedules: true
//                     }
//                 }
//             }
//         })

//         console.log('✅ Bus updated:', updatedBus.busNumber)
//         return NextResponse.json(updatedBus)

//     } catch (error) {
//         console.error('❌ PUT /api/operator/buses/[id] error:', error)

//         // Handle Zod validation errors
//         if (error instanceof z.ZodError) {
//             return NextResponse.json(
//                 {
//                     error: 'Validation failed',
//                     details: error.issues.map(issue => ({
//                         path: issue.path.join('.'),
//                         message: issue.message
//                     }))
//                 },
//                 { status: 400 }
//             )
//         }

//         return NextResponse.json(
//             { error: 'Failed to update bus' },
//             { status: 500 }
//         )
//     }
// }

// // ✅ DELETE BUS
// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         console.log('🚌 DELETE /api/operator/buses/[id] called for:', params.id)

//         // Verify authentication
//         const session = await getServerSession(authOptions)

//         if (!session || session.user.role !== 'OPERATOR') {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//         }

//         // Find existing bus with counts
//         const existingBus = await prisma.bus.findUnique({
//             where: { id: params.id },
//             include: {
//                 _count: {
//                     select: {
//                         bookings: true,
//                         schedules: true,
//                         positions: true
//                     }
//                 }
//             }
//         })

//         if (!existingBus) {
//             return NextResponse.json({ error: 'Bus not found' }, { status: 404 })
//         }

//         // Verify operator ownership
//         const operator = await verifyOperatorOwnership(session, existingBus.operatorId)

//         if (!operator) {
//             return NextResponse.json({ error: 'Access denied' }, { status: 403 })
//         }

//         // Check for active bookings
//         const activeBookingsCount = await prisma.booking.count({
//             where: {
//                 busId: params.id,
//                 status: {
//                     in: ['PENDING', 'CONFIRMED']
//                 }
//             }
//         })

//         if (activeBookingsCount > 0) {
//             return NextResponse.json(
//                 { error: `Cannot delete bus with ${activeBookingsCount} active bookings` },
//                 { status: 400 }
//             )
//         }

//         // Delete bus and related data in transaction
//         await prisma.$transaction(async (tx) => {
//             // Delete related positions
//             await tx.position.deleteMany({
//                 where: { busId: params.id }
//             })

//             // Delete device if exists
//             await tx.device.deleteMany({
//                 where: { busId: params.id }
//             })

//             // Deactivate schedules (preserve history)
//             await tx.schedule.updateMany({
//                 where: { busId: params.id },
//                 data: { isActive: false }
//             })

//             // Delete the bus
//             await tx.bus.delete({
//                 where: { id: params.id }
//             })
//         })

//         console.log('✅ Bus deleted:', existingBus.busNumber)

//         return NextResponse.json({
//             success: true,
//             message: 'Bus deleted successfully',
//             deletedBusNumber: existingBus.busNumber
//         })

//     } catch (error) {
//         console.error('❌ DELETE /api/operator/buses/[id] error:', error)
//         return NextResponse.json(
//             { error: 'Failed to delete bus' },
//             { status: 500 }
//         )
//     }
// }




import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ✅ GET SINGLE BUS - SIMPLIFIED
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📡 Getting bus:', params.id)

    const bus = await prisma.bus.findUnique({
      where: { id: params.id },
      include: {
        operator: {
          select: {
            id: true,
            name: true,
            licenseNo: true
          }
        },
        device: true,
        positions: {
          take: 10,
          orderBy: { timestamp: 'desc' }
        },
        schedules: {
          include: {
            route: true
          }
        },
        bookings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true,
            positions: true,
            schedules: true
          }
        }
      }
    })

    if (!bus) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      )
    }

    console.log('✅ Bus found:', bus.busNumber)

    return NextResponse.json(bus)

  } catch (error) {
    console.error('❌ Get bus error:', error)
    return NextResponse.json(
      { error: 'Failed to get bus' },
      { status: 500 }
    )
  }
}

// ✅ UPDATE BUS - SIMPLIFIED (NO AUTH CHECK)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📡 Updating bus:', params.id)

    const body = await request.json()
    const { busNumber, busType, capacity, isActive } = body

    console.log('📝 Update data:', body)

    // Check if bus exists
    const existingBus = await prisma.bus.findUnique({
      where: { id: params.id }
    })

    if (!existingBus) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      )
    }

    // Check for duplicate bus number (if changing)
    if (busNumber && busNumber !== existingBus.busNumber) {
      const duplicateBus = await prisma.bus.findFirst({
        where: {
          busNumber: busNumber,
          id: { not: params.id }
        }
      })

      if (duplicateBus) {
        return NextResponse.json(
          { error: 'Bus number already exists' },
          { status: 409 }
        )
      }
    }

    // Validate capacity if provided
    if (capacity && (capacity < 1 || capacity > 100)) {
      return NextResponse.json(
        { error: 'Capacity must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Update bus
    const updatedBus = await prisma.bus.update({
      where: { id: params.id },
      data: {
        ...(busNumber && { busNumber }),
        ...(busType && { busType }),
        ...(capacity && { capacity: parseInt(capacity) }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date()
      },
      include: {
        operator: {
          select: {
            id: true,
            name: true,
            licenseNo: true
          }
        },
        device: true,
        positions: {
          take: 1,
          orderBy: { timestamp: 'desc' }
        },
        schedules: {
          where: { isActive: true },
          include: {
            route: true
          }
        },
        _count: {
          select: {
            bookings: true,
            positions: true,
            schedules: true
          }
        }
      }
    })

    console.log('✅ Bus updated:', updatedBus.busNumber)

    return NextResponse.json(updatedBus)

  } catch (error) {
    console.error('❌ Update bus error:', error)
    return NextResponse.json(
      { error: 'Failed to update bus' },
      { status: 500 }
    )
  }
}

// ✅ DELETE BUS - SIMPLIFIED
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📡 Deleting bus:', params.id)

    // Check if bus exists
    const existingBus = await prisma.bus.findUnique({
      where: { id: params.id }
    })

    if (!existingBus) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      )
    }

    // Check for active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        busId: params.id,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    if (activeBookings > 0) {
      return NextResponse.json(
        { error: `Cannot delete bus with ${activeBookings} active bookings` },
        { status: 400 }
      )
    }

    // Delete bus (cascade will handle related data)
    await prisma.bus.delete({
      where: { id: params.id }
    })

    console.log('✅ Bus deleted:', existingBus.busNumber)

    return NextResponse.json({
      message: 'Bus deleted successfully',
      busNumber: existingBus.busNumber
    })

  } catch (error) {
    console.error('❌ Delete bus error:', error)
    return NextResponse.json(
      { error: 'Failed to delete bus' },
      { status: 500 }
    )
  }
}
