'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
    ChevronDown,
    MessageSquare,
    HelpCircle,
    Zap
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

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
    className?: string
}

export function OperatorHeader({ title, subtitle, user, className }: OperatorHeaderProps) {
    // ✅ FIX: Initialize as null to avoid hydration mismatch
    const [currentTime, setCurrentTime] = useState<Date | null>(null)
    const [isOnline, setIsOnline] = useState(true)
    const [notifications] = useState(2)
    const [searchQuery, setSearchQuery] = useState('')

    // ✅ FIX: Only set time on client side
    useEffect(() => {
        setCurrentTime(new Date())
        const timer = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

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

    const getUserInitials = (name?: string | null) => {
        if (!name) return 'OP'
        return name.split(' ').map(n => n[0]?.toUpperCase()).join('').slice(0, 2)
    }

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full border-b bg-gradient-to-r from-white via-slate-50/50 to-white backdrop-blur-xl shadow-sm",
            className
        )}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between gap-6">
                    {/* Left Section - Branding & Title */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                    TransitLK
                                </h1>
                                <p className="text-xs text-slate-500 font-medium">Operator Portal</p>
                            </div>
                        </div>

                        {(title || subtitle) && (
                            <>
                                <div className="h-8 w-px bg-slate-200 hidden lg:block" />
                                <div className="hidden lg:block">
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        {title || 'Dashboard'}
                                    </h2>
                                    {subtitle && (
                                        <p className="text-sm text-slate-600">{subtitle}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Center Section - Search */}
                    <div className="hidden md:flex flex-1 max-w-lg">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Search buses, routes, or drivers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 bg-slate-50/50 border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Section - Status & User */}
                    <div className="flex items-center gap-4">
                        {/* Status Indicators */}
                        <div className="hidden lg:flex items-center gap-4">
                            {/* Connection Status */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                                {isOnline ? (
                                    <>
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        <Wifi className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-700">Online</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-2 w-2 rounded-full bg-red-500" />
                                        <WifiOff className="h-4 w-4 text-red-600" />
                                        <span className="text-sm font-medium text-red-700">Offline</span>
                                    </>
                                )}
                            </div>

                            {/* System Status */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                                <Activity className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">All Systems</span>
                            </div>

                            {/* ✅ FIXED: Current Time - Only render on client */}
                            {currentTime && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                                    <Clock className="h-4 w-4 text-slate-600" />
                                    <div className="text-sm">
                                        <span className="font-mono font-medium text-slate-900" suppressHydrationWarning>
                                            {currentTime.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="relative p-2 hover:bg-slate-100 rounded-xl"
                        >
                            <Bell className="h-5 w-5 text-slate-600" />
                            {notifications > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500 border-2 border-white shadow-sm">
                                    {notifications}
                                </Badge>
                            )}
                        </Button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-semibold">
                                            {getUserInitials(user?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {user?.name || 'Operator'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {user?.role || 'Operator'}
                                        </p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-72 p-2 shadow-xl border-slate-200 bg-white/95 backdrop-blur-sm"
                            >
                                <div className="px-3 py-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                                                {getUserInitials(user?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">
                                                {user?.name || 'Operator User'}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {user?.email || 'operator@transitlk.com'}
                                            </p>
                                            <Badge variant="secondary" className="mt-1.5 text-xs">
                                                <Shield className="h-3 w-3 mr-1" />
                                                {user?.role || 'Operator'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-1">
                                    <DropdownMenuItem className="px-3 py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                        <User className="mr-3 h-4 w-4 text-slate-500" />
                                        <div>
                                            <p className="font-medium">Profile Settings</p>
                                            <p className="text-xs text-slate-500">Manage your account</p>
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className="px-3 py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                        <Bell className="mr-3 h-4 w-4 text-slate-500" />
                                        <div className="flex items-center justify-between w-full">
                                            <div>
                                                <p className="font-medium">Notifications</p>
                                                <p className="text-xs text-slate-500">Alerts and updates</p>
                                            </div>
                                            {notifications > 0 && (
                                                <Badge className="bg-red-500 text-white text-xs px-2">
                                                    {notifications}
                                                </Badge>
                                            )}
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className="px-3 py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                        <Settings className="mr-3 h-4 w-4 text-slate-500" />
                                        <div>
                                            <p className="font-medium">Settings</p>
                                            <p className="text-xs text-slate-500">System preferences</p>
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className="px-3 py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                        <MessageSquare className="mr-3 h-4 w-4 text-slate-500" />
                                        <div>
                                            <p className="font-medium">Support</p>
                                            <p className="text-xs text-slate-500">Get help and assistance</p>
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className="px-3 py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                        <HelpCircle className="mr-3 h-4 w-4 text-slate-500" />
                                        <div>
                                            <p className="font-medium">Documentation</p>
                                            <p className="text-xs text-slate-500">User guides and FAQs</p>
                                        </div>
                                    </DropdownMenuItem>
                                </div>

                                <DropdownMenuSeparator className="my-2" />

                                <DropdownMenuItem
                                    className="px-3 py-2.5 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    <div>
                                        <p className="font-medium">Sign Out</p>
                                        <p className="text-xs text-red-500">End your session</p>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search buses, routes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 bg-slate-50/50 border-slate-200 focus:border-blue-300"
                        />
                    </div>
                </div>

                {/* Mobile Status Bar */}
                <div className="lg:hidden mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-50 text-xs">
                            {isOnline ? (
                                <>
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-green-700 font-medium">Online</span>
                                </>
                            ) : (
                                <>
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span className="text-red-700 font-medium">Offline</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-50 text-xs">
                            <Activity className="h-3 w-3 text-green-600" />
                            <span className="text-green-700 font-medium">All Systems</span>
                        </div>
                    </div>
                    {/* ✅ FIXED: Mobile time */}
                    {currentTime && (
                        <div className="text-xs text-slate-600 font-mono" suppressHydrationWarning>
                            {currentTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
