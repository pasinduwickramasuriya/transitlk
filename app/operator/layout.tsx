



import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { OperatorSidebar } from '@/components/operator/OperatorSidebar'
import { OperatorHeader } from '@/components/operator/OperatorHeader'

export const metadata: Metadata = {
  title: 'TransitLK Operator Dashboard',
  description: 'Operator panel for managing fleet and schedules',
}

interface OperatorLayoutProps {
  children: React.ReactNode
}

export default async function OperatorLayout({ children }: OperatorLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'OPERATOR') {
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ✅ SIDEBAR */}
      <OperatorSidebar />

      {/* ✅ MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ HEADER */}
        <OperatorHeader user={session.user} />

        {/* ✅ MAIN CONTENT */}
        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
