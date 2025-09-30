

// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { z } from 'zod'

// // ✅ VALIDATION SCHEMA
// const createDeviceSchema = z.object({
//     deviceId: z.string().min(1, 'Device ID is required'),
//     name: z.string().min(1, 'Device name is required'),
//     busId: z.string().min(1, 'Bus ID is required'),
//     isActive: z.boolean().optional().default(true)
// })

// // ✅ ENSURE DEFAULT OPERATOR EXISTS (Same as bus API)
// async function ensureDefaultOperator() {
//     const defaultOperatorId = '507f1f77bcf86cd799439011'

//     let operator = await prisma.operator.findUnique({
//         where: { id: defaultOperatorId }
//     }).catch(() => null)

//     if (!operator) {
//         try {
//             operator = await prisma.operator.create({
//                 data: {
//                     id: defaultOperatorId,
//                     name: 'Default Operator',
//                     licenseNo: 'DEFAULT001',
//                     contactInfo: 'default@transitlk.com',
//                     isActive: true
//                 }
//             })
//             console.log('✅ Default operator created for devices:', operator.id)
//         } catch (error) {
//             console.log('⚠️ Operator might already exist:', error)
//         }
//     }

//     return operator || { id: defaultOperatorId, name: 'Default Operator' }
// }

// // ✅ CREATE DEVICE (SIMPLIFIED)
// export async function POST(request: NextRequest) {
//     try {
//         console.log('📡 POST /api/operator/devices called')

//         // Parse and validate request body
//         const body = await request.json()
//         console.log('📝 Device request body:', body)

//         const validatedData = createDeviceSchema.parse(body)
//         console.log('✅ Validated device data:', validatedData)

//         // Verify bus exists
//         const bus = await prisma.bus.findUnique({
//             where: { id: validatedData.busId },
//             include: { operator: true }
//         })

//         if (!bus) {
//             console.log('❌ Bus not found:', validatedData.busId)
//             return NextResponse.json({ error: 'Bus not found' }, { status: 404 })
//         }

//         console.log('✅ Bus found:', bus.busNumber)

//         // ✅ SKIP AUTH CHECK FOR NOW - SIMPLIFIED
//         // Just ensure the operator exists
//         await ensureDefaultOperator()

//         // Check for duplicate device ID
//         const existingDevice = await prisma.device.findUnique({
//             where: { deviceId: validatedData.deviceId }
//         })

//         if (existingDevice) {
//             console.log('❌ Device ID already exists:', validatedData.deviceId)
//             return NextResponse.json(
//                 { error: 'Device ID already exists' },
//                 { status: 409 }
//             )
//         }

//         // Check if bus already has a device (one-to-one relation)
//         const existingBusDevice = await prisma.device.findUnique({
//             where: { busId: validatedData.busId }
//         })

//         if (existingBusDevice) {
//             console.log('❌ Bus already has a device:', existingBusDevice.deviceId)
//             return NextResponse.json(
//                 { error: 'Bus already has a device assigned' },
//                 { status: 409 }
//             )
//         }

//         // Create device
//         console.log('🏗️ Creating device...')
//         const newDevice = await prisma.device.create({
//             data: validatedData,
//             include: {
//                 bus: {
//                     select: {
//                         id: true,
//                         busNumber: true,
//                         busType: true
//                     }
//                 }
//             }
//         })

//         console.log('✅ Device created successfully:', newDevice.id)

//         return NextResponse.json(newDevice, { status: 201 })

//     } catch (error) {
//         console.error('❌ POST /api/operator/devices error:', error)

//         // Handle Zod validation errors
//         if (error instanceof z.ZodError) {
//             console.log('❌ Device validation error:', error.issues)
//             return NextResponse.json(
//                 {
//                     error: 'Validation failed',
//                     details: error.issues.map(issue => ({
//                         path: issue.path.join('.'),
//                         message: issue.message
//                     }))
//                 },
//                 { status: 400 }
//             )
//         }

//         return NextResponse.json(
//             {
//                 error: 'Failed to create device',
//                 message: error instanceof Error ? error.message : 'Unknown error'
//             },
//             { status: 500 }
//         )
//     }
// }

// // ✅ GET ALL DEVICES (SIMPLIFIED)
// export async function GET(request: NextRequest) {
//     try {
//         console.log('📡 GET /api/operator/devices called')

//         // Ensure default operator exists
//         const operator = await ensureDefaultOperator()

//         // Get all devices for the default operator's buses
//         const devices = await prisma.device.findMany({
//             where: {
//                 bus: {
//                     operatorId: operator.id
//                 }
//             },
//             include: {
//                 bus: {
//                     select: {
//                         id: true,
//                         busNumber: true,
//                         busType: true,
//                         isActive: true
//                     }
//                 },
//                 _count: {
//                     select: {
//                         positions: true
//                     }
//                 }
//             },
//             orderBy: { createdAt: 'desc' }
//         })

//         console.log('✅ Returning devices:', devices.length)

//         return NextResponse.json({
//             devices,
//             count: devices.length
//         })

//     } catch (error) {
//         console.error('❌ GET /api/operator/devices error:', error)
//         return NextResponse.json(
//             { error: 'Failed to fetch devices' },
//             { status: 500 }
//         )
//     }
// }





import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ✅ CREATE DEVICE - SIMPLE & CLEAR
export async function POST(request: NextRequest) {
    try {
        console.log('📡 Creating device...')

        const body = await request.json()
        const { deviceId, name, busId, isActive = true } = body

        // Simple validation
        if (!deviceId || !name || !busId) {
            return NextResponse.json(
                { error: 'Device ID, name, and bus ID are required' },
                { status: 400 }
            )
        }

        // Check if bus exists
        const bus = await prisma.bus.findUnique({
            where: { id: busId }
        })

        if (!bus) {
            return NextResponse.json(
                { error: 'Bus not found' },
                { status: 404 }
            )
        }

        // Check if device ID already exists
        const existingDevice = await prisma.device.findFirst({
            where: { deviceId: deviceId }
        })

        if (existingDevice) {
            return NextResponse.json(
                { error: 'Device ID already exists' },
                { status: 409 }
            )
        }

        // Check if bus already has a device
        const busHasDevice = await prisma.device.findFirst({
            where: { busId: busId }
        })

        if (busHasDevice) {
            return NextResponse.json(
                { error: 'Bus already has a device' },
                { status: 409 }
            )
        }

        // Create device
        const newDevice = await prisma.device.create({
            data: {
                deviceId: deviceId,
                name: name,
                busId: busId,
                isActive: isActive,
                lastSeen: new Date()
            },
            include: {
                bus: {
                    select: {
                        id: true,
                        busNumber: true,
                        busType: true
                    }
                }
            }
        })

        console.log('✅ Device created:', newDevice.deviceId)

        return NextResponse.json(newDevice, { status: 201 })

    } catch (error) {
        console.error('❌ Create device error:', error)
        return NextResponse.json(
            { error: 'Failed to create device' },
            { status: 500 }
        )
    }
}

// ✅ GET ALL DEVICES - SIMPLE & CLEAR
export async function GET() {
    try {
        console.log('📡 Getting all devices...')

        const devices = await prisma.device.findMany({
            include: {
                bus: {
                    select: {
                        id: true,
                        busNumber: true,
                        busType: true,
                        isActive: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        console.log('✅ Found devices:', devices.length)

        return NextResponse.json({
            devices: devices,
            count: devices.length
        })

    } catch (error) {
        console.error('❌ Get devices error:', error)
        return NextResponse.json(
            { error: 'Failed to get devices' },
            { status: 500 }
        )
    }
}
