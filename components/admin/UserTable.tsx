'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, Eye, User, Phone, Calendar, Save, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface User {
    id: string
    name: string | null
    email: string
    phoneNumber?: string | null
    role: string
    isActive: boolean
    createdAt: Date
    updatedAt?: Date
    _count: {
        bookings: number
        feedback: number
    }
}

interface UsersTableProps {
    users: User[]
    totalPages: number
    currentPage: number
}

export function UsersTable({ users, totalPages, currentPage }: UsersTableProps) {
    const [loading, setLoading] = useState<string | null>(null)
    const [editingUser, setEditingUser] = useState<string | null>(null)
    const [editData, setEditData] = useState<Partial<User>>({})
    const router = useRouter()

    // ✅ CRUD OPERATIONS

    // 🗑️ DELETE USER
    const handleDeleteUser = async (id: string, userName: string) => {
        if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) return

        setLoading(id)
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                router.push('/admin/users?success=User deleted successfully&action=delete')
                router.refresh()
            } else {
                const error = await response.json()
                alert(error.error || 'Failed to delete user')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Failed to delete user')
        } finally {
            setLoading(null)
        }
    }

    // ✏️ START EDIT
    const startEdit = (user: User) => {
        setEditingUser(user.id)
        setEditData({
            name: user.name || '',
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            role: user.role,
            isActive: user.isActive
        })
    }

    // 💾 SAVE EDIT
    const saveEdit = async (id: string) => {
        setLoading(id)
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            })

            if (response.ok) {
                setEditingUser(null)
                setEditData({})
                router.push('/admin/users?success=User updated successfully&action=update')
                router.refresh()
            } else {
                const error = await response.json()
                alert(error.error || 'Failed to update user')
            }
        } catch (error) {
            console.error('Error updating user:', error)
            alert('Failed to update user')
        } finally {
            setLoading(null)
        }
    }

    // ❌ CANCEL EDIT
    const cancelEdit = () => {
        setEditingUser(null)
        setEditData({})
    }

    // 🔄 TOGGLE STATUS
    const toggleUserStatus = async (id: string, currentStatus: boolean) => {
        setLoading(id)
        try {
            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            })

            if (response.ok) {
                router.refresh()
            } else {
                alert('Failed to update user status')
            }
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Failed to update user status')
        } finally {
            setLoading(null)
        }
    }

    // ✅ HELPER FUNCTIONS
    const getUserDisplayName = (user: User): string => {
        return user.name || 'Unnamed User'
    }

    const formatPhoneNumber = (phone: string | null | undefined): string => {
        return phone || 'Not provided'
    }

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getRoleBadgeColor = (role: string): string => {
        switch (role.toLowerCase()) {
            case 'admin': return 'bg-purple-100 text-purple-800'
            case 'operator': return 'bg-blue-100 text-blue-800'
            case 'user': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusBadgeColor = (isActive: boolean): string => {
        return isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
    }

    // ✅ EARLY RETURN: Handle empty state
    if (!users || users.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <User className="mx-auto h-16 w-16" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Users List */}
            <div className="space-y-3">
                {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>

            {/* Pagination */}
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    )

    // ✅ USER CARD COMPONENT
    function UserCard({ user }: { user: User }) {
        const isEditing = editingUser === user.id
        const isLoading = loading === user.id

        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">

                        {/* User Info Section */}
                        <div className="flex items-center space-x-4 flex-1">
                            <div className="bg-gray-100 rounded-full p-3">
                                <User className="h-6 w-6 text-gray-600" />
                            </div>

                            <div className="space-y-2 flex-1">
                                {isEditing ? (
                                    // ✏️ EDIT MODE
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-500">Name</label>
                                                <Input
                                                    value={editData.name || ''}
                                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                    placeholder="Enter name"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Email</label>
                                                <Input
                                                    value={editData.email || ''}
                                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                    placeholder="Enter email"
                                                    type="email"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Phone</label>
                                                <Input
                                                    value={editData.phoneNumber || ''}
                                                    onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                                                    placeholder="Enter phone"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Role</label>
                                                <select
                                                    value={editData.role || ''}
                                                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                                    className="w-full p-2 border rounded"
                                                    disabled={isLoading}
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="OPERATOR">Operator</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={editData.isActive || false}
                                                onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                                                disabled={isLoading}
                                            />
                                            <label className="text-sm">Active User</label>
                                        </div>
                                    </div>
                                ) : (
                                    // 👁️ VIEW MODE
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {getUserDisplayName(user)}
                                            </h3>
                                            <Badge className={getRoleBadgeColor(user.role)}>
                                                {user.role}
                                            </Badge>
                                            <Badge
                                                className={getStatusBadgeColor(user.isActive)}
                                                onClick={() => toggleUserStatus(user.id, user.isActive)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>

                                        <p className="text-gray-600 mb-1">{user.email}</p>

                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Phone className="h-4 w-4" />
                                                <span>{formatPhoneNumber(user.phoneNumber)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>Joined {formatDate(user.createdAt)}</span>
                                            </div>
                                        </div>

                                        <div className="mt-2 text-sm text-gray-500">
                                            {user._count.bookings} bookings • {user._count.feedback} reviews
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions Section */}
                        <div className="flex items-center space-x-2">
                            {isEditing ? (
                                // ✏️ EDIT ACTIONS
                                <div className="flex items-center space-x-2">
                                    <Button
                                        size="sm"
                                        onClick={() => saveEdit(user.id)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelEdit}
                                        disabled={isLoading}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                // 👁️ VIEW ACTIONS
                                <UserActionsMenu user={user} />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // ✅ USER ACTIONS MENU
    function UserActionsMenu({ user }: { user: User }) {
        const isLoading = loading === user.id

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MoreHorizontal className="h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => startEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleUserStatus(user.id, user.isActive)}>
                        <User className="mr-2 h-4 w-4" />
                        {user.isActive ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDeleteUser(user.id, getUserDisplayName(user))}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    // ✅ PAGINATION COMPONENT
    function PaginationControls({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
        return (
            <div className="flex items-center justify-between py-4 border-t bg-gray-50 px-6">
                <div className="text-sm text-gray-700">
                    Showing page {currentPage} of {totalPages} ({users.length} users)
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        asChild
                    >
                        <Link href={`?page=${currentPage - 1}`}>Previous</Link>
                    </Button>

                    <span className="text-sm text-gray-500 px-2">
                        {currentPage} / {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        asChild
                    >
                        <Link href={`?page=${currentPage + 1}`}>Next</Link>
                    </Button>
                </div>
            </div>
        )
    }
}
