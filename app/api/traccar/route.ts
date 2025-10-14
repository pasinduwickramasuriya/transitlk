import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('[TRACCAR] 📡 Incoming GPS data:', body)

    // Handle different Traccar client app formats
    const id = body.device_id || body.deviceId || body.id
    const coords = body.location?.coords
    const lat = coords?.latitude || body.latitude || body.lat
    const lon = coords?.longitude || body.longitude || body.lon
    const speed = coords?.speed || body.speed
    const heading = coords?.heading || body.heading || body.bearing || body.course
    const altitude = coords?.altitude || body.altitude
    const accuracy = coords?.accuracy || body.accuracy
    const timestamp = body.location?.timestamp || body.timestamp

    if (!id || lat === undefined || lon === undefined) {
      console.log('[TRACCAR] ❌ Missing required fields:', { id, lat, lon })
      return NextResponse.json({ error: 'Missing device_id, latitude, longitude' }, { status: 400 })
    }

    // Validate coordinates
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)
    
    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      console.log('[TRACCAR] ❌ Invalid coordinates:', { latitude, longitude })
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
    }

    // Ensure operator exists
    await ensureOperator()

    // Upsert device (update if exists, create if not)
    const upsertDevice = await prisma.device.upsert({
      where: { deviceId: id.toString() },
      update: { 
        lastSeen: new Date(), 
        isActive: true 
      },
      create: { 
        deviceId: id.toString(), 
        name: `GPS Device ${id}`,
        isActive: true,
        lastSeen: new Date()
      },
    })
    console.log('[TRACCAR] 📱 Device upserted:', upsertDevice.deviceId)

    // 🎯 UPDATE existing position or create new one
    const existingPosition = await prisma.position.findFirst({
      where: { deviceId: id.toString() },
      orderBy: { timestamp: 'desc' }
    })

    let position
    if (existingPosition) {
      // Update the most recent position
      position = await prisma.position.update({
        where: { id: existingPosition.id },
        data: {
          latitude: latitude,
          longitude: longitude,
          speed: speed ? parseFloat(speed) : null,
          heading: heading ? parseFloat(heading) : null,
          altitude: altitude ? parseFloat(altitude) : null,
          accuracy: accuracy ? parseFloat(accuracy) : null,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
          busId: upsertDevice.busId,
        },
      })
      console.log('[TRACCAR] 📍 Position updated:', position.id)
    } else {
      // Create new position (first time for this device)
      position = await prisma.position.create({
        data: {
          deviceId: id.toString(),
          latitude: latitude,
          longitude: longitude,
          speed: speed ? parseFloat(speed) : null,
          heading: heading ? parseFloat(heading) : null,
          altitude: altitude ? parseFloat(altitude) : null,
          accuracy: accuracy ? parseFloat(accuracy) : null,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
          busId: upsertDevice.busId,
        },
      })
      console.log('[TRACCAR] 📍 Position created:', position.id)
    }

    return NextResponse.json({ 
      success: true,
      message: 'GPS position recorded',
      deviceId: id,
      timestamp: position.timestamp
    })
  } catch (error: unknown) {
    console.error('[TRACCAR] ❌ Server error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

async function ensureOperator() {
  const operator = await prisma.operator.findUnique({
    where: { id: DEFAULT_OPERATOR_ID }
  }).catch(() => null)

  if (!operator) {
    await prisma.operator.create({
      data: {
        id: DEFAULT_OPERATOR_ID,
        name: 'TransitLK Operator',
        licenseNo: 'TLK001',
        contactInfo: 'contact@transitlk.com',
        isActive: true
      }
    }).catch(() => console.log('Operator already exists'))
  }
}












// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()
//     console.log('[TRACCAR] 📡 Incoming GPS data:', body)

//     // Handle different formats
//     const id = body.device_id || body.deviceId || body.id
//     const coords = body.location?.coords
//     const lat = coords?.latitude || body.latitude || body.lat
//     const lon = coords?.longitude || body.longitude || body.lon
//     const speed = coords?.speed || body.speed
//     const heading = coords?.heading || body.heading || body.bearing || body.course
//     const altitude = coords?.altitude || body.altitude
//     const accuracy = coords?.accuracy || body.accuracy
//     const timestamp = body.location?.timestamp || body.timestamp

//     if (!id || lat === undefined || lon === undefined) {
//       console.log('[TRACCAR] ❌ Missing required fields:', { id, lat, lon })
//       return NextResponse.json({ error: 'Missing device_id, latitude, longitude' }, { status: 400 })
//     }

//     // Validate coordinates
//     const latitude = parseFloat(lat)
//     const longitude = parseFloat(lon)
    
//     if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
//       console.log('[TRACCAR] ❌ Invalid coordinates:', { latitude, longitude })
//       return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
//     }

//     // Ensure operator exists
//     await ensureOperator()

//     // Upsert device
//     const device = await prisma.device.upsert({
//       where: { deviceId: id.toString() },
//       update: { 
//         lastSeen: new Date(), 
//         isActive: true 
//       },
//       create: { 
//         deviceId: id.toString(), 
//         name: `GPS Device ${id}`,
//         isActive: true,
//         lastSeen: new Date()
//       },
//     })
//     console.log('[TRACCAR] 📱 Device upserted:', device.deviceId)

//     // ✅ ALWAYS CREATE NEW POSITION - Continuous tracking
//     const position = await prisma.position.create({
//       data: {
//         deviceId: id.toString(),
//         latitude: latitude,
//         longitude: longitude,
//         speed: speed ? parseFloat(speed) : null,
//         heading: heading ? parseFloat(heading) : null,
//         altitude: altitude ? parseFloat(altitude) : null,
//         accuracy: accuracy ? parseFloat(accuracy) : null,
//         timestamp: timestamp ? new Date(timestamp) : new Date(),
//         busId: device.busId,
//       },
//     })
//     console.log('[TRACCAR] 📍 New position created:', position.id)

//     return NextResponse.json({ 
//       success: true,
//       message: 'GPS position recorded',
//       deviceId: id,
//       timestamp: position.timestamp
//     })
//   } catch (error: unknown) {
//     console.error('[TRACCAR] ❌ Server error:', error)
//     return NextResponse.json({ error: 'Server error' }, { status: 500 })
//   }
// }

// async function ensureOperator() {
//   const operator = await prisma.operator.findUnique({
//     where: { id: DEFAULT_OPERATOR_ID }
//   }).catch(() => null)

//   if (!operator) {
//     await prisma.operator.create({
//       data: {
//         id: DEFAULT_OPERATOR_ID,
//         name: 'TransitLK Operator',
//         licenseNo: 'TLK001',
//         contactInfo: 'contact@transitlk.com',
//         isActive: true
//       }
//     }).catch(() => console.log('Operator already exists'))
//   }
// }
