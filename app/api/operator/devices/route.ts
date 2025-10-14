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
