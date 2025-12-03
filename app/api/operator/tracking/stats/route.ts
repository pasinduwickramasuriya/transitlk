import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

export async function GET() {
  console.log('📊 API /operator/tracking/stats called')
  
  try {
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

    const [
      totalBuses,
      activeBuses,
      connectedDevices,
      recentPositions
    ] = await Promise.all([
      // Total buses for this operator
      prisma.bus.count({
        where: { operatorId: DEFAULT_OPERATOR_ID }
      }),
      
      // Active buses
      prisma.bus.count({
        where: { 
          operatorId: DEFAULT_OPERATOR_ID,
          isActive: true 
        }
      }),
      
      // Devices with recent positions (online buses)
      prisma.device.count({
        where: {
          isActive: true,
          bus: {
            operatorId: DEFAULT_OPERATOR_ID,
            isActive: true
          },
          positions: {
            some: {
              timestamp: {
                gte: fiveMinutesAgo
              }
            }
          }
        }
      }),
      
      // Recent position updates
      prisma.position.count({
        where: {
          timestamp: {
            gte: fiveMinutesAgo
          },
          device: {
            bus: {
              operatorId: DEFAULT_OPERATOR_ID
            }
          }
        }
      })
    ])

    const stats = {
      totalBuses,
      activeBuses,
      connectedDevices,
      recentPositions,
      offlineBuses: activeBuses - connectedDevices
    }

    console.log('✅ Statistics calculated:', stats)
    return NextResponse.json(stats)
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('❌ Error fetching statistics:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch statistics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}
