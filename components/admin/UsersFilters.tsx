
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, X, Filter } from 'lucide-react'

export function UsersFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentSearch = searchParams.get('search') || ''
    const currentRole = searchParams.get('role') || 'all'
    const currentStatus = searchParams.get('status') || 'all'

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== 'all') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.delete('page') // Reset to first page when filtering
        router.push(`?${params.toString()}`)
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const search = formData.get('search') as string
        handleFilter('search', search)
    }

    const clearFilters = () => {
        router.push('/admin/users')
    }

    const hasActiveFilters = currentSearch || currentRole !== 'all' || currentStatus !== 'all'

    return (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            name="search"
                            placeholder="Search users by name or email..."
                            className="pl-10"
                            defaultValue={currentSearch}
                        />
                    </div>
                    <Button type="submit" size="sm">
                        Search
                    </Button>
                </form>

                {/* Filters */}
                <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />

                    {/* Role Filter */}
                    <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">Role:</span>
                        <div className="flex space-x-1">
                            {['all', 'user', 'operator', 'admin'].map((role) => (
                                <Button
                                    key={role}
                                    variant={currentRole === role ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleFilter('role', role)}
                                    className="capitalize"
                                >
                                    {role === 'all' ? 'All' : role}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">Status:</span>
                        <div className="flex space-x-1">
                            {['all', 'active', 'inactive'].map((status) => (
                                <Button
                                    key={status}
                                    variant={currentStatus === status ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleFilter('status', status)}
                                    className="capitalize"
                                >
                                    {status === 'all' ? 'All' : status}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-3 flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Active filters:</span>
                    {currentSearch && (
                        <Badge variant="secondary">
                            Search: {currentSearch}
                            <button
                                onClick={() => handleFilter('search', '')}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {currentRole !== 'all' && (
                        <Badge variant="secondary">
                            Role: {currentRole}
                            <button
                                onClick={() => handleFilter('role', 'all')}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {currentStatus !== 'all' && (
                        <Badge variant="secondary">
                            Status: {currentStatus}
                            <button
                                onClick={() => handleFilter('status', 'all')}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    )
}

