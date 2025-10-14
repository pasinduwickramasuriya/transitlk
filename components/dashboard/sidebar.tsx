

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Calendar, 
  MapPin, 
  User, 
  LogOut 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Bus Tracking', href: '/dashboard/tracking', icon: MapPin },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <>
      {/* Profile icon button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-gray-200 shadow hover:shadow-lg focus:ring-2 focus:ring-rose-400 transition"
          aria-label="Open profile menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <User className="w-6 h-6 text-rose-600" />
        </Button>
      </div>

      {/* Sidebar modal drawer */}
      <div 
        ref={sidebarRef}
        className={cn(
          "fixed top-14 left-4 w-64 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-rose-200 z-40 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex flex-col py-6 space-y-1">
          {navigation.map(({ name, href, icon }) => {
            const active = pathname === href
            return (
              <Link 
                key={name} 
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-5 py-3 rounded-lg space-x-3 transition-colors font-semibold text-sm",
                  active 
                    ? "bg-gradient-to-r from-rose-100 to-violet-100 text-rose-700 shadow-md" 
                    : "hover:bg-rose-50 hover:text-rose-600 text-gray-600"
                )}
              >
                {/* {icon({ className: `w-5 h-5 ${active ? 'text-rose-600' : 'text-gray-400'}` })} */}
                
                <span>{name}</span>
              </Link>
            )
          })}
          <div className="mt-4 border-t border-rose-200 pt-4 px-5">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold"
              onClick={() => {
                setIsOpen(false)
                // Add logout logic here if any
              }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Background overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
