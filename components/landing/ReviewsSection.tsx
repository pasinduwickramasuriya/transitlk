"use client"

import * as React from "react"
import { FeedbackList } from "@/components/feedback/FeedbackList"
import { FeedbackForm } from "@/components/feedback/FeedbackForm"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { MessageSquarePlus, Sparkles } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

import { isUserLoggedIn, getCurrentUser, checkAuthStatus } from "@/utils/auth"

export function ReviewsSection() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [refreshKey, setRefreshKey] = React.useState(0)
    const [open, setOpen] = React.useState(false)

    // Sync auth check for side effects (optional, but keep UI purely driven by 'status')
    React.useEffect(() => {
        if (status === 'authenticated') {
            // Ensure local utils are in sync, but don't block UI
            checkAuthStatus()
        }
    }, [status])

    const handleSuccess = () => {
        setRefreshKey((prev) => prev + 1)
        setOpen(false)
    }

    return (
        <section className="relative py-20 bg-gradient-to-br from-rose-50 via-blue-50 to-violet-50 overflow-hidden">
            {/* Enhanced Pastel Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-gradient-to-br from-rose-200/30 via-pink-200/20 to-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/25 via-cyan-200/20 to-emerald-200/25 rounded-full blur-3xl animate-pulse"></div>

                {/* Subtle grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    {/* Floating Status Badge */}
                    <div className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-rose-200/50 shadow-lg mb-8">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse mr-3"></div>
                            <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
                                Community Voices
                            </span>
                            <Sparkles className="h-4 w-4 text-rose-400 ml-2" />
                        </div>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
                        <span className="block mb-2">Stories from</span>
                        <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-rose-600 bg-clip-text text-transparent">
                            The Journey
                        </span>
                    </h2>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join thousands of commuters sharing their experiences. Your feedback helps us drive the future of transport.
                    </p>

                    {status === 'loading' ? (
                        <Button
                            size="lg"
                            className="bg-slate-100 text-slate-400 px-8 py-6 rounded-3xl text-lg font-bold shadow-none cursor-not-allowed"
                            disabled
                        >
                            <Sparkles className="mr-3 h-6 w-6 animate-pulse" />
                            Loading...
                        </Button>
                    ) : status === 'authenticated' ? (
                        <Button
                            size="lg"
                            className="group relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:from-rose-600 hover:via-pink-600 hover:to-violet-700 text-white px-8 py-6 rounded-3xl text-lg font-bold shadow-xl hover:shadow-rose-500/25 transition-all duration-300 transform hover:scale-105"
                            onClick={() => setOpen(true)}
                        >
                            <MessageSquarePlus className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                            Write a Review
                            <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000"></div>
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="group relative overflow-hidden bg-white/50 backdrop-blur-md border border-white/60 hover:bg-white/70 text-slate-700 px-8 py-6 rounded-3xl text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
                            onClick={() => router.push(`/auth/signin?returnTo=${encodeURIComponent(pathname)}`)}
                        >
                            <MessageSquarePlus className="mr-3 h-6 w-6 opacity-50" />
                            Sign in to Review
                        </Button>
                    )}

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-xl border-white/40">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">Share your experience</DialogTitle>
                                <DialogDescription className="text-slate-600">
                                    Your feedback helps us improve the journey for everyone.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <FeedbackForm onSuccess={handleSuccess} />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <FeedbackList key={refreshKey} limit={6} />
            </div>
        </section>
    )
}
