/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { getSession } from 'next-auth/react'

// User type definition
export interface User {
  id: string
  name?: string | null
  email?: string | null
  role?: string
  image?: string | null
}

// Auto cleanup expired sessions
function autoCleanupExpiredSession(): void {
  if (typeof window !== 'undefined') {
    const expiry = localStorage.getItem('user_expiry')
    if (expiry) {
      const expirationTime = parseInt(expiry)
      const now = new Date().getTime()

      if (now > expirationTime) {
        console.log('🧹 Auto-cleaning expired session')
        removeUser() // Auto-cleanup expired session
      }
    }
  }
}

// SIMPLE: Check if user is logged in (works anywhere)
export function isUserLoggedIn(): boolean {
  // FIRST: Auto-cleanup expired sessions
  autoCleanupExpiredSession()

  // Then check localStorage for quick access
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    const session = localStorage.getItem('session_exists')
    return !!(user && session)
  }
  return false
}

// Get current user data
export function getCurrentUser(): User | null {
  // FIRST Auto-cleanup expired sessions
  autoCleanupExpiredSession()

  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
  return null
}

// Save user data after login
export function saveUser(userData: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('session_exists', 'true')

    //  Set 1-minute expiration
    const expirationTime = new Date().getTime() + (20 * 60 * 1000) // 20 minute
    localStorage.setItem('user_expiry', expirationTime.toString())

    console.log(' User saved to localStorage:', userData)
    console.log(' Session will expire at:', new Date(expirationTime).toLocaleTimeString())

    //  Set up automatic cleanup timer
    setupAutoCleanupTimer()
  }
}

//Set up timer to automatically remove user after expiration
function setupAutoCleanupTimer(): void {
  if (typeof window !== 'undefined') {
    const expiry = localStorage.getItem('user_expiry')
    if (expiry) {
      const expirationTime = parseInt(expiry)
      const now = new Date().getTime()
      const timeUntilExpiry = expirationTime - now

      if (timeUntilExpiry > 0) {
        console.log(`⏰ Setting up auto-cleanup timer for ${timeUntilExpiry}ms`)

        setTimeout(() => {
          console.log('🧹 Timer triggered - cleaning up expired session')
          if (isSessionExpired()) {
            // Session is expired, user data already removed
            console.log('Session cleaned up automatically')

            // Optional: Show toast notification
            if (typeof window !== 'undefined' && window.location.pathname !== '/auth/signin') {
              // You can add a toast here if needed
              console.log('ℹSession expired - user needs to sign in again')
            }
          }
        }, timeUntilExpiry)
      }
    }
  }
}

//Remove user data on logout
export function removeUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
    localStorage.removeItem('session_exists')
    localStorage.removeItem('user_expiry')
    localStorage.removeItem('returnTo') // Clear return URL too

    console.log('User removed from localStorage')
  }
}

//Check if user session is expired
export function isSessionExpired(): boolean {
  if (typeof window !== 'undefined') {
    const expiry = localStorage.getItem('user_expiry')
    if (!expiry) return true

    const expirationTime = parseInt(expiry)
    const now = new Date().getTime()

    if (now > expirationTime) {
      console.log('Session expired, removing user data')
      removeUser() // Auto-cleanup expired session
      return true
    }
  }
  return false
}

//Enhanced check with NextAuth session
export async function checkAuthStatus(): Promise<boolean> {
  try {
    //FIRST: Auto-cleanup expired sessions
    autoCleanupExpiredSession()

    // First check localStorage for quick response
    if (isUserLoggedIn() && !isSessionExpired()) {
      return true
    }

    // Then verify with NextAuth session
    const session = await getSession()

    if (session?.user) {
      // Update localStorage with fresh session data
      saveUser({
        id: session.user.id || session.user.email || '',
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any).role || 'USER',
        image: session.user.image
      })
      return true
    }

    // No valid session found
    removeUser()
    return false
  } catch (error) {
    console.error('Auth check failed:', error)
    return false
  }
}

//Get return URL for redirecting after login
export function getReturnUrl(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('returnTo') || '/dashboard'
  }
  return '/dashboard'
}

//Save return URL before redirecting to login
export function saveReturnUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('returnTo', url)
  }
}

//Clear return URL after successful login
export function clearReturnUrl(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('returnTo')
  }
}

//Debug function to see auth state
export function debugAuthState(): void {
  if (typeof window !== 'undefined') {
    const expiry = localStorage.getItem('user_expiry')
    const now = new Date().getTime()
    const timeLeft = expiry ? parseInt(expiry) - now : 0

    console.log('🔍 Auth Debug State:', {
      isLoggedIn: isUserLoggedIn(),
      user: getCurrentUser(),
      sessionExists: localStorage.getItem('session_exists'),
      expiry: expiry ? new Date(parseInt(expiry)).toLocaleTimeString() : null,
      timeLeftMs: timeLeft,
      timeLeftSeconds: Math.round(timeLeft / 1000),
      isExpired: isSessionExpired(),
      returnUrl: getReturnUrl()
    })
  }
}

//Force check session expiry (call this from components)
export function forceCheckExpiry(): boolean {
  autoCleanupExpiredSession()
  return !isUserLoggedIn()
}

//Initialize auto-cleanup on page load
if (typeof window !== 'undefined') {
  // Set up cleanup timer when module loads
  const expiry = localStorage.getItem('user_expiry')
  if (expiry) {
    setupAutoCleanupTimer()
  }
}
