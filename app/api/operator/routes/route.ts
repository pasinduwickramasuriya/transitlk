


// import { NextRequest } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'

// // ✅ GET - Enhanced with advanced filtering support
// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== 'OPERATOR') {
//       return new Response(
//         JSON.stringify({ error: 'Unauthorized. OPERATOR role required.' }), 
//         { status: 401, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     console.log('📍 Fetching routes with advanced filtering for operator:', session.user.name)

//     // Extract query parameters with new filter options
//     const { searchParams } = new URL(request.url)
//     const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
//     const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '10')))
//     const search = searchParams.get('search')?.trim() || ''
//     const status = searchParams.get('status') || 'all'
//     const hasStops = searchParams.get('hasStops') || 'all'
//     const hasSchedules = searchParams.get('hasSchedules') || 'all'
    
//     const skip = (page - 1) * limit

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
//         JSON.stringify({ error: 'Operator profile not found.' }), 
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     // ✅ BUILD ADVANCED WHERE CLAUSE
//     const where: any = {
//       operatorId: operator.id
//     }
    
//     // Search filter
//     if (search) {
//       where.OR = [
//         { routeNumber: { contains: search, mode: 'insensitive' } },
//         { startLocation: { contains: search, mode: 'insensitive' } },
//         { endLocation: { contains: search, mode: 'insensitive' } }
//       ]
//     }
    
//     // Status filter
//     if (status && status !== 'all') {
//       where.isActive = status === 'active'
//     }

//     // ✅ STOPS FILTER - requires subquery approach
//     let stopsFilter = {}
//     if (hasStops && hasStops !== 'all') {
//       if (hasStops === 'yes') {
//         stopsFilter = {
//           some: {}
//         }
//       } else if (hasStops === 'no') {
//         stopsFilter = {
//           none: {}
//         }
//       }
//     }

//     // ✅ SCHEDULES FILTER - requires subquery approach  
//     let schedulesFilter = {}
//     if (hasSchedules && hasSchedules !== 'all') {
//       if (hasSchedules === 'yes') {
//         schedulesFilter = {
//           some: { isActive: true }
//         }
//       } else if (hasSchedules === 'no') {
//         schedulesFilter = {
//           none: {}
//         }
//       }
//     }

//     // Apply stops and schedules filters if specified
//     if (Object.keys(stopsFilter).length > 0) {
//       where.stops = stopsFilter
//     }
//     if (Object.keys(schedulesFilter).length > 0) {
//       where.schedules = schedulesFilter
//     }

//     console.log('🔍 Advanced query filters:', { 
//       search, status, hasStops, hasSchedules, page, limit 
//     })

//     // Execute queries with enhanced filtering
//     const [routes, total] = await Promise.all([
//       prisma.route.findMany({
//         where,
//         skip,
//         take: limit,
//         orderBy: [
//           { isActive: 'desc' },
//           { createdAt: 'desc' },
//           { routeNumber: 'asc' }
//         ],
//         include: {
//           operator: {
//             select: {
//               id: true,
//               name: true
//             }
//           },
//           stops: {
//             select: {
//               id: true,
//               name: true,
//               latitude: true,
//               longitude: true,
//               order: true
//             },
//             orderBy: { order: 'asc' },
//             take: 10 // Limit stops for performance
//           },
//           schedules: {
//             select: {
//               id: true,
//               departureTime: true,
//               arrivalTime: true,
//               isActive: true,
//               frequency: true,
//               bus: {
//                 select: {
//                   busNumber: true,
//                   capacity: true,
//                   busType: true
//                 }
//               }
//             },
//             where: { isActive: true },
//             orderBy: { departureTime: 'asc' },
//             take: 5 // Limit schedules for performance
//           },
//           _count: {
//             select: {
//               stops: true,
//               schedules: true,
//               fares: true
//             }
//           }
//         }
//       }),
//       prisma.route.count({ where })
//     ])

//     console.log('📊 Advanced routes query result:', { 
//       routesCount: routes.length, 
//       total, 
//       page, 
//       totalPages: Math.ceil(total / limit),
//       filters: { search, status, hasStops, hasSchedules }
//     })
    
//     const response = {
//       routes,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       hasNext: page < Math.ceil(total / limit),
//       hasPrev: page > 1,
//       filters: {
//         search,
//         status,
//         hasStops,
//         hasSchedules
//       }
//     }
    
//     return new Response(
//       JSON.stringify(response), 
//       { 
//         status: 200,
//         headers: { 
//           'Content-Type': 'application/json',
//           'Cache-Control': 'no-cache, no-store, must-revalidate'
//         } 
//       }
//     )
    
//   } catch (error) {
//     console.error('❌ Error fetching routes with filters:', error)
    
//     const errorMessage = error instanceof Error 
//       ? error.message 
//       : 'An unexpected error occurred while fetching routes'
    
//     return new Response(
//       JSON.stringify({ 
//         error: 'Internal server error', 
//         details: errorMessage,
//         timestamp: new Date().toISOString()
//       }), 
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     )
//   }
// }

// // ✅ POST, PUT, DELETE methods remain the same as in the previous implementation
// // (Include the same POST, DELETE methods from the previous route file here)



import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ✅ TYPES
interface RouteQueryParams {
  page?: string
  limit?: string
  search?: string
  status?: string
  hasStops?: string
  hasSchedules?: string
}

// ✅ GET - Fetch routes with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting routes API request...')
    
    const session = await getServerSession(authOptions)
    
    // Authentication check
    if (!session) {
      console.log('❌ No session found')
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    if (session.user.role !== 'OPERATOR') {
      console.log('❌ User role is not OPERATOR:', session.user.role)
      return NextResponse.json(
        { error: 'Operator role required' }, 
        { status: 403 }
      )
    }

    console.log('✅ Session validated for user:', session.user.name)

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '10')))
    const search = searchParams.get('search')?.trim() || ''
    const status = searchParams.get('status') || 'all'
    const hasStops = searchParams.get('hasStops') || 'all'
    const hasSchedules = searchParams.get('hasSchedules') || 'all'
    
    const skip = (page - 1) * limit

    console.log('📊 Query parameters:', { page, limit, search, status, hasStops, hasSchedules })

    // Find operator - try multiple approaches
    let operator = null
    
    // Method 1: By user name
    if (session.user.name) {
      operator = await prisma.operator.findFirst({
        where: { 
          name: {
            equals: session.user.name,
            mode: 'insensitive'
          }
        }
      })
      console.log('🔍 Operator search by name result:', operator?.id || 'not found')
    }

    // Method 2: By user email if name didn't work
    if (!operator && session.user.email) {
      operator = await prisma.operator.findFirst({
        where: { 
          contactInfo: {
            contains: session.user.email,
            mode: 'insensitive'
          }
        }
      })
      console.log('🔍 Operator search by email result:', operator?.id || 'not found')
    }

    // Method 3: Get first operator if user is OPERATOR role (for testing)
    if (!operator) {
      operator = await prisma.operator.findFirst({
        orderBy: { createdAt: 'desc' }
      })
      console.log('🔍 Fallback operator result:', operator?.id || 'not found')
    }

    if (!operator) {
      console.log('❌ No operator found for user')
      return NextResponse.json(
        { error: 'Operator profile not found' }, 
        { status: 404 }
      )
    }

    console.log('✅ Operator found:', { id: operator.id, name: operator.name })

    // Build where clause
    const where: any = {
      operatorId: operator.id
    }

    // Search filter
    if (search) {
      where.OR = [
        { routeNumber: { contains: search, mode: 'insensitive' } },
        { startLocation: { contains: search, mode: 'insensitive' } },
        { endLocation: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Status filter
    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    // Stops filter
    if (hasStops !== 'all') {
      if (hasStops === 'yes') {
        where.stops = { some: {} }
      } else {
        where.stops = { none: {} }
      }
    }

    // Schedules filter
    if (hasSchedules !== 'all') {
      if (hasSchedules === 'yes') {
        where.schedules = { some: { isActive: true } }
      } else {
        where.schedules = { none: {} }
      }
    }

    console.log('🔍 Final where clause:', JSON.stringify(where, null, 2))

    // Execute queries
    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isActive: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          operator: {
            select: {
              id: true,
              name: true
            }
          },
          stops: {
            select: {
              id: true,
              name: true,
              latitude: true,
              longitude: true,
              order: true
            },
            orderBy: { order: 'asc' },
            take: 5
          },
          schedules: {
            select: {
              id: true,
              departureTime: true,
              arrivalTime: true,
              isActive: true,
              bus: {
                select: {
                  busNumber: true,
                  capacity: true,
                  busType: true
                }
              }
            },
            where: { isActive: true },
            orderBy: { departureTime: 'asc' },
            take: 3
          },
          _count: {
            select: {
              stops: true,
              schedules: true,
              fares: true
            }
          }
        }
      }),
      prisma.route.count({ where })
    ])

    console.log('✅ Query results:', { routesCount: routes.length, total })

    const response = {
      routes,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Routes API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// ✅ POST - Create new route
export async function POST(request: NextRequest) {
  try {
    console.log('➕ Creating new route...')
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { routeNumber, startLocation, endLocation, distance, estimatedTime } = body

    // Validation
    if (!routeNumber?.trim() || !startLocation?.trim() || !endLocation?.trim()) {
      return NextResponse.json(
        { error: 'Route number, start location, and end location are required' },
        { status: 400 }
      )
    }

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

    // Check for duplicate route number
    const existingRoute = await prisma.route.findUnique({
      where: { routeNumber: routeNumber.trim().toUpperCase() }
    })

    if (existingRoute) {
      return NextResponse.json(
        { error: 'Route number already exists' },
        { status: 409 }
      )
    }

    // Create route
    const newRoute = await prisma.route.create({
      data: {
        routeNumber: routeNumber.trim().toUpperCase(),
        startLocation: startLocation.trim(),
        endLocation: endLocation.trim(),
        distance: distance ? parseFloat(distance) : null,
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : null,
        operatorId: operator.id,
        isActive: true
      },
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

    console.log('✅ Route created:', newRoute.id)

    return NextResponse.json(newRoute, { status: 201 })

  } catch (error) {
    console.error('❌ Create route error:', error)
    return NextResponse.json(
      { error: 'Failed to create route' },
      { status: 500 }
    )
  }
}
