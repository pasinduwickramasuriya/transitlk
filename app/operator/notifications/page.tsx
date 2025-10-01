import { Metadata } from 'next'
// import { NotificationManagementClient } from '@/components/operator/NotificationManagementClient'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import { NotificationManagementClient } from '@/components/operator/NotificationManagementClient'

export const metadata: Metadata = {
  title: 'Notification Management - TransitLK Operator',
  description: 'Send and manage passenger notifications',
}

const DEFAULT_OPERATOR_ID = '507f1f77bcf86cd799439011'

async function getPageData() {
  try {
    const operator = await prisma.operator.upsert({
      where: { id: DEFAULT_OPERATOR_ID },
      update: { isActive: true },
      create: {
        id: DEFAULT_OPERATOR_ID,
        name: 'TransitLK Operator',
        licenseNo: 'TLK001',
        contactInfo: 'contact@transitlk.com',
        isActive: true
      }
    })

    const [notifications, users] = await Promise.all([
      prisma.notification.findMany({
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
        take: 100
      }),
      prisma.user.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          email: true
        },
        take: 50
      })
    ])

    return { operator, notifications, users }
  } catch (error) {
    console.error('❌ Error fetching notification data:', error)
    return {
      operator: { id: DEFAULT_OPERATOR_ID, name: 'TransitLK Operator' },
      notifications: [],
      users: []
    }
  }
}

function LoadingNotifications() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loading Notifications
          </h2>
          <p className="text-slate-600">Setting up notification system...</p>
        </div>
      </div>
    </div>
  )
}

export default async function NotificationManagementPage() {
  const { operator, notifications, users } = await getPageData()

  return (
    <Suspense fallback={<LoadingNotifications />}>
      <NotificationManagementClient 
              operator={operator}
              // initialNotifications={notifications}
              users={users} initialNotifications={[]}      />
    </Suspense>
  )
}
