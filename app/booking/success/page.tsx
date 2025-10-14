'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle, Ticket, Download, Home, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [processing, setProcessing] = useState(true)
  const [booking, setBooking] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams?.get('session_id')
    
    if (!sessionId) {
      console.error('❌ No session ID found')
      toast.error('Invalid payment session')
      router.push('/booking')
      return
    }

    console.log('🎯 Completing booking for session:', sessionId)

    const completeBooking = async () => {
      try {
        setProcessing(true)
        
        const response = await fetch('/api/bookings/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        })

        const data = await response.json()
        console.log('📦 Response:', data)

        if (data.success) {
          console.log('✅ Booking completed successfully')
          setBooking(data.booking)
          toast.success('🎉 Booking confirmed!')
        } else {
          console.error('❌ Booking failed:', data.error)
          setError(data.error || 'Booking confirmation failed')
          toast.error(data.error || 'Booking confirmation failed')
        }
      } catch (error) {
        console.error('❌ Request error:', error)
        setError('Failed to confirm booking')
        toast.error('Failed to confirm booking')
      } finally {
        setProcessing(false)
      }
    }

    completeBooking()
  }, [searchParams, router])

  // Loading state
  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-blue-50 via-purple-50 to-violet-50">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <Loader2 className="w-16 h-16 animate-spin text-emerald-500" />
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-emerald-300/30 blur-xl animate-pulse"></div>
          </div>
          <div className="bg-white/20 backdrop-blur-2xl rounded-2xl px-8 py-4 border border-white/20">
            <p className="text-lg font-semibold text-slate-700">Processing your booking...</p>
            <p className="text-sm text-slate-500 mt-1">Please wait, this may take a moment</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-blue-50 via-purple-50 to-violet-50 p-6">
        <Card className="bg-white/20 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Booking Failed</h2>
            <p className="text-slate-600 mb-6">{error || 'Something went wrong'}</p>
            <Button onClick={() => router.push('/booking')} className="w-full">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Success state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-blue-50 via-purple-50 to-violet-50 p-6">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-emerald-300/30 via-teal-300/20 to-green-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-gradient-to-br from-blue-300/25 via-cyan-300/20 to-sky-300/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Card className="relative bg-white/20 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-2xl w-full">
        <CardHeader className="text-center pb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-200/50 to-teal-200/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20 shadow-xl animate-bounce">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <CardTitle className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Booking Confirmed! 🎉
          </CardTitle>
          <p className="text-lg text-slate-600 mt-2">Your ticket has been booked successfully</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Ticket Details */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-slate-800">Ticket Details</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Ticket Number:</span>
                <span className="font-bold text-emerald-600">{booking.ticket.ticketNumber}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Route:</span>
                <span className="font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {booking.schedule.route.startLocation} → {booking.schedule.route.endLocation}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Bus:</span>
                <span className="font-semibold text-slate-800">🚌 {booking.schedule.bus.busNumber}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Seats:</span>
                <span className="font-semibold text-slate-800">🪑 {booking.seats.join(', ')}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Journey Date:</span>
                <span className="font-semibold text-slate-800">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {new Date(booking.journeyDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between py-2 text-lg font-black">
                <span className="text-emerald-600">Amount Paid:</span>
                <span className="text-emerald-600">Rs. {booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          {booking.ticket.qrCode && (
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
              <p className="text-sm font-semibold text-slate-700 mb-3">Scan this QR code when boarding</p>
              <img 
                src={booking.ticket.qrCode} 
                alt="Ticket QR Code" 
                className="w-48 h-48 mx-auto rounded-xl shadow-lg border-4 border-white"
              />
              <p className="text-xs text-slate-500 mt-3">Keep this safe for your journey</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button 
              onClick={() => router.push('/dashboard/profile')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all"
            >
              <Ticket className="w-4 h-4 mr-2" />
              View My Bookings
            </Button>
            <Button 
              onClick={() => router.push('/booking')}
              variant="outline"
              className="border-2 border-emerald-300 hover:bg-emerald-50/50"
            >
              <Home className="w-4 h-4 mr-2" />
              Book Another Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
