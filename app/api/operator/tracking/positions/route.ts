






import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

export async function GET(request: Request) {
  console.log('📍 API /operator/tracking/positions called')
  
  try {
    const { searchParams } = new URL(request.url)
    const since = searchParams.get('since')
    const deviceIds = searchParams.get('deviceIds')?.split(',').filter(Boolean)

    // Build time filter - default to last 30 minutes
    const timeFilter = since ? 
      new Date(since) : 
      new Date(Date.now() - 30 * 60 * 1000)

    // Build where clause
    const where: any = {
      timestamp: {
        gte: timeFilter
      },
      device: {
        bus: {
          operatorId: DEFAULT_OPERATOR_ID,
          isActive: true
        },
        isActive: true
      }
    }

    // Filter by specific device IDs if provided
    if (deviceIds && deviceIds.length > 0) {
      where.deviceId = {
        in: deviceIds
      }
    }

    const positions = await prisma.position.findMany({
      where,
      include: {
        device: {
          include: {
            bus: {
              select: {
                id: true,
                busNumber: true,
                busType: true,
                capacity: true,
                isActive: true
              }
            }
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 1000 // Limit results
    })

    // Group by deviceId to get latest position per device
    const latestPositionsMap = new Map()
    positions.forEach(position => {
      if (!latestPositionsMap.has(position.deviceId)) {
        latestPositionsMap.set(position.deviceId, {
          ...position,
          timestamp: position.timestamp.toISOString()
        })
      }
    })

    const latestPositions = Array.from(latestPositionsMap.values())

    console.log(`✅ Returning ${latestPositions.length} latest positions`)
    
    return NextResponse.json({
      positions: latestPositions,
      total: latestPositions.length,
      timestamp: new Date().toISOString(),
      success: true
    })
    
  } catch (error: any) {
    console.error('❌ Error fetching positions:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch positions',
        positions: [],
        total: 0,
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}
