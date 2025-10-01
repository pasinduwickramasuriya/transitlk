


import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

export async function GET(request: Request) {
  console.log('📱 API /operator/tracking/devices called')
  
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    // Build filter for active devices only if requested
    const where: any = {
      bus: {
        operatorId: DEFAULT_OPERATOR_ID
      }
    }

    if (activeOnly) {
      where.isActive = true
      where.bus.isActive = true
    }

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
            timestamp: true
          }
        },
      },
      orderBy: { lastSeen: 'desc' },
    })

    const devicesWithLatestPosition = devices.map(device => ({
      id: device.id,
      deviceId: device.deviceId,
      name: device.name,
      isActive: device.isActive,
      lastSeen: device.lastSeen.toISOString(),
      bus: device.bus,
      latestPosition: device.positions[0] ? {
        ...device.positions[0],
        timestamp: device.positions[0].timestamp.toISOString()
      } : null
    }))

    console.log(`✅ Returning ${devicesWithLatestPosition.length} devices`)
    
    return NextResponse.json({
      devices: devicesWithLatestPosition,
      total: devicesWithLatestPosition.length,
      success: true
    })
    
  } catch (error: any) {
    console.error('❌ Error fetching devices:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch devices',
        devices: [],
        total: 0,
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}
