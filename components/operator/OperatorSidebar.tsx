/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import {
    LayoutDashboard,
    Bus,
    Route,
    Calendar,
    BarChart3,
    Navigation,
    AlertTriangle,
    Map,
    DollarSign
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
            badge: 'Active',
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
            title: 'Fare',
            href: '/operator/fare ',
            icon: DollarSign,
            badge: null,
        },
        {
            title: 'Notifications',
            href: '/operator/notifications ',
            icon: AlertTriangle,
            badge: null,
        },
        {
            title: 'Bookings',
            href: '/operator/bookings',
            icon: Calendar,
            badge: 'live',
        },

    ]

    const secondaryItems = [
        {
            title: 'Analytics',
            href: '/operator/analytics',
            icon: BarChart3,
            badge: null,
        },
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

            {/* Operator Info */}
            {!collapsed && (
                <div className="p-4 bg-blue-50 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                            <Navigation className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">TransitLK</p>

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
