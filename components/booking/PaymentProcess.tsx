'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, CreditCard, Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import { SelectedBusData, SearchData } from '@/types/booking'

interface PaymentProcessProps {
  selectedBus: SelectedBusData
  selectedSeats: number[]
  searchData: SearchData
  onPaymentComplete: (bookingData: any) => void
  onBackToSeats: () => void
}

export function PaymentProcess({
  selectedBus,
  selectedSeats,
  searchData,
  onPaymentComplete,
  onBackToSeats
}: PaymentProcessProps) {
  const [processing, setProcessing] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: ''
  })

  // Fetch user data on mount - NO useSession needed!
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setUserData({
            name: data.user.name || '',
            phone: data.user.phoneNumber || '',
            email: data.user.email || ''
          })
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        toast.error('Failed to load user data')
      }
    }

    fetchUserData()
  }, [])

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':')
      const time = new Date()
      time.setHours(parseInt(hours), parseInt(minutes))
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })
    } catch {
      return timeString
    }
  }

  const getTotalPrice = () => {
    return selectedSeats.length * selectedBus.fare.basePrice
  }

  const handleStripePayment = async () => {
    if (!userData.name || !userData.phone) {
      toast.error('Please fill in all passenger details')
      return
    }

    setProcessing(true)
    
    try {
      // Create Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId: selectedBus.schedule.id,
          busId: selectedBus.schedule.bus.id,
          seatNumbers: selectedSeats,
          totalAmount: getTotalPrice(),
          routeName: `${selectedBus.route.startLocation} → ${selectedBus.route.endLocation}`,
          busNumber: selectedBus.schedule.bus.busNumber,
          journeyDate: searchData.date,
          departureTime: selectedBus.schedule.departureTime,
          passengerName: userData.name,
          passengerPhone: userData.phone
        })
      })

      const data = await response.json()
      
      if (data.url) {
        // ✅ Simple redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Payment initialization failed')
        setProcessing(false)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Background Blur Container */}
      <div className="bg-white/15 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl p-8 sm:p-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-200/50 to-teal-200/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20 shadow-lg">
            <CreditCard className="h-10 w-10 text-emerald-600" />
          </div>
          
          <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-3">
            Secure Payment
          </h2>
          <p className="text-lg text-slate-600">
            Review your booking details and complete the payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Passenger Details */}
          <div className="space-y-6">
            <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-rose-500" />
                Passenger Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-700 font-semibold">Full Name</Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Enter passenger name"
                    className="mt-2 bg-white/20 backdrop-blur-xl border-2 border-white/30 focus:border-emerald-400 transition-all"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-slate-700 font-semibold">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="mt-2 bg-white/20 backdrop-blur-xl border-2 border-white/30 focus:border-emerald-400 transition-all"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
                  <Input
                    id="email"
                    value={userData.email}
                    disabled
                    className="mt-2 bg-white/10 backdrop-blur-xl border-2 border-white/20 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div className="space-y-6">
            <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Booking Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Route:</span>
                  <span className="font-semibold text-slate-800">{selectedBus.route.startLocation} → {selectedBus.route.endLocation}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Bus:</span>
                  <span className="font-semibold text-slate-800">{selectedBus.schedule.bus.busNumber}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Operator:</span>
                  <span className="font-semibold text-slate-800">{selectedBus.route.operator.name}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Seats:</span>
                  <span className="font-semibold text-slate-800">{selectedSeats.sort((a, b) => a - b).join(', ')}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-semibold text-slate-800">{new Date(searchData.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Time:</span>
                  <span className="font-semibold text-slate-800">{formatTime(selectedBus.schedule.departureTime)}</span>
                </div>
                
                <Separator className="my-4 bg-gradient-to-r from-emerald-300/30 to-teal-300/30" />
                
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Seats ({selectedSeats.length} × Rs. {selectedBus.fare.basePrice}):</span>
                  <span className="font-semibold">Rs. {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Service Fee:</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                
                <Separator className="my-4 bg-gradient-to-r from-emerald-300/30 to-teal-300/30" />
                
                <div className="flex justify-between py-3 text-xl font-black">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Total:</span>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Rs. {getTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Payment Method</h3>
              <div className="p-4 border-2 border-emerald-300/50 bg-emerald-100/30 backdrop-blur-xl rounded-xl hover:border-emerald-400/60 transition-all">
                <div className="flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="font-semibold text-emerald-800">Stripe Secure Checkout</span>
                </div>
                <p className="text-xs text-emerald-600 mt-2 text-center">Credit/Debit Card • Google Pay • Apple Pay</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={onBackToSeats}
            variant="outline"
            className="px-8 py-3 rounded-2xl border-2 border-slate-300 hover:bg-slate-100/50 backdrop-blur-xl transition-all duration-300 hover:scale-105"
            disabled={processing}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Seats
          </Button>
          
          <Button
            onClick={handleStripePayment}
            disabled={processing || !userData.name || !userData.phone}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Redirecting to Stripe...
              </div>
            ) : (
              <div className="flex items-center">
                Pay Rs. {getTotalPrice().toLocaleString()}
                <ArrowRight className="h-5 w-5 ml-2" />
              </div>
            )}
          </Button>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-100/30 backdrop-blur-xl rounded-xl border border-blue-200/30 text-center">
          <p className="text-sm text-blue-700 font-medium">
            🔒 Your payment is secured with Stripe's 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  )
}
