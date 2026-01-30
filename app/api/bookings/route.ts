/* eslint-disable @typescript-eslint/no-explicit-any */



import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const whereClause: any = {}
    
    // If userId is provided, filter by user
    if (userId) {
      whereClause.userId = userId
    }
    
    // If user is not admin, only show their bookings
    if (session?.user?.role !== 'ADMIN' && session?.user?.id) {
      whereClause.userId = session.user.id
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          schedule: {
            include: {
              bus: true,
              route: {
                include: {
                  operator: true
                }
              }
            }
          },
          ticket: true,
          payment: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.booking.count({
        where: whereClause
      })
    ])

    return NextResponse.json({
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}










