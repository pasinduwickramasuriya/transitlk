/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSMS } from '@/lib/twilio'

// Type definitions for better type safety
interface NotificationCreateData {
  title: string
  message: string
  type: 'BOOKING_CONFIRMATION' | 'PAYMENT_SUCCESS' | 'SCHEDULE_UPDATE' | 'ROUTE_CHANGE' | 'GENERAL' | 'EMERGENCY'
  isBroadcast: boolean
  userId?: string | null
}

export async function GET(request: Request) {
  try {
    console.log(' Fetching notifications...')

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')
    const isRead = searchParams.get('isRead')

    // Build where clause for filtering
    const where: any = {}

    if (type && type !== 'all') {
      where.type = type
    }

    if (isRead !== null && isRead !== 'all') {
      where.isRead = isRead === 'true'
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const total = await prisma.notification.count({ where })

    console.log(`  Retrieved ${notifications.length} notifications`)

    return NextResponse.json({
      notifications,
      total,
      success: true,
      meta: {
        limit,
        offset,
        hasMore: offset + notifications.length < total
      }
    })
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch notifications',
        notifications: [],
        total: 0,
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}


export async function POST(request: Request) {
  try {
    console.log(' Creating notification...')

    const { title, message, type } = await request.json()

    // Validate
    if (!title || !message || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        title: title.trim(),
        message: message.trim(),
        type,
        isBroadcast: true,
        userId: null,
        isRead: false
      }
    })

    console.log('  Notification created:', notification.id)

    //     GET ALL USERS (remove ALL filters!)    
    const allUsers = await prisma.user.findMany({
      select: {
        phoneNumber: true,
        name: true,
        email: true
      }
    })

    console.log(` Total users in database: ${allUsers.length}`)

    // Filter ONLY users with phone numbers
    const usersWithPhone = allUsers.filter(u => u.phoneNumber && u.phoneNumber.trim() !== '')

    console.log(`📱 Users with phone numbers: ${usersWithPhone.length}`)

    // Send SMS to each user
    const smsText = `TransitLK\n${title}\n\n${message}`
    let sent = 0

    for (const user of usersWithPhone) {
      try {
        await sendSMS(user.phoneNumber!, smsText)
        sent++
        console.log(`  [${sent}/${usersWithPhone.length}] ${user.name || user.email}`)
        await new Promise(r => setTimeout(r, 100)) // Small delay
      } catch (error) {
        console.error(`Failed: ${user.phoneNumber}`, error)
      }
    }

    console.log(`    DONE! Sent ${sent}/${usersWithPhone.length} SMS    `)

    return NextResponse.json({
      success: true,
      notification,
      message: `Sent to ${sent}/${usersWithPhone.length} users`,
      smsSent: sent,
      totalUsers: usersWithPhone.length
    }, { status: 201 })

  } catch (error: any) {
    console.error(' Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
