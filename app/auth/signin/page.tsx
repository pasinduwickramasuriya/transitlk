'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Bus,
  Heart
} from 'lucide-react'
import { toast } from 'sonner'
import { saveUser, getReturnUrl, clearReturnUrl, debugAuthState } from '@/utils/auth' // ✅ Import auth functions
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
  const searchParams = useSearchParams()

  // ✅ Get return URL from query params or localStorage
  const returnTo = searchParams?.get('returnTo') || getReturnUrl()
  const fromBooking = searchParams?.get('from') === 'booking'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  // ✅ Debug auth state on component mount
  useEffect(() => {
    debugAuthState()
    console.log('📍 SignIn page loaded with returnTo:', returnTo)
  }, [returnTo])

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError('')

    try {
      console.log('🔄 Attempting login for:', data.email)

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      console.log('📝 SignIn result:', result)

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
        toast.error('Sign in failed', {
          description: 'Please check your credentials and try again.'
        })
      } else {
        // ✅ Get session and save user data
        const session = await getSession()
        console.log('👤 Session after login:', session)

        if (session?.user) {
          // ✅ Save user data to localStorage for quick access
          const userData = {
            id: session.user.id || session.user.email || '',
            name: session.user.name,
            email: session.user.email,
            role: (session.user as any).role || 'USER',
            image: session.user.image
          }

          saveUser(userData)
          console.log('✅ User data saved:', userData)

          toast.success('Welcome back!', {
            description: `Hello ${session.user.name || session.user.email}! 🎉`
          })

          // ✅ Determine redirect location
          let redirectPath = '/dashboard' // Default

          if (fromBooking && returnTo && returnTo !== '/dashboard') {
            // User came from booking flow - return to booking
            redirectPath = returnTo
            clearReturnUrl()
            toast.success('🎫 Ready to continue booking!', {
              description: 'You can now proceed to seat selection.'
            })
          } else if (session.user.role === 'ADMIN') {
            redirectPath = '/admin'
          } else if ((session.user as any).role === 'OPERATOR') {
            redirectPath = '/operator'
          } else if (returnTo && returnTo !== window.location.pathname) {
            // Return to saved URL
            redirectPath = returnTo
            clearReturnUrl()
          }

          console.log('🎯 Redirecting to:', redirectPath)

          // ✅ Small delay for better UX
          setTimeout(() => {
            router.push(redirectPath)
          }, 1000)
        } else {
          setError('Failed to get user session. Please try again.')
          toast.error('Session error', {
            description: 'Please try signing in again.'
          })
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      setError('An unexpected error occurred. Please try again.')
      toast.error('Something went wrong', {
        description: 'Please check your connection and try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      console.log('🔄 Attempting Google sign in...')

      // ✅ Include return URL in Google sign in
      const callbackUrl = returnTo || '/dashboard'
      await signIn('google', {
        callbackUrl,
        redirect: true
      })
    } catch (error) {
      console.error('❌ Google sign in error:', error)
      setError('Failed to sign in with Google. Please try again.')
      toast.error('Google sign in failed')
      setIsLoading(false)
    }
  }


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
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 xl:p-16">
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

            {/* ✅ Enhanced welcome text based on booking context */}
            <h2 className="text-6xl font-black text-slate-800 leading-tight mb-8">
              {fromBooking ? (
                <>
                  Sign in to
                  <span className="bg-gradient-to-r from-violet-600 via-rose-600 to-pink-600 bg-clip-text text-transparent"> book </span>
                  your journey
                </>
              ) : (
                <>
                  Welcome back to the
                  <span className="bg-gradient-to-r from-violet-600 via-rose-600 to-pink-600 bg-clip-text text-transparent"> future </span>
                  of transport
                </>
              )}
            </h2>

            <p className="text-xl text-slate-700 mb-12 leading-relaxed font-medium">
              {fromBooking
                ? "Please sign in to continue with your bus booking and seat selection."
                : "Sign in to access real-time bus tracking, smart booking system, and comprehensive transport analytics."
              }
            </p>

            {/* Features */}
            <div className="space-y-8">
              {(fromBooking ? [
                {
                  icon: Bus,
                  title: "Continue Booking",
                  description: "Your selected route is waiting - just sign in to proceed",
                  gradient: "from-cyan-400 to-blue-500"
                },
                {
                  icon: Shield,
                  title: "Secure Booking",
                  description: "Your booking data is protected with encryption",
                  gradient: "from-emerald-400 to-green-500"
                },
                {
                  icon: Sparkles,
                  title: "Real-time Seats",
                  description: "Live seat availability and instant confirmation",
                  gradient: "from-violet-400 to-purple-500"
                }
              ] : [
                {
                  icon: Shield,
                  title: "Secure & Encrypted",
                  description: "Your data is protected with enterprise-grade security",
                  gradient: "from-emerald-400 to-green-500"
                },
                {
                  icon: Bus,
                  title: "Real-time Tracking",
                  description: "Live GPS tracking with 2-minute accuracy guarantee",
                  gradient: "from-blue-400 to-cyan-500"
                },
                {
                  icon: Sparkles,
                  title: "Smart Analytics",
                  description: "Data-driven insights for better transport decisions",
                  gradient: "from-violet-400 to-purple-500"
                }
              ]).map((feature, index) => (
                <div key={index} className="flex items-start space-x-5">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
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
                <div className="w-14 h-14 bg-gradient-to-br from-rose-400 via-pink-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Navigation className="h-8 w-8 text-white" />
                </div>
                <span className="ml-4 text-3xl font-black bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">TransitLK</span>
              </div>
            </div>

            {/* ✅ Enhanced Floating Status Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-lg">
                <Sparkles className="h-4 w-4 text-rose-400 mr-2 animate-spin" />
                <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
                  {fromBooking ? 'Continue Booking' : 'Welcome Back'}
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
                  <h3 className="text-4xl font-black text-slate-800 mb-3">Sign In</h3>
                  <p className="text-slate-600 text-lg font-medium">
                    {fromBooking
                      ? 'Sign in to continue your booking'
                      : 'Welcome back! Enter your credentials to continue'
                    }
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-6 p-4 bg-red-100/60 backdrop-blur-sm border border-red-200/50 rounded-2xl">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                      <p className="text-red-800 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${focusedField === 'email' ? 'text-violet-600 scale-110' : 'text-slate-500'
                        }`}>
                        <Mail className="h-5 w-5" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/30 backdrop-blur-sm font-medium ${focusedField === 'email'
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

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">
                      Password
                    </Label>
                    <div className="relative group">
                      <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${focusedField === 'password' ? 'text-violet-600 scale-110' : 'text-slate-500'
                        }`}>
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`pl-12 pr-12 h-12 rounded-2xl border-2 transition-all duration-300 bg-white/30 backdrop-blur-sm font-medium ${focusedField === 'password'
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
                        onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                        className="data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500 rounded-lg border-2"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-slate-700 cursor-pointer select-none font-medium"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/auth/reset-password"
                      className="text-sm text-violet-700 hover:text-violet-800 font-semibold transition-colors hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* ✅ Enhanced Sign In Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-rose-500/25 disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Signing you in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Sparkles className="h-6 w-6 mr-2" />
                        <span>{fromBooking ? 'Sign In & Continue Booking' : 'Sign In'}</span>
                        <ArrowRight className="h-6 w-6 ml-2" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/40"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white/30 backdrop-blur-sm px-6 py-1 rounded-full text-slate-600 font-medium border border-white/30">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-2xl border-2 border-white/40 hover:border-white/60 bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 group"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="font-medium text-slate-700">Continue with Google</span>
                </Button>

                {/* Sign Up Link */}
                <div className="text-center mt-8">
                  <p className="text-slate-600 text-lg font-medium">
                    Don't have an account?{' '}
                    <Link
                      href="/auth/signup"
                      className="text-violet-700 hover:text-violet-800 font-bold transition-colors hover:underline"
                    >
                      Create one now
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

























