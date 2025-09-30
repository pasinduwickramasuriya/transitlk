import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ✅ GET FLEET STATS - ACTUAL DATA FROM DATABASE
export async function GET() {
  try {
    console.log('📊 Calculating fleet stats...')

    const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

    // Ensure default operator exists
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
        console.log('⚠️ Operator creation failed, using default')
      }
    }

    // Get comprehensive fleet statistics
    const [
      totalBuses,
      activeBuses,
      inactiveBuses,
      busTypesStats,
      devicesConnected,
      devicesDisconnected,
      totalDevices,
      totalBookings,
      recentPositions
    ] = await Promise.all([
      // Total buses count
      prisma.bus.count({
        where: { operatorId: DEFAULT_OPERATOR_ID }
      }),
      
      // Active buses count
      prisma.bus.count({
        where: {
          operatorId: DEFAULT_OPERATOR_ID,
          isActive: true
        }
      }),
      
      // Inactive buses count
      prisma.bus.count({
        where: {
          operatorId: DEFAULT_OPERATOR_ID,
          isActive: false
        }
      }),
      
      // Bus types breakdown
      prisma.bus.groupBy({
        by: ['busType'],
        where: { operatorId: DEFAULT_OPERATOR_ID },
        _count: { busType: true }
      }),
      
      // Connected devices count
      prisma.device.count({
        where: {
          bus: { operatorId: DEFAULT_OPERATOR_ID },
          isActive: true
        }
      }),
      
      // Disconnected devices count
      prisma.device.count({
        where: {
          bus: { operatorId: DEFAULT_OPERATOR_ID },
          isActive: false
        }
      }),
      
      // Total devices count
      prisma.device.count({
        where: {
          bus: { operatorId: DEFAULT_OPERATOR_ID }
        }
      }),
      
      // Total bookings count
      prisma.booking.count({
        where: {
          bus: { operatorId: DEFAULT_OPERATOR_ID }
        }
      }),
      
      // Recent positions count (last 24 hours)
      prisma.position.count({
        where: {
          bus: { operatorId: DEFAULT_OPERATOR_ID },
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    // Format bus types data
    const busTypesMap: Record<string, number> = {}
    busTypesStats.forEach(type => {
      busTypesMap[type.busType] = type._count.busType
    })

    // Calculate buses without GPS devices
    const busesWithoutGPS = totalBuses - totalDevices

    const stats = {
      totalBuses,
      totalBookings,
      busTypes: busTypesMap,
      status: {
        active: activeBuses,
        inactive: inactiveBuses
      },
      devices: {
        connected: devicesConnected,
        disconnected: devicesDisconnected + busesWithoutGPS,
        total: totalDevices,
        busesWithoutGPS
      },
      activity: {
        recentPositions
      },
      lastUpdated: new Date().toISOString()
    }

    console.log('✅ Fleet stats calculated:', {
      totalBuses,
      activeBuses,
      connectedDevices: devicesConnected,
      needsAttention: devicesDisconnected + busesWithoutGPS
    })

    return NextResponse.json(stats)

  } catch (error) {
    console.error('❌ Get fleet stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get fleet statistics' },
      { status: 500 }
    )
  }
}
