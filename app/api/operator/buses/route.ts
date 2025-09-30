


// // src/app/api/operator/buses/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'
// import { z } from 'zod'

// // ✅ VALIDATION SCHEMAS
// const createBusSchema = z.object({
//   busNumber: z.string().min(1, 'Bus number is required').max(20, 'Bus number too long'),
//   busType: z.enum(['AC Luxury', 'Semi Luxury', 'Normal', 'Express']),
//   capacity: z.number().min(1, 'Capacity must be at least 1').max(100, 'Capacity too large'),
//   operatorId: z.string().min(1, 'Operator ID is required'),
//   isActive: z.boolean().optional().default(true)
// })

// const searchParamsSchema = z.object({
//   page: z.string().optional().default('1'),
//   limit: z.string().optional().default('10'),
//   search: z.string().optional().default(''),
//   busType: z.string().optional().default('all'),
//   status: z.string().optional().default('all'),
//   hasDevice: z.string().optional().default('all')
// })

// // ✅ CREATE DEFAULT OPERATOR IF NOT EXISTS
// async function ensureDefaultOperator() {
//   const defaultOperatorId = '507f1f77bcf86cd799439011'
  
//   let operator = await prisma.operator.findUnique({
//     where: { id: defaultOperatorId }
//   }).catch(() => null)

//   if (!operator) {
//     try {
//       operator = await prisma.operator.create({
//         data: {
//           id: defaultOperatorId,
//           name: 'Default Operator',
//           licenseNo: 'DEFAULT001',
//           contactInfo: 'default@transitlk.com',
//           isActive: true
//         }
//       })
//       console.log('✅ Default operator created:', operator.id)
//     } catch (error) {
//       console.log('⚠️ Operator might already exist:', error)
//     }
//   }

//   return defaultOperatorId
// }

// // ✅ GET ALL BUSES
// export async function GET(request: NextRequest) {
//   try {
//     console.log('🚌 GET /api/operator/buses called')
    
//     // Ensure default operator exists
//     const operatorId = await ensureDefaultOperator()

//     // Parse search parameters
//     const { searchParams } = new URL(request.url)
//     const params = searchParamsSchema.parse({
//       page: searchParams.get('page') || '1',
//       limit: searchParams.get('limit') || '10',
//       search: searchParams.get('search') || '',
//       busType: searchParams.get('busType') || 'all',
//       status: searchParams.get('status') || 'all',
//       hasDevice: searchParams.get('hasDevice') || 'all'
//     })

//     const page = parseInt(params.page)
//     const limit = parseInt(params.limit)
//     const skip = (page - 1) * limit

//     // Build where clause for database query
//     const whereClause: any = {
//       operatorId: operatorId
//     }

//     // Apply search filter
//     if (params.search) {
//       whereClause.OR = [
//         { busNumber: { contains: params.search, mode: 'insensitive' } },
//         { busType: { contains: params.search, mode: 'insensitive' } }
//       ]
//     }

//     // Apply filters
//     if (params.busType !== 'all') {
//       whereClause.busType = params.busType
//     }

//     if (params.status !== 'all') {
//       whereClause.isActive = params.status === 'active'
//     }

//     if (params.hasDevice === 'yes') {
//       whereClause.device = { isNot: null }
//     } else if (params.hasDevice === 'no') {
//       whereClause.device = null
//     }

//     // Fetch buses with related data
//     const [buses, totalCount] = await Promise.all([
//       prisma.bus.findMany({
//         where: whereClause,
//         skip,
//         take: limit,
//         orderBy: { createdAt: 'desc' },
//         include: {
//           operator: {
//             select: {
//               id: true,
//               name: true,
//               licenseNo: true
//             }
//           },
//           device: {
//             select: {
//               id: true,
//               deviceId: true,
//               name: true,
//               isActive: true,
//               lastSeen: true
//             }
//           },
//           positions: {
//             take: 1,
//             orderBy: { timestamp: 'desc' },
//             select: {
//               id: true,
//               latitude: true,
//               longitude: true,
//               speed: true,
//               heading: true,
//               timestamp: true
//             }
//           },
//           schedules: {
//             where: { isActive: true },
//             include: {
//               route: {
//                 select: {
//                   id: true,
//                   routeNumber: true,
//                   startLocation: true,
//                   endLocation: true
//                 }
//               }
//             }
//           },
//           _count: {
//             select: {
//               bookings: true,
//               positions: true,
//               schedules: true
//             }
//           }
//         }
//       }),
//       prisma.bus.count({ where: whereClause })
//     ])

//     const totalPages = Math.ceil(totalCount / limit)

//     console.log('✅ Returning bus list:', { buses: buses.length, totalCount })

//     return NextResponse.json({
//       buses,
//       pagination: {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         limit,
//         hasMore: page < totalPages
//       }
//     })

//   } catch (error) {
//     console.error('❌ GET /api/operator/buses error:', error)
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { 
//           error: 'Invalid parameters', 
//           details: error.issues.map(issue => ({
//             path: issue.path.join('.'),
//             message: issue.message
//           }))
//         },
//         { status: 400 }
//       )
//     }

//     return NextResponse.json(
//       { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
//       { status: 500 }
//     )
//   }
// }

// // ✅ CREATE NEW BUS
// export async function POST(request: NextRequest) {
//   try {
//     console.log('🚌 POST /api/operator/buses called')

//     // Get and parse request body
//     const body = await request.json()
//     console.log('📝 Request body:', body)

//     // Validate request data
//     const validatedData = createBusSchema.parse(body)
//     console.log('✅ Validated data:', validatedData)

//     // Ensure default operator exists
//     await ensureDefaultOperator()

//     // Check for duplicate bus number
//     const existingBus = await prisma.bus.findUnique({
//       where: { busNumber: validatedData.busNumber }
//     })

//     if (existingBus) {
//       console.log('❌ Bus number already exists:', validatedData.busNumber)
//       return NextResponse.json(
//         { error: 'Bus number already exists' },
//         { status: 409 }
//       )
//     }

//     // Create new bus
//     console.log('🏗️ Creating new bus...')
//     const newBus = await prisma.bus.create({
//       data: validatedData,
//       include: {
//         operator: {
//           select: {
//             id: true,
//             name: true,
//             licenseNo: true
//           }
//         },
//         device: true,
//         _count: {
//           select: {
//             bookings: true,
//             positions: true,
//             schedules: true
//           }
//         }
//       }
//     })

//     console.log('✅ Bus created successfully:', newBus.id)

//     return NextResponse.json(newBus, { status: 201 })

//   } catch (error) {
//     console.error('❌ POST /api/operator/buses error:', error)

//     if (error instanceof z.ZodError) {
//       console.log('❌ Validation error:', error.issues)
//       return NextResponse.json(
//         { 
//           error: 'Validation failed', 
//           details: error.issues.map(issue => ({
//             path: issue.path.join('.'),
//             message: issue.message
//           }))
//         },
//         { status: 400 }
//       )
//     }

//     if (error instanceof SyntaxError) {
//       console.log('❌ JSON parsing error')
//       return NextResponse.json(
//         { error: 'Invalid JSON in request body' },
//         { status: 400 }
//       )
//     }

//     return NextResponse.json(
//       { 
//         error: 'Failed to create bus',
//         message: error instanceof Error ? error.message : 'Unknown error',
//         stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
//       },
//       { status: 500 }
//     )
//   }
// }



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
      console.log('✅ Default operator created')
    } catch (error) {
      console.log('⚠️ Operator might already exist')
    }
  }

  return DEFAULT_OPERATOR_ID
}

// ✅ GET ALL BUSES - SIMPLIFIED
export async function GET(request: NextRequest) {
  try {
    console.log('📡 Getting all buses...')

    // Ensure operator exists
    const operatorId = await ensureDefaultOperator()

    // Get search parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const busType = searchParams.get('busType') || 'all'
    const status = searchParams.get('status') || 'all'
    const hasDevice = searchParams.get('hasDevice') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      operatorId: operatorId
    }

    // Add search filter
    if (search) {
      where.OR = [
        { busNumber: { contains: search, mode: 'insensitive' } },
        { busType: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Add filters
    if (busType !== 'all') {
      where.busType = busType
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    if (hasDevice === 'yes') {
      where.device = { isNot: null }
    } else if (hasDevice === 'no') {
      where.device = null
    }

    // Fetch buses
    const [buses, totalCount] = await Promise.all([
      prisma.bus.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          operator: {
            select: {
              id: true,
              name: true,
              licenseNo: true
            }
          },
          device: {
            select: {
              id: true,
              deviceId: true,
              name: true,
              isActive: true,
              lastSeen: true
            }
          },
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
      }),
      prisma.bus.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    console.log('✅ Found buses:', buses.length)

    return NextResponse.json({
      buses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasMore: page < totalPages
      }
    })

  } catch (error) {
    console.error('❌ Get buses error:', error)
    return NextResponse.json(
      { error: 'Failed to get buses' },
      { status: 500 }
    )
  }
}

// ✅ CREATE BUS - SIMPLIFIED
export async function POST(request: NextRequest) {
  try {
    console.log('📡 Creating bus...')

    const body = await request.json()
    const { busNumber, busType, capacity, isActive = true } = body

    // Simple validation
    if (!busNumber || !busType || !capacity) {
      return NextResponse.json(
        { error: 'Bus number, type, and capacity are required' },
        { status: 400 }
      )
    }

    if (capacity < 1 || capacity > 100) {
      return NextResponse.json(
        { error: 'Capacity must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Ensure operator exists
    const operatorId = await ensureDefaultOperator()

    // Check for duplicate bus number
    const existingBus = await prisma.bus.findFirst({
      where: { busNumber: busNumber }
    })

    if (existingBus) {
      return NextResponse.json(
        { error: 'Bus number already exists' },
        { status: 409 }
      )
    }

    // Create bus
    const newBus = await prisma.bus.create({
      data: {
        busNumber,
        busType,
        capacity: parseInt(capacity),
        operatorId,
        isActive
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
        _count: {
          select: {
            bookings: true,
            positions: true,
            schedules: true
          }
        }
      }
    })

    console.log('✅ Bus created:', newBus.busNumber)

    return NextResponse.json(newBus, { status: 201 })

  } catch (error) {
    console.error('❌ Create bus error:', error)
    return NextResponse.json(
      { error: 'Failed to create bus' },
      { status: 500 }
    )
  }
}
