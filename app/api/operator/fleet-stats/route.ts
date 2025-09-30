import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ✅ CREATE DEFAULT OPERATOR IF NOT EXISTS
async function ensureDefaultOperator() {
  const defaultOperatorId = '507f1f77bcf86cd799439011'
  
  let operator = await prisma.operator.findUnique({
    where: { id: defaultOperatorId }
  }).catch(() => null)

  if (!operator) {
    try {
      operator = await prisma.operator.create({
        data: {
          id: defaultOperatorId,
          name: 'Default Operator',
          licenseNo: 'DEFAULT001',
          contactInfo: 'default@transitlk.com',
          isActive: true
        }
      })
      console.log('✅ Default operator created for stats:', operator.id)
    } catch (error) {
      console.log('⚠️ Operator might already exist:', error)
    }
  }

  return operator || { id: defaultOperatorId, name: 'Default Operator' }
}

// ✅ GET FLEET STATISTICS
export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/operator/fleet-stats called')

    // Ensure default operator exists
    const operator = await ensureDefaultOperator()

    // Get all buses for the operator with related data
    const buses = await prisma.bus.findMany({
      where: { operatorId: operator.id },
      include: {
        device: true,
        positions: {
          take: 1,
          orderBy: { timestamp: 'desc' }
        },
        _count: {
          select: {
            bookings: true,
            schedules: true,
            positions: true
          }
        }
      }
    })

    // ✅ CALCULATE REAL STATISTICS
    const stats = {
      // Bus Type Counts
      busTypes: {
        'AC Luxury': buses.filter(bus => bus.busType === 'AC Luxury').length,
        'Semi Luxury': buses.filter(bus => bus.busType === 'Semi Luxury').length,
        'Normal': buses.filter(bus => bus.busType === 'Normal').length,
        'Express': buses.filter(bus => bus.busType === 'Express').length,
      },
      
      // Status Counts
      status: {
        active: buses.filter(bus => bus.isActive).length,
        inactive: buses.filter(bus => !bus.isActive).length,
        // Offline: buses with devices but no recent position data
        offline: buses.filter(bus => {
          if (!bus.device) return false
          if (!bus.positions || bus.positions.length === 0) return true
          
          const lastPosition = bus.positions[0]
          const now = new Date()
          const lastSeen = new Date(lastPosition.timestamp)
          const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60)
          
          return diffMinutes > 30 // Consider offline if no data for 30+ minutes
        }).length,
      },

      // GPS Device Counts
      devices: {
        withGPS: buses.filter(bus => bus.device).length,
        withoutGPS: buses.filter(bus => !bus.device).length,
      },

      // Total counts
      totalBuses: buses.length,
      totalBookings: buses.reduce((sum, bus) => sum + bus._count.bookings, 0),
      totalActiveRoutes: buses.reduce((sum, bus) => sum + bus._count.schedules, 0),
    }

    console.log('✅ Fleet stats calculated:', stats)

    return NextResponse.json(stats)

  } catch (error) {
    console.error('❌ GET /api/operator/fleet-stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fleet statistics', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
