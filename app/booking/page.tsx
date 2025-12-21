/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { BookingLayout } from '@/components/booking/BookingLayout'
import { SearchForm } from '@/components/booking/SearchForm'
import { RouteSelection } from '@/components/booking/RouteSelection'
import { RouteData, ScheduleData, FareData, SelectedBusData } from '@/types/booking'
import { ProgressIndicator } from '@/components/booking/ProgressIndicater'
import { TicketConfirmation } from '@/components/booking/TicketConfirmation'
import { PaymentProcess } from '@/components/booking/PaymentProcess'
import { SeatSelection } from '@/components/booking/SeatSelection'
import { isUserLoggedIn, saveReturnUrl, getCurrentUser, forceCheckExpiry } from '@/utils/auth'
import { Navbar } from '@/components/landing/Navbar'


const BOOKING_STEPS = ['Search Routes', 'Select Bus', 'Choose Seats', 'Secure Payment', 'Get Ticket']


export default function BookTicketsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Client-side hydration fix
  const [isClient, setIsClient] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  //  Session monitoring
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(0)

  //    Check for login success from URL params
  const loginSuccess = searchParams?.get('loginSuccess') === 'true'
  const fromBooking = searchParams?.get('from') === 'booking'

  // State Management
  const [currentStep, setCurrentStep] = useState(0)
  const [searchLoading, setSearchLoading] = useState(false)

  // Search Data State
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Booking State
  const [availableRoutes, setAvailableRoutes] = useState<RouteData[]>([])
  const [selectedBus, setSelectedBus] = useState<SelectedBusData | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [bookingData, setBookingData] = useState<any>(null)

  //   Function to update auth state
  const updateAuthState = useCallback(() => {
    const loggedIn = isUserLoggedIn()
    const user = getCurrentUser()

    setUserLoggedIn(loggedIn)
    setCurrentUser(user)

    //    Calculate time left
    if (typeof window !== 'undefined') {
      const expiry = localStorage.getItem('user_expiry')
      if (expiry) {
        const expirationTime = parseInt(expiry)
        const now = new Date().getTime()
        const timeLeft = Math.max(0, expirationTime - now)
        setSessionTimeLeft(timeLeft)
      } else {
        setSessionTimeLeft(0)
      }
    }

    return loggedIn
  }, [])

  //    Client-side auth check (fixes hydration)
  useEffect(() => {
    setIsClient(true)
    updateAuthState()
    console.log('📍 Client-side auth check initialized')
  }, [updateAuthState])

  //    Session monitoring - check every second
  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      //    Force check for expiry
      const wasLoggedOut = forceCheckExpiry()

      if (wasLoggedOut && userLoggedIn) {
        //    User was just logged out due to expiry
        console.log('🔒 Session expired - logging user out')
        setUserLoggedIn(false)
        setCurrentUser(null)
        setSessionTimeLeft(0)

        toast.error('Session expired', {
          description: 'Please sign in again to continue booking.'
        })

        //    If user is in the middle of booking, save their progress
        if (currentStep > 0) {
          toast.info('Your booking progress has been saved', {
            description: 'Sign in again to continue from where you left off.'
          })
        }
      } else {
        //    Update auth state and time left
        updateAuthState()
      }
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [isClient, userLoggedIn, currentStep, updateAuthState])

  //    Handle returning from login
  useEffect(() => {
    // Only run if we're on client and have auth data
    if (!isClient) return

    console.log('📍 BookTicketsPage loaded with params:', { loginSuccess, fromBooking })

    if (loginSuccess && fromBooking) {
      //    User just logged in and came from booking flow
      const user = getCurrentUser()
      if (user) {
        setCurrentUser(user)
        setUserLoggedIn(true)

        toast.success(`Welcome back, ${user.name || user.email}!`, {
          description: 'Continue with your bus booking'
        })

        //    Check if we have saved booking data and auto-proceed
        const savedBusData = localStorage.getItem('selectedBusForBooking')
        if (savedBusData) {
          try {
            const busData = JSON.parse(savedBusData)
            setSelectedBus(busData)
            setSearchData({
              from: busData.route.startLocation,
              to: busData.route.endLocation,
              date: new Date().toISOString().split('T')[0]
            })
            setCurrentStep(2) //    Go directly to seat selection
            toast.success('🪑 Proceeding to seat selection...', {
              description: 'Your selected bus is ready for booking!'
            })

            // Clean up saved data
            localStorage.removeItem('selectedBusForBooking')
          } catch (error) {
            console.error(' Error loading saved bus data:', error)
          }
        }
      }

      //    Clean up URL params
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
    }
  }, [isClient, loginSuccess, fromBooking])

  // Step Navigation
  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Search Function
  const handleSearch = async (searchParams: typeof searchData) => {
    setSearchLoading(true)
    try {
      const response = await fetch('/api/routes/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startLocation: searchParams.from.trim(),
          endLocation: searchParams.to.trim(),
          journeyDate: searchParams.date
        })
      })

      const data = await response.json()

      if (data.success && data.routes?.length > 0) {
        setAvailableRoutes(data.routes)
        setCurrentStep(1)
        toast.success(`Found ${data.routes.length} route${data.routes.length > 1 ? 's' : ''}`)
      } else {
        setAvailableRoutes([])
        setCurrentStep(1)
        toast.error('No routes found')
      }
    } catch (error) {
      setAvailableRoutes([])
      setCurrentStep(1)
      toast.error('Search failed')
    } finally {
      setSearchLoading(false)
    }
  }

  //    ENHANCED: Bus Selection with Login Check
  const handleBusSelection = (route: RouteData, schedule: ScheduleData) => {
    console.log('🚌 Bus selection attempted')

    //    Check if user is logged in FIRST
    if (!userLoggedIn) {
      console.log('     User not logged in - saving bus data and redirecting')

      const fare = route.fares.find(f => f.busType === schedule.bus.busType && f.isActive)
      if (!fare) {
        toast.error('Fare information not available')
        return
      }

      //    Save the selected bus data for after login
      const busData = { route, schedule, fare }
      localStorage.setItem('selectedBusForBooking', JSON.stringify(busData))

      //    Save current page URL for return
      saveReturnUrl(window.location.pathname + '?from=booking&loginSuccess=true')

      //    Show login prompt
      toast.error('🔒 Please sign in to book tickets!', {
        description: 'You need to be logged in to continue with seat selection.'
      })

      //    Redirect to login with booking context
      const loginUrl = `/auth/signin?returnTo=${encodeURIComponent(window.location.pathname + '?from=booking&loginSuccess=true')}&from=booking`
      console.log('🔗 Redirecting to login:', loginUrl)

      router.push(loginUrl)
      return
    }

    //    User is logged in - proceed normally
    console.log('User is logged in - proceeding with bus selection')

    const fare = route.fares.find(f => f.busType === schedule.bus.busType && f.isActive)

    if (!fare) {
      toast.error('Fare information not available')
      return
    }

    setSelectedBus({ route, schedule, fare })
    setCurrentStep(2) // Go to seat selection
    toast.success('Bus selected! Choose your seats')
  }

  // Seat Selection
  const handleSeatSelection = (seats: number[]) => {
    setSelectedSeats(seats)
  }

  // Payment Process
  const handlePayment = () => {
    setCurrentStep(3)
    toast.success(`Proceeding to payment for ${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''}`)
  }

  // Complete Booking
  const completeBooking = async (bookingResult: any) => {
    setBookingData(bookingResult)
    setCurrentStep(4)
    toast.success('Booking confirmed!')
  }

  // Reset Booking
  const resetBooking = () => {
    setCurrentStep(0)
    setAvailableRoutes([])
    setSelectedBus(null)
    setSelectedSeats([])
    setBookingData(null)
    setSearchData({
      from: '',
      to: '',
      date: new Date().toISOString().split('T')[0]
    })

    //    Clean up any saved booking data
    localStorage.removeItem('selectedBusForBooking')
  }

  //    Format time left display
  const formatTimeLeft = (milliseconds: number): string => {
    const seconds = Math.ceil(milliseconds / 1000)
    if (seconds <= 0) return 'Expired'

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${remainingSeconds}s`
  }

  //    Show loading state during hydration
  if (!isClient) {
    return (

      <BookingLayout onBack={goToPreviousStep}>

        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Progress Indicator */}
          <ProgressIndicator
            steps={BOOKING_STEPS}
            currentStep={currentStep}
          />

          {/* Loading state */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100/60 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">
                Loading...
              </span>
            </div>
          </div>

          {/* Show search form by default */}
          <SearchForm
            searchData={searchData}
            onSearchDataChange={setSearchData}
            onSearch={handleSearch}
            isLoading={searchLoading}
          />
        </div>
      </BookingLayout>
    )
  }

  return (
    <BookingLayout onBack={goToPreviousStep}>
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Progress Indicator */}
        <ProgressIndicator
          steps={BOOKING_STEPS}
          currentStep={currentStep}
        />

        {/*    Enhanced Login Status Indicator - Only after hydration */}
        {userLoggedIn && currentUser && (
          <div className="mb-6 flex justify-center">
            <div className={`inline-flex items-center px-4 py-2 backdrop-blur-sm rounded-full border shadow-sm transition-all duration-300 ${sessionTimeLeft <= 30000 // Last 30 seconds
              ? 'bg-red-100/60 border-red-200/50'
              : sessionTimeLeft <= 60000 // Last 60 seconds  
                ? 'bg-yellow-100/60 border-yellow-200/50'
                : 'bg-green-100/60 border-green-200/50'
              }`}>
              <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${sessionTimeLeft <= 30000
                ? 'bg-red-500'
                : sessionTimeLeft <= 60000
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
                }`}></div>
              <span className={`text-sm font-medium ${sessionTimeLeft <= 30000
                ? 'text-red-700'
                : sessionTimeLeft <= 60000
                  ? 'text-yellow-700'
                  : 'text-green-700'
                }`}>
                {currentUser?.name || currentUser?.email}
                {sessionTimeLeft > 0 && (
                  <span className="ml-2 text-xs opacity-75">
                    ({formatTimeLeft(sessionTimeLeft)} left)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Step Content */}
        {currentStep === 0 && (
          <SearchForm
            searchData={searchData}
            onSearchDataChange={setSearchData}
            onSearch={handleSearch}
            isLoading={searchLoading}
          />
        )}

        {currentStep === 1 && (
          <RouteSelection
            routes={availableRoutes}
            searchData={searchData}
            onBusSelection={handleBusSelection} //    This now handles login check
            onBackToSearch={() => setCurrentStep(0)}
          />
        )}

        {currentStep === 2 && selectedBus && (

          <SeatSelection
            selectedBus={selectedBus}
            searchData={searchData}
            selectedSeats={selectedSeats}
            onSeatSelection={handleSeatSelection}
            onProceedToPayment={handlePayment}
            // <<-- This is critical!!
            onSessionExpired={() => {
              setCurrentStep(0);   // Go to step 1 (RouteSelection)
              setSelectedBus(null);
              setSelectedSeats([]);
              toast.error('Session expired. Please log in again.');
            }}
          />
        )}

        {currentStep === 3 && selectedBus && (
          <PaymentProcess
            selectedBus={selectedBus}
            selectedSeats={selectedSeats}
            searchData={searchData}
            onPaymentComplete={completeBooking}
            onBackToSeats={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && bookingData && (
          <TicketConfirmation
            bookingData={bookingData}
            selectedBus={selectedBus}
            selectedSeats={selectedSeats}
            searchData={searchData}
            onNewBooking={resetBooking}
          />
        )}
      </div>
    </BookingLayout>
  )
}
