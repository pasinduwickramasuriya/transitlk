// 'use client'

// import { useState, useEffect } from 'react'
// import { signOut } from 'next-auth/react'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import {
//     Bell,
//     Search,
//     User,
//     Settings,
//     LogOut,
//     Shield,
//     Wifi,
//     WifiOff,
//     Activity,
//     Clock,
//     MapPin,
//     Users,
//     Bus
// } from 'lucide-react'
// import { Input } from '@/components/ui/input'

// // ✅ FIXED: Add user prop to interface
// interface OperatorHeaderProps {
//     title?: string
//     subtitle?: string
//     user?: {
//         id: string
//         name?: string | null
//         email?: string | null
//         role: string
//         image?: string | null
//     }
// }

// export function OperatorHeader({ title, subtitle, user }: OperatorHeaderProps) {
//     const [currentTime, setCurrentTime] = useState(new Date())
//     const [isOnline, setIsOnline] = useState(true)
//     const [notifications, setNotifications] = useState(3)

//     // ✅ Update time every minute
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentTime(new Date())
//         }, 60000)

//         return () => clearInterval(timer)
//     }, [])

//     // ✅ Check online status
//     useEffect(() => {
//         const handleOnline = () => setIsOnline(true)
//         const handleOffline = () => setIsOnline(false)

//         window.addEventListener('online', handleOnline)
//         window.addEventListener('offline', handleOffline)

//         return () => {
//             window.removeEventListener('online', handleOnline)
//             window.removeEventListener('offline', handleOffline)
//         }
//     }, [])

//     const formatTime = (date: Date) => {
//         return date.toLocaleTimeString('en-US', {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true
//         })
//     }

//     const formatDate = (date: Date) => {
//         return date.toLocaleDateString('en-US', {
//             weekday: 'short',
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric'
//         })
//     }

//     return (
//         <header className="bg-white border-b border-gray-200 px-6 py-4">
//             <div className="flex items-center justify-between">
//                 {/* Left Section - Title & Breadcrumb */}
//                 <div className="flex items-center space-x-4">
//                     <div>
//                         {title ? (
//                             <div>
//                                 <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
//                                 {subtitle && (
//                                     <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
//                                 )}
//                             </div>
//                         ) : (
//                             <div>
//                                 <h1 className="text-2xl font-bold text-gray-900">Operator Dashboard</h1>
//                                 <p className="text-sm text-gray-600 mt-1">Manage your fleet and operations</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Center Section - Search */}
//                 <div className="hidden md:flex flex-1 max-w-md mx-8">
//                     <div className="relative w-full">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                         <Input
//                             type="search"
//                             placeholder="Search buses, routes, drivers..."
//                             className="pl-10 w-full"
//                         />
//                     </div>
//                 </div>

//                 {/* Right Section - Status & User Menu */}
//                 <div className="flex items-center space-x-4">
//                     {/* Live Status Indicators */}
//                     <div className="hidden lg:flex items-center space-x-4 text-sm">
//                         {/* Online Status */}
//                         <div className="flex items-center space-x-2">
//                             {isOnline ? (
//                                 <Wifi className="h-4 w-4 text-green-600" />
//                             ) : (
//                                 <WifiOff className="h-4 w-4 text-red-600" />
//                             )}
//                             <span className={isOnline ? "text-green-600" : "text-red-600"}>
//                                 {isOnline ? "Online" : "Offline"}
//                             </span>
//                         </div>

//                         {/* System Status */}
//                         <div className="flex items-center space-x-2 text-green-600">
//                             <Activity className="h-4 w-4" />
//                             <span>All Systems Active</span>
//                         </div>

//                         {/* Current Time */}
//                         <div className="flex items-center space-x-2 text-gray-600">
//                             <Clock className="h-4 w-4" />
//                             <div className="text-right">
//                                 <div className="font-medium">{formatTime(currentTime)}</div>
//                                 <div className="text-xs">{formatDate(currentTime)}</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Quick Stats */}
//                     <div className="hidden xl:flex items-center space-x-4">
//                         <QuickStatItem icon={Bus} label="Active Buses" value="12" color="text-blue-600" />
//                         <QuickStatItem icon={Users} label="Passengers" value="89" color="text-green-600" />
//                         <QuickStatItem icon={MapPin} label="Routes" value="8" color="text-orange-600" />
//                     </div>

//                     {/* Notifications */}
//                     <Button variant="ghost" size="sm" className="relative">
//                         <Bell className="h-5 w-5" />
//                         {notifications > 0 && (
//                             <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
//                                 {notifications}
//                             </Badge>
//                         )}
//                     </Button>

//                     {/* User Menu */}
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="sm" className="flex items-center space-x-2">
//                                 <div className="bg-blue-100 rounded-full p-2">
//                                     <User className="h-4 w-4 text-blue-600" />
//                                 </div>
//                                 <div className="hidden md:block text-left">
//                                     <p className="font-medium text-sm">
//                                         {user?.name || 'Operator'}
//                                     </p>
//                                     <p className="text-xs text-gray-500">ABC Transport</p>
//                                 </div>
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-56">
//                             <div className="px-2 py-1.5">
//                                 <p className="font-medium">{user?.name || 'Operator User'}</p>
//                                 <p className="text-sm text-gray-500">{user?.email || 'operator@example.com'}</p>
//                                 <Badge variant="secondary" className="mt-1">
//                                     <Shield className="h-3 w-3 mr-1" />
//                                     {user?.role || 'Operator'}
//                                 </Badge>
//                             </div>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem>
//                                 <User className="mr-2 h-4 w-4" />
//                                 Profile Settings
//                             </DropdownMenuItem>
//                             <DropdownMenuItem>
//                                 <Settings className="mr-2 h-4 w-4" />
//                                 Account Settings
//                             </DropdownMenuItem>
//                             <DropdownMenuItem>
//                                 <Bell className="mr-2 h-4 w-4" />
//                                 Notifications ({notifications})
//                             </DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                                 className="text-red-600 cursor-pointer"
//                                 onClick={() => signOut({ callbackUrl: '/' })}
//                             >
//                                 <LogOut className="mr-2 h-4 w-4" />
//                                 Sign Out
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             </div>

//             {/* Mobile Search */}
//             <div className="md:hidden mt-4">
//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                     <Input
//                         type="search"
//                         placeholder="Search..."
//                         className="pl-10 w-full"
//                     />
//                 </div>
//             </div>
//         </header>
//     )
// }

// // ✅ QUICK STAT ITEM COMPONENT (unchanged)
// interface QuickStatItemProps {
//     icon: any
//     label: string
//     value: string
//     color: string
// }

// function QuickStatItem({ icon: Icon, label, value, color }: QuickStatItemProps) {
//     return (
//         <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
//             <Icon className={`h-5 w-5 ${color}`} />
//             <div>
//                 <p className="text-sm font-medium">{value}</p>
//                 <p className="text-xs text-gray-500">{label}</p>
//             </div>
//         </div>
//     )
// }







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
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isOnline, setIsOnline] = useState(true)
    const [notifications] = useState(2)
    const [searchQuery, setSearchQuery] = useState('')

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    // Monitor online status
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
            "sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl shadow-sm",
            className
        )}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between gap-6">
                    {/* Left Section - Branding & Title */}
                    <div className="flex items-center gap-6">
                        {/* Brand */}
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

                        {/* Page Title */}
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

                            {/* Current Time */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                                <Clock className="h-4 w-4 text-slate-600" />
                                <div className="text-sm">
                                    <span className="font-mono font-medium text-slate-900">
                                        {currentTime.toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit',
                                            hour12: true 
                                        })}
                                    </span>
                                </div>
                            </div>
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
                                {/* User Info */}
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

                                {/* Menu Items */}
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

                                {/* Sign Out */}
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
                    <div className="text-xs text-slate-600 font-mono">
                        {currentTime.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                        })}
                    </div>
                </div>
            </div>
        </header>
    )
}
