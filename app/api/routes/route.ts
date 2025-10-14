// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const from = searchParams.get('from')
//     const to = searchParams.get('to')
//     const date = searchParams.get('date')

//     let whereClause: any = {
//       isActive: true
//     }

//     if (from) {
//       whereClause.startLocation = {
//         contains: from,
//         mode: 'insensitive'
//       }
//     }

//     if (to) {
//       whereClause.endLocation = {
//         contains: to,
//         mode: 'insensitive'
//       }
//     }

//     const routes = await prisma.route.findMany({
//       where: whereClause,
//       include: {
//         operator: true,
//         schedules: {
//           where: { isActive: true },
//           include: {
//             bus: true
//           }
//         },
//         stops: {
//           orderBy: { order: 'asc' }
//         },
//         fares: {
//           where: { isActive: true }
//         }
//       }
//     })

//     return NextResponse.json(routes)

//   } catch (error) {
//     console.error('Routes error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }



import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        skip,
        take: limit,
        where: {
          isActive: true
        },
        include: {
          operator: true,
          schedules: {
            where: { isActive: true },
            include: {
              bus: true
            }
          },
          fares: {
            where: { isActive: true }
          },
          stops: {
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.route.count({
        where: {
          isActive: true
        }
      })
    ])

    return NextResponse.json({
      success: true,
      routes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Routes fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch routes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const routeData = await request.json()

    // Validate required fields
    const requiredFields = ['routeNumber', 'startLocation', 'endLocation', 'operatorId']
    for (const field of requiredFields) {
      if (!routeData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const route = await prisma.route.create({
      data: {
        routeNumber: routeData.routeNumber,
        startLocation: routeData.startLocation,
        endLocation: routeData.endLocation,
        distance: routeData.distance,
        estimatedTime: routeData.estimatedTime,
        operatorId: routeData.operatorId,
        isActive: true
      },
      include: {
        operator: true
      }
    })

    return NextResponse.json({
      success: true,
      route,
      message: 'Route created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Route creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create route' },
      { status: 500 }
    )
  }
}
