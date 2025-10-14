// 'use client'

// import React, { useState, useEffect, useMemo } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Separator } from '@/components/ui/separator'
// import {
//   Bell, Plus, Send, Users, MessageCircle, AlertTriangle, Info,
//   CheckCircle, RefreshCw, Search, Filter, Trash2, Eye, X, Globe
// } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'

// interface Notification {
//   id: string
//   userId: string | null
//   title: string
//   message: string
//   type: 'BOOKING_CONFIRMATION' | 'PAYMENT_SUCCESS' | 'SCHEDULE_UPDATE' | 'ROUTE_CHANGE' | 'GENERAL' | 'EMERGENCY'
//   isRead: boolean
//   isBroadcast: boolean
//   createdAt: string
//   user: {
//     id: string
//     name: string | null
//     email: string
//   } | null
// }

// interface User {
//   id: string
//   name: string | null
//   email: string
// }

// interface Operator {
//   id: string
//   name: string
// }

// interface NotificationFormData {
//   title: string
//   message: string
//   type: 'BOOKING_CONFIRMATION' | 'PAYMENT_SUCCESS' | 'SCHEDULE_UPDATE' | 'ROUTE_CHANGE' | 'GENERAL' | 'EMERGENCY'
//   isBroadcast: boolean
//   userId: string | null
// }

// interface NotificationManagementClientProps {
//   operator: Operator
//   initialNotifications: Notification[]
//   users: User[]
// }

// const notificationTypes = [
//   { value: 'GENERAL', label: 'General', color: 'bg-blue-100 text-blue-700', icon: Info },
//   { value: 'BOOKING_CONFIRMATION', label: 'Booking', color: 'bg-green-100 text-green-700', icon: CheckCircle },
//   { value: 'PAYMENT_SUCCESS', label: 'Payment', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
//   { value: 'SCHEDULE_UPDATE', label: 'Schedule', color: 'bg-orange-100 text-orange-700', icon: MessageCircle },
//   { value: 'ROUTE_CHANGE', label: 'Route Change', color: 'bg-purple-100 text-purple-700', icon: MessageCircle },
//   { value: 'EMERGENCY', label: 'Emergency', color: 'bg-red-100 text-red-700', icon: AlertTriangle }
// ] as const

// export function NotificationManagementClient({ 
//   operator, 
//   initialNotifications, 
//   users 
// }: NotificationManagementClientProps) {
//   const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
//   const [loading, setLoading] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedType, setSelectedType] = useState<string>('all')
//   const [selectedFilter, setSelectedFilter] = useState<string>('all')
//   const [isFormOpen, setIsFormOpen] = useState(false)
//   const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

//   const [formData, setFormData] = useState<NotificationFormData>({
//     title: '',
//     message: '',
//     type: 'GENERAL',
//     isBroadcast: true,
//     userId: null
//   })

//   // Memoized calculations
//   const stats = useMemo(() => {
//     const totalNotifications = notifications.length
//     const broadcastNotifications = notifications.filter(n => n.isBroadcast).length
//     const unreadNotifications = notifications.filter(n => !n.isRead).length
//     const emergencyNotifications = notifications.filter(n => n.type === 'EMERGENCY').length

//     return {
//       total: totalNotifications,
//       broadcast: broadcastNotifications,
//       unread: unreadNotifications,
//       emergency: emergencyNotifications
//     }
//   }, [notifications])

//   const filteredNotifications = useMemo(() => {
//     return notifications.filter(notification => {
//       const matchesSearch = !searchTerm || 
//         notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         notification.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         notification.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesType = selectedType === 'all' || notification.type === selectedType

//       const matchesFilter = selectedFilter === 'all' ||
//         (selectedFilter === 'broadcast' && notification.isBroadcast) ||
//         (selectedFilter === 'individual' && !notification.isBroadcast) ||
//         (selectedFilter === 'unread' && !notification.isRead) ||
//         (selectedFilter === 'read' && notification.isRead)

//       return matchesSearch && matchesType && matchesFilter
//     })
//   }, [notifications, searchTerm, selectedType, selectedFilter])

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       message: '',
//       type: 'GENERAL',
//       isBroadcast: true,
//       userId: null
//     })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const response = await fetch('/api/operator/notifications', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       })

//       if (!response.ok) {
//         throw new Error('Failed to send notification')
//       }

//       const result = await response.json()

//       setNotifications([result.notification, ...notifications])
//       toast.success('Notification sent successfully')
//       setIsFormOpen(false)
//       resetForm()
//     } catch (error) {
//       toast.error('Failed to send notification')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (notificationId: string) => {
//     setLoading(true)

//     try {
//       const response = await fetch(`/api/operator/notifications/${notificationId}`, {
//         method: 'DELETE'
//       })

//       if (!response.ok) {
//         throw new Error('Failed to delete notification')
//       }

//       setNotifications(notifications.filter(n => n.id !== notificationId))
//       toast.success('Notification deleted successfully')
//     } catch (error) {
//       toast.error('Failed to delete notification')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const refreshNotifications = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch('/api/operator/notifications')
//       if (response.ok) {
//         const data = await response.json()
//         setNotifications(data.notifications)
//         toast.success('Notifications refreshed')
//       }
//     } catch (error) {
//       toast.error('Failed to refresh notifications')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getTypeConfig = (type: string) => {
//     return notificationTypes.find(t => t.value === type) || notificationTypes[0]
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
//       <div className="container mx-auto p-6 space-y-8">
//         {/* Header */}
//         <div className="text-center space-y-4">
//           <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
//             <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
//               <Bell className="h-6 w-6 text-white" />
//             </div>
//             <div className="text-left">
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Notification Management
//               </h1>
//               <p className="text-sm text-slate-600">Operator: {operator.name}</p>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-2xl transition-all duration-300">
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
//                   <Bell className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
//                   <p className="text-sm text-slate-600 font-medium">Total Sent</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-300">
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
//                   <Globe className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-slate-800">{stats.broadcast}</p>
//                   <p className="text-sm text-slate-600 font-medium">Broadcast</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-2xl transition-all duration-300">
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
//                   <Eye className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-slate-800">{stats.unread}</p>
//                   <p className="text-sm text-slate-600 font-medium">Unread</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-rose-50 hover:shadow-2xl transition-all duration-300">
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg">
//                   <AlertTriangle className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-slate-800">{stats.emergency}</p>
//                   <p className="text-sm text-slate-600 font-medium">Emergency</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Controls */}
//         <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
//           <CardHeader>
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <CardTitle className="flex items-center gap-3">
//                 <Filter className="h-5 w-5 text-purple-600" />
//                 Notification Controls
//               </CardTitle>
//               <div className="flex gap-2">
//                 <Button onClick={refreshNotifications} variant="outline" disabled={loading}>
//                   <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
//                   Refresh
//                 </Button>
//                 <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
//                   <DialogTrigger asChild>
//                     <Button onClick={resetForm} className="bg-gradient-to-r from-purple-500 to-pink-500">
//                       <Plus className="h-4 w-4 mr-2" />
//                       Send Notification
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-lg">
//                     <DialogHeader>
//                       <DialogTitle>Send New Notification</DialogTitle>
//                     </DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                       <div>
//                         <Label>Title</Label>
//                         <Input
//                           value={formData.title}
//                           onChange={(e) => setFormData({...formData, title: e.target.value})}
//                           placeholder="Notification title"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <Label>Message</Label>
//                         <Textarea
//                           value={formData.message}
//                           onChange={(e) => setFormData({...formData, message: e.target.value})}
//                           placeholder="Notification message"
//                           rows={4}
//                           required
//                         />
//                       </div>

//                       <div>
//                         <Label>Type</Label>
//                         <Select
//                           value={formData.type}
//                           onValueChange={(value: any) => setFormData({...formData, type: value})}
//                         >
//                           <SelectTrigger>
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {notificationTypes.map(type => (
//                               <SelectItem key={type.value} value={type.value}>
//                                 <div className="flex items-center gap-2">
//                                   <type.icon className="h-4 w-4" />
//                                   {type.label}
//                                 </div>
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           id="isBroadcast"
//                           checked={formData.isBroadcast}
//                           onChange={(e) => setFormData({
//                             ...formData, 
//                             isBroadcast: e.target.checked,
//                             userId: e.target.checked ? null : formData.userId
//                           })}
//                         />
//                         <Label htmlFor="isBroadcast">Send to all users (Broadcast)</Label>
//                       </div>

//                       {!formData.isBroadcast && (
//                         <div>
//                           <Label>Select User</Label>
//                           <Select
//                             value={formData.userId || ''}
//                             onValueChange={(value) => setFormData({...formData, userId: value})}
//                             required={!formData.isBroadcast}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select a user" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {users.map(user => (
//                                 <SelectItem key={user.id} value={user.id}>
//                                   {user.name || user.email}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       )}

//                       <div className="flex gap-2 pt-4">
//                         <Button type="submit" disabled={loading} className="flex-1">
//                           <Send className="h-4 w-4 mr-2" />
//                           {loading ? 'Sending...' : 'Send Notification'}
//                         </Button>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => setIsFormOpen(false)}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </form>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                 <Input
//                   placeholder="Search notifications..."
//                   className="pl-10"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <Select value={selectedType} onValueChange={setSelectedType}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Filter by type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   {notificationTypes.map(type => (
//                     <SelectItem key={type.value} value={type.value}>
//                       {type.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={selectedFilter} onValueChange={setSelectedFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Filter notifications" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Notifications</SelectItem>
//                   <SelectItem value="broadcast">Broadcast Only</SelectItem>
//                   <SelectItem value="individual">Individual Only</SelectItem>
//                   <SelectItem value="unread">Unread Only</SelectItem>
//                   <SelectItem value="read">Read Only</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Notifications List */}
//         <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-3">
//               <Bell className="h-5 w-5 text-purple-600" />
//               Notifications ({filteredNotifications.length})
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-[600px]">
//               {filteredNotifications.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Bell className="h-16 w-16 text-slate-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-slate-700 mb-2">No notifications found</h3>
//                   <p className="text-slate-500">Send your first notification to get started</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {filteredNotifications.map((notification) => {
//                     const typeConfig = getTypeConfig(notification.type)
//                     const IconComponent = typeConfig.icon

//                     return (
//                       <div
//                         key={notification.id}
//                         className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200"
//                       >
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-3 mb-3">
//                               <Badge className={typeConfig.color}>
//                                 <IconComponent className="h-3 w-3 mr-1" />
//                                 {typeConfig.label}
//                               </Badge>
//                               {notification.isBroadcast ? (
//                                 <Badge variant="outline" className="bg-blue-50 text-blue-700">
//                                   <Globe className="h-3 w-3 mr-1" />
//                                   Broadcast
//                                 </Badge>
//                               ) : (
//                                 <Badge variant="outline" className="bg-purple-50 text-purple-700">
//                                   <Users className="h-3 w-3 mr-1" />
//                                   Individual
//                                 </Badge>
//                               )}
//                               <Badge 
//                                 variant={notification.isRead ? "secondary" : "default"}
//                                 className={notification.isRead ? "" : "bg-orange-500"}
//                               >
//                                 {notification.isRead ? 'Read' : 'Unread'}
//                               </Badge>
//                             </div>

//                             <h3 className="text-lg font-semibold text-slate-800 mb-2">
//                               {notification.title}
//                             </h3>
//                             <p className="text-slate-600 mb-4 leading-relaxed">
//                               {notification.message}
//                             </p>

//                             <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
//                               <div className="flex items-center gap-1">
//                                 <MessageCircle className="h-4 w-4" />
//                                 {new Date(notification.createdAt).toLocaleDateString()}
//                               </div>
//                               {notification.user && (
//                                 <div className="flex items-center gap-1">
//                                   <Users className="h-4 w-4" />
//                                   {notification.user.name || notification.user.email}
//                                 </div>
//                               )}
//                             </div>
//                           </div>

//                           <div className="flex flex-col gap-2 ml-6">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => setSelectedNotification(notification)}
//                               disabled={loading}
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleDelete(notification.id)}
//                               disabled={loading}
//                               className="text-red-600 hover:bg-red-50"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               )}
//             </ScrollArea>
//           </CardContent>
//         </Card>

//         {/* View Notification Dialog */}
//         <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
//           <DialogContent className="max-w-lg">
//             <DialogHeader>
//               <DialogTitle>Notification Details</DialogTitle>
//             </DialogHeader>
//             {selectedNotification && (
//               <div className="space-y-4">
//                 <div>
//                   <Label className="text-sm text-slate-500">Title</Label>
//                   <p className="font-medium text-slate-800">{selectedNotification.title}</p>
//                 </div>
//                 <div>
//                   <Label className="text-sm text-slate-500">Message</Label>
//                   <p className="text-slate-700 leading-relaxed">{selectedNotification.message}</p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label className="text-sm text-slate-500">Type</Label>
//                     <p className="font-medium">{getTypeConfig(selectedNotification.type).label}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm text-slate-500">Status</Label>
//                     <p className="font-medium">{selectedNotification.isRead ? 'Read' : 'Unread'}</p>
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="text-sm text-slate-500">Sent At</Label>
//                   <p className="font-medium">
//                     {new Date(selectedNotification.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//                 {selectedNotification.user && (
//                   <div>
//                     <Label className="text-sm text-slate-500">Recipient</Label>
//                     <p className="font-medium">
//                       {selectedNotification.user.name || selectedNotification.user.email}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   )
// }








'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Bell, Plus, Send, Users, MessageCircle, AlertTriangle, Info,
  CheckCircle, RefreshCw, Search, Filter, Trash2, Eye, X, Globe,
  Edit, Save
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Notification {
  id: string
  userId: string | null
  title: string
  message: string
  type: 'BOOKING_CONFIRMATION' | 'PAYMENT_SUCCESS' | 'SCHEDULE_UPDATE' | 'ROUTE_CHANGE' | 'GENERAL' | 'EMERGENCY'
  isRead: boolean
  isBroadcast: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
  } | null
}

interface User {
  id: string
  name: string | null
  email: string
}

interface Operator {
  id: string
  name: string
}

interface NotificationFormData {
  title: string
  message: string
  type: 'BOOKING_CONFIRMATION' | 'PAYMENT_SUCCESS' | 'SCHEDULE_UPDATE' | 'ROUTE_CHANGE' | 'GENERAL' | 'EMERGENCY'
  isBroadcast: boolean
  userId: string | null
}

interface NotificationManagementClientProps {
  operator: Operator
  initialNotifications: Notification[]
  users: User[]
}

const notificationTypes = [
  { value: 'GENERAL', label: 'General', color: 'bg-blue-100 text-blue-700', icon: Info },
  { value: 'BOOKING_CONFIRMATION', label: 'Booking', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'PAYMENT_SUCCESS', label: 'Payment', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  { value: 'SCHEDULE_UPDATE', label: 'Schedule', color: 'bg-orange-100 text-orange-700', icon: MessageCircle },
  { value: 'ROUTE_CHANGE', label: 'Route Change', color: 'bg-purple-100 text-purple-700', icon: MessageCircle },
  { value: 'EMERGENCY', label: 'Emergency', color: 'bg-red-100 text-red-700', icon: AlertTriangle }
] as const

export function NotificationManagementClient({
  operator,
  initialNotifications,
  users
}: NotificationManagementClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    type: 'GENERAL',
    isBroadcast: true,
    userId: null
  })

  // Memoized calculations
  const stats = useMemo(() => {
    const totalNotifications = notifications.length
    const broadcastNotifications = notifications.filter(n => n.isBroadcast).length
    const unreadNotifications = notifications.filter(n => !n.isRead).length
    const emergencyNotifications = notifications.filter(n => n.type === 'EMERGENCY').length

    return {
      total: totalNotifications,
      broadcast: broadcastNotifications,
      unread: unreadNotifications,
      emergency: emergencyNotifications
    }
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = !searchTerm ||
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedType === 'all' || notification.type === selectedType

      const matchesFilter = selectedFilter === 'all' ||
        (selectedFilter === 'broadcast' && notification.isBroadcast) ||
        (selectedFilter === 'individual' && !notification.isBroadcast) ||
        (selectedFilter === 'unread' && !notification.isRead) ||
        (selectedFilter === 'read' && notification.isRead)

      return matchesSearch && matchesType && matchesFilter
    })
  }, [notifications, searchTerm, selectedType, selectedFilter])

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'GENERAL',
      isBroadcast: true,
      userId: null
    })
    setEditingNotification(null)
  }

  // CREATE - Send new notification
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/operator/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to send notification')
      }

      const result = await response.json()

      setNotifications([result.notification, ...notifications])
      toast.success('Notification sent successfully')
      setIsFormOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to send notification')
    } finally {
      setLoading(false)
    }
  }

  // UPDATE - Edit notification
  const openEditForm = (notification: Notification) => {
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isBroadcast: notification.isBroadcast,
      userId: notification.userId
    })
    setEditingNotification(notification)
    setIsFormOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingNotification) return

    setLoading(true)

    try {
      const response = await fetch(`/api/operator/notifications/${editingNotification.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update notification')
      }

      const result = await response.json()

      setNotifications(notifications.map(n =>
        n.id === editingNotification.id ? result.notification : n
      ))
      toast.success('Notification updated successfully')
      setIsFormOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to update notification')
    } finally {
      setLoading(false)
    }
  }

  // UPDATE - Toggle read status
  const toggleReadStatus = async (notificationId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/operator/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: !currentStatus } : n
      ))
      toast.success(`Notification marked as ${!currentStatus ? 'read' : 'unread'}`)
    } catch (error) {
      toast.error('Failed to update notification status')
    }
  }

  // DELETE - Single notification
  const handleDelete = async (notificationId: string) => {
    setLoading(true)

    try {
      const response = await fetch(`/api/operator/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete notification')
      }

      setNotifications(notifications.filter(n => n.id !== notificationId))
      toast.success('Notification deleted successfully')
      setDeleteConfirm(null)
    } catch (error) {
      toast.error('Failed to delete notification')
    } finally {
      setLoading(false)
    }
  }

  // READ - Refresh notifications
  const refreshNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/operator/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        toast.success('Notifications refreshed')
      }
    } catch (error) {
      toast.error('Failed to refresh notifications')
    } finally {
      setLoading(false)
    }
  }

  const getTypeConfig = (type: string) => {
    return notificationTypes.find(t => t.value === type) || notificationTypes[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Notification Management
              </h1>
              <p className="text-sm text-slate-600">Operator: {operator.name}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                  <p className="text-sm text-slate-600 font-medium">Total Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.broadcast}</p>
                  <p className="text-sm text-slate-600 font-medium">Broadcast</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.unread}</p>
                  <p className="text-sm text-slate-600 font-medium">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-rose-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.emergency}</p>
                  <p className="text-sm text-slate-600 font-medium">Emergency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-purple-600" />
                Notification Controls
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={refreshNotifications} variant="outline" disabled={loading}>
                  <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                  Refresh
                </Button>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-gradient-to-r from-purple-500 to-pink-500">
                      <Plus className="h-4 w-4 mr-2" />
                      {editingNotification ? 'Edit' : 'Send'} Notification
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {editingNotification ? 'Edit Notification' : 'Send New Notification'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={editingNotification ? handleUpdate : handleCreate} className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Notification title"
                          required
                        />
                      </div>

                      <div>
                        <Label>Message</Label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Notification message"
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <Label>Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {notificationTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isBroadcast"
                          checked={formData.isBroadcast}
                          onChange={(e) => setFormData({
                            ...formData,
                            isBroadcast: e.target.checked,
                            userId: e.target.checked ? null : formData.userId
                          })}
                        />
                        <Label htmlFor="isBroadcast">Send to all users (Broadcast)</Label>
                      </div>

                      {!formData.isBroadcast && (
                        <div>
                          <Label>Select User</Label>
                          <Select
                            value={formData.userId || ''}
                            onValueChange={(value) => setFormData({ ...formData, userId: value })}
                            required={!formData.isBroadcast}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map(user => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name || user.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={loading} className="flex-1">
                          {editingNotification ? <Save className="h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                          {loading ? 'Processing...' : editingNotification ? 'Update' : 'Send'} Notification
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsFormOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {notificationTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter notifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="broadcast">Broadcast Only</SelectItem>
                  <SelectItem value="individual">Individual Only</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="read">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-purple-600" />
              Notifications ({filteredNotifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">No notifications found</h3>
                  <p className="text-slate-500">Send your first notification to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => {
                    const typeConfig = getTypeConfig(notification.type)
                    const IconComponent = typeConfig.icon

                    return (
                      <div
                        key={notification.id}
                        className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge className={typeConfig.color}>
                                <IconComponent className="h-3 w-3 mr-1" />
                                {typeConfig.label}
                              </Badge>
                              {notification.isBroadcast ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Broadcast
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                  <Users className="h-3 w-3 mr-1" />
                                  Individual
                                </Badge>
                              )}
                              <Badge
                                variant={notification.isRead ? "secondary" : "default"}
                                className={cn(
                                  "cursor-pointer",
                                  notification.isRead ? "" : "bg-orange-500 hover:bg-orange-600"
                                )}
                                onClick={() => toggleReadStatus(notification.id, notification.isRead)}
                              >
                                {notification.isRead ? 'Read' : 'Unread'}
                              </Badge>
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                              {notification.title}
                            </h3>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                              {notification.message}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </div>
                              {notification.user && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {notification.user.name || notification.user.email}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 ml-6">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedNotification(notification)}
                              disabled={loading}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditForm(notification)}
                              disabled={loading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirm(notification.id)}
                              disabled={loading}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* View Notification Dialog */}
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Notification Details</DialogTitle>
            </DialogHeader>
            {selectedNotification && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-500">Title</Label>
                  <p className="font-medium text-slate-800">{selectedNotification.title}</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-500">Message</Label>
                  <p className="text-slate-700 leading-relaxed">{selectedNotification.message}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-slate-500">Type</Label>
                    <p className="font-medium">{getTypeConfig(selectedNotification.type).label}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-500">Status</Label>
                    <p className="font-medium">{selectedNotification.isRead ? 'Read' : 'Unread'}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-slate-500">Sent At</Label>
                  <p className="font-medium">
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedNotification.user && (
                  <div>
                    <Label className="text-sm text-slate-500">Recipient</Label>
                    <p className="font-medium">
                      {selectedNotification.user.name || selectedNotification.user.email}
                    </p>
                  </div>
                )}
                <Separator />
                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditForm(selectedNotification)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => toggleReadStatus(selectedNotification.id, selectedNotification.isRead)}
                    variant="outline"
                    className="flex-1"
                  >
                    Mark as {selectedNotification.isRead ? 'Unread' : 'Read'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete Notification
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-slate-600">
                Are you sure you want to delete this notification? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
