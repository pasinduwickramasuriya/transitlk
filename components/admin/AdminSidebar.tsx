'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Bus, 
  Route, 
  Calendar, 
  CreditCard,
  MapPin,
  Smartphone,  // Changed from Device to Smartphone
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Operators', href: '/admin/operators', icon: Building2 },
  { name: 'Buses', href: '/admin/buses', icon: Bus },
  { name: 'Routes', href: '/admin/routes', icon: Route },
  { name: 'Schedules', href: '/admin/schedules', icon: Calendar },
  { name: 'Devices', href: '/admin/devices', icon: Smartphone }, // Fixed icon
  { name: 'Bookings', href: '/admin/bookings', icon: CreditCard },
  { name: 'Live Tracking', href: '/admin/tracking', icon: MapPin },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Link href="/admin" className="flex items-center space-x-2">
            <Bus className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">TransitLK Admin</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-6 w-6 shrink-0 mr-3" />
                Sign out
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
