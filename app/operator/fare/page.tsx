import { Metadata } from 'next'
// import { FareManagementClient } from '@/components/operator/FareManagementClient'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import { FareManagementClient } from '@/components/operator/FareManagementClient'

export const metadata: Metadata = {
  title: 'Fare Management - TransitLK Operator',
  description: 'Manage bus fare pricing and route-based fares',
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

    const [fares, routes] = await Promise.all([
      prisma.fare.findMany({
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
      }),
      prisma.route.findMany({
        where: { 
          operatorId: DEFAULT_OPERATOR_ID,
          isActive: true
        },
        select: {
          id: true,
          routeNumber: true,
          startLocation: true,
          endLocation: true,
          distance: true
        }
      })
    ])

    return { operator, fares, routes }
  } catch (error) {
    console.error('❌ Error fetching fare data:', error)
    return {
      operator: { id: DEFAULT_OPERATOR_ID, name: 'TransitLK Operator' },
      fares: [],
      routes: []
    }
  }
}

function LoadingFares() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 border-4 border-green-200 rounded-full animate-spin border-t-green-600 mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Loading Fare Management
          </h2>
          <p className="text-slate-600">Setting up pricing system...</p>
        </div>
      </div>
    </div>
  )
}

export default async function FareManagementPage() {
  const { operator, fares, routes } = await getPageData()

  return (
    <Suspense fallback={<LoadingFares />}>
      <FareManagementClient 
              operator={operator}
              // initialFares={fares}
              routes={routes} initialFares={[]}      />
    </Suspense>
  )
}
