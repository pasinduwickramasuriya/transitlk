/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Download, Share2, QrCode, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { SelectedBusData, SearchData } from '@/types/booking'

interface TicketConfirmationProps {
  bookingData: any
  selectedBus: SelectedBusData | null
  selectedSeats: number[]
  searchData: SearchData
  onNewBooking: () => void
}

export function TicketConfirmation({
  bookingData,
  selectedBus,
  selectedSeats,
  searchData,
  onNewBooking
}: TicketConfirmationProps) {
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

  const handleDownload = () => {
    toast.success('Ticket downloaded!')
    // In real app, generate and download PDF ticket
  }

  const handleShare = () => {
    toast.success('Booking details copied to clipboard!')
    // In real app, copy booking details to clipboard
  }

  const getBookingId = () => {
    if (bookingData?.bookings?.length > 0) {
      return `TLK${bookingData.bookings[0].id.slice(-6).toUpperCase()}`
    }
    return `TLK${Date.now().toString().slice(-6)}`
  }

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20"></div>
        
        <div className="relative p-12">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed! 🎉</h2>
          <p className="text-xl text-gray-600 mb-8">
            Your bus ticket has been successfully booked. Have a great journey!
          </p>
          
          {/* Digital Ticket */}
          <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-8 max-w-lg mx-auto border-2 border-cyan-200 mb-8 shadow-xl">
            <div className="text-center mb-6">
              <QrCode className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <p className="text-sm text-gray-600">Scan QR code at boarding</p>
            </div>
            
            {/* Ticket Details */}
            <div className="space-y-4 text-left">
              <div className="text-center pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">TransitLK Ticket</h3>
                <Badge className="bg-green-100 text-green-700 border-green-200 mt-2">
                  CONFIRMED
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Booking ID:</span>
                  <div className="font-bold text-lg">{getBookingId()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Journey Date:</span>
                  <div className="font-medium">{new Date(searchData.date).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-y border-gray-200">
                <div className="text-left">
                  <div className="text-lg font-bold text-gray-900">{searchData.from}</div>
                  <div className="text-sm text-gray-600">
                    {selectedBus ? formatTime(selectedBus.schedule.departureTime) : ''}
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-8 h-px bg-gray-300"></div>
                  <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                  <div className="w-8 h-px bg-gray-300"></div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{searchData.to}</div>
                  <div className="text-sm text-gray-600">
                    {selectedBus ? formatTime(selectedBus.schedule.arrivalTime) : ''}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Bus:</span>
                  <div className="font-medium">{selectedBus?.schedule.bus.busNumber || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Route:</span>
                  <div className="font-medium">{selectedBus?.route.routeNumber || 'N/A'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Operator:</span>
                  <div className="font-medium">{selectedBus?.route.operator.name || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Bus Type:</span>
                  <div className="font-medium">{selectedBus?.schedule.bus.busType || 'N/A'}</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-bold text-cyan-600">
                    {selectedSeats.sort((a, b) => a - b).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-xl text-green-600">
                    {bookingData?.summary?.currency || 'LKR'} {bookingData?.summary?.totalAmount?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white px-8 py-3 rounded-2xl"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Ticket
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 rounded-2xl"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Booking
            </Button>
          </div>

          {/* Important Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-2xl mx-auto mb-8">
            <h3 className="font-semibold text-yellow-800 mb-3">Important Instructions:</h3>
            <ul className="text-sm text-yellow-700 space-y-2 text-left">
              <li>• Please arrive at the boarding point 15 minutes before departure</li>
              <li>• Show this digital ticket or QR code to the conductor</li>
              <li>• Keep your ID card/passport ready for verification</li>
              <li>• Contact support for any changes: +94 11 123 4567</li>
            </ul>
          </div>

          {/* New Booking Button */}
          <Button
            onClick={onNewBooking}
            variant="outline"
            className="px-8 py-3 rounded-2xl border-2 border-cyan-300 hover:border-cyan-400 hover:bg-cyan-50"
          >
            Book Another Trip
          </Button>
        </div>
      </div>
    </div>
  )
}
