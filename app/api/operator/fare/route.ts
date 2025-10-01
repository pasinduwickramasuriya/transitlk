import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

export async function GET() {
  try {
    const fares = await prisma.fare.findMany({
      include: {
        route: {
          select: {
            id: true,
            routeNumber: true,
            startLocation: true,
            endLocation: true,
            distance: true
          }
        }
      },
      where: {
        route: {
          operatorId: DEFAULT_OPERATOR_ID
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      fares,
      total: fares.length,
      success: true
    })
  } catch (error: any) {
    console.error('❌ Error fetching fares:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch fares',
        fares: [],
        success: false
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { routeId, busType, basePrice, currency, isActive } = data

    // Validate required fields
    if (!routeId || !busType || basePrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if fare already exists for this route and bus type
    const existingFare = await prisma.fare.findFirst({
      where: {
        routeId,
        busType
      }
    })

    if (existingFare) {
      return NextResponse.json(
        { error: 'Fare already exists for this route and bus type' },
        { status: 400 }
      )
    }

    const fare = await prisma.fare.create({
      data: {
        routeId,
        busType,
        basePrice,
        currency: currency || 'LKR',
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        route: {
          select: {
            id: true,
            routeNumber: true,
            startLocation: true,
            endLocation: true,
            distance: true
          }
        }
      }
    })

    return NextResponse.json({
      fare,
      success: true,
      message: 'Fare created successfully'
    })
  } catch (error: any) {
    console.error('❌ Error creating fare:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create fare',
        success: false
      }, 
      { status: 500 }
    )
  }
}
