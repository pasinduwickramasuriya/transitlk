import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

// ✅ MOBILE GPS ENDPOINT - For Traccar Client App and Mobile Devices
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[MOBILE-GPS] 📱 Incoming mobile GPS data:', JSON.stringify(body, null, 2))

    // Handle different mobile app formats
    let deviceId: string
    let latitude: number
    let longitude: number
    let speed: number | null = null
    let heading: number | null = null
    let timestamp: Date = new Date()

    // Format 1: Traccar Mobile App format
    if (body.location) {
      deviceId = body.id || body.device_id || body.deviceId || 'mobile-device'
      latitude = body.location.lat || body.location.latitude
      longitude = body.location.lon || body.location.longitude
      speed = body.location.speed || null
      heading = body.location.bearing || body.location.heading || null
      timestamp = body.location.time ? new Date(body.location.time) : new Date()
    }
    // Format 2: Custom mobile format
    else if (body.coords) {
      deviceId = body.device_id || body.deviceId || 'mobile-device'
      latitude = body.coords.latitude
      longitude = body.coords.longitude
      speed = body.coords.speed || null
      heading = body.coords.heading || null
      timestamp = body.timestamp ? new Date(body.timestamp) : new Date()
    }
    // Format 3: Direct format
    else {
      deviceId = body.device_id || body.deviceId || body.id || 'mobile-device'
      latitude = body.latitude || body.lat
      longitude = body.longitude || body.lon || body.lng
      speed = body.speed || null
      heading = body.heading || body.bearing || null
      timestamp = body.timestamp ? new Date(body.timestamp) : new Date()
    }

    // Validate required fields
    if (!deviceId || latitude === undefined || longitude === undefined) {
      console.log('[MOBILE-GPS] ❌ Missing required fields:', { deviceId, latitude, longitude })
      return NextResponse.json({ 
        error: 'Missing required fields: device_id, latitude, longitude',
        received: body
      }, { status: 400 })
    }

    // Validate coordinates
    const lat = parseFloat(latitude.toString())
    const lng = parseFloat(longitude.toString())
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.log('[MOBILE-GPS] ❌ Invalid coordinates:', { lat, lng })
      return NextResponse.json({ 
        error: 'Invalid coordinates',
        lat, lng
      }, { status: 400 })
    }

    console.log('[MOBILE-GPS] ✅ Processing position:', {
      deviceId,
      lat,
      lng,
      speed,
      heading,
      timestamp: timestamp.toISOString()
    })

    // Ensure operator exists
    await ensureDefaultOperator()

    // Upsert device
    const device = await prisma.device.upsert({
      where: { deviceId: deviceId.toString() },
      update: { 
        lastSeen: new Date(), 
        isActive: true,
        name: `Mobile GPS ${deviceId}`
      },
      create: { 
        deviceId: deviceId.toString(), 
        name: `Mobile GPS ${deviceId}`,
        isActive: true,
        lastSeen: new Date()
      },
    })

    // Create position record
    const position = await prisma.position.create({
      data: {
        deviceId: deviceId.toString(),
        latitude: lat,
        longitude: lng,
        speed: speed !== null ? parseFloat(speed.toString()) : null,
        heading: heading !== null ? parseFloat(heading.toString()) : null,
        timestamp: timestamp,
        busId: device.busId,
      },
    })

    console.log('[MOBILE-GPS] ✅ Position created:', {
      id: position.id,
      deviceId: position.deviceId,
      lat: position.latitude,
      lng: position.longitude,
      timestamp: position.timestamp.toISOString()
    })

    return NextResponse.json({ 
      success: true,
      message: 'Position recorded successfully',
      position: {
        id: position.id,
        deviceId: position.deviceId,
        latitude: position.latitude,
        longitude: position.longitude,
        speed: position.speed,
        heading: position.heading,
        timestamp: position.timestamp.toISOString()
      }
    })

  } catch (error) {
    console.error('[MOBILE-GPS] ❌ Server error:', error)
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// ✅ GET ENDPOINT - For testing and info
export async function GET() {
  return NextResponse.json({
    message: 'Mobile GPS Tracking Endpoint',
    timestamp: new Date().toISOString(),
    formats: [
      {
        name: 'Traccar Mobile App Format',
        example: {
          id: 'mobile-001',
          location: {
            lat: 6.9271,
            lon: 79.8612,
            speed: 25.5,
            bearing: 180,
            time: '2025-09-30T12:00:00Z'
          }
        }
      },
      {
        name: 'Direct Format',
        example: {
          device_id: 'mobile-001',
          latitude: 6.9271,
          longitude: 79.8612,
          speed: 25.5,
          heading: 180,
          timestamp: '2025-09-30T12:00:00Z'
        }
      }
    ]
  })
}

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
    } catch (error) {
      console.log('⚠️ Operator might already exist')
    }
  }
  return operator
}
