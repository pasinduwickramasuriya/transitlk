import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export const metadata: Metadata = {
  title: 'TransitLK Admin Dashboard',
  description: 'Admin panel for managing TransitLK public transport system',
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Transform session user to match AdminHeader interface
  const adminUser = {
    id: session.user.id,
    name: session.user.name || 'Admin User',
    email: session.user.email || 'admin@transitlk.com',
    role: session.user.role,
    //  Use 'undefined' instead of 'null' to satisfy TypeScript
    image: session.user.image || undefined 
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader user={adminUser} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}