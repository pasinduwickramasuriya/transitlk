// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// // import { authOptions } from '@/app/api/auth/[...nextauth]/route'
// import { prisma } from '@/lib/prisma'
// import { authOptions } from '@/lib/auth'

// // ✅ UPDATE DEVICE
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     console.log('💾 PUT /api/operator/devices/[id] called for device:', params.id)

//     const session = await getServerSession(authOptions)
    
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { error: 'Authentication required' },
//         { status: 401 }
//       )
//     }

//     const body = await request.json()
//     const { deviceId, name, isActive } = body

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

//     // Check if device exists and belongs to the operator
//     const existingDevice = await prisma.device.findFirst({
//       where: {
//         id: params.id,
//         bus: {
//           operatorId: session.user.id
//         }
//       },
//       include: {
//         bus: true
//       }
//     })

//     if (!existingDevice) {
//       return NextResponse.json(
//         { error: 'Device not found or access denied' },
//         { status: 404 }
//       )
//     }

//     // Check for duplicate deviceId
//     const duplicateDevice = await prisma.device.findFirst({
//       where: {
//         deviceId: deviceId.trim(),
//         id: { not: params.id },
//         bus: {
//           operatorId: session.user.id
//         }
//       }
//     })

//     if (duplicateDevice) {
//       return NextResponse.json(
//         { error: 'Device ID already exists' },
//         { status: 409 }
//       )
//     }

//     // Update device
//     const updatedDevice = await prisma.device.update({
//       where: { id: params.id },
//       data: {
//         deviceId: deviceId.trim(),
//         name: name.trim(),
//         isActive: Boolean(isActive),
//         updatedAt: new Date()
//       },
//       include: {
//         bus: {
//           select: {
//             id: true,
//             busNumber: true
//           }
//         }
//       }
//     })

//     console.log('✅ Device updated successfully:', updatedDevice.deviceId)

//     return NextResponse.json({
//       success: true,
//       device: updatedDevice,
//       message: 'Device updated successfully'
//     })

//   } catch (error) {
//     console.error('❌ PUT /api/operator/devices/[id] error:', error)
//     return NextResponse.json(
//       { error: 'Failed to update device' },
//       { status: 500 }
//     )
//   }
// }

// // ✅ DELETE DEVICE
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     console.log('🗑️ DELETE /api/operator/devices/[id] called for device:', params.id)

//     const session = await getServerSession(authOptions)
    
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { error: 'Authentication required' },
//         { status: 401 }
//       )
//     }

//     // Check if device exists and belongs to the operator
//     const existingDevice = await prisma.device.findFirst({
//       where: {
//         id: params.id,
//         bus: {
//           operatorId: session.user.id
//         }
//       }
//     })

//     if (!existingDevice) {
//       return NextResponse.json(
//         { error: 'Device not found or access denied' },
//         { status: 404 }
//       )
//     }

//     // Delete device (this will also cascade delete positions if configured)
//     const deletedDevice = await prisma.device.delete({
//       where: { id: params.id }
//     })

//     console.log('✅ Device deleted successfully:', deletedDevice.deviceId)

//     return NextResponse.json({
//       success: true,
//       message: 'Device deleted successfully',
//       deletedDeviceId: deletedDevice.deviceId
//     })

//   } catch (error) {
//     console.error('❌ DELETE /api/operator/devices/[id] error:', error)
//     return NextResponse.json(
//       { error: 'Failed to delete device' },
//       { status: 500 }
//     )
//   }
// }





import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ✅ GET SINGLE DEVICE - SIMPLE & CLEAR
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('📡 Getting device:', params.id)

        const device = await prisma.device.findUnique({
            where: { id: params.id },
            include: {
                bus: {
                    select: {
                        id: true,
                        busNumber: true,
                        busType: true,
                        isActive: true
                    }
                }
            }
        })

        if (!device) {
            return NextResponse.json(
                { error: 'Device not found' },
                { status: 404 }
            )
        }

        console.log('✅ Device found:', device.deviceId)

        return NextResponse.json(device)

    } catch (error) {
        console.error('❌ Get device error:', error)
        return NextResponse.json(
            { error: 'Failed to get device' },
            { status: 500 }
        )
    }
}

// ✅ UPDATE DEVICE - SIMPLE & CLEAR
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('📡 Updating device:', params.id)

        const body = await request.json()
        const { deviceId, name, isActive } = body

        // Check if device exists
        const existingDevice = await prisma.device.findUnique({
            where: { id: params.id }
        })

        if (!existingDevice) {
            return NextResponse.json(
                { error: 'Device not found' },
                { status: 404 }
            )
        }

        // Check for duplicate device ID (if changing)
        if (deviceId && deviceId !== existingDevice.deviceId) {
            const duplicateDevice = await prisma.device.findFirst({
                where: { 
                    deviceId: deviceId,
                    id: { not: params.id }
                }
            })

            if (duplicateDevice) {
                return NextResponse.json(
                    { error: 'Device ID already exists' },
                    { status: 409 }
                )
            }
        }

        // Update device
        const updatedDevice = await prisma.device.update({
            where: { id: params.id },
            data: {
                ...(deviceId && { deviceId }),
                ...(name && { name }),
                ...(isActive !== undefined && { isActive }),
                updatedAt: new Date()
            },
            include: {
                bus: {
                    select: {
                        id: true,
                        busNumber: true,
                        busType: true,
                        isActive: true
                    }
                }
            }
        })

        console.log('✅ Device updated:', updatedDevice.deviceId)

        return NextResponse.json(updatedDevice)

    } catch (error) {
        console.error('❌ Update device error:', error)
        return NextResponse.json(
            { error: 'Failed to update device' },
            { status: 500 }
        )
    }
}

// ✅ DELETE DEVICE - SIMPLE & CLEAR
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('📡 Deleting device:', params.id)

        // Check if device exists
        const existingDevice = await prisma.device.findUnique({
            where: { id: params.id }
        })

        if (!existingDevice) {
            return NextResponse.json(
                { error: 'Device not found' },
                { status: 404 }
            )
        }

        // Delete device
        await prisma.device.delete({
            where: { id: params.id }
        })

        console.log('✅ Device deleted:', existingDevice.deviceId)

        return NextResponse.json({
            message: 'Device deleted successfully',
            deviceId: existingDevice.deviceId
        })

    } catch (error) {
        console.error('❌ Delete device error:', error)
        return NextResponse.json(
            { error: 'Failed to delete device' },
            { status: 500 }
        )
    }
}
