
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Plus, User, Mail, Phone, Shield, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface CreateUserDialogProps {
    children: React.ReactNode
}

export function CreateUserDialog({ children }: CreateUserDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // ✅ REAL DATABASE INTEGRATION
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const formData = new FormData(e.currentTarget)
            const userData = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                phoneNumber: formData.get('phone') as string, // ✅ Match API field name
                role: formData.get('role') as string,
                password: formData.get('password') as string,
            }

            // ✅ Validate data before sending
            if (!userData.name || !userData.email || !userData.role || !userData.password) {
                throw new Error('Please fill in all required fields')
            }

            // ✅ Call your actual API endpoint
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create user')
            }

            // ✅ Success! Close dialog and refresh
            console.log('✅ User created successfully:', result)
            setOpen(false)

            // ✅ Refresh the page to show new user
            router.refresh()

            // ✅ Optional: Show success message
            window.location.href = '/admin/users?success=User created successfully&action=create'

        } catch (error: any) {
            console.error('❌ Error creating user:', error)
            setError(error.message || 'Failed to create user')
        } finally {
            setLoading(false)
        }
    }

    // ✅ IMPROVED: Better trigger handling
    if (!open) {
        return (
            <div onClick={() => setOpen(true)} className="cursor-pointer">
                {children}
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
                        <p className="text-sm text-gray-600">Add a new user to the TransitLK system</p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
                        disabled={loading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                            <p className="text-red-800 text-sm font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                <User className="inline h-4 w-4 mr-1" />
                                Full Name *
                            </label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                placeholder="Enter full name"
                                className="w-full"
                                disabled={loading}
                                autoComplete="name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                <Mail className="inline h-4 w-4 mr-1" />
                                Email Address *
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="Enter email address"
                                className="w-full"
                                disabled={loading}
                                autoComplete="email"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                <Phone className="inline h-4 w-4 mr-1" />
                                Phone Number
                            </label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+94712345678"
                                className="w-full"
                                disabled={loading}
                                autoComplete="tel"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                                <Shield className="inline h-4 w-4 mr-1" />
                                Role *
                            </label>
                            <select
                                id="role"
                                name="role"
                                required
                                disabled={loading}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select role</option>
                                <option value="USER">User</option>
                                <option value="OPERATOR">Operator</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password *
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Enter password (min 6 characters)"
                                className="w-full"
                                disabled={loading}
                                autoComplete="new-password"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Password must be at least 6 characters long
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="min-w-[80px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex items-center min-w-[120px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create User
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
