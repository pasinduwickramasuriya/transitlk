// 'use client'

// import { useState } from 'react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Switch } from '@/components/ui/switch'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Bell, 
//   Shield, 
//   CreditCard, 
//   Camera,
//   Save,
//   Eye,
//   EyeOff
// } from 'lucide-react'

// interface UserProfile {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   phone: string
//   dateOfBirth: string
//   gender: string
//   address: string
//   city: string
//   profileImage?: string
//   emailVerified: boolean
//   phoneVerified: boolean
//   memberSince: string
// }

// interface NotificationSettings {
//   emailNotifications: boolean
//   smsNotifications: boolean
//   pushNotifications: boolean
//   bookingUpdates: boolean
//   promotionalEmails: boolean
//   weeklyNewsletter: boolean
// }

// export default function ProfilePage() {
//   const [isEditing, setIsEditing] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [isSaving, setIsSaving] = useState(false)

//   // Mock data - replace with real API calls
//   const [profile, setProfile] = useState<UserProfile>({
//     id: '1',
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'john.doe@example.com',
//     phone: '+94 77 123 4567',
//     dateOfBirth: '1995-05-15',
//     gender: 'male',
//     address: '123 Main Street, Colombo 03',
//     city: 'Colombo',
//     emailVerified: true,
//     phoneVerified: true,
//     memberSince: '2024-01-15'
//   })

//   const [notifications, setNotifications] = useState<NotificationSettings>({
//     emailNotifications: true,
//     smsNotifications: true,
//     pushNotifications: false,
//     bookingUpdates: true,
//     promotionalEmails: false,
//     weeklyNewsletter: true
//   })

//   const handleSave = async () => {
//     setIsSaving(true)
    
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000))
    
//     setIsSaving(false)
//     setIsEditing(false)
//     alert('Profile updated successfully!')
//   }

//   const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
//     setNotifications(prev => ({ ...prev, [key]: value }))
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
//           <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
//         </div>
//         <div className="flex gap-2">
//           {isEditing ? (
//             <>
//               <Button 
//                 variant="outline" 
//                 onClick={() => setIsEditing(false)}
//                 disabled={isSaving}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleSave} disabled={isSaving}>
//                 <Save className="w-4 h-4 mr-2" />
//                 {isSaving ? 'Saving...' : 'Save Changes'}
//               </Button>
//             </>
//           ) : (
//             <Button onClick={() => setIsEditing(true)}>
//               Edit Profile
//             </Button>
//           )}
//         </div>
//       </div>

//       <Tabs defaultValue="personal" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="personal">Personal Info</TabsTrigger>
//           <TabsTrigger value="notifications">Notifications</TabsTrigger>
//           <TabsTrigger value="payment">Payment</TabsTrigger>
//           <TabsTrigger value="security">Security</TabsTrigger>
//         </TabsList>

//         {/* Personal Information */}
//         <TabsContent value="personal" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <User className="w-5 h-5" />
//                 Personal Information
//               </CardTitle>
//               <CardDescription>
//                 Update your personal details and contact information
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Profile Picture */}
//               <div className="flex items-center gap-6">
//                 <Avatar className="w-24 h-24">
//                   <AvatarImage src={profile.profileImage} />
//                   <AvatarFallback className="text-2xl">
//                     {profile.firstName[0]}{profile.lastName[0]}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h3 className="font-medium mb-2">Profile Picture</h3>
//                   <Button variant="outline" size="sm" disabled={!isEditing}>
//                     <Camera className="w-4 h-4 mr-2" />
//                     Change Photo
//                   </Button>
//                   <p className="text-xs text-gray-500 mt-2">
//                     JPG, PNG or GIF. Max size 2MB.
//                   </p>
//                 </div>
//               </div>

//               <Separator />

//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="firstName">First Name</Label>
//                   <Input
//                     id="firstName"
//                     value={profile.firstName}
//                     onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="lastName">Last Name</Label>
//                   <Input
//                     id="lastName"
//                     value={profile.lastName}
//                     onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <div className="flex gap-2">
//                     <Input
//                       id="email"
//                       type="email"
//                       value={profile.email}
//                       onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
//                       disabled={!isEditing}
//                       className="flex-1"
//                     />
//                     <Badge variant={profile.emailVerified ? "default" : "destructive"}>
//                       {profile.emailVerified ? "Verified" : "Unverified"}
//                     </Badge>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <div className="flex gap-2">
//                     <Input
//                       id="phone"
//                       value={profile.phone}
//                       onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
//                       disabled={!isEditing}
//                       className="flex-1"
//                     />
//                     <Badge variant={profile.phoneVerified ? "default" : "destructive"}>
//                       {profile.phoneVerified ? "Verified" : "Unverified"}
//                     </Badge>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="dateOfBirth">Date of Birth</Label>
//                   <Input
//                     id="dateOfBirth"
//                     type="date"
//                     value={profile.dateOfBirth}
//                     onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="gender">Gender</Label>
//                   <Select 
//                     value={profile.gender} 
//                     onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
//                     disabled={!isEditing}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="male">Male</SelectItem>
//                       <SelectItem value="female">Female</SelectItem>
//                       <SelectItem value="other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Address Information */}
//               <Separator />
//               <div className="space-y-4">
//                 <h3 className="font-medium">Address Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="address">Street Address</Label>
//                     <Textarea
//                       id="address"
//                       value={profile.address}
//                       onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
//                       disabled={!isEditing}
//                       rows={3}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="city">City</Label>
//                     <Select 
//                       value={profile.city} 
//                       onValueChange={(value) => setProfile(prev => ({ ...prev, city: value }))}
//                       disabled={!isEditing}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Colombo">Colombo</SelectItem>
//                         <SelectItem value="Kandy">Kandy</SelectItem>
//                         <SelectItem value="Galle">Galle</SelectItem>
//                         <SelectItem value="Jaffna">Jaffna</SelectItem>
//                         <SelectItem value="Anuradhapura">Anuradhapura</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>

//               {/* Account Info */}
//               <Separator />
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-medium mb-2">Account Information</h3>
//                 <p className="text-sm text-gray-600">
//                   Member since: {new Date(profile.memberSince).toLocaleDateString()}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Account ID: {profile.id}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Notifications */}
//         <TabsContent value="notifications" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Bell className="w-5 h-5" />
//                 Notification Preferences
//               </CardTitle>
//               <CardDescription>
//                 Choose how you want to be notified
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label htmlFor="emailNotifications">Email Notifications</Label>
//                     <p className="text-sm text-gray-600">Receive notifications via email</p>
//                   </div>
//                   <Switch
//                     id="emailNotifications"
//                     checked={notifications.emailNotifications}
//                     onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label htmlFor="smsNotifications">SMS Notifications</Label>
//                     <p className="text-sm text-gray-600">Receive notifications via SMS</p>
//                   </div>
//                   <Switch
//                     id="smsNotifications"
//                     checked={notifications.smsNotifications}
//                     onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label htmlFor="bookingUpdates">Booking Updates</Label>
//                     <p className="text-sm text-gray-600">Notifications about your trips</p>
//                   </div>
//                   <Switch
//                     id="bookingUpdates"
//                     checked={notifications.bookingUpdates}
//                     onCheckedChange={(checked) => handleNotificationChange('bookingUpdates', checked)}
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Payment Methods */}
//         <TabsContent value="payment" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <CardTitle className="flex items-center gap-2">
//                     <CreditCard className="w-5 h-5" />
//                     Payment Methods
//                   </CardTitle>
//                   <CardDescription>
//                     Manage your saved payment methods
//                   </CardDescription>
//                 </div>
//                 <Button>Add Payment Method</Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-4 border rounded-lg">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
//                       <CreditCard className="w-4 h-4 text-gray-500" />
//                     </div>
//                     <div>
//                       <p className="font-medium">Visa •••• 4567</p>
//                       <p className="text-sm text-gray-600">Expires 12/26</p>
//                       <Badge variant="outline" className="mt-1">Default</Badge>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button variant="outline" size="sm">Edit</Button>
//                     <Button variant="outline" size="sm">Remove</Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Security */}
//         <TabsContent value="security" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Shield className="w-5 h-5" />
//                 Security Settings
//               </CardTitle>
//               <CardDescription>
//                 Manage your account security
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Password */}
//               <div className="space-y-4">
//                 <h3 className="font-medium">Password</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="currentPassword">Current Password</Label>
//                     <div className="relative">
//                       <Input
//                         id="currentPassword"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter current password"
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="absolute right-2 top-1/2 -translate-y-1/2"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="newPassword">New Password</Label>
//                     <Input
//                       id="newPassword"
//                       type="password"
//                       placeholder="Enter new password"
//                     />
//                   </div>
//                 </div>
//                 <Button variant="outline">Update Password</Button>
//               </div>

//               <Separator />

//               {/* Two-Factor Authentication */}
//               <div className="space-y-4">
//                 <h3 className="font-medium">Two-Factor Authentication</h3>
//                 <div className="flex items-center justify-between p-4 border rounded-lg">
//                   <div>
//                     <p className="font-medium">SMS Authentication</p>
//                     <p className="text-sm text-gray-600">
//                       Receive verification codes via SMS
//                     </p>
//                   </div>
//                   <Button variant="outline">Enable</Button>
//                 </div>
//               </div>

//               <Separator />

//               {/* Danger Zone */}
//               <div className="space-y-4">
//                 <h3 className="font-medium text-red-600">Danger Zone</h3>
//                 <div className="space-y-2">
//                   <Button variant="outline" className="w-full justify-start">
//                     Download Account Data
//                   </Button>
//                   <Button variant="destructive" className="w-full justify-start">
//                     Delete Account
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }



'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  CreditCard, 
  Camera,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  profileImage?: string
  emailVerified: boolean
  phoneVerified: boolean
  memberSince: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  bookingUpdates: boolean
  promotionalEmails: boolean
  weeklyNewsletter: boolean
}

// Helper function to format date consistently
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    // Use consistent format: YYYY-MM-DD or custom format
    return date.toISOString().split('T')[0] // Returns YYYY-MM-DD format
    
    // Alternative: Use a specific locale consistently
    // return date.toLocaleDateString('en-US', { 
    //   year: 'numeric', 
    //   month: '2-digit', 
    //   day: '2-digit' 
    // })
  } catch {
    return dateString
  }
}

// Helper function for display date format
const formatDisplayDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } catch {
    return dateString
  }
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Mock data - replace with real API calls
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+94 77 123 4567',
    dateOfBirth: '1995-05-15',
    gender: 'male',
    address: '123 Main Street, Colombo 03',
    city: 'Colombo',
    emailVerified: true,
    phoneVerified: true,
    memberSince: '2024-01-15'
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    bookingUpdates: true,
    promotionalEmails: false,
    weeklyNewsletter: true
  })

  // Fix hydration by ensuring client-side rendering for dynamic content
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Replace with actual API call
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          dateOfBirth: profile.dateOfBirth,
          gender: profile.gender,
          address: profile.address,
          city: profile.city
        }),
      })

      if (response.ok) {
        alert('Profile updated successfully!')
        setIsEditing(false)
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  // Don't render dynamic content until client-side hydration is complete
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>
          <div className="flex gap-2">
            <Button disabled>Loading...</Button>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.profileImage} />
                  <AvatarFallback className="text-2xl">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium mb-2">Profile Picture</h3>
                  <Button variant="outline" size="sm" disabled={!isEditing}>
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                    <Badge variant={profile.emailVerified ? "default" : "destructive"}>
                      {profile.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                    <Badge variant={profile.phoneVerified ? "default" : "destructive"}>
                      {profile.phoneVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={profile.gender} 
                    onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address Information */}
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select 
                      value={profile.city} 
                      onValueChange={(value) => setProfile(prev => ({ ...prev, city: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Colombo">Colombo</SelectItem>
                        <SelectItem value="Kandy">Kandy</SelectItem>
                        <SelectItem value="Galle">Galle</SelectItem>
                        <SelectItem value="Jaffna">Jaffna</SelectItem>
                        <SelectItem value="Anuradhapura">Anuradhapura</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Account Info - Fixed hydration issue */}
              <Separator />
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Account Information</h3>
                <p className="text-sm text-gray-600">
                  Member since: {formatDisplayDate(profile.memberSince)}
                </p>
                <p className="text-sm text-gray-600">
                  Account ID: {profile.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bookingUpdates">Booking Updates</Label>
                    <p className="text-sm text-gray-600">Notifications about your trips</p>
                  </div>
                  <Switch
                    id="bookingUpdates"
                    checked={notifications.bookingUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('bookingUpdates', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Methods
                  </CardTitle>
                  <CardDescription>
                    Manage your saved payment methods
                  </CardDescription>
                </div>
                <Button>Add Payment Method</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">Visa •••• 4567</p>
                      <p className="text-sm text-gray-600">Expires 12/26</p>
                      <Badge variant="outline" className="mt-1">Default</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password */}
              <div className="space-y-4">
                <h3 className="font-medium">Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                <Button variant="outline">Update Password</Button>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">SMS Authentication</p>
                    <p className="text-sm text-gray-600">
                      Receive verification codes via SMS
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>

              <Separator />

              {/* Danger Zone */}
              <div className="space-y-4">
                <h3 className="font-medium text-red-600">Danger Zone</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Download Account Data
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
