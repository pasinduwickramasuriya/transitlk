// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const deviceId = searchParams.get('deviceId')
//     const limit = parseInt(searchParams.get('limit') || '50')
//     const since = searchParams.get('since') // ISO timestamp

//     console.log('[POSITIONS-API] Fetching positions:', { deviceId, limit, since })

//     // Build query filters
//     const where: any = {}
    
//     if (deviceId) {
//       where.deviceId = deviceId
//     }
    
//     if (since) {
//       where.timestamp = {
//         gte: new Date(since)
//       }
//     }

//     // Get devices with their latest positions
//     const devices = await prisma.device.findMany({
//       where: { 
//         isActive: true,
//         ...(deviceId ? { deviceId } : {})
//       },
//       include: {
//         positions: {
//           where: since ? { timestamp: { gte: new Date(since) } } : {},
//           orderBy: { timestamp: 'desc' },
//           take: limit,
//         },
//         bus: {
//           include: {
//             operator: true,
//             schedules: {
//               where: { isActive: true },
//               include: { route: true },
//               take: 1
//             }
//           }
//         }
//       },
//     })

//     // Format response for map display
//     const formattedDevices = devices.map((device: { deviceId: any; name: any; isActive: any; lastSeen: any; bus: { id: any; busNumber: any; capacity: any; operator: { name: any }; schedules: { route: {
//         id: any
//         name: any
//         startLocation: any endLocation: any 
// } }[] }; positions: any[] }) => ({
//       deviceId: device.deviceId,
//       name: device.name,
//       isActive: device.isActive,
//       lastSeen: device.lastSeen,
//       bus: device.bus ? {
//         id: device.bus.id,
//         busNumber: device.bus.busNumber,
//         capacity: device.bus.capacity,
//         operator: device.bus.operator?.name,
//         currentRoute: device.bus.schedules[0]?.route ? {
//           id: device.bus.schedules[0].route.id,
//           name: device.bus.schedules[0].route.name,
//           startLocation: device.bus.schedules[0].route.startLocation,
//           endLocation: device.bus.schedules[0].route.endLocation
//         } : null
//       } : null,
//       positions: device.positions.map(pos => ({
//         id: pos.id,
//         latitude: pos.latitude,
//         longitude: pos.longitude,
//         speed: pos.speed,
//         heading: pos.heading,
//         timestamp: pos.timestamp,
//         accuracy: pos.accuracy
//       })),
//       latestPosition: device.positions[0] || null,
//     }))

//     console.log(`[POSITIONS-API] Returning ${formattedDevices.length} devices`)
    
//     return NextResponse.json({
//       devices: formattedDevices,
//       total: formattedDevices.length,
//       timestamp: new Date().toISOString()
//     })

//   } catch (error: any) {
//     console.error('[POSITIONS-API] Error:', error)
//     return NextResponse.json(
//       { 
//         error: 'Failed to fetch positions',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       }, 
//       { status: 500 }
//     )
//   }
// }


import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Define clean interfaces for better readability and type safety
interface RouteInfo {
  id: string
  routeNumber: string
  startLocation: string
  endLocation: string
}

interface BusInfo {
  id: string
  busNumber: string
  capacity: number
  operator?: string
  currentRoute?: RouteInfo | null
}

interface PositionInfo {
  id: string
  latitude: number
  longitude: number
  speed: number | null
  heading: number | null
  altitude: number | null
  accuracy: number | null
  timestamp: Date
}

interface DeviceResponse {
  deviceId: string
  name: string
  isActive: boolean
  lastSeen: Date
  bus: BusInfo | null
  positions: PositionInfo[]
  latestPosition: PositionInfo | null
}

// Define the expected structure from Prisma query
interface PrismaPosition {
  id: string
  latitude: number
  longitude: number
  speed: number | null
  heading: number | null
  altitude: number | null
  accuracy: number | null
  timestamp: Date
}

interface PrismaDevice {
  deviceId: string
  name: string
  isActive: boolean
  lastSeen: Date
  bus: {
    id: string
    busNumber: string
    capacity: number
    operator?: { name: string }
    schedules: Array<{
      route: {
        id: string
        routeNumber: string
        startLocation: string
        endLocation: string
      }
    }>
  } | null
  positions: PrismaPosition[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const since = searchParams.get('since')

    console.log('[POSITIONS-API] Fetching positions:', { 
      deviceId, 
      limit, 
      since 
    })

    // Get devices with their latest positions
    const devices: PrismaDevice[] = await prisma.device.findMany({
      where: { 
        isActive: true,
        ...(deviceId ? { deviceId } : {})
      },
      include: {
        positions: {
          where: since ? { timestamp: { gte: new Date(since) } } : {},
          orderBy: { timestamp: 'desc' },
          take: limit,
        },
        bus: {
          include: {
            operator: true,
            schedules: {
              where: { isActive: true },
              include: { route: true },
              take: 1
            }
          }
        }
      },
    })

    // Transform data with proper typing
    const formattedDevices: DeviceResponse[] = devices.map((device: PrismaDevice) => {
      // Extract bus information
      const busInfo: BusInfo | null = device.bus ? {
        id: device.bus.id,
        busNumber: device.bus.busNumber,
        capacity: device.bus.capacity,
        operator: device.bus.operator?.name,
        currentRoute: device.bus.schedules[0]?.route ? {
          id: device.bus.schedules[0].route.id,
          routeNumber: device.bus.schedules[0].route.routeNumber,
          startLocation: device.bus.schedules[0].route.startLocation,
          endLocation: device.bus.schedules[0].route.endLocation
        } : null
      } : null

      // Transform positions with explicit typing
      const positions: PositionInfo[] = device.positions.map((pos: PrismaPosition) => ({
        id: pos.id,
        latitude: pos.latitude,
        longitude: pos.longitude,
        speed: pos.speed,
        heading: pos.heading,
        altitude: pos.altitude,
        accuracy: pos.accuracy,
        timestamp: pos.timestamp
      }))

      // Return formatted device
      return {
        deviceId: device.deviceId,
        name: device.name,
        isActive: device.isActive,
        lastSeen: device.lastSeen,
        bus: busInfo,
        positions,
        latestPosition: positions[0] || null,
      }
    })

    console.log(`[POSITIONS-API] Returning ${formattedDevices.length} devices`)
    
    return NextResponse.json({
      devices: formattedDevices,
      total: formattedDevices.length,
      timestamp: new Date().toISOString()
    })

  } catch (error: unknown) {
    console.error('[POSITIONS-API] Error:', error)
    
    // Type guard for error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch positions',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }, 
      { status: 500 }
    )
  }
}
