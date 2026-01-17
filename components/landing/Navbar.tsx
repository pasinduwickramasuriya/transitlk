'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Navigation,
  Menu,
  X,
  Sparkles,
  Zap,
  User,
  Home,
  Settings,
  MapPin,
  Activity,
  LogOut
} from 'lucide-react'

import { isUserLoggedIn, getCurrentUser, removeUser } from '@/utils/auth'

interface User {
  id: string
  name?: string | null
  email?: string | null
  role?: string
  image?: string | null
}

export function Navbar() {
  const pathname = usePathname() // Get current route
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    function syncUserState() {
      setLoggedIn(isUserLoggedIn())
      setUser(getCurrentUser())
    }
    syncUserState()
    window.addEventListener('storage', syncUserState)
    const interval = setInterval(syncUserState, 5000)
    return () => {
      window.removeEventListener('storage', syncUserState)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Services', href: '/booking', icon: Settings },
    { name: 'Live Map', href: '/tracking', icon: MapPin },
    { name: 'Analytics', href: '/analytics', icon: Activity }
  ]

  // Helper function to check if nav item is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    // 1. Clear local storage first
    removeUser()
    setLoggedIn(false)
    setUser(null)

    // 2. Clear NextAuth session (this handles redirect)
    await signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
      ? 'bg-white/80 backdrop-blur-xl border-b border-rose-200/30 shadow-xl shadow-rose-500/5'
      : 'bg-gradient-to-r from-rose-50/50 via-blue-50/50 to-violet-50/50 backdrop-blur-md border-b border-white/20'
      }`}>
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">
          {/* Logo */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Link href="/" className="flex-shrink-0 flex items-center group cursor-pointer">
              <div className="relative">
                <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-br from-rose-400 via-pink-500 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all duration-500 group-hover:scale-110">
                  <Navigation className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-white" />
                </div>
                <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-3 sm:w-4 h-3 sm:h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse">
                  <Sparkles className="h-2 sm:h-3 w-2 sm:w-3 text-white m-0.5" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-violet-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
              <div className="ml-2 sm:ml-3 md:ml-4 min-w-0">
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black bg-gradient-to-r from-violet-600 via-rose-600 to-pink-600 bg-clip-text text-transparent truncate block">
                  TransitLK
                </span>
                <div className="text-xs sm:text-xs font-semibold text-slate-500 -mt-0.5 sm:-mt-1 truncate">
                  Smart Transit
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1 xl:space-x-2">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center px-3 xl:px-5 py-2 xl:py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${isActive(item.href)
                    ? 'bg-gradient-to-r from-rose-100 via-pink-100 to-violet-100 text-violet-700 shadow-lg'
                    : 'text-slate-600 hover:text-rose-600 hover:bg-white/60'
                    }`}
                >
                  <item.icon className={`h-4 w-4 mr-1 xl:mr-2 transition-transform duration-300 group-hover:scale-110 ${isActive(item.href) ? 'text-rose-500' : 'text-slate-400 group-hover:text-rose-500'
                    }`} />
                  <span className="whitespace-nowrap">{item.name}</span>
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-rose-400 to-violet-400 rounded-full"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 to-violet-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
            {loggedIn ? (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="flex items-center px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-rose-100"
                >
                  <Link href="/dashboard/profile" className="flex items-center">
                    <User className="h-5 w-5 text-rose-600 mr-2" />
                    <span>{user?.name || user?.email || 'Profile'}</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-800 px-3 py-2 rounded-xl"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="hidden md:flex items-center px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl lg:rounded-2xl text-slate-600 hover:text-rose-600 hover:bg-white/60 font-semibold transition-all duration-300 border border-transparent hover:border-rose-200/50 text-sm"
                >
                  <Link href="/auth/signin" className="flex items-center">
                    <User className="h-4 w-4 mr-1 lg:mr-2" />
                    <span className="whitespace-nowrap">Sign In</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="group relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white px-3 xs:px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs xs:text-sm"
                >
                  <Link href="/auth/signup" className="flex items-center">
                    <Zap className="h-3 xs:h-4 w-3 xs:w-4 mr-1 xs:mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="whitespace-nowrap">Get Started</span>
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-sm border border-rose-200/50 shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 sm:h-5 w-4 sm:w-5 text-slate-600" />
              ) : (
                <Menu className="h-4 sm:h-5 w-4 sm:w-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-rose-200/30 shadow-2xl">
            <div className="p-4 sm:p-6 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group flex items-center px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 ${isActive(item.href)
                    ? 'bg-gradient-to-r from-rose-100 to-violet-100 text-violet-700 shadow-lg'
                    : 'text-slate-600 hover:text-rose-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50'
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 transition-all duration-300 ${isActive(item.href)
                    ? 'bg-gradient-to-br from-rose-400 to-violet-500 shadow-lg'
                    : 'bg-slate-100 group-hover:bg-gradient-to-br group-hover:from-rose-300 group-hover:to-pink-400'
                    }`}>
                    <item.icon
                      className={`h-4 sm:h-5 w-4 sm:w-5 ${isActive(item.href) ? 'text-white' : 'text-slate-500 group-hover:text-white'
                        }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-semibold truncate">{item.name}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {item.name === 'Home' && 'Dashboard & Overview'}
                      {item.name === 'Services' && 'All Transit Services'}
                      {item.name === 'Live Map' && 'Real-time Tracking'}
                      {item.name === 'Analytics' && 'Data & Insights'}
                    </div>
                  </div>
                  {isActive(item.href) && (
                    <div className="w-2 h-2 bg-gradient-to-br from-rose-400 to-violet-400 rounded-full animate-pulse flex-shrink-0"></div>
                  )}
                </Link>
              ))}

              {/* Auth Buttons on Mobile */}
              <div className="pt-4 sm:pt-6 border-t border-rose-200/30 space-y-3">
                {loggedIn ? (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full border-2 border-rose-200/50 hover:border-rose-300 text-slate-600 hover:text-rose-600 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 font-semibold text-sm sm:text-base"
                    >
                      <Link href="/dashboard/profile" className="flex items-center justify-center">
                        <User className="h-4 w-4 mr-2" />
                        <span className="whitespace-nowrap">{user?.name || 'My Profile'}</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-red-200 hover:border-red-300 text-red-600 hover:text-red-800 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 font-semibold text-sm sm:text-base"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="whitespace-nowrap">Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full border-2 border-rose-200/50 hover:border-rose-300 text-slate-600 hover:text-rose-600 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 font-semibold text-sm sm:text-base"
                    >
                      <Link href="/auth/signin" className="flex items-center justify-center">
                        <User className="h-4 w-4 mr-2" />
                        <span className="whitespace-nowrap">Sign In to Account</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white rounded-xl sm:rounded-2xl py-2.5 sm:py-3 font-bold shadow-lg text-sm sm:text-base"
                    >
                      <Link href="/auth/signup" className="flex items-center justify-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        <span className="whitespace-nowrap">Create New Account</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
