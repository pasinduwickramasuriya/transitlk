// import { NextRequest } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'

// // ✅ GET - Fetch single route by ID with detailed information
// export async function GET(
//   request: NextRequest, 
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== 'OPERATOR') {
//       return new Response(
//         JSON.stringify({ error: 'Unauthorized' }), 
//         { status: 401, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     const { id } = params

//     if (!id || typeof id !== 'string') {
//       return new Response(
//         JSON.stringify({ error: 'Valid route ID is required' }), 
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     console.log('📍 Fetching route by ID:', id)
    
//     // Find operator
//     const operator = await prisma.operator.findFirst({
//       where: { 
//         name: {
//           equals: session.user.name || '',
//           mode: 'insensitive'
//         }
//       }
//     })
    
//     if (!operator) {
//       return new Response(
//         JSON.stringify({ error: 'Operator not found' }), 
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       )
//     }
    
//     // Find route with comprehensive data
//     const route = await prisma.route.findFirst({
//       where: {
//         id,
//         operatorId: operator.id
//       },
//       include: {
//         operator: {
//           select: {
//             id: true,
//             name: true,
//             licenseNo: true,
//             contactInfo: true
//           }
//         },
//         stops: {
//           orderBy: { order: 'asc' }
//         },
//         schedules: {
//           include: {
//             bus: {
//               select: {
//                 id: true,
//                 busNumber: true,
//                 capacity: true,
//                 busType: true
//               }
//             },
//             bookings: {
//               where: {
//                 status: {
//                   in: ['CONFIRMED', 'PENDING']
//                 }
//               },
//               select: {
//                 id: true,
//                 status: true,
//                 totalAmount: true
//               }
//             }
//           },
//           orderBy: { departureTime: 'asc' }
//         },
//         fares: {
//           where: { isActive: true },
//           orderBy: { createdAt: 'desc' }
//         },
//         _count: {
//           select: {
//             stops: true,
//             schedules: true,
//             fares: true
//           }
//         }
//       }
//     })
    
//     if (!route) {
//       return new Response(
//         JSON.stringify({ error: 'Route not found or access denied' }), 
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     console.log('✅ Route found:', route.routeNumber)
    
//     return new Response(
//       JSON.stringify(route), 
//       { 
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//       }
//     )
    
//   } catch (error) {
//     console.error('❌ Error fetching route:', error)
    
//     return new Response(
//       JSON.stringify({ 
//         error: 'Internal server error',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       }), 
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     )
//   }
// }

// // ✅ PUT - Update existing route (supports inline editing from your component)
// export async function PUT(
//   request: NextRequest, 
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== 'OPERATOR') {
//       return new Response(
//         JSON.stringify({ error: 'Unauthorized' }), 
//         { status: 401, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     const { id } = params

//     if (!id || typeof id !== 'string') {
//       return new Response(
//         JSON.stringify({ error: 'Valid route ID is required' }), 
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     console.log('✏️ Updating route:', id)

//     // Parse request body
//     let body
//     try {
//       body = await request.json()
//     } catch (parseError) {
//       return new Response(
//         JSON.stringify({ error: 'Invalid JSON in request body' }), 
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     const { routeNumber, startLocation, endLocation, distance, estimatedTime, isActive } = body
    
//     // Find operator
//     const operator = await prisma.operator.findFirst({
//       where: { 
//         name: {
//           equals: session.user.name || '',
//           mode: 'insensitive'
//         }
//       }
//     })
    
//     if (!operator) {
//       return new Response(
//         JSON.stringify({ error: 'Operator not found' }), 
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       )
//     }
    
//     // Verify route exists and belongs to operator
//     const existingRoute = await prisma.route.findFirst({
//       where: {
//         id,
//         operatorId: operator.id
//       }
//     })
    
//     if (!existingRoute) {
//       return new Response(
//         JSON.stringify({ error: 'Route not found or access denied' }), 
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     // Validate fields if they are being updated
//     if (routeNumber !== undefined) {
//       if (!routeNumber?.trim()) {
//         return new Response(
//           JSON.stringify({ error: 'Route number cannot be empty' }), 
//           { status: 400, headers: { 'Content-Type': 'application/json' } }
//         )
//       }

//       // Check if new route number conflicts with existing ones (excluding current route)
//       const normalizedRouteNumber = routeNumber.trim().toUpperCase()
//       if (normalizedRouteNumber !== existingRoute.routeNumber) {
//         const conflictingRoute = await prisma.route.findUnique({
//           where: { routeNumber: normalizedRouteNumber }
//         })
        
//         if (conflictingRoute) {
//           return new Response(
//             JSON.stringify({ 
//               error: 'Route number already exists',
//               details: `Route number "${normalizedRouteNumber}" is already in use`
//             }), 
//             { status: 409, headers: { 'Content-Type': 'application/json' } }
//           )
//         }
//       }
//     }

//     if (startLocation !== undefined && !startLocation?.trim()) {
//       return new Response(
//         JSON.stringify({ error: 'Start location cannot be empty' }), 
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     if (endLocation !== undefined && !endLocation?.trim()) {
//       return new Response(
//         JSON.stringify({ error: 'End location cannot be empty' }), 
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     // Validate numeric fields
//     if (distance !== undefined && distance !== null && distance !== '') {
//       const numDistance = parseFloat(distance)
//       if (isNaN(numDistance) || numDistance < 0) {
//         return new Response(
//           JSON.stringify({ error: 'Distance must be a positive number' }), 
//           { status: 400, headers: { 'Content-Type': 'application/json' } }
//         )
//       }
//     }

//     if (estimatedTime !== undefined && estimatedTime !== null && estimatedTime !== '') {
//       const numTime = parseInt(estimatedTime)
//       if (isNaN(numTime) || numTime < 0) {
//         return new Response(
//           JSON.stringify({ error: 'Estimated time must be a positive integer' }), 
//           { status: 400, headers: { 'Content-Type': 'application/json' } }
//         )
//       }
//     }

//     // Build update data object
//     const updateData: any = {}
    
//     if (routeNumber !== undefined) {
//       updateData.routeNumber = routeNumber.trim().toUpperCase()
//     }
//     if (startLocation !== undefined) {
//       updateData.startLocation = startLocation.trim()
//     }
//     if (endLocation !== undefined) {
//       updateData.endLocation = endLocation.trim()
//     }
//     if (distance !== undefined) {
//       updateData.distance = (distance && distance !== '') ? parseFloat(distance) : null
//     }
//     if (estimatedTime !== undefined) {
//       updateData.estimatedTime = (estimatedTime && estimatedTime !== '') ? parseInt(estimatedTime) : null
//     }
//     if (isActive !== undefined) {
//       updateData.isActive = Boolean(isActive)
//     }

//     console.log('💾 Updating route with data:', updateData)
    
//     // Update route
//     const updatedRoute = await prisma.route.update({
//       where: { id },
//       data: updateData,
//       include: {
//         operator: {
//           select: {
//             id: true,
//             name: true
//           }
//         },
//         _count: {
//           select: {
//             stops: true,
//             schedules: true,
//             fares: true
//           }
//         }
//       }
//     })

//     console.log('✅ Route updated successfully:', updatedRoute.routeNumber)
    
//     return new Response(
//       JSON.stringify({
//         message: 'Route updated successfully',
//         route: updatedRoute
//       }), 
//       { 
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//       }
//     )
    
//   } catch (error) {
//     console.error('❌ Error updating route:', error)
    
//     // Handle Prisma unique constraint errors
//     if (error && typeof error === 'object' && 'code' in error) {
//       if (error.code === 'P2002') {
//         return new Response(
//           JSON.stringify({ 
//             error: 'Route number already exists',
//             details: 'This route number is already in use'
//           }), 
//           { status: 409, headers: { 'Content-Type': 'application/json' } }
//         )
//       }
//     }
    
//     return new Response(
//       JSON.stringify({ 
//         error: 'Internal server error',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       }), 
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     )
//   }
// }

// // ✅ DELETE - Delete single route with safety checks
// export async function DELETE(
//   request: NextRequest, 
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== 'OPERATOR') {
//       return new Response(
//         JSON.stringify({ error: 'Unauthorized' }), 
//         { status: 401, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     const { id } = params

//     if (!id || typeof id !== 'string') {
//       return new Response(
//         JSON.stringify({ error: 'Valid route ID is required' }), 
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     console.log('🗑️ Deleting route:', id)
    
//     // Find operator
//     const operator = await prisma.operator.findFirst({
//       where: { 
//         name: {
//           equals: session.user.name || '',
//           mode: 'insensitive'
//         }
//       }
//     })
    
//     if (!operator) {
//       return new Response(
//         JSON.stringify({ error: 'Operator not found' }), 
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       )
//     }
    
//     // Verify route exists and belongs to operator
//     const existingRoute = await prisma.route.findFirst({
//       where: {
//         id,
//         operatorId: operator.id
//       },
//       include: {
//         _count: {
//           select: {
//             schedules: { where: { isActive: true } },
//             stops: true
//           }
//         }
//       }
//     })
    
//     if (!existingRoute) {
//       return new Response(
//         JSON.stringify({ error: 'Route not found or access denied' }), 
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     // Check if route has active schedules
//     if (existingRoute._count.schedules > 0) {
//       return new Response(
//         JSON.stringify({ 
//           error: 'Cannot delete route with active schedules',
//           details: `Route ${existingRoute.routeNumber} has ${existingRoute._count.schedules} active schedules. Please deactivate or delete schedules first.`
//         }), 
//         { status: 409, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     console.log('🗑️ Deleting route and related data for:', existingRoute.routeNumber)

//     // Delete route and related records in transaction
//     await prisma.$transaction(async (tx) => {
//       // Delete related stops first
//       await tx.stop.deleteMany({
//         where: { routeId: id }
//       })
      
//       // Delete related fares
//       await tx.fare.deleteMany({
//         where: { routeId: id }
//       })
      
//       // Delete any inactive schedules
//       await tx.schedule.deleteMany({
//         where: { routeId: id }
//       })
      
//       // Finally delete the route
//       await tx.route.delete({
//         where: { id }
//       })
//     })

//     console.log('✅ Route deleted successfully:', existingRoute.routeNumber)
    
//     return new Response(
//       JSON.stringify({
//         message: `Route ${existingRoute.routeNumber} deleted successfully`,
//         routeNumber: existingRoute.routeNumber
//       }), 
//       { 
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//       }
//     )
    
//   } catch (error) {
//     console.error('❌ Error deleting route:', error)
    
//     // Handle foreign key constraint errors
//     if (error && typeof error === 'object' && 'code' in error) {
//       if (error.code === 'P2003') {
//         return new Response(
//           JSON.stringify({ 
//             error: 'Cannot delete route',
//             details: 'Route has associated records that must be deleted first'
//           }), 
//           { status: 409, headers: { 'Content-Type': 'application/json' } }
//         )
//       }
//     }
    
//     return new Response(
//       JSON.stringify({ 
//         error: 'Internal server error',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       }), 
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     )
//   }
// }





import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ✅ GET - Fetch single route
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Find operator
    let operator = await prisma.operator.findFirst({
      where: { 
        name: {
          equals: session.user.name || '',
          mode: 'insensitive'
        }
      }
    })

    if (!operator) {
      operator = await prisma.operator.findFirst({
        orderBy: { createdAt: 'desc' }
      })
    }

    if (!operator) {
      return NextResponse.json({ error: 'Operator not found' }, { status: 404 })
    }

    const route = await prisma.route.findFirst({
      where: {
        id,
        operatorId: operator.id
      },
      include: {
        operator: {
          select: {
            id: true,
            name: true,
            licenseNo: true,
            contactInfo: true
          }
        },
        stops: {
          orderBy: { order: 'asc' }
        },
        schedules: {
          include: {
            bus: {
              select: {
                id: true,
                busNumber: true,
                capacity: true,
                busType: true
              }
            }
          },
          orderBy: { departureTime: 'asc' }
        },
        fares: {
          where: { isActive: true }
        },
        _count: {
          select: {
            stops: true,
            schedules: true,
            fares: true
          }
        }
      }
    })

    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }

    return NextResponse.json(route)

  } catch (error) {
    console.error('❌ Get route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ✅ PUT - Update route
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { routeNumber, startLocation, endLocation, distance, estimatedTime, isActive } = body

    // Find operator
    let operator = await prisma.operator.findFirst({
      where: { 
        name: {
          equals: session.user.name || '',
          mode: 'insensitive'
        }
      }
    })

    if (!operator) {
      operator = await prisma.operator.findFirst({
        orderBy: { createdAt: 'desc' }
      })
    }

    if (!operator) {
      return NextResponse.json({ error: 'Operator not found' }, { status: 404 })
    }

    // Verify route exists and belongs to operator
    const existingRoute = await prisma.route.findFirst({
      where: {
        id,
        operatorId: operator.id
      }
    })

    if (!existingRoute) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }

    // Check for route number conflicts
    if (routeNumber && routeNumber.trim().toUpperCase() !== existingRoute.routeNumber) {
      const conflictingRoute = await prisma.route.findUnique({
        where: { routeNumber: routeNumber.trim().toUpperCase() }
      })

      if (conflictingRoute) {
        return NextResponse.json(
          { error: 'Route number already exists' },
          { status: 409 }
        )
      }
    }

    // Build update data
    const updateData: any = {}
    if (routeNumber !== undefined) updateData.routeNumber = routeNumber.trim().toUpperCase()
    if (startLocation !== undefined) updateData.startLocation = startLocation.trim()
    if (endLocation !== undefined) updateData.endLocation = endLocation.trim()
    if (distance !== undefined) updateData.distance = distance ? parseFloat(distance) : null
    if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime ? parseInt(estimatedTime) : null
    if (isActive !== undefined) updateData.isActive = Boolean(isActive)

    const updatedRoute = await prisma.route.update({
      where: { id },
      data: updateData,
      include: {
        operator: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            stops: true,
            schedules: true,
            fares: true
          }
        }
      }
    })

    return NextResponse.json(updatedRoute)

  } catch (error) {
    console.error('❌ Update route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ✅ DELETE - Delete route
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Find operator
    let operator = await prisma.operator.findFirst({
      where: { 
        name: {
          equals: session.user.name || '',
          mode: 'insensitive'
        }
      }
    })

    if (!operator) {
      operator = await prisma.operator.findFirst({
        orderBy: { createdAt: 'desc' }
      })
    }

    if (!operator) {
      return NextResponse.json({ error: 'Operator not found' }, { status: 404 })
    }

    // Verify route exists and check for active schedules
    const existingRoute = await prisma.route.findFirst({
      where: {
        id,
        operatorId: operator.id
      },
      include: {
        _count: {
          select: {
            schedules: { where: { isActive: true } }
          }
        }
      }
    })

    if (!existingRoute) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }

    if (existingRoute._count.schedules > 0) {
      return NextResponse.json(
        { error: 'Cannot delete route with active schedules' },
        { status: 409 }
      )
    }

    // Delete route and related data
    await prisma.$transaction([
      prisma.stop.deleteMany({ where: { routeId: id } }),
      prisma.fare.deleteMany({ where: { routeId: id } }),
      prisma.schedule.deleteMany({ where: { routeId: id } }),
      prisma.route.delete({ where: { id } })
    ])

    return NextResponse.json({ 
      message: `Route ${existingRoute.routeNumber} deleted successfully` 
    })

  } catch (error) {
    console.error('❌ Delete route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
