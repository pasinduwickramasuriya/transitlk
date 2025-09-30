



// 'use client'

// import { useState } from 'react'
// import { signIn, getSession } from 'next-auth/react'
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
//   Eye,
//   EyeOff,
//   Navigation,
//   ArrowRight,
//   AlertCircle,
//   Shield,
//   Sparkles,
//   Bus
// } from 'lucide-react'
// import { toast } from 'sonner'
// import { Checkbox } from '@/components/ui/checkbok'

// const loginSchema = z.object({
//   email: z.string().email('Please enter a valid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// })

// type LoginInput = z.infer<typeof loginSchema>

// export default function SignInPage() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [rememberMe, setRememberMe] = useState(false)
//   const [error, setError] = useState('')
//   const [focusedField, setFocusedField] = useState<string | null>(null)
//   const router = useRouter()

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginInput>({
//     resolver: zodResolver(loginSchema),
//   })

//   const onSubmit = async (data: LoginInput) => {
//     setIsLoading(true)
//     setError('')

//     try {
//       const result = await signIn('credentials', {
//         email: data.email,
//         password: data.password,
//         redirect: false,
//       })

//       if (result?.error) {
//         setError('Invalid email or password. Please try again.')
//         toast.error('Sign in failed', {
//           description: 'Please check your credentials and try again.'
//         })
//       } else {
//         const session = await getSession()
//         toast.success('Welcome back!', {
//           description: 'You have been successfully signed in.'
//         })

//         // Redirect based on user role
//         if (session?.user?.role === 'ADMIN') {
//           router.push('/admin')
//         } else if (session?.user?.role === 'OPERATOR') {
//           router.push('/operator')
//         } else {
//           router.push('/dashboard')
//         }
//       }
//     } catch (error) {
//       setError('An unexpected error occurred. Please try again.')
//       toast.error('Something went wrong')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleGoogleSignIn = async () => {
//     setIsLoading(true)
//     try {
//       await signIn('google', { callbackUrl: '/dashboard' })
//     } catch (error) {
//       setError('Failed to sign in with Google. Please try again.')
//       toast.error('Google sign in failed')
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0">
//         <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/10 to-cyan-100/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 min-h-screen flex">
//         {/* Left Panel - Branding */}
//         <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 xl:p-16">
//           <div className="max-w-lg">
//             {/* Logo */}
//             <div className="flex items-center mb-12">
//               <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
//                 <Navigation className="h-8 w-8 text-white" />
//               </div>
//               <div className="ml-4">
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                   TransitLK
//                 </h1>
//                 <p className="text-sm text-gray-500">Smart Transit Solutions</p>
//               </div>
//             </div>

//             {/* Welcome Text */}
//             <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
//               Welcome back to the
//               <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> future </span>
//               of transport
//             </h2>

//             <p className="text-xl text-gray-600 mb-12 leading-relaxed">
//               Sign in to access real-time bus tracking, smart booking system,
//               and comprehensive transport analytics.
//             </p>

//             {/* Features */}
//             <div className="space-y-6">
//               {[
//                 {
//                   icon: Shield,
//                   title: "Secure & Encrypted",
//                   description: "Your data is protected with enterprise-grade security"
//                 },
//                 {
//                   icon: Bus,
//                   title: "Real-time Tracking",
//                   description: "Live GPS tracking with 2-minute accuracy guarantee"
//                 },
//                 {
//                   icon: Sparkles,
//                   title: "Smart Analytics",
//                   description: "Data-driven insights for better transport decisions"
//                 }
//               ].map((feature, index) => (
//                 <div key={index} className="flex items-start space-x-4">
//                   <div className="w-10 h-10 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <feature.icon className="h-5 w-5 text-cyan-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900">{feature.title}</h3>
//                     <p className="text-gray-600 text-sm">{feature.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Panel - Sign In Form */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12">
//           <div className="w-full max-w-md">
//             {/* Mobile Logo */}
//             <div className="lg:hidden flex justify-center mb-8">
//               <div className="flex items-center">
//                 <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
//                   <Navigation className="h-7 w-7 text-white" />
//                 </div>
//                 <span className="ml-3 text-2xl font-bold text-gray-900">TransitLK</span>
//               </div>
//             </div>

//             {/* Sign In Card */}
//             <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8">
//               {/* Header */}
//               <div className="text-center mb-8">
//                 <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
//                 <p className="text-gray-600">Welcome back! Enter your credentials to continue</p>
//               </div>

//               {/* Error Alert */}
//               {error && (
//                 <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
//                   <div className="flex items-center">
//                     <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
//                     <p className="text-red-700 text-sm">{error}</p>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Email Field */}
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
//                     Email Address
//                   </Label>
//                   <div className="relative group">
//                     <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${focusedField === 'email' ? 'text-cyan-500 scale-110' : 'text-gray-400'
//                       }`}>
//                       <Mail className="h-5 w-5" />
//                     </div>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="Enter your email"
//                       className={`pl-12 h-12 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 ${focusedField === 'email'
//                           ? 'border-cyan-400 bg-cyan-50/50 shadow-lg shadow-cyan-500/20'
//                           : 'border-gray-200 hover:border-gray-300 focus:border-cyan-400'
//                         } ${errors.email ? 'border-red-300 bg-red-50/50' : ''}`}
//                       {...register('email')}
//                       disabled={isLoading}
//                       onFocus={() => setFocusedField('email')}
//                       onBlur={() => setFocusedField(null)}
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="text-sm text-red-600 flex items-center mt-1">
//                       <AlertCircle className="h-4 w-4 mr-1" />
//                       {errors.email.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password Field */}
//                 <div className="space-y-2">
//                   <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
//                     Password
//                   </Label>
//                   <div className="relative group">
//                     <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${focusedField === 'password' ? 'text-cyan-500 scale-110' : 'text-gray-400'
//                       }`}>
//                       <Lock className="h-5 w-5" />
//                     </div>
//                     <Input
//                       id="password"
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Enter your password"
//                       className={`pl-12 pr-12 h-12 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 ${focusedField === 'password'
//                           ? 'border-cyan-400 bg-cyan-50/50 shadow-lg shadow-cyan-500/20'
//                           : 'border-gray-200 hover:border-gray-300 focus:border-cyan-400'
//                         } ${errors.password ? 'border-red-300 bg-red-50/50' : ''}`}
//                       {...register('password')}
//                       disabled={isLoading}
//                       onFocus={() => setFocusedField('password')}
//                       onBlur={() => setFocusedField(null)}
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="text-sm text-red-600 flex items-center mt-1">
//                       <AlertCircle className="h-4 w-4 mr-1" />
//                       {errors.password.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Remember Me & Forgot Password */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Checkbox
//                       id="remember"
//                       checked={rememberMe}
//                       onCheckedChange={(checked: boolean) => setRememberMe(checked as boolean)}
//                       className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 rounded-md"
//                     />
//                     <Label
//                       htmlFor="remember"
//                       className="text-sm text-gray-600 cursor-pointer select-none"
//                     >
//                       Remember me
//                     </Label>
//                   </div>
//                   <Link
//                     href="/auth/reset-password"
//                     className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>

//                 {/* Sign In Button */}
//                 <Button
//                   type="submit"
//                   className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center">
//                       <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                       <span>Signing you in...</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center">
//                       <span>Sign In</span>
//                       <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                     </div>
//                   )}
//                 </Button>
//               </form>

//               {/* Divider */}
//               <div className="relative my-8">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-200"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="bg-white px-6 text-gray-500 font-medium">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>

//               {/* Google Sign In */}
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
//                 onClick={handleGoogleSignIn}
//                 disabled={isLoading}
//               >
//                 <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
//                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
//                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//                 </svg>
//                 <span className="font-medium">Continue with Google</span>
//               </Button>

//               {/* Sign Up Link */}
//               <div className="text-center mt-8">
//                 <p className="text-gray-600">
//                   Don't have an account?{' '}
//                   <Link
//                     href="/auth/signup"
//                     className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors hover:underline"
//                   >
//                     Create one now
//                   </Link>
//                 </p>
//               </div>

//               {/* Demo Credentials */}
//               <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50/50 p-5 rounded-2xl border border-gray-100">
//                 <div className="flex items-center mb-3">
//                   <Sparkles className="h-4 w-4 text-cyan-600 mr-2" />
//                   <p className="text-sm font-semibold text-gray-700">Demo Credentials</p>
//                 </div>
//                 <div className="space-y-2 text-xs text-gray-600">
//                   <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
//                     <span className="font-medium text-gray-800">Admin:</span>
//                     <span>admin@transitlk.com / admin123</span>
//                   </div>
//                   <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
//                     <span className="font-medium text-gray-800">Operator:</span>
//                     <span>operator@transitlk.com / operator123</span>
//                   </div>
//                   <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
//                     <span className="font-medium text-gray-800">User:</span>
//                     <span>user@transitlk.com / user123</span>
//                   </div>
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
import { signIn, getSession } from 'next-auth/react'
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
  Eye,
  EyeOff,
  Navigation,
  ArrowRight,
  AlertCircle,
  Shield,
  Sparkles,
  Bus
} from 'lucide-react'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbok'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginInput = z.infer<typeof loginSchema>

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
        toast.error('Sign in failed', {
          description: 'Please check your credentials and try again.'
        })
      } else {
        const session = await getSession()
        toast.success('Welcome back!', {
          description: 'You have been successfully signed in.'
        })

        // Redirect based on user role
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin')
        } else if (session?.user?.role === 'OPERATOR') {
          router.push('/operator')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.')
      toast.error('Google sign in failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Primary gradient orbs */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-cyan-300/30 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-br from-purple-300/25 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Secondary decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-purple-300/15 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/15 to-emerald-300/10 rounded-full blur-2xl animate-pulse delay-1500"></div>
        
        {/* Central large orb */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-blue-100/15 to-cyan-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 xl:p-16">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="flex items-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                <Navigation className="h-9 w-9 text-white" />
              </div>
              <div className="ml-5">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  TransitLK
                </h1>
                <p className="text-sm font-medium text-cyan-600">Smart Transit Solutions</p>
              </div>
            </div>

            {/* Welcome Text */}
            <h2 className="text-6xl font-bold text-gray-900 leading-tight mb-8">
              Welcome back to the
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> future </span>
              of transport
            </h2>

            <p className="text-xl text-gray-700 mb-12 leading-relaxed font-medium">
              Sign in to access real-time bus tracking, smart booking system,
              and comprehensive transport analytics.
            </p>

            {/* Features */}
            <div className="space-y-8">
              {[
                {
                  icon: Shield,
                  title: "Secure & Encrypted",
                  description: "Your data is protected with enterprise-grade security"
                },
                {
                  icon: Bus,
                  title: "Real-time Tracking",
                  description: "Live GPS tracking with 2-minute accuracy guarantee"
                },
                {
                  icon: Sparkles,
                  title: "Smart Analytics",
                  description: "Data-driven insights for better transport decisions"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <feature.icon className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{feature.title}</h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-10">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Navigation className="h-8 w-8 text-white" />
                </div>
                <span className="ml-4 text-3xl font-bold text-gray-900">TransitLK</span>
              </div>
            </div>

            {/* Transparent Form Container */}
            <div className="relative">
              {/* Subtle background for form readability */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20"></div>
              
              {/* Form Content */}
              <div className="relative p-8 lg:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-bold text-gray-900 mb-3">Sign In</h3>
                  <p className="text-gray-700 text-lg">Welcome back! Enter your credentials to continue</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200 rounded-2xl">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                      <p className="text-red-800 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-800 font-semibold text-sm">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
                        focusedField === 'email' ? 'text-cyan-600 scale-110' : 'text-gray-500'
                      }`}>
                        <Mail className="h-5 w-5" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/60 backdrop-blur-sm font-medium ${
                          focusedField === 'email' 
                            ? 'border-cyan-400 bg-white/80 shadow-lg shadow-cyan-500/25' 
                            : 'border-white/40 hover:border-white/60 focus:border-cyan-400 hover:bg-white/70'
                        } ${errors.email ? 'border-red-400 bg-red-50/60' : ''}`}
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

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-800 font-semibold text-sm">
                      Password
                    </Label>
                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
                        focusedField === 'password' ? 'text-cyan-600 scale-110' : 'text-gray-500'
                      }`}>
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`pl-12 pr-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/60 backdrop-blur-sm font-medium ${
                          focusedField === 'password' 
                            ? 'border-cyan-400 bg-white/80 shadow-lg shadow-cyan-500/25' 
                            : 'border-white/40 hover:border-white/60 focus:border-cyan-400 hover:bg-white/70'
                        } ${errors.password ? 'border-red-400 bg-red-50/60' : ''}`}
                        {...register('password')}
                        disabled={isLoading}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-700 flex items-center mt-1 font-medium">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 rounded-lg border-2"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-gray-700 cursor-pointer select-none font-medium"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/auth/reset-password"
                      className="text-sm text-cyan-700 hover:text-cyan-800 font-semibold transition-colors hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-cyan-500/25 disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Signing you in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span>Sign In</span>
                        <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white/20 backdrop-blur-sm px-6 py-1 rounded-full text-gray-700 font-medium border border-white/20">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-2xl border-2 border-white/40 hover:border-white/60 bg-white/60 hover:bg-white/80 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="font-medium text-gray-700">Continue with Google</span>
                </Button>

                {/* Sign Up Link */}
                <div className="text-center mt-8">
                  <p className="text-gray-700 text-lg">
                    Don't have an account?{' '}
                    <Link
                      href="/auth/signup"
                      className="text-cyan-700 hover:text-cyan-800 font-bold transition-colors hover:underline"
                    >
                      Create one now
                    </Link>
                  </p>
                </div>

                {/* Demo Credentials */}
                <div className="mt-8 bg-white/20 backdrop-blur-sm p-5 rounded-2xl border border-white/20">
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-5 w-5 text-cyan-700 mr-2" />
                    <p className="text-sm font-bold text-gray-800">Demo Credentials</p>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <span className="font-bold text-gray-800">Admin:</span>
                      <span className="font-medium">admin@transitlk.com / admin123</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <span className="font-bold text-gray-800">Operator:</span>
                      <span className="font-medium">operator@transitlk.com / operator123</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <span className="font-bold text-gray-800">User:</span>
                      <span className="font-medium">user@transitlk.com / user123</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
