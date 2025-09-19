import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const date = searchParams.get('date')

    let whereClause: any = {
      isActive: true
    }

    if (from) {
      whereClause.startLocation = {
        contains: from,
        mode: 'insensitive'
      }
    }

    if (to) {
      whereClause.endLocation = {
        contains: to,
        mode: 'insensitive'
      }
    }

    const routes = await prisma.route.findMany({
      where: whereClause,
      include: {
        operator: true,
        schedules: {
          where: { isActive: true },
          include: {
            bus: true
          }
        },
        stops: {
          orderBy: { order: 'asc' }
        },
        fares: {
          where: { isActive: true }
        }
      }
    })

    return NextResponse.json(routes)

  } catch (error) {
    console.error('Routes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
