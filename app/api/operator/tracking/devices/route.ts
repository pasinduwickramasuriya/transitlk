
import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  console.log('📱 API /operator/tracking/devices called')

  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (activeOnly) {
      where.isActive = true
    }

    // Fetch devices with bus and latest position
    const devices = await prisma.device.findMany({
      where,
      include: {
        bus: {
          select: {
            id: true,
            busNumber: true,
            busType: true,
            capacity: true,
            isActive: true
          }
        },
        positions: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          select: {
            id: true,
            latitude: true,
            longitude: true,
            speed: true,
            heading: true,
            altitude: true,
            accuracy: true,
            timestamp: true
          }
        },
      },
      orderBy: { lastSeen: 'desc' },
    })

    // Map to response format
    const devicesWithLatestPosition = devices.map(device => ({
      id: device.id,
      deviceId: device.deviceId,
      name: device.name,
      isActive: device.isActive,
      lastSeen: device.lastSeen.toISOString(),
      bus: device.bus,
      latestPosition: device.positions[0] ? {
        id: device.positions[0].id,
        latitude: device.positions[0].latitude,
        longitude: device.positions[0].longitude,
        speed: device.positions[0].speed,
        heading: device.positions[0].heading,
        altitude: device.positions[0].altitude,
        accuracy: device.positions[0].accuracy,
        timestamp: device.positions[0].timestamp.toISOString()
      } : null
    }))

    // Log summary
    const withPositions = devicesWithLatestPosition.filter(d => d.latestPosition)
    console.log(`✅ Returning ${devicesWithLatestPosition.length} devices (${withPositions.length} with GPS)`)

    withPositions.forEach(d => {
      console.log(`  📍 ${d.deviceId}: [${d.latestPosition?.latitude}, ${d.latestPosition?.longitude}] at ${d.latestPosition?.timestamp}`)
    })

    return NextResponse.json({
      devices: devicesWithLatestPosition,
      total: devicesWithLatestPosition.length,
      withPositions: withPositions.length,
      success: true
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(' Error fetching devices:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch devices',
        devices: [],
        total: 0,
        withPositions: 0,
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
