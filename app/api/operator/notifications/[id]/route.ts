// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params

//     await prisma.notification.delete({
//       where: { id }
//     })

//     return NextResponse.json({
//       success: true,
//       message: 'Notification deleted successfully'
//     })
//   } catch (error: any) {
//     console.error('❌ Error deleting notification:', error)
//     return NextResponse.json(
//       { 
//         error: 'Failed to delete notification',
//         success: false
//       }, 
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params
//     const data = await request.json()
//     const { isRead } = data

//     const notification = await prisma.notification.update({
//       where: { id },
//       data: { isRead },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true
//           }
//         }
//       }
//     })

//     return NextResponse.json({
//       notification,
//       success: true,
//       message: 'Notification updated successfully'
//     })
//   } catch (error: any) {
//     console.error('❌ Error updating notification:', error)
//     return NextResponse.json(
//       { 
//         error: 'Failed to update notification',
//         success: false
//       }, 
//       { status: 500 }
//     )
//   }
// }








import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Type definitions
interface NotificationUpdateData {
  title?: string
  message?: string
  type?: 'BOOKING_CONFIRMATION' | 'PAYMENT_SUCCESS' | 'SCHEDULE_UPDATE' | 'ROUTE_CHANGE' | 'GENERAL' | 'EMERGENCY'
  isBroadcast?: boolean
  userId?: string | null
  isRead?: boolean
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required', success: false },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      notification,
      success: true
    })
  } catch (error: any) {
    console.error('❌ Error fetching notification:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch notification',
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required', success: false },
        { status: 400 }
      )
    }

    const data: NotificationUpdateData = await request.json()
    const { title, message, type, isBroadcast, userId, isRead } = data

    // Check if notification exists
    const existingNotification = await prisma.notification.findUnique({
      where: { id },
      select: { id: true, isBroadcast: true }
    })

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'Notification not found', success: false },
        { status: 404 }
      )
    }

    // Validate fields if they are provided
    if (title !== undefined && !title?.trim()) {
      return NextResponse.json(
        { error: 'Title cannot be empty', success: false },
        { status: 400 }
      )
    }

    if (message !== undefined && !message?.trim()) {
      return NextResponse.json(
        { error: 'Message cannot be empty', success: false },
        { status: 400 }
      )
    }

    if (type !== undefined) {
      const validTypes = ['BOOKING_CONFIRMATION', 'PAYMENT_SUCCESS', 'SCHEDULE_UPDATE', 'ROUTE_CHANGE', 'GENERAL', 'EMERGENCY']
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: 'Invalid notification type', success: false },
          { status: 400 }
        )
      }
    }

    // Validate individual notification requirements
    if (isBroadcast === false && !userId) {
      return NextResponse.json(
        { error: 'User ID is required for individual notifications', success: false },
        { status: 400 }
      )
    }

    // If changing to individual notification, verify user exists
    if (isBroadcast === false && userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true }
      })

      if (!userExists) {
        return NextResponse.json(
          { error: 'Selected user does not exist', success: false },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title.trim()
    if (message !== undefined) updateData.message = message.trim()
    if (type !== undefined) updateData.type = type
    if (isRead !== undefined) updateData.isRead = isRead
    if (isBroadcast !== undefined) {
      updateData.isBroadcast = isBroadcast
      updateData.userId = isBroadcast ? null : userId || null
    }

    // Update notification
    const notification = await prisma.notification.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    console.log(`✅ Updated notification: ${id}`)

    return NextResponse.json({
      notification,
      success: true,
      message: 'Notification updated successfully'
    })
  } catch (error: any) {
    console.error('❌ Error updating notification:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Notification not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to update notification',
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required', success: false },
        { status: 400 }
      )
    }

    const data = await request.json()
    const { isRead } = data

    if (typeof isRead !== 'boolean') {
      return NextResponse.json(
        { error: 'isRead must be a boolean value', success: false },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    console.log(`✅ Updated notification read status: ${id} -> ${isRead}`)

    return NextResponse.json({
      notification,
      success: true,
      message: `Notification marked as ${isRead ? 'read' : 'unread'}`
    })
  } catch (error: any) {
    console.error('❌ Error updating notification status:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Notification not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to update notification status',
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
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

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required', success: false },
        { status: 400 }
      )
    }

    // Check if notification exists before deleting
    const existingNotification = await prisma.notification.findUnique({
      where: { id },
      select: { id: true, title: true }
    })

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'Notification not found', success: false },
        { status: 404 }
      )
    }

    await prisma.notification.delete({
      where: { id }
    })

    console.log(`✅ Deleted notification: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
      deletedId: id
    })
  } catch (error: any) {
    console.error('❌ Error deleting notification:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Notification not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to delete notification',
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    )
  }
}
