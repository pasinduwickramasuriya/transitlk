'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  User, Bell, Shield, CreditCard, Save, Loader2, Mail, Phone, Calendar, MapPin, Award,
  Activity, Ticket, Download, QrCode, Armchair, AlertTriangle, Radio, Clock
} from 'lucide-react'
import { toast } from 'sonner'

// INTERFACES 
interface UserProfile {
  id: string
  name: string | null
  email: string
  phoneNumber: string | null
  image: string | null
  emailVerified: Date | null
  role: string
  isActive: boolean
  createdAt: Date
  _count?: { bookings: number; notifications: number; feedback: number }
}

interface Booking {
  id: string
  passengerName: string
  passengerPhone: string
  journeyDate: Date
  status: string
  totalAmount: number
  seatNumbers: string
  schedule: {
    route: { routeNumber: string; startLocation: string; endLocation: string }
    bus: { busNumber: string }
  }
  payment: { status: string } | null
}

interface BookingDetails {
  id: string
  passengerName: string
  passengerPhone: string
  journeyDate: Date
  status: string
  totalAmount: number
  seatNumbers: string
  schedule: {
    route: { routeNumber: string; startLocation: string; endLocation: string }
    bus: { busNumber: string }
  }
  ticket?: {
    id: string
    ticketNumber: string
    qrCode: string | null
    isValid: boolean
    isUsed: boolean
  }
  payment?: {
    id: string
    amount: number
    currency: string
    method: string
    status: string
    transactionId: string | null
  } | null
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: Date
  isBroadcast: boolean
}

// ========== HELPER FUNCTIONS ==========
const formatDisplay = (dateStr: string | Date) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'N/A'
  }
}

const formatTimeAgo = (date: Date | string) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDisplay(date)
}

// MAIN COMPONENT 
export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // State
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [formData, setFormData] = useState({ name: '', phoneNumber: '', image: '' })

  // ========== API CALLS ==========
  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    if (status === 'authenticated') {
      fetchProfile()
      fetchBookings()
      fetchNotifications()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data.user)
      setFormData({
        name: data.user.name || '',
        phoneNumber: data.user.phoneNumber || '',
        image: data.user.image || ''
      })
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/profile/bookings')
      if (!response.ok) throw new Error('Failed to fetch bookings')
      const data = await response.json()
      setBookings(data.bookings)
    } catch (error) {
      console.error('Failed to load bookings:', error)
    }
  }

  const fetchNotifications = async () => {
    setLoadingNotifications(true)
    try {
      const response = await fetch('/api/profile/notifications')
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      setNotifications(data.notifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoadingNotifications(false)
    }
  }

  const fetchBookingDetails = async (bookingId: string) => {
    setLoadingDetails(true)
    try {
      const response = await fetch(`/api/profile/bookings/${bookingId}`)
      if (!response.ok) throw new Error('Failed to fetch booking details')
      const data = await response.json()
      setSelectedBooking(data.booking)
      setIsBookingModalOpen(true)
    } catch (error) {
      toast.error('Failed to load booking details')
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Failed to update profile')
      const data = await response.json()
      setProfile(data.user)
      toast.success('Profile updated! 🎉')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/profile/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })
      if (!response.ok) throw new Error('Failed to mark as read')

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
      toast.success('Marked as read')
    } catch (error) {
      toast.error('Failed to update notification')
    }
  }

  // ========== HELPER FUNCTIONS ==========
  const getInitials = () => {
    if (profile?.name) {
      const parts = profile.name.split(' ')
      return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase()
    }
    return profile?.email[0].toUpperCase()
  }

  const bookingsCount = profile?._count?.bookings ?? 0
  const notificationsCount = notifications.filter(n => !n.isRead).length

  // ========== LOADING STATE ==========
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-rose-50">
        <Loader2 className="w-12 h-12 animate-spin text-violet-400" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-rose-50">
        <p className="text-lg text-slate-700 mb-4">Profile not found</p>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    )
  }

  // ========== RENDER ==========
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 via-teal-50 to-amber-50 p-4 sm:p-8 lg:p-12">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/40 via-fuchsia-200/30 to-rose-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[450px] h-[450px] bg-gradient-to-br from-sky-200/35 via-cyan-200/25 to-teal-200/35 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-gradient-to-br from-amber-200/30 via-orange-200/20 to-rose-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-white/30 backdrop-blur-3xl rounded-[2rem] p-8 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-500">
          <div className="flex flex-wrap justify-between items-center gap-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-black bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">
                Profile Settings
              </h1>
              <p className="text-lg text-slate-600 flex items-center gap-2">
                <Activity className="w-5 h-5 text-fuchsia-400" />
                Manage your account & preferences
              </p>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving} className="rounded-full backdrop-blur-sm bg-white/50">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 hover:from-violet-500 hover:to-fuchsia-500">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 hover:from-violet-500 hover:to-fuchsia-500">
                  Edit Profile
                </Button>
              )}
            </div>
            {/*  DASHBOARD LINK */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-black hover:text-[#1ebcf1] hover:bg-[#1ebcf1]/10 h-8 mr-2"
            >
              {/* <LayoutDashboard className="w-4 h-4 mr-2" /> */}
              Dashboard
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-8">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-[1.5rem] bg-white/30 backdrop-blur-3xl p-3 border border-white/40">
            <TabsTrigger value="personal" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-200/80 data-[state=active]:to-fuchsia-200/80 data-[state=active]:text-violet-700">
              <User className="w-4 h-4 mr-2" />Personal
            </TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-200/80 data-[state=active]:to-cyan-200/80 data-[state=active]:text-sky-700">
              <CreditCard className="w-4 h-4 mr-2" />Bookings ({bookingsCount})
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-200/80 data-[state=active]:to-pink-200/80 data-[state=active]:text-rose-700">
              <Bell className="w-4 h-4 mr-2" />Alerts ({notificationsCount})
            </TabsTrigger>
          </TabsList>

          {/* Personal Tab */}
          <TabsContent value="personal">
            <Card className="bg-white/30 backdrop-blur-3xl rounded-[2rem] shadow-xl border border-white/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl font-black text-violet-700">
                  <User className="w-8 h-8" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-8">
                  <Avatar className="w-32 h-32 ring-4 ring-violet-300/50 ring-offset-4">
                    {profile.image ? (
                      <AvatarImage src={profile.image} alt={profile.name || 'User'} />
                    ) : (
                      <AvatarFallback className="text-4xl font-black bg-gradient-to-br from-violet-300 to-fuchsia-300 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>

                <Separator className="bg-gradient-to-r from-violet-200/50 via-fuchsia-200/50 to-rose-200/50" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Full Name" id="name" icon={<User className="w-4 h-4" />} value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} disabled={!isEditing} />
                  <FormInput label="Email" id="email" icon={<Mail className="w-4 h-4" />} value={profile.email} onChange={() => { }} disabled={true} verified={!!profile.emailVerified} />
                  <FormInput label="Phone" id="phone" icon={<Phone className="w-4 h-4" />} value={formData.phoneNumber} onChange={(v) => setFormData({ ...formData, phoneNumber: v })} disabled={!isEditing} />
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                      <Award className="w-4 h-4 text-amber-400" />Role
                    </Label>
                    <Badge className="bg-gradient-to-r from-amber-200 to-orange-200 text-amber-700 border-0">{profile.role}</Badge>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-violet-200/50 via-sky-200/50 to-teal-200/50" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard icon={<Calendar className="w-5 h-5" />} label="Member Since" value={formatDisplay(profile.createdAt)} color="from-violet-300 to-fuchsia-300" />
                  <StatCard icon={<CreditCard className="w-5 h-5" />} label="Bookings" value={bookingsCount.toString()} color="from-sky-300 to-cyan-300" />
                  <StatCard icon={<Shield className="w-5 h-5" />} label="Status" value={profile.isActive ? 'Active' : 'Inactive'} color="from-teal-300 to-emerald-300" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="bg-white/30 backdrop-blur-3xl rounded-[2rem] shadow-xl border border-white/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl font-black text-sky-700">
                  <CreditCard className="w-8 h-8" /> Your Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {bookings.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <CreditCard className="w-16 h-16 mx-auto text-slate-300" />
                    <p className="text-slate-500 text-lg">No bookings found</p>
                    <Button onClick={() => router.push('/booking')} className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-400">Book a Ticket</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        onClick={() => fetchBookingDetails(booking.id)}
                        className="p-6 bg-gradient-to-br from-sky-100/40 via-cyan-100/30 to-teal-100/40 rounded-[1.5rem] backdrop-blur-xl border border-white/40 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-3 flex-1">
                            <p className="font-bold text-xl flex items-center gap-2 text-slate-800">
                              <MapPin className="w-5 h-5 text-rose-400" />
                              {booking.schedule.route.startLocation} → {booking.schedule.route.endLocation}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                              <span className="flex items-center gap-1">🚌 {booking.schedule.bus.busNumber}</span>
                              <span className="flex items-center gap-1">📅 {formatDisplay(booking.journeyDate)}</span>
                              <span className="flex items-center gap-1">👤 {booking.passengerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Armchair className="w-4 h-4 text-violet-400" />
                              <span className="text-sm font-semibold text-violet-600">
                                Seats: {booking.seatNumbers}
                              </span>
                            </div>
                          </div>
                          <div className="text-right space-y-3">
                            <Badge className="bg-gradient-to-r from-sky-200 to-cyan-200 text-sky-700 border-0">{booking.status}</Badge>
                            <p className="text-2xl font-black bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">Rs. {booking.totalAmount.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 group-hover:text-sky-600 transition-colors">View Details →</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-white/30 backdrop-blur-3xl rounded-[2rem] shadow-xl border border-white/40">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-3xl font-black text-rose-700">
                    <Bell className="w-8 h-8" /> Notifications
                  </div>
                  {notificationsCount > 0 && (
                    <Badge className="bg-gradient-to-r from-rose-200 to-pink-200 text-rose-700 border-0 text-lg px-4 py-2">
                      {notificationsCount} Unread
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {loadingNotifications ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <Bell className="w-16 h-16 mx-auto text-slate-300" />
                    <p className="text-slate-500 text-lg">No notifications</p>
                    <p className="text-sm text-slate-400">We will notify you when something important happens</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-5 rounded-[1.5rem] backdrop-blur-xl border transition-all duration-300 cursor-pointer hover:scale-[1.01] ${notification.isRead
                          ? 'bg-slate-100/40 border-slate-200/60'
                          : 'bg-gradient-to-br from-rose-100/60 via-pink-100/50 to-fuchsia-100/60 border-rose-200/60 shadow-lg'
                          }`}
                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${notification.type === 'success' ? 'bg-gradient-to-br from-emerald-200 to-teal-200' :
                            notification.type === 'warning' ? 'bg-gradient-to-br from-amber-200 to-orange-200' :
                              notification.type === 'error' ? 'bg-gradient-to-br from-rose-200 to-pink-200' :
                                'bg-gradient-to-br from-sky-200 to-cyan-200'
                            }`}>
                            {notification.type === 'success' && <Activity className="w-5 h-5 text-emerald-700" />}
                            {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-700" />}
                            {notification.type === 'error' && <Bell className="w-5 h-5 text-rose-700" />}
                            {notification.type === 'info' && <Bell className="w-5 h-5 text-sky-700" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h4 className="font-bold text-lg text-slate-800 leading-tight">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0 mt-2" />
                              )}
                            </div>

                            <p className="text-slate-700 mb-3 leading-relaxed">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-3 text-sm">
                              <span className="flex items-center gap-1 text-slate-500">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(notification.createdAt)}
                              </span>

                              {notification.isBroadcast && (
                                <Badge className="bg-gradient-to-r from-violet-200/70 to-fuchsia-200/70 text-violet-700 border-0 text-xs">
                                  <Radio className="w-3 h-3 mr-1" />
                                  Broadcast
                                </Badge>
                              )}

                              {notification.isRead ? (
                                <Badge className="bg-gradient-to-r from-slate-200/70 to-slate-300/70 text-slate-600 border-0 text-xs">
                                  ✓ Read
                                </Badge>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                  className="h-7 px-3 text-xs rounded-lg bg-white/60 hover:bg-white/80"
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Details Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-3xl rounded-[2rem] border-2 border-white/50">
          {loadingDetails ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
          ) : selectedBooking ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-black flex items-center gap-3 bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                  <Ticket className="w-8 h-8 text-sky-500" />
                  Booking Details
                </DialogTitle>
                <DialogDescription>Complete booking information</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {selectedBooking.ticket?.qrCode && (
                  <div className="bg-gradient-to-br from-sky-100/60 to-cyan-100/60 rounded-[1.5rem] p-6 text-center backdrop-blur-xl border border-white/40">
                    <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2 text-slate-800">
                      <QrCode className="w-5 h-5 text-sky-500" />
                      Ticket QR Code
                    </h3>
                    <img src={selectedBooking.ticket.qrCode} alt="QR Code" className="w-48 h-48 mx-auto rounded-2xl shadow-xl border-4 border-white" />
                    <p className="text-sm mt-3 text-slate-700">
                      Ticket: <span className="font-bold text-sky-600">{selectedBooking.ticket.ticketNumber}</span>
                    </p>
                    <Badge className={selectedBooking.ticket.isValid ? "bg-gradient-to-r from-emerald-200 to-teal-200 text-emerald-700 mt-3 border-0" : "bg-gradient-to-r from-rose-200 to-pink-200 text-rose-700 mt-3 border-0"}>
                      {selectedBooking.ticket.isValid ? '✓ Valid' : '✗ Invalid'}
                    </Badge>
                  </div>
                )}

                <div className="bg-gradient-to-br from-rose-100/50 to-pink-100/50 rounded-[1.5rem] p-6 backdrop-blur-xl border border-white/40">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                    <MapPin className="w-5 h-5 text-rose-500" />
                    Journey Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Route" value={selectedBooking.schedule.route.routeNumber} />
                    <InfoRow label="From" value={selectedBooking.schedule.route.startLocation} />
                    <InfoRow label="To" value={selectedBooking.schedule.route.endLocation} />
                    <InfoRow label="Bus" value={selectedBooking.schedule.bus.busNumber} />
                    <InfoRow label="Date" value={formatDisplay(selectedBooking.journeyDate)} />
                    <InfoRow label="Status" value={selectedBooking.status} badge />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-violet-100/50 to-fuchsia-100/50 rounded-[1.5rem] p-6 backdrop-blur-xl border border-white/40">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                    <User className="w-5 h-5 text-violet-500" />
                    Passenger Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Name" value={selectedBooking.passengerName} />
                    <InfoRow label="Phone" value={selectedBooking.passengerPhone} />
                    <div className="md:col-span-2">
                      <p className="text-sm text-slate-600 font-semibold mb-2 flex items-center gap-2">
                        <Armchair className="w-4 h-4 text-violet-400" />
                        Booked Seats
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedBooking.seatNumbers.split(',').map((seat, idx) => (
                          <Badge key={idx} className="bg-gradient-to-r from-violet-200 to-fuchsia-200 text-violet-700 border-0 px-3 py-1">
                            Seat {seat.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.payment && (
                  <div className="bg-gradient-to-br from-teal-100/50 to-emerald-100/50 rounded-[1.5rem] p-6 backdrop-blur-xl border border-white/40">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                      <CreditCard className="w-5 h-5 text-teal-500" />
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoRow label="Amount" value={`Rs. ${selectedBooking.payment.amount.toLocaleString()}`} />
                      <InfoRow label="Method" value={selectedBooking.payment.method} />
                      <InfoRow label="Status" value={selectedBooking.payment.status} badge />
                      {selectedBooking.payment.transactionId && (
                        <InfoRow label="Transaction ID" value={selectedBooking.payment.transactionId} className="md:col-span-2" />
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button className="flex-1 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500">
                    <Download className="w-4 h-4 mr-2" />Download
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-full bg-white/50 backdrop-blur-sm">
                    <Mail className="w-4 h-4 mr-2" />Email
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}

// ========== HELPER COMPONENTS ==========
function FormInput({ label, id, value, onChange, disabled, verified, icon }: {
  label: string; id: string; value: string; onChange: (val: string) => void; disabled?: boolean; verified?: boolean; icon?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-slate-700 font-semibold">{icon}{label}</Label>
      <div className="flex items-center gap-2">
        <Input id={id} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} className="flex-1 bg-white/50 backdrop-blur-sm border-white/60 rounded-xl" />
        {verified !== undefined && (
          <Badge variant={verified ? "default" : "destructive"} className={verified ? "bg-gradient-to-r from-emerald-200 to-teal-200 text-emerald-700 border-0" : "bg-gradient-to-r from-rose-200 to-pink-200 text-rose-700 border-0"}>
            {verified ? "✓" : "✗"}
          </Badge>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg text-white space-y-2 hover:scale-105 transition-transform`}>
      <div className="flex items-center gap-2">{icon}<p className="text-xs font-semibold opacity-90">{label}</p></div>
      <p className="text-3xl font-black">{value}</p>
    </div>
  )
}

function InfoRow({ label, value, badge = false, className = '' }: { label: string; value: string; badge?: boolean; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm text-slate-600 font-semibold">{label}</p>
      {badge ? (
        <Badge className="bg-gradient-to-r from-sky-200 to-cyan-200 text-sky-700 border-0">{value}</Badge>
      ) : (
        <p className="text-base font-bold text-slate-800">{value}</p>
      )}
    </div>
  )
}











