// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

// async function ensureDefaultOperator() {
//   let operator = await prisma.operator.findUnique({
//     where: { id: DEFAULT_OPERATOR_ID }
//   }).catch(() => null)

//   if (!operator) {
//     try {
//       operator = await prisma.operator.create({
//         data: {
//           id: DEFAULT_OPERATOR_ID,
//           name: 'Default Operator',
//           licenseNo: 'DEFAULT001',
//           contactInfo: 'default@transitlk.com',
//           isActive: true
//         }
//       })
//       console.log('✅ Created default operator')
//     } catch (error) {
//       console.log('⚠️ Operator might already exist:', error)
//     }
//   }
//   return operator || { id: DEFAULT_OPERATOR_ID, name: 'Default Operator' }
// }

// // ✅ GET ALL DEVICES WITH BUS INFORMATION
// export async function GET(request: NextRequest) {
//   try {
//     console.log('📱 Getting devices with bus information...')

//     await ensureDefaultOperator()

//     const { searchParams } = new URL(request.url)
//     const activeOnly = searchParams.get('active') === 'true'

//     console.log('Active only filter:', activeOnly)

//     // Build where clause
//     const where: any = {
//       bus: {
//         operatorId: DEFAULT_OPERATOR_ID
//       }
//     }

//     if (activeOnly) {
//       where.isActive = true
//       where.bus.isActive = true
//     }

//     const devices = await prisma.device.findMany({
//       where,
//       include: {
//         bus: {
//           select: {
//             id: true,
//             busNumber: true,
//             busType: true,
//             capacity: true,
//             isActive: true
//           }
//         },
//         positions: {
//           orderBy: {
//             timestamp: 'desc'
//           },
//           take: 1, // Get latest position only
//           select: {
//             id: true,
//             latitude: true,
//             longitude: true,
//             speed: true,
//             heading: true,
//             timestamp: true
//           }
//         }
//       },
//       orderBy: {
//         name: 'asc'
//       }
//     })

//     console.log(`✅ Found ${devices.length} devices`)

//     // Transform data for frontend
//     const devicesWithLatestPosition = devices.map(device => ({
//       id: device.id,
//       deviceId: device.deviceId,
//       name: device.name,
//       isActive: device.isActive,
//       lastSeen: device.lastSeen.toISOString(),
//       bus: device.bus,
//       latestPosition: device.positions[0] ? {
//         ...device.positions[0],
//         timestamp: device.positions[0].timestamp.toISOString()
//       } : null
//     }))

//     return NextResponse.json({
//       devices: devicesWithLatestPosition,
//       total: devices.length,
//       success: true
//     })

//   } catch (error) {
//     console.error('❌ Get devices error:', error)
//     return NextResponse.json(
//       { 
//         error: 'Failed to load devices',
//         devices: [],
//         total: 0,
//         success: false
//       },
//       { status: 500 }
//     )
//   }
// }

// // ✅ CREATE DEVICE
// export async function POST(request: NextRequest) {
//   try {
//     console.log('📱 Creating device...')

//     await ensureDefaultOperator()

//     const body = await request.json()
//     const { deviceId, name, busId } = body

//     // Validation
//     if (!deviceId?.trim()) {
//       return NextResponse.json(
//         { error: 'Device ID is required' },
//         { status: 400 }
//       )
//     }

//     if (!name?.trim()) {
//       return NextResponse.json(
//         { error: 'Device name is required' },
//         { status: 400 }
//       )
//     }

//     // Check if deviceId already exists
//     const existingDevice = await prisma.device.findUnique({
//       where: { deviceId: deviceId.trim() }
//     })

//     if (existingDevice) {
//       return NextResponse.json(
//         { error: `Device ID ${deviceId} already exists` },
//         { status: 409 }
//       )
//     }

//     // If busId provided, verify bus exists and belongs to operator
//     let bus = null
//     if (busId) {
//       bus = await prisma.bus.findFirst({
//         where: { 
//           id: busId,
//           operatorId: DEFAULT_OPERATOR_ID
//         }
//       })

//       if (!bus) {
//         return NextResponse.json(
//           { error: 'Bus not found or does not belong to operator' },
//           { status: 404 }
//         )
//       }

//       // Check if bus already has a device
//       const existingBusDevice = await prisma.device.findFirst({
//         where: { busId }
//       })

//       if (existingBusDevice) {
//         return NextResponse.json(
//           { error: 'Bus already has a device assigned' },
//           { status: 409 }
//         )
//       }
//     }

//     // Create device
//     const newDevice = await prisma.device.create({
//       data: {
//         deviceId: deviceId.trim(),
//         name: name.trim(),
//         busId: busId || null,
//         isActive: true,
//         lastSeen: new Date()
//       },
//       include: {
//         bus: {
//           select: {
//             id: true,
//             busNumber: true,
//             busType: true,
//             capacity: true,
//             isActive: true
//           }
//         }
//       }
//     })

//     console.log(`✅ Device created: ${newDevice.deviceId}`)

//     return NextResponse.json({
//       ...newDevice,
//       lastSeen: newDevice.lastSeen.toISOString(),
//       success: true,
//       message: `Device ${newDevice.deviceId} created successfully`
//     }, { status: 201 })

//   } catch (error) {
//     console.error('❌ Create device error:', error)
//     return NextResponse.json(
//       { 
//         error: 'Failed to create device',
//         success: false
//       },
//       { status: 500 }
//     )
//   }
// }
