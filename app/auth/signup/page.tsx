



// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// // import { Checkbox } from '@/components/ui/checkbox'
// import {
//   Loader2,
//   Mail,
//   Lock,
//   User,
//   Phone,
//   Eye,
//   EyeOff,
//   Navigation,
//   ArrowRight,
//   AlertCircle,
//   Check,
//   Shield,
//   Users,
//   Zap
// } from 'lucide-react'
// import { toast } from 'sonner'
// import { Checkbox } from '@/components/ui/checkbok'

// const registerSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email address'),
//   phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// })

// type RegisterInput = z.infer<typeof registerSchema>

// export default function SignUpPage() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [acceptTerms, setAcceptTerms] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [focusedField, setFocusedField] = useState<string | null>(null)
//   const router = useRouter()

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm<RegisterInput>({
//     resolver: zodResolver(registerSchema),
//   })

//   const password = watch("password")

//   const onSubmit = async (data: RegisterInput) => {
//     if (!acceptTerms) {
//       toast.error('Please accept the terms and conditions')
//       return
//     }

//     setIsLoading(true)
//     setError('')
//     setSuccess('')

//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: data.name,
//           email: data.email,
//           phoneNumber: data.phoneNumber,
//           password: data.password,
//         }),
//       })

//       const result = await response.json()

//       if (!response.ok) {
//         throw new Error(result.error || 'Something went wrong')
//       }

//       setSuccess('Account created successfully! Redirecting to sign in...')
//       toast.success('Welcome to TransitLK!', {
//         description: 'Your account has been created successfully.'
//       })

//       setTimeout(() => {
//         router.push('/auth/signin')
//       }, 2000)

//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
//       setError(errorMessage)
//       toast.error('Registration failed', {
//         description: errorMessage
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Password strength checker
//   const getPasswordStrength = (password: string) => {
//     if (!password) return { strength: 0, label: '', color: '' }

//     let strength = 0
//     if (password.length >= 6) strength += 1
//     if (password.match(/[a-z]/)) strength += 1
//     if (password.match(/[A-Z]/)) strength += 1
//     if (password.match(/[0-9]/)) strength += 1
//     if (password.match(/[^a-zA-Z0-9]/)) strength += 1

//     const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
//     const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

//     return {
//       strength: strength,
//       label: labels[Math.min(strength - 1, 4)] || '',
//       color: colors[Math.min(strength - 1, 4)] || 'bg-gray-300'
//     }
//   }

//   const passwordStrength = getPasswordStrength(password || '')

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-green-100 relative overflow-hidden">
//       {/* Enhanced Animated Background */}
//       <div className="absolute inset-0">
//         {/* Primary gradient orbs */}
//         <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-emerald-300/30 to-green-400/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-br from-teal-300/25 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

//         {/* Secondary decorative elements */}
//         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-300/15 rounded-full blur-2xl animate-pulse delay-500"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/15 to-pink-300/10 rounded-full blur-2xl animate-pulse delay-1500"></div>

//         {/* Central large orb */}
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-emerald-100/15 to-green-200/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 min-h-screen flex">
//         {/* Left Panel - Branding */}
//         <div className="hidden lg:flex lg:w-2/5 flex-col justify-center p-12 xl:p-16">
//           <div className="max-w-lg">
//             {/* Logo */}
//             <div className="flex items-center mb-12">
//               <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
//                 <Navigation className="h-9 w-9 text-white" />
//               </div>
//               <div className="ml-5">
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                   TransitLK
//                 </h1>
//                 <p className="text-sm font-medium text-emerald-600">Smart Transit Solutions</p>
//               </div>
//             </div>

//             {/* Welcome Text */}
//             <h2 className="text-6xl font-bold text-gray-900 leading-tight mb-8">
//               Join the
//               <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> revolution </span>
//               in transport
//             </h2>

//             <p className="text-xl text-gray-700 mb-12 leading-relaxed font-medium">
//               Create your account and experience the future of Sri Lankan
//               public transport with smart features and real-time insights.
//             </p>

//             {/* Benefits */}
//             <div className="space-y-8">
//               {[
//                 {
//                   icon: Shield,
//                   title: "Secure Registration",
//                   description: "Your personal information is protected with bank-level security"
//                 },
//                 {
//                   icon: Users,
//                   title: "Join 25K+ Users",
//                   description: "Be part of Sri Lanka's largest smart transport community"
//                 },
//                 {
//                   icon: Zap,
//                   title: "Instant Access",
//                   description: "Start booking and tracking buses immediately after signup"
//                 }
//               ].map((benefit, index) => (
//                 <div key={index} className="flex items-start space-x-5">
//                   <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
//                     <benefit.icon className="h-6 w-6 text-emerald-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-900 text-lg">{benefit.title}</h3>
//                     <p className="text-gray-700">{benefit.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Panel - Sign Up Form */}
//         <div className="w-full lg:w-3/5 flex items-center justify-center px-6 sm:px-12">
//           <div className="w-full max-w-md">
//             {/* Mobile Logo */}
//             <div className="lg:hidden flex justify-center mb-10">
//               <div className="flex items-center">
//                 <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
//                   <Navigation className="h-8 w-8 text-white" />
//                 </div>
//                 <span className="ml-4 text-3xl font-bold text-gray-900">TransitLK</span>
//               </div>
//             </div>

//             {/* Transparent Form Container */}
//             <div className="relative">
//               {/* Subtle background for form readability */}
//               <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20"></div>

//               {/* Form Content */}
//               <div className="relative p-8 lg:p-10">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                   <h3 className="text-4xl font-bold text-gray-900 mb-3">Create Account</h3>
//                   <p className="text-gray-700 text-lg">Join TransitLK and start your smart journey</p>
//                 </div>

//                 {/* Success/Error Messages */}
//                 {error && (
//                   <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200 rounded-2xl">
//                     <div className="flex items-center">
//                       <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
//                       <p className="text-red-800 text-sm font-medium">{error}</p>
//                     </div>
//                   </div>
//                 )}

//                 {success && (
//                   <div className="mb-6 p-4 bg-green-100/80 backdrop-blur-sm border border-green-200 rounded-2xl">
//                     <div className="flex items-center">
//                       <Check className="h-5 w-5 text-green-500 mr-3" />
//                       <p className="text-green-800 text-sm font-medium">{success}</p>
//                     </div>
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                   {/* Name Field */}
//                   <div className="space-y-2">
//                     <Label htmlFor="name" className="text-gray-800 font-semibold text-sm">
//                       Full Name
//                     </Label>
//                     <div className="relative group">
//                       <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${focusedField === 'name' ? 'text-emerald-600 scale-110' : 'text-gray-500'
//                         }`}>
//                         <User className="h-5 w-5" />
//                       </div>
//                       <Input
//                         id="name"
//                         type="text"
//                         placeholder="Enter your full name"
//                         className={`pl-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/60 backdrop-blur-sm font-medium ${focusedField === 'name'
//                             ? 'border-emerald-400 bg-white/80 shadow-lg shadow-emerald-500/25'
//                             : 'border-white/40 hover:border-white/60 focus:border-emerald-400 hover:bg-white/70'
//                           } ${errors.name ? 'border-red-400 bg-red-50/60' : ''}`}
//                         {...register('name')}
//                         disabled={isLoading}
//                         onFocus={() => setFocusedField('name')}
//                         onBlur={() => setFocusedField(null)}
//                       />
//                     </div>
//                     {errors.name && (
//                       <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.name.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Email Field */}
//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-gray-800 font-semibold text-sm">
//                       Email Address
//                     </Label>
//                     <div className="relative group">
//                       <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${focusedField === 'email' ? 'text-emerald-600 scale-110' : 'text-gray-500'
//                         }`}>
//                         <Mail className="h-5 w-5" />
//                       </div>
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="Enter your email"
//                         className={`pl-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/60 backdrop-blur-sm font-medium ${focusedField === 'email'
//                             ? 'border-emerald-400 bg-white/80 shadow-lg shadow-emerald-500/25'
//                             : 'border-white/40 hover:border-white/60 focus:border-emerald-400 hover:bg-white/70'
//                           } ${errors.email ? 'border-red-400 bg-red-50/60' : ''}`}
//                         {...register('email')}
//                         disabled={isLoading}
//                         onFocus={() => setFocusedField('email')}
//                         onBlur={() => setFocusedField(null)}
//                       />
//                     </div>
//                     {errors.email && (
//                       <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.email.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Phone Number Field */}
//                   <div className="space-y-2">
//                     <Label htmlFor="phoneNumber" className="text-gray-800 font-semibold text-sm">
//                       Phone Number <span className="text-gray-500 text-xs font-normal">(Optional)</span>
//                     </Label>
//                     <div className="relative group">
//                       <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${focusedField === 'phoneNumber' ? 'text-emerald-600 scale-110' : 'text-gray-500'
//                         }`}>
//                         <Phone className="h-5 w-5" />
//                       </div>
//                       <Input
//                         id="phoneNumber"
//                         type="tel"
//                         placeholder="+94 77 123 4567"
//                         className={`pl-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/60 backdrop-blur-sm font-medium ${focusedField === 'phoneNumber'
//                             ? 'border-emerald-400 bg-white/80 shadow-lg shadow-emerald-500/25'
//                             : 'border-white/40 hover:border-white/60 focus:border-emerald-400 hover:bg-white/70'
//                           } ${errors.phoneNumber ? 'border-red-400 bg-red-50/60' : ''}`}
//                         {...register('phoneNumber')}
//                         disabled={isLoading}
//                         onFocus={() => setFocusedField('phoneNumber')}
//                         onBlur={() => setFocusedField(null)}
//                       />
//                     </div>
//                     {errors.phoneNumber && (
//                       <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.phoneNumber.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Password Field */}
//                   <div className="space-y-2">
//                     <Label htmlFor="password" className="text-gray-800 font-semibold text-sm">
//                       Password
//                     </Label>
//                     <div className="relative group">
//                       <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${focusedField === 'password' ? 'text-emerald-600 scale-110' : 'text-gray-500'
//                         }`}>
//                         <Lock className="h-5 w-5" />
//                       </div>
//                       <Input
//                         id="password"
//                         type={showPassword ? 'text' : 'password'}
//                         placeholder="Create a password"
//                         className={`pl-12 pr-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/60 backdrop-blur-sm font-medium ${focusedField === 'password'
//                             ? 'border-emerald-400 bg-white/80 shadow-lg shadow-emerald-500/25'
//                             : 'border-white/40 hover:border-white/60 focus:border-emerald-400 hover:bg-white/70'
//                           } ${errors.password ? 'border-red-400 bg-red-50/60' : ''}`}
//                         {...register('password')}
//                         disabled={isLoading}
//                         onFocus={() => setFocusedField('password')}
//                         onBlur={() => setFocusedField(null)}
//                       />
//                       <button
//                         type="button"
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                       </button>
//                     </div>

//                     {/* Password Strength Indicator */}
//                     {password && (
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between text-xs">
//                           <span className="text-gray-600 font-medium">Password strength</span>
//                           <span className={`font-bold ${passwordStrength.strength <= 2 ? 'text-red-600' :
//                               passwordStrength.strength <= 3 ? 'text-yellow-600' : 'text-green-600'
//                             }`}>
//                             {passwordStrength.label}
//                           </span>
//                         </div>
//                         <div className="w-full bg-white/40 rounded-full h-2">
//                           <div
//                             className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
//                             style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     )}

//                     {errors.password && (
//                       <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.password.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Confirm Password Field */}
//                   <div className="space-y-2">
//                     <Label htmlFor="confirmPassword" className="text-gray-800 font-semibold text-sm">
//                       Confirm Password
//                     </Label>
//                     <div className="relative group">
//                       <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${focusedField === 'confirmPassword' ? 'text-emerald-600 scale-110' : 'text-gray-500'
//                         }`}>
//                         <Lock className="h-5 w-5" />
//                       </div>
//                       <Input
//                         id="confirmPassword"
//                         type={showConfirmPassword ? 'text' : 'password'}
//                         placeholder="Confirm your password"
//                         className={`pl-12 pr-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/60 backdrop-blur-sm font-medium ${focusedField === 'confirmPassword'
//                             ? 'border-emerald-400 bg-white/80 shadow-lg shadow-emerald-500/25'
//                             : 'border-white/40 hover:border-white/60 focus:border-emerald-400 hover:bg-white/70'
//                           } ${errors.confirmPassword ? 'border-red-400 bg-red-50/60' : ''}`}
//                         {...register('confirmPassword')}
//                         disabled={isLoading}
//                         onFocus={() => setFocusedField('confirmPassword')}
//                         onBlur={() => setFocusedField(null)}
//                       />
//                       <button
//                         type="button"
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       >
//                         {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                       </button>
//                     </div>
//                     {errors.confirmPassword && (
//                       <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
//                         <AlertCircle className="h-4 w-4 mr-1" />
//                         {errors.confirmPassword.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Terms & Conditions */}
//                   <div className="flex items-start space-x-3 py-3">
//                     <Checkbox
//                       id="terms"
//                       checked={acceptTerms}
//                       onCheckedChange={(checked: boolean) => setAcceptTerms(checked as boolean)}
//                       className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 rounded-lg mt-0.5 border-2"
//                     />
//                     <div className="text-sm text-gray-700 leading-relaxed">
//                       <Label htmlFor="terms" className="cursor-pointer font-medium">
//                         I agree to the{' '}
//                         <Link href="/terms" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">
//                           Terms of Service
//                         </Link>{' '}
//                         and{' '}
//                         <Link href="/privacy" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">
//                           Privacy Policy
//                         </Link>
//                       </Label>
//                     </div>
//                   </div>

//                   {/* Create Account Button */}
//                   <Button
//                     type="submit"
//                     className="w-full h-14 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-emerald-500/25 disabled:opacity-70"
//                     disabled={isLoading || !acceptTerms}
//                   >
//                     {isLoading ? (
//                       <div className="flex items-center">
//                         <Loader2 className="h-6 w-6 animate-spin mr-2" />
//                         <span>Creating your account...</span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center">
//                         <span>Create Account</span>
//                         <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
//                       </div>
//                     )}
//                   </Button>
//                 </form>

//                 {/* Sign In Link */}
//                 <div className="text-center mt-8">
//                   <p className="text-gray-700 text-lg">
//                     Already have an account?{' '}
//                     <Link
//                       href="/auth/signin"
//                       className="text-emerald-700 hover:text-emerald-800 font-bold transition-colors hover:underline"
//                     >
//                       Sign in here
//                     </Link>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }




'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { Checkbox } from '@/components/ui/checkbox'
import {
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Navigation,
  ArrowRight,
  AlertCircle,
  Check,
  Shield,
  Users,
  Zap,
  Sparkles,
  Heart
} from 'lucide-react'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbok'

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterInput = z.infer<typeof registerSchema>

export default function SignUpPage() {
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const router = useRouter()

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch("password")

  // Handle form submission
  const onSubmit = async (data: RegisterInput) => {
    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      setSuccess('Account created successfully! Redirecting to sign in...')
      toast.success('Welcome to TransitLK!', {
        description: 'Your account has been created successfully.'
      })

      setTimeout(() => router.push('/auth/signin'), 2000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast.error('Registration failed', { description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }

    let strength = 0
    if (password.length >= 6) strength += 1
    if (password.match(/[a-z]/)) strength += 1
    if (password.match(/[A-Z]/)) strength += 1
    if (password.match(/[0-9]/)) strength += 1
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-400', 'bg-emerald-400']

    return {
      strength: strength,
      label: labels[Math.min(strength - 1, 4)] || '',
      color: colors[Math.min(strength - 1, 4)] || 'bg-slate-300'
    }
  }

  const passwordStrength = getPasswordStrength(password || '')

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 relative overflow-hidden">
      {/* Enhanced Pastel Background */}
      <div className="absolute inset-0">
        {/* Main gradient orbs */}
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/35 via-cyan-200/30 to-emerald-200/35 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-violet-200/30 via-indigo-200/25 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating elements */}
        <div className="absolute top-32 left-1/4 w-6 h-6 bg-rose-300/60 rounded-full animate-bounce delay-300 shadow-lg"></div>
        <div className="absolute top-64 right-1/3 w-4 h-4 bg-violet-400/70 rounded-full animate-bounce delay-700 shadow-md"></div>
        <div className="absolute bottom-40 left-1/2 w-5 h-5 bg-cyan-300/80 rounded-full animate-bounce delay-500 shadow-lg"></div>
        
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-2/5 flex-col justify-center p-12 xl:p-16">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="flex items-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 via-pink-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Navigation className="h-9 w-9 text-white" />
              </div>
              <div className="ml-5">
                <h1 className="text-4xl font-black bg-gradient-to-r from-violet-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                  TransitLK
                </h1>
                <p className="text-sm font-medium text-violet-600">Smart Transit Solutions</p>
              </div>
            </div>

            {/* Welcome Text */}
            <h2 className="text-6xl font-black text-slate-800 leading-tight mb-8">
              Join the
              <span className="bg-gradient-to-r from-violet-600 via-rose-600 to-pink-600 bg-clip-text text-transparent"> revolution </span>
              in transport
            </h2>

            <p className="text-xl text-slate-700 mb-12 leading-relaxed font-medium">
              Create your account and experience the future of Sri Lankan
              public transport with smart features and real-time insights.
            </p>

            {/* Benefits */}
            <div className="space-y-8">
              {[
                {
                  icon: Shield,
                  title: "Secure Registration",
                  description: "Your personal information is protected with bank-level security",
                  gradient: "from-emerald-400 to-green-500"
                },
                {
                  icon: Users,
                  title: "Join 50K+ Users",
                  description: "Be part of Sri Lanka's largest smart transport community",
                  gradient: "from-blue-400 to-cyan-500"
                },
                {
                  icon: Zap,
                  title: "Instant Access",
                  description: "Start booking and tracking buses immediately after signup",
                  gradient: "from-violet-400 to-purple-500"
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-5">
                  <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{benefit.title}</h3>
                    <p className="text-slate-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Sign Up Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-10">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-400 via-pink-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Navigation className="h-8 w-8 text-white" />
                </div>
                <span className="ml-4 text-3xl font-black bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">TransitLK</span>
              </div>
            </div>

            {/* Floating Status Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-lg">
                <Sparkles className="h-4 w-4 text-rose-400 mr-2 animate-spin" />
                <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
                  Join Our Community
                </span>
                <Heart className="h-4 w-4 text-violet-400 ml-2 animate-pulse" />
              </div>
            </div>

            {/* Form Container - Enhanced Glass Effect */}
            <div className="relative">
              {/* Multiple blur layers for enhanced glass effect */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-rose-500/5 via-transparent to-violet-500/5 rounded-3xl"></div>

              {/* Form Content */}
              <div className="relative p-8 lg:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-black text-slate-800 mb-3">Create Account</h3>
                  <p className="text-slate-600 text-lg font-medium">Join TransitLK and start your smart journey</p>
                </div>

                {/* Success/Error Messages */}
                {error && (
                  <div className="mb-6 p-4 bg-red-100/60 backdrop-blur-sm border border-red-200/50 rounded-2xl">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                      <p className="text-red-800 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-emerald-100/60 backdrop-blur-sm border border-emerald-200/50 rounded-2xl">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-500 mr-3" />
                      <p className="text-emerald-800 text-sm font-medium">{success}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-semibold text-sm">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                        focusedField === 'name' ? 'text-violet-600' : 'text-slate-500'
                      }`} />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        className={`pl-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/30 backdrop-blur-sm font-medium ${
                          focusedField === 'name'
                            ? 'border-violet-400/60 bg-white/50 shadow-lg shadow-violet-500/25'
                            : 'border-white/40 hover:border-white/60 focus:border-violet-400/60 hover:bg-white/40'
                        } ${errors.name ? 'border-red-400/60 bg-red-50/30' : ''}`}
                        {...register('name')}
                        disabled={isLoading}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                        focusedField === 'email' ? 'text-violet-600' : 'text-slate-500'
                      }`} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/30 backdrop-blur-sm font-medium ${
                          focusedField === 'email'
                            ? 'border-violet-400/60 bg-white/50 shadow-lg shadow-violet-500/25'
                            : 'border-white/40 hover:border-white/60 focus:border-violet-400/60 hover:bg-white/40'
                        } ${errors.email ? 'border-red-400/60 bg-red-50/30' : ''}`}
                        {...register('email')}
                        disabled={isLoading}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-slate-700 font-semibold text-sm">
                      Phone Number <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <Phone className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                        focusedField === 'phoneNumber' ? 'text-violet-600' : 'text-slate-500'
                      }`} />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+94 77 123 4567"
                        className={`pl-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/30 backdrop-blur-sm font-medium ${
                          focusedField === 'phoneNumber'
                            ? 'border-violet-400/60 bg-white/50 shadow-lg shadow-violet-500/25'
                            : 'border-white/40 hover:border-white/60 focus:border-violet-400/60 hover:bg-white/40'
                        } ${errors.phoneNumber ? 'border-red-400/60 bg-red-50/30' : ''}`}
                        {...register('phoneNumber')}
                        disabled={isLoading}
                        onFocus={() => setFocusedField('phoneNumber')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                        focusedField === 'password' ? 'text-violet-600' : 'text-slate-500'
                      }`} />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        className={`pl-12 pr-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/30 backdrop-blur-sm font-medium ${
                          focusedField === 'password'
                            ? 'border-violet-400/60 bg-white/50 shadow-lg shadow-violet-500/25'
                            : 'border-white/40 hover:border-white/60 focus:border-violet-400/60 hover:bg-white/40'
                        } ${errors.password ? 'border-red-400/60 bg-red-50/30' : ''}`}
                        {...register('password')}
                        disabled={isLoading}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">Password strength</span>
                          <span className={`font-bold ${
                            passwordStrength.strength <= 2 ? 'text-red-600' :
                            passwordStrength.strength <= 3 ? 'text-yellow-600' : 'text-emerald-600'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full bg-white/40 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold text-sm">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                        focusedField === 'confirmPassword' ? 'text-violet-600' : 'text-slate-500'
                      }`} />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className={`pl-12 pr-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/30 backdrop-blur-sm font-medium ${
                          focusedField === 'confirmPassword'
                            ? 'border-violet-400/60 bg-white/50 shadow-lg shadow-violet-500/25'
                            : 'border-white/40 hover:border-white/60 focus:border-violet-400/60 hover:bg-white/40'
                        } ${errors.confirmPassword ? 'border-red-400/60 bg-red-50/30' : ''}`}
                        {...register('confirmPassword')}
                        disabled={isLoading}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start space-x-3 py-3">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={setAcceptTerms}
                      className="data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500 rounded-lg mt-0.5 border-2"
                    />
                    <div className="text-sm text-slate-700 leading-relaxed">
                      <Label htmlFor="terms" className="cursor-pointer font-medium">
                        I agree to the{' '}
                        <Link href="/terms" className="text-violet-700 hover:text-violet-800 font-semibold underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-violet-700 hover:text-violet-800 font-semibold underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </div>

                  {/* Create Account Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-rose-500/25 disabled:opacity-70"
                    disabled={isLoading || !acceptTerms}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Creating your account...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Sparkles className="h-6 w-6 mr-2" />
                        Create Account
                        <ArrowRight className="h-6 w-6 ml-2" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Sign In Link */}
                <div className="text-center mt-8">
                  <p className="text-slate-600 text-lg font-medium">
                    Already have an account?{' '}
                    <Link
                      href="/auth/signin"
                      className="text-violet-700 hover:text-violet-800 font-bold transition-colors hover:underline"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
