// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

// export async function GET(request: Request) {
//   console.log('📍 API /operator/tracking/positions called')

//   try {
//     const { searchParams } = new URL(request.url)
//     const since = searchParams.get('since')
//     const deviceIds = searchParams.get('deviceIds')?.split(',').filter(Boolean)

//     // Build time filter - default to last 30 minutes
//     const timeFilter = since ?
//       new Date(since) :
//       new Date(Date.now() - 30 * 60 * 1000)

//     // Build where clause
//     const where: any = {
//       timestamp: {
//         gte: timeFilter
//       },
//       device: {
//         bus: {
//           operatorId: DEFAULT_OPERATOR_ID,
//           isActive: true
//         },
//         isActive: true
//       }
//     }

//     // Filter by specific device IDs if provided
//     if (deviceIds && deviceIds.length > 0) {
//       where.deviceId = {
//         in: deviceIds
//       }
//     }

//     const positions = await prisma.position.findMany({
//       where,
//       include: {
//         device: {
//           include: {
//             bus: {
//               select: {
//                 id: true,
//                 busNumber: true,
//                 busType: true,
//                 capacity: true,
//                 isActive: true
//               }
//             }
//           }
//         }
//       },
//       orderBy: { timestamp: 'desc' },
//       take: 1000 // Limit results
//     })

//     // Group by deviceId to get latest position per device
//     const latestPositionsMap = new Map()
//     positions.forEach(position => {
//       if (!latestPositionsMap.has(position.deviceId)) {
//         latestPositionsMap.set(position.deviceId, {
//           ...position,
//           timestamp: position.timestamp.toISOString()
//         })
//       }
//     })

//     const latestPositions = Array.from(latestPositionsMap.values())

//     console.log(`✅ Returning ${latestPositions.length} latest positions`)

//     return NextResponse.json({
//       positions: latestPositions,
//       total: latestPositions.length,
//       timestamp: new Date().toISOString(),
//       success: true
//     })

//   } catch (error: any) {
//     console.error('❌ Error fetching positions:', error)
//     return NextResponse.json(
//       {
//         error: 'Failed to fetch positions',
//         positions: [],
//         total: 0,
//         success: false,
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       },
//       { status: 500 }
//     )
//   }
// }








import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  console.log('📍 API /operator/tracking/positions called')
  
  try {
    const { searchParams } = new URL(request.url)
    const since = searchParams.get('since')
    
    // ✅ FIX: Get positions from last 24 hours instead of 30 minutes
    const timeFilter = since ? 
      new Date(since) : 
      new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours

    console.log(`📍 Fetching positions since: ${timeFilter.toISOString()}`)

    const positions = await prisma.position.findMany({
      where: {
        timestamp: {
          gte: timeFilter
        }
      },
      include: {
        device: {
          include: {
            bus: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 1000
    })

    console.log(`📍 Found ${positions.length} total positions`)

    // Group by deviceId to get latest position per device
    const latestPositionsMap = new Map()
    positions.forEach(position => {
      if (!latestPositionsMap.has(position.deviceId)) {
        latestPositionsMap.set(position.deviceId, {
          id: position.id,
          deviceId: position.deviceId,
          latitude: position.latitude,
          longitude: position.longitude,
          speed: position.speed,
          heading: position.heading,
          altitude: position.altitude,
          accuracy: position.accuracy,
          timestamp: position.timestamp.toISOString(),
          device: position.device,
          bus: position.device?.bus
        })
      }
    })

    const latestPositions = Array.from(latestPositionsMap.values())

    console.log(`✅ Returning ${latestPositions.length} unique device positions`)
    
    // Log each position for debugging
    latestPositions.forEach(pos => {
      console.log(`  📍 Device ${pos.deviceId}: [${pos.latitude}, ${pos.longitude}] at ${pos.timestamp}`)
    })

    return NextResponse.json({
      positions: latestPositions,
      total: latestPositions.length,
      timestamp: new Date().toISOString(),
      success: true
    })
    
  } catch (error: any) {
    console.error('❌ Error fetching positions:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch positions',
        positions: [],
        total: 0,
        success: false,
        details: error.message
      }, 
      { status: 500 }
    )
  }
}
