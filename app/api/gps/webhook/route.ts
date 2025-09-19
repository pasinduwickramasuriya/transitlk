// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     console.log('[GPS-WEBHOOK] Incoming data:', JSON.stringify(body, null, 2))

//     // Handle different GPS data formats (Traccar, custom devices, etc.)
//     const gpsData = parseGpsData(body)
    
//     if (!gpsData) {
//       return NextResponse.json({ error: 'Invalid GPS data format' }, { status: 400 })
//     }

//     const { deviceId, latitude, longitude, speed, heading, timestamp, accuracy } = gpsData

//     // Validate required fields
//     if (!deviceId || latitude === undefined || longitude === undefined) {
//       console.log('[GPS-WEBHOOK] Missing required fields:', { deviceId, latitude, longitude })
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
//     }

//     // Find or create device
//     const device = await prisma.device.upsert({
//       where: { deviceId: deviceId.toString() },
//       update: { 
//         lastSeen: new Date(), 
//         isActive: true 
//       },
//       create: { 
//         deviceId: deviceId.toString(), 
//         name: `Device ${deviceId}`,
//         isActive: true
//       },
//     })

//     // Create new position record
//     const position = await prisma.position.create({
//       data: {
//         deviceId: device.deviceId,
//         latitude: Number(latitude),
//         longitude: Number(longitude),
//         speed: speed ? Number(speed) : null,
//         heading: heading ? Number(heading) : null,
//         timestamp: timestamp ? new Date(timestamp) : new Date(),
//         accuracy: accuracy ? Number(accuracy) : null,
//         busId: device.busId, // Link to bus if device is assigned
//       },
//     })

//     console.log('[GPS-WEBHOOK] Position created:', position.id)

//     // Broadcast to real-time subscribers (optional)
//     await broadcastPositionUpdate(device.deviceId, position)

//     return NextResponse.json({ 
//       success: true, 
//       positionId: position.id 
//     })

//   } catch (error: any) {
//     console.error('[GPS-WEBHOOK] Error:', error)
//     return NextResponse.json(
//       { 
//         error: 'Server error',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       }, 
//       { status: 500 }
//     )
//   }
// }

// // Parse different GPS data formats
// function parseGpsData(body: any) {
//   // Traccar format
//   if (body.device && body.position) {
//     return {
//       deviceId: body.device.id || body.device.uniqueId,
//       latitude: body.position.latitude,
//       longitude: body.position.longitude,
//       speed: body.position.speed,
//       heading: body.position.course,
//       timestamp: body.position.fixTime,
//       accuracy: body.position.accuracy
//     }
//   }

//   // Custom format (like your example)
//   if (body.device_id && body.location?.coords) {
//     const coords = body.location.coords
//     return {
//       deviceId: body.device_id,
//       latitude: coords.latitude,
//       longitude: coords.longitude,
//       speed: coords.speed,
//       heading: coords.heading,
//       timestamp: body.location.timestamp,
//       accuracy: coords.accuracy
//     }
//   }

//   // Direct format
//   if (body.deviceId && body.latitude && body.longitude) {
//     return {
//       deviceId: body.deviceId,
//       latitude: body.latitude,
//       longitude: body.longitude,
//       speed: body.speed,
//       heading: body.heading,
//       timestamp: body.timestamp,
//       accuracy: body.accuracy
//     }
//   }

//   return null
// }

// // Optional: Broadcast position updates via WebSocket/SSE
// async function broadcastPositionUpdate(deviceId: string, position: any) {
//   // Implement WebSocket/SSE broadcasting here
//   // This could notify connected clients about position updates
// }



import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface GpsData {
  deviceId: string
  latitude: number
  longitude: number
  speed?: number
  heading?: number
  timestamp?: string
  accuracy?: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[GPS-WEBHOOK] Incoming data:', JSON.stringify(body, null, 2))

    // Handle different GPS data formats (Traccar, custom devices, etc.)
    const gpsData = parseGpsData(body)
    
    if (!gpsData) {
      return NextResponse.json({ error: 'Invalid GPS data format' }, { status: 400 })
    }

    const { deviceId, latitude, longitude, speed, heading, timestamp, accuracy } = gpsData

    // Validate required fields
    if (!deviceId || latitude === undefined || longitude === undefined) {
      console.log('[GPS-WEBHOOK] Missing required fields:', { deviceId, latitude, longitude })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find or create device
    const device = await prisma.device.upsert({
      where: { deviceId: deviceId.toString() },
      update: { 
        lastSeen: new Date(), 
        isActive: true 
      },
      create: { 
        deviceId: deviceId.toString(), 
        name: `Device ${deviceId}`,
        isActive: true
      },
    })

    // Create new position record
    const position = await prisma.position.create({
      data: {
        deviceId: device.deviceId,
        latitude: Number(latitude),
        longitude: Number(longitude),
        speed: speed ? Number(speed) : null,
        heading: heading ? Number(heading) : null,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        accuracy: accuracy ? Number(accuracy) : null,
        altitude: null, // Add altitude field from schema
        busId: device.busId, // Link to bus if device is assigned
      },
    })

    console.log('[GPS-WEBHOOK] Position created:', position.id)

    // Broadcast to real-time subscribers (optional)
    await broadcastPositionUpdate(device.deviceId, position)

    return NextResponse.json({ 
      success: true, 
      positionId: position.id 
    })

  } catch (error: any) {
    console.error('[GPS-WEBHOOK] Error:', error)
    return NextResponse.json(
      { 
        error: 'Server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}

// Parse different GPS data formats
function parseGpsData(body: any): GpsData | null {
  // Traccar format
  if (body.device && body.position) {
    return {
      deviceId: body.device.id || body.device.uniqueId,
      latitude: body.position.latitude,
      longitude: body.position.longitude,
      speed: body.position.speed,
      heading: body.position.course,
      timestamp: body.position.fixTime,
      accuracy: body.position.accuracy
    }
  }

  // Custom format (like your example)
  if (body.device_id && body.location?.coords) {
    const coords = body.location.coords
    return {
      deviceId: body.device_id,
      latitude: coords.latitude,
      longitude: coords.longitude,
      speed: coords.speed,
      heading: coords.heading,
      timestamp: body.location.timestamp,
      accuracy: coords.accuracy
    }
  }

  // Direct format
  if (body.deviceId && body.latitude !== undefined && body.longitude !== undefined) {
    return {
      deviceId: body.deviceId,
      latitude: body.latitude,
      longitude: body.longitude,
      speed: body.speed,
      heading: body.heading,
      timestamp: body.timestamp,
      accuracy: body.accuracy
    }
  }

  return null
}

// Optional: Broadcast position updates via WebSocket/SSE
async function broadcastPositionUpdate(deviceId: string, position: any): Promise<void> {
  try {
    // Implement WebSocket/SSE broadcasting here
    // This could notify connected clients about position updates
    console.log(`[BROADCAST] Position update for device ${deviceId}:`, position.id)
  } catch (error) {
    console.error('[BROADCAST] Error:', error)
  }
}
