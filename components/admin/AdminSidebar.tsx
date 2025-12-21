'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  LogOut, 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-slate-200 bg-white">
      
      {/* 1. Header / Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="font-bold text-slate-900">TransitLK</span>
        </Link>
      </div>

      {/* 2. Navigation Links */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#1ebcf1]/10 text-[#1ebcf1]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-[#1ebcf1]" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* 3. Footer / Sign Out */}
        <div className="mt-auto border-t border-slate-100 pt-4">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}