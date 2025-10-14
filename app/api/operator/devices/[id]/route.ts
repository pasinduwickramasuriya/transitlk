// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// // ✅ GET SINGLE DEVICE - SIMPLE & CLEAR
// export async function GET(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         console.log('📡 Getting device:', params.id)

//         const device = await prisma.device.findUnique({
//             where: { id: params.id },
//             include: {
//                 bus: {
//                     select: {
//                         id: true,
//                         busNumber: true,
//                         busType: true,
//                         isActive: true
//                     }
//                 }
//             }
//         })

//         if (!device) {
//             return NextResponse.json(
//                 { error: 'Device not found' },
//                 { status: 404 }
//             )
//         }

//         console.log('✅ Device found:', device.deviceId)

//         return NextResponse.json(device)

//     } catch (error) {
//         console.error('❌ Get device error:', error)
//         return NextResponse.json(
//             { error: 'Failed to get device' },
//             { status: 500 }
//         )
//     }
// }

// // ✅ UPDATE DEVICE - SIMPLE & CLEAR
// export async function PUT(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         console.log('📡 Updating device:', params.id)

//         const body = await request.json()
//         const { deviceId, name, isActive } = body

//         // Check if device exists
//         const existingDevice = await prisma.device.findUnique({
//             where: { id: params.id }
//         })

//         if (!existingDevice) {
//             return NextResponse.json(
//                 { error: 'Device not found' },
//                 { status: 404 }
//             )
//         }

//         // Check for duplicate device ID (if changing)
//         if (deviceId && deviceId !== existingDevice.deviceId) {
//             const duplicateDevice = await prisma.device.findFirst({
//                 where: { 
//                     deviceId: deviceId,
//                     id: { not: params.id }
//                 }
//             })

//             if (duplicateDevice) {
//                 return NextResponse.json(
//                     { error: 'Device ID already exists' },
//                     { status: 409 }
//                 )
//             }
//         }

//         // Update device
//         const updatedDevice = await prisma.device.update({
//             where: { id: params.id },
//             data: {
//                 ...(deviceId && { deviceId }),
//                 ...(name && { name }),
//                 ...(isActive !== undefined && { isActive }),
//                 updatedAt: new Date()
//             },
//             include: {
//                 bus: {
//                     select: {
//                         id: true,
//                         busNumber: true,
//                         busType: true,
//                         isActive: true
//                     }
//                 }
//             }
//         })

//         console.log('✅ Device updated:', updatedDevice.deviceId)

//         return NextResponse.json(updatedDevice)

//     } catch (error) {
//         console.error('❌ Update device error:', error)
//         return NextResponse.json(
//             { error: 'Failed to update device' },
//             { status: 500 }
//         )
//     }
// }

// // ✅ DELETE DEVICE - SIMPLE & CLEAR
// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         console.log('📡 Deleting device:', params.id)

//         // Check if device exists
//         const existingDevice = await prisma.device.findUnique({
//             where: { id: params.id }
//         })

//         if (!existingDevice) {
//             return NextResponse.json(
//                 { error: 'Device not found' },
//                 { status: 404 }
//             )
//         }

//         // Delete device
//         await prisma.device.delete({
//             where: { id: params.id }
//         })

//         console.log('✅ Device deleted:', existingDevice.deviceId)

//         return NextResponse.json({
//             message: 'Device deleted successfully',
//             deviceId: existingDevice.deviceId
//         })

//     } catch (error) {
//         console.error('❌ Delete device error:', error)
//         return NextResponse.json(
//             { error: 'Failed to delete device' },
//             { status: 500 }
//         )
//     }
// }






// ✅ DELETE DEVICE - FIX: Delete positions first
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        console.log('📡 Deleting device:', id)

        // Check if device exists
        const existingDevice = await prisma.device.findUnique({
            where: { id: id }
        })

        if (!existingDevice) {
            return NextResponse.json(
                { error: 'Device not found' },
                { status: 404 }
            )
        }

        // ✅ FIX: Delete all positions FIRST (they reference deviceId)
        const deletedPositions = await prisma.position.deleteMany({
            where: { deviceId: existingDevice.deviceId }
        })
        console.log(`🗑️ Deleted ${deletedPositions.count} positions`)

        // Now delete the device
        await prisma.device.delete({
            where: { id: id }
        })

        console.log('✅ Device deleted:', existingDevice.deviceId)

        return NextResponse.json({
            success: true,
            message: 'Device deleted successfully',
            deviceId: existingDevice.deviceId,
            deletedPositions: deletedPositions.count
        })

    } catch (error: any) {
        console.error('❌ Delete device error:', error)
        return NextResponse.json(
            { 
                error: 'Failed to delete device',
                details: error.message 
            },
            { status: 500 }
        )
    }
}
