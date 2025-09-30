'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    LayoutDashboard,
    Bus,
    Route,
    MapPin,
    Users,
    Calendar,
    BarChart3,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Navigation,
    Clock,
    AlertTriangle,
    UserCheck,
    Map
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OperatorSidebarProps {
    className?: string
}

export function OperatorSidebar({ className }: OperatorSidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    // ✅ NAVIGATION MENU ITEMS
    const navigationItems = [
        {
            title: 'Overview',
            href: '/operator',
            icon: LayoutDashboard,
            badge: null,
        },
        {
            title: 'Fleet Management',
            href: '/operator/buses',
            icon: Bus,
            badge: '12 Active',
        },
        {
            title: 'Routes & Schedules',
            href: '/operator/routes',
            icon: Route,
            badge: null,
        },
        {
            title: 'Live Tracking',
            href: '/operator/tracking',
            icon: Map,
            badge: 'Live',
        },
        {
            title: 'Drivers',
            href: '/operator/drivers',
            icon: UserCheck,
            badge: null,
        },
        {
            title: 'Bookings',
            href: '/operator/bookings',
            icon: Calendar,
            badge: '24 Today',
        },
        {
            title: 'Passengers',
            href: '/operator/passengers',
            icon: Users,
            badge: null,
        },
        {
            title: 'Stops',
            href: '/operator/stops',
            icon: MapPin,
            badge: null,
        }
    ]

    const secondaryItems = [
        {
            title: 'Analytics',
            href: '/operator/analytics',
            icon: BarChart3,
            badge: null,
        },
        {
            title: 'Reports',
            href: '/operator/reports',
            icon: Clock,
            badge: null,
        },
        {
            title: 'Alerts',
            href: '/operator/alerts',
            icon: AlertTriangle,
            badge: '3 New',
        }
    ]

    const bottomItems = [
        {
            title: 'Settings',
            href: '/operator/settings',
            icon: Settings,
            badge: null,
        },
        {
            title: 'Help & Support',
            href: '/operator/help',
            icon: HelpCircle,
            badge: null,
        }
    ]

    const isActive = (href: string) => {
        if (href === '/operator') {
            return pathname === '/operator'
        }
        return pathname.startsWith(href)
    }

    return (
        <div className={cn(
            "bg-white border-r border-gray-200 transition-all duration-300",
            collapsed ? "w-16" : "w-64",
            "flex flex-col h-full",
            className
        )}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center space-x-2">
                            <div className="bg-blue-600 rounded-lg p-2">
                                <Bus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900">TransitLK</h1>
                                <p className="text-xs text-gray-500">Operator Panel</p>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCollapsed(!collapsed)}
                        className="h-8 w-8 p-0"
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Operator Info */}
            {!collapsed && (
                <div className="p-4 bg-blue-50 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                            <Navigation className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">ABC Transport</p>
                            <p className="text-sm text-gray-600">License: OP-2024-001</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                {/* Primary Navigation */}
                <nav className="space-y-1 px-2">
                    {!collapsed && (
                        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Main Menu
                        </p>
                    )}
                    {navigationItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            item={item}
                            isActive={isActive(item.href)}
                            collapsed={collapsed}
                        />
                    ))}
                </nav>

                {/* Secondary Navigation */}
                <nav className="space-y-1 px-2 mt-6">
                    {!collapsed && (
                        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Insights
                        </p>
                    )}
                    {secondaryItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            item={item}
                            isActive={isActive(item.href)}
                            collapsed={collapsed}
                        />
                    ))}
                </nav>
            </div>

            {/* Bottom Navigation */}
            <div className="border-t border-gray-200 p-2">
                {bottomItems.map((item) => (
                    <SidebarItem
                        key={item.href}
                        item={item}
                        isActive={isActive(item.href)}
                        collapsed={collapsed}
                    />
                ))}
            </div>

            {/* Collapse Footer */}
            {collapsed && (
                <div className="p-2 border-t border-gray-200">
                    <div className="bg-blue-600 rounded-lg p-2">
                        <Bus className="h-6 w-6 text-white mx-auto" />
                    </div>
                </div>
            )}
        </div>
    )
}

// ✅ SIDEBAR ITEM COMPONENT
interface SidebarItemProps {
    item: {
        title: string
        href: string
        icon: any
        badge: string | null
    }
    isActive: boolean
    collapsed: boolean
}

function SidebarItem({ item, isActive, collapsed }: SidebarItemProps) {
    const { title, href, icon: Icon, badge } = item

    return (
        <Link href={href} className="block">
            <div className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                collapsed ? "justify-center" : "justify-between"
            )}>
                <div className="flex items-center space-x-3">
                    <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-blue-600" : "text-gray-500")} />
                    {!collapsed && <span>{title}</span>}
                </div>

                {!collapsed && badge && (
                    <Badge variant="secondary" className={cn(
                        "text-xs",
                        isActive ? "bg-blue-200 text-blue-800" : "bg-gray-200 text-gray-600",
                        badge === 'Live' && "bg-green-100 text-green-700 animate-pulse",
                        badge.includes('New') && "bg-red-100 text-red-700"
                    )}>
                        {badge}
                    </Badge>
                )}
            </div>
        </Link>
    )
}
