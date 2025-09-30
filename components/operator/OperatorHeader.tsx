'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Bell,
    Search,
    User,
    Settings,
    LogOut,
    Shield,
    Wifi,
    WifiOff,
    Activity,
    Clock,
    MapPin,
    Users,
    Bus
} from 'lucide-react'
import { Input } from '@/components/ui/input'

// ✅ FIXED: Add user prop to interface
interface OperatorHeaderProps {
    title?: string
    subtitle?: string
    user?: {
        id: string
        name?: string | null
        email?: string | null
        role: string
        image?: string | null
    }
}

export function OperatorHeader({ title, subtitle, user }: OperatorHeaderProps) {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isOnline, setIsOnline] = useState(true)
    const [notifications, setNotifications] = useState(3)

    // ✅ Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        return () => clearInterval(timer)
    }, [])

    // ✅ Check online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left Section - Title & Breadcrumb */}
                <div className="flex items-center space-x-4">
                    <div>
                        {title ? (
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                                {subtitle && (
                                    <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Operator Dashboard</h1>
                                <p className="text-sm text-gray-600 mt-1">Manage your fleet and operations</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Center Section - Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="search"
                            placeholder="Search buses, routes, drivers..."
                            className="pl-10 w-full"
                        />
                    </div>
                </div>

                {/* Right Section - Status & User Menu */}
                <div className="flex items-center space-x-4">
                    {/* Live Status Indicators */}
                    <div className="hidden lg:flex items-center space-x-4 text-sm">
                        {/* Online Status */}
                        <div className="flex items-center space-x-2">
                            {isOnline ? (
                                <Wifi className="h-4 w-4 text-green-600" />
                            ) : (
                                <WifiOff className="h-4 w-4 text-red-600" />
                            )}
                            <span className={isOnline ? "text-green-600" : "text-red-600"}>
                                {isOnline ? "Online" : "Offline"}
                            </span>
                        </div>

                        {/* System Status */}
                        <div className="flex items-center space-x-2 text-green-600">
                            <Activity className="h-4 w-4" />
                            <span>All Systems Active</span>
                        </div>

                        {/* Current Time */}
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <div className="text-right">
                                <div className="font-medium">{formatTime(currentTime)}</div>
                                <div className="text-xs">{formatDate(currentTime)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="hidden xl:flex items-center space-x-4">
                        <QuickStatItem icon={Bus} label="Active Buses" value="12" color="text-blue-600" />
                        <QuickStatItem icon={Users} label="Passengers" value="89" color="text-green-600" />
                        <QuickStatItem icon={MapPin} label="Routes" value="8" color="text-orange-600" />
                    </div>

                    {/* Notifications */}
                    <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-5 w-5" />
                        {notifications > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                                {notifications}
                            </Badge>
                        )}
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                                <div className="bg-blue-100 rounded-full p-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="font-medium text-sm">
                                        {user?.name || 'Operator'}
                                    </p>
                                    <p className="text-xs text-gray-500">ABC Transport</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="px-2 py-1.5">
                                <p className="font-medium">{user?.name || 'Operator User'}</p>
                                <p className="text-sm text-gray-500">{user?.email || 'operator@example.com'}</p>
                                <Badge variant="secondary" className="mt-1">
                                    <Shield className="h-3 w-3 mr-1" />
                                    {user?.role || 'Operator'}
                                </Badge>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Account Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications ({notifications})
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden mt-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 w-full"
                    />
                </div>
            </div>
        </header>
    )
}

// ✅ QUICK STAT ITEM COMPONENT (unchanged)
interface QuickStatItemProps {
    icon: any
    label: string
    value: string
    color: string
}

function QuickStatItem({ icon: Icon, label, value, color }: QuickStatItemProps) {
    return (
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <div>
                <p className="text-sm font-medium">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    )
}
