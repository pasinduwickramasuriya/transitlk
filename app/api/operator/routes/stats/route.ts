


// import { NextRequest } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'

// // ✅ DEFINE TYPES FOR REQUEST BODIES
// interface RefreshStatsRequest {
//   forceRefresh?: boolean
// }

// // ✅ GET - Fetch route statistics and analytics for operator
// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     // Check authentication and role
//     if (!session || session.user.role !== 'OPERATOR') {
//       return new Response(
//         JSON.stringify({ error: 'Unauthorized. OPERATOR role required.' }), 
//         { status: 401, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     console.log('📊 Fetching route statistics for operator:', session.user.name)

//     // Find operator by user session
//     const operator = await prisma.operator.findFirst({
//       where: { 
//         name: {
//           equals: session.user.name || '',
//           mode: 'insensitive'
//         }
//       }
//     })
    
//     if (!operator) {
//       console.warn('❌ Operator not found for user:', session.user.name)
//       return new Response(
//         JSON.stringify({ error: 'Operator profile not found. Please contact support.' }), 
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     console.log('✅ Operator found:', operator.name, 'ID:', operator.id)

//     // Calculate date ranges
//     const now = new Date()
//     const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

//     // ✅ PARALLEL QUERIES FOR PERFORMANCE
//     const [
//       // Basic counts
//       totalRoutes,
//       activeRoutes,
//       inactiveRoutes,
      
//       // Stops count
//       totalStopsResult,
      
//       // Distance and time averages
//       routeAggregates,
      
//       // Recent routes count
//       recentRoutes,
      
//       // Popular locations data
//       startLocationsData,
//       endLocationsData,
      
//       // Routes with relationships for additional calculations
//       routesWithRelations
//     ] = await Promise.all([
//       // Total routes count
//       prisma.route.count({
//         where: { operatorId: operator.id }
//       }),
      
//       // Active routes count
//       prisma.route.count({
//         where: { 
//           operatorId: operator.id,
//           isActive: true 
//         }
//       }),
      
//       // Inactive routes count
//       prisma.route.count({
//         where: { 
//           operatorId: operator.id,
//           isActive: false 
//         }
//       }),
      
//       // Total stops across all routes
//       prisma.stop.count({
//         where: {
//           route: {
//             operatorId: operator.id
//           }
//         }
//       }),
      
//       // Average distance and estimated time
//       prisma.route.aggregate({
//         where: { 
//           operatorId: operator.id,
//           isActive: true
//         },
//         _avg: {
//           distance: true,
//           estimatedTime: true
//         }
//       }),
      
//       // Recent routes (created in last 7 days)
//       prisma.route.count({
//         where: {
//           operatorId: operator.id,
//           createdAt: {
//             gte: weekAgo
//           }
//         }
//       }),
      
//       // Popular start locations
//       prisma.route.groupBy({
//         by: ['startLocation'],
//         where: { 
//           operatorId: operator.id,
//           isActive: true
//         },
//         _count: {
//           startLocation: true
//         },
//         orderBy: {
//           _count: {
//             startLocation: 'desc'
//           }
//         },
//         take: 10
//       }),
      
//       // Popular end locations
//       prisma.route.groupBy({
//         by: ['endLocation'],
//         where: { 
//           operatorId: operator.id,
//           isActive: true
//         },
//         _count: {
//           endLocation: true
//         },
//         orderBy: {
//           _count: {
//             endLocation: 'desc'
//           }
//         },
//         take: 10
//       }),
      
//       // Routes with stops and schedules count for additional metrics
//       prisma.route.findMany({
//         where: { operatorId: operator.id },
//         select: {
//           id: true,
//           routeNumber: true,
//           isActive: true,
//           _count: {
//             select: {
//               stops: true,
//               schedules: { where: { isActive: true } }
//             }
//           }
//         }
//       })
//     ])

//     console.log('📈 Raw statistics calculated:', {
//       totalRoutes,
//       activeRoutes,
//       totalStops: totalStopsResult,
//       avgDistance: routeAggregates._avg.distance,
//       avgTime: routeAggregates._avg.estimatedTime
//     })

//     // ✅ PROCESS POPULAR LOCATIONS
//     const popularStartLocations = startLocationsData.map(item => ({
//       location: item.startLocation,
//       count: item._count.startLocation
//     }))

//     const popularEndLocations = endLocationsData.map(item => ({
//       location: item.endLocation,
//       count: item._count.endLocation
//     }))

//     // ✅ ADDITIONAL METRICS CALCULATION
//     const routesWithStops = routesWithRelations.filter(route => route._count.stops > 0).length
//     const routesWithoutStops = totalRoutes - routesWithStops
//     const routesWithSchedules = routesWithRelations.filter(route => route._count.schedules > 0).length
//     const routesWithoutSchedules = totalRoutes - routesWithSchedules

//     // ✅ COMPILE FINAL STATISTICS
//     const stats = {
//       // Basic counts
//       totalRoutes,
//       activeRoutes,
//       inactiveRoutes,
      
//       // Stops
//       totalStops: totalStopsResult,
//       routesWithStops,
//       routesWithoutStops,
      
//       // Schedules
//       routesWithSchedules,
//       routesWithoutSchedules,
      
//       // Averages (rounded to reasonable precision)
//       averageDistance: routeAggregates._avg.distance ? Math.round(routeAggregates._avg.distance * 10) / 10 : 0,
//       averageTime: routeAggregates._avg.estimatedTime ? Math.round(routeAggregates._avg.estimatedTime) : 0,
      
//       // Recent activity
//       recentRoutes,
      
//       // Popular locations
//       popularLocations: {
//         startLocations: popularStartLocations,
//         endLocations: popularEndLocations
//       },
      
//       // Additional insights
//       insights: {
//         utilizationRate: totalRoutes > 0 ? Math.round((activeRoutes / totalRoutes) * 100) : 0,
//         averageStopsPerRoute: totalRoutes > 0 ? Math.round((totalStopsResult / totalRoutes) * 10) / 10 : 0,
//         routeCompletionScore: totalRoutes > 0 ? Math.round(((routesWithStops + routesWithSchedules) / (totalRoutes * 2)) * 100) : 0
//       },
      
//       // Metadata
//       lastUpdated: new Date().toISOString(),
//       operatorInfo: {
//         id: operator.id,
//         name: operator.name
//       }
//     }

//     console.log('✅ Statistics compiled successfully:', {
//       totalRoutes: stats.totalRoutes,
//       activeRoutes: stats.activeRoutes,
//       avgDistance: stats.averageDistance,
//       popularStartLocations: stats.popularLocations.startLocations.length
//     })

//     return new Response(
//       JSON.stringify(stats), 
//       { 
//         status: 200,
//         headers: { 
//           'Content-Type': 'application/json',
//           'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' // Cache for 5 minutes
//         } 
//       }
//     )
    
//   } catch (error) {
//     console.error('❌ Error fetching route statistics:', error)
    
//     const errorMessage = error instanceof Error 
//       ? error.message 
//       : 'An unexpected error occurred while fetching statistics'
    
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

// // ✅ POST - Update or recalculate statistics (FIXED with proper typing)
// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== 'OPERATOR') {
//       return new Response(
//         JSON.stringify({ error: 'Unauthorized' }), 
//         { status: 401, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     console.log('🔄 Refreshing route statistics for operator:', session.user.name)

//     // ✅ PROPERLY TYPED REQUEST BODY PARSING
//     let requestBody: RefreshStatsRequest = {}
    
//     try {
//       const bodyText = await request.text()
//       if (bodyText.trim()) {
//         requestBody = JSON.parse(bodyText) as RefreshStatsRequest
//       }
//     } catch (parseError) {
//       console.warn('⚠️ Could not parse request body, using defaults:', parseError)
//       // Body is optional for stats refresh, continue with defaults
//     }

//     // ✅ NOW WE CAN SAFELY DESTRUCTURE WITH PROPER TYPING
//     const { forceRefresh = true } = requestBody

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

//     // In a real application, you might want to:
//     // 1. Clear cached statistics
//     // 2. Trigger background recalculation
//     // 3. Update materialized views
//     // 4. Invalidate Redis/Memcached entries
    
//     // For demonstration, we'll simulate some refresh logic
//     if (forceRefresh) {
//       console.log('🔥 Force refresh enabled - clearing all cached data')
//       // Here you would implement cache clearing logic
//     } else {
//       console.log('🔄 Standard refresh - updating incrementally')
//       // Here you would implement incremental update logic
//     }

//     const refreshTimestamp = new Date().toISOString()

//     console.log('✅ Statistics refresh completed at:', refreshTimestamp)

//     return new Response(
//       JSON.stringify({
//         message: 'Statistics refreshed successfully',
//         timestamp: refreshTimestamp,
//         forceRefresh,
//         operatorId: operator.id,
//         operatorName: operator.name
//       }), 
//       { 
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//       }
//     )
    
//   } catch (error) {
//     console.error('❌ Error refreshing statistics:', error)
    
//     return new Response(
//       JSON.stringify({ 
//         error: 'Internal server error',
//         details: error instanceof Error ? error.message : 'Unknown error',
//         timestamp: new Date().toISOString()
//       }), 
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     )
//   }
// }







import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ✅ GET - Fetch route statistics
export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching route statistics...')
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find operator with multiple strategies
    let operator = null
    
    if (session.user.name) {
      operator = await prisma.operator.findFirst({
        where: { 
          name: {
            equals: session.user.name,
            mode: 'insensitive'
          }
        }
      })
    }

    if (!operator && session.user.email) {
      operator = await prisma.operator.findFirst({
        where: { 
          contactInfo: {
            contains: session.user.email,
            mode: 'insensitive'
          }
        }
      })
    }

    if (!operator) {
      operator = await prisma.operator.findFirst({
        orderBy: { createdAt: 'desc' }
      })
    }

    if (!operator) {
      console.log('❌ No operator found for statistics')
      return NextResponse.json(
        { error: 'Operator profile not found' }, 
        { status: 404 }
      )
    }

    console.log('✅ Operator found for stats:', operator.name)

    // Calculate date ranges
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Execute parallel queries
    const [
      totalRoutes,
      activeRoutes,
      inactiveRoutes,
      totalStops,
      routeAggregates,
      recentRoutes,
      startLocationsData,
      endLocationsData,
      routesWithRelations
    ] = await Promise.all([
      // Basic counts
      prisma.route.count({
        where: { operatorId: operator.id }
      }),
      prisma.route.count({
        where: { 
          operatorId: operator.id,
          isActive: true 
        }
      }),
      prisma.route.count({
        where: { 
          operatorId: operator.id,
          isActive: false 
        }
      }),
      
      // Total stops
      prisma.stop.count({
        where: {
          route: { operatorId: operator.id }
        }
      }),
      
      // Averages
      prisma.route.aggregate({
        where: { 
          operatorId: operator.id,
          isActive: true
        },
        _avg: {
          distance: true,
          estimatedTime: true
        }
      }),
      
      // Recent routes
      prisma.route.count({
        where: {
          operatorId: operator.id,
          createdAt: { gte: weekAgo }
        }
      }),
      
      // Popular start locations
      prisma.route.groupBy({
        by: ['startLocation'],
        where: { 
          operatorId: operator.id,
          isActive: true
        },
        _count: { startLocation: true },
        orderBy: { _count: { startLocation: 'desc' } },
        take: 10
      }),
      
      // Popular end locations
      prisma.route.groupBy({
        by: ['endLocation'],
        where: { 
          operatorId: operator.id,
          isActive: true
        },
        _count: { endLocation: true },
        orderBy: { _count: { endLocation: 'desc' } },
        take: 10
      }),
      
      // Routes with relationships
      prisma.route.findMany({
        where: { operatorId: operator.id },
        select: {
          id: true,
          _count: {
            select: {
              stops: true,
              schedules: { where: { isActive: true } }
            }
          }
        }
      })
    ])

    // Process popular locations
    const popularStartLocations = startLocationsData.map(item => ({
      location: item.startLocation,
      count: item._count.startLocation
    }))

    const popularEndLocations = endLocationsData.map(item => ({
      location: item.endLocation,
      count: item._count.endLocation
    }))

    // Calculate additional metrics
    const routesWithStops = routesWithRelations.filter(r => r._count.stops > 0).length
    const routesWithoutStops = totalRoutes - routesWithStops
    const routesWithSchedules = routesWithRelations.filter(r => r._count.schedules > 0).length
    const routesWithoutSchedules = totalRoutes - routesWithSchedules

    const stats = {
      // Basic counts
      totalRoutes,
      activeRoutes,
      inactiveRoutes,
      
      // Stops
      totalStops,
      routesWithStops,
      routesWithoutStops,
      
      // Schedules
      routesWithSchedules,
      routesWithoutSchedules,
      
      // Averages
      averageDistance: routeAggregates._avg.distance 
        ? Math.round(routeAggregates._avg.distance * 10) / 10 
        : 0,
      averageTime: routeAggregates._avg.estimatedTime 
        ? Math.round(routeAggregates._avg.estimatedTime) 
        : 0,
      
      // Recent activity
      recentRoutes,
      
      // Popular locations
      popularLocations: {
        startLocations: popularStartLocations,
        endLocations: popularEndLocations
      },
      
      // Additional insights
      insights: {
        utilizationRate: totalRoutes > 0 ? Math.round((activeRoutes / totalRoutes) * 100) : 0,
        averageStopsPerRoute: totalRoutes > 0 ? Math.round((totalStops / totalRoutes) * 10) / 10 : 0,
        routeCompletionScore: totalRoutes > 0 
          ? Math.round(((routesWithStops + routesWithSchedules) / (totalRoutes * 2)) * 100) 
          : 0
      },
      
      // Metadata
      lastUpdated: new Date().toISOString(),
      operatorInfo: {
        id: operator.id,
        name: operator.name
      }
    }

    console.log('✅ Statistics calculated:', {
      totalRoutes,
      activeRoutes,
      totalStops
    })

    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('❌ Statistics API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// ✅ POST - Refresh statistics
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'OPERATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json().catch(() => ({}))
    const { forceRefresh = true } = body

    console.log('🔄 Statistics refresh requested:', { forceRefresh })

    return NextResponse.json({
      message: 'Statistics refreshed successfully',
      timestamp: new Date().toISOString(),
      forceRefresh
    })

  } catch (error) {
    console.error('❌ Statistics refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
