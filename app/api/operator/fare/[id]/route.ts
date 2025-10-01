import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    const { routeId, busType, basePrice, currency, isActive } = data

    const fare = await prisma.fare.update({
      where: { id },
      data: {
        routeId,
        busType,
        basePrice,
        currency,
        isActive
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
      message: 'Fare updated successfully'
    })
  } catch (error: any) {
    console.error('❌ Error updating fare:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update fare',
        success: false
      }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.fare.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Fare deleted successfully'
    })
  } catch (error: any) {
    console.error('❌ Error deleting fare:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete fare',
        success: false
      }, 
      { status: 500 }
    )
  }
}
