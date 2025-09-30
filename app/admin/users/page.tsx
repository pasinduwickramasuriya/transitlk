import { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UsersService } from '@/lib/services/admin-service'
import { UsersFilters } from '@/components/admin/UsersFilters'
import { UsersTable } from '@/components/admin/UserTable'
import { CreateUserDialog } from '@/components/admin/CreateUserDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Users, UserCheck, Shield, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'User Management - TransitLK Admin',
  description: 'Manage system users, commuters, and administrators with full CRUD operations',
}

interface UserManagementPageProps {
  searchParams: Promise<{  // ✅ FIXED: searchParams is now a Promise
    page?: string
    search?: string
    role?: string
    status?: string
    action?: string
    success?: string
    error?: string
  }>
}

// ✅ FIXED: Made function async to await searchParams
export default async function UserManagementPage({
  searchParams
}: UserManagementPageProps) {
  // ✅ Authentication check
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // ✅ FIXED: Await searchParams before accessing properties
  const resolvedSearchParams = await searchParams

  // ✅ Parse and validate parameters
  const page = Math.max(1, Number(resolvedSearchParams.page) || 1)
  const search = resolvedSearchParams.search?.trim() || ''
  const role = resolvedSearchParams.role || 'all'
  const status = resolvedSearchParams.status || 'all'

  // ✅ Handle success/error messages
  const successMessage = resolvedSearchParams.success
  const errorMessage = resolvedSearchParams.error
  const actionType = resolvedSearchParams.action

  try {
    // ✅ Fetch users data
    const usersData = await UsersService.getAll({
      page,
      search,
      role,
      status,
      limit: 10
    })

    // ✅ Calculate statistics
    const stats = {
      total: usersData.total,
      active: usersData.users.filter(u => u.isActive).length,
      inactive: usersData.users.filter(u => !u.isActive).length,
      admins: usersData.users.filter(u => u.role === 'ADMIN').length,
      operators: usersData.users.filter(u => u.role === 'OPERATOR').length,
      regularUsers: usersData.users.filter(u => u.role === 'USER').length,
    }

    return (
      <div className="space-y-6">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">
                {actionType === 'create' && 'User created successfully!'}
                {actionType === 'update' && 'User updated successfully!'}
                {actionType === 'delete' && 'User deleted successfully!'}
                {!actionType && successMessage}
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Complete CRUD operations for system users</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <a href="/admin/users/export">Export Users</a>
            </Button>
            <CreateUserDialog>
              <Button size="lg" className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add New User</span>
              </Button>
            </CreateUserDialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={stats.total}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Active Users"
            value={stats.active}
            icon={UserCheck}
            color="green"
          />
          <StatsCard
            title="Administrators"
            value={stats.admins}
            icon={Shield}
            color="purple"
          />
          <StatsCard
            title="Operators"
            value={stats.operators}
            icon={Users}
            color="orange"
          />
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Filters & Search</span>
              {(search || role !== 'all' || status !== 'all') && (
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {[search && 'Search', role !== 'all' && 'Role', status !== 'all' && 'Status']
                    .filter(Boolean).length} active
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UsersFilters />
          </CardContent>
        </Card>

        {/* Users Table Section */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Users Directory
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Showing {usersData.users.length} of {usersData.total}</span>
                <span>•</span>
                <span>Page {page} of {usersData.totalPages}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Suspense fallback={<UsersLoadingState />}>
              <UsersTable
                users={usersData.users}
                totalPages={usersData.totalPages}
                currentPage={page}
              />
            </Suspense>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{usersData.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {usersData.users.filter(u => u.isActive).length}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {usersData.users.filter(u => u.role === 'ADMIN').length}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading users:', error)
    
    return <ErrorState error={error} />
  }
}

// ✅ STATS CARD COMPONENT
function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string
  value: number
  icon: any
  color: string 
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          </div>
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ✅ LOADING STATE COMPONENT
function UsersLoadingState() {
  return (
    <div className="p-8">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        
        {/* User cards skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-6 border rounded-lg">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex space-x-4">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ✅ ERROR STATE COMPONENT
function ErrorState({ error }: { error: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
          <AlertCircle className="h-16 w-16 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h3>
        <p className="text-gray-600 mb-4">
          {error?.message || 'There was a problem loading the user data. Please try again.'}
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button asChild variant="outline">
            <a href="/admin/users">Reload Page</a>
          </Button>
          <Button asChild>
            <a href="/admin">Back to Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
