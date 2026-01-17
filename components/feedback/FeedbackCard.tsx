import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RatingStars } from "./RatingStars"
import { formatDistanceToNow } from "date-fns"
import { Quote } from "lucide-react"

interface FeedbackProps {
    review: {
        id: string
        rating: number
        comment: string | null
        createdAt: string
        user: {
            name: string | null
            image: string | null
        }
    }
}

export function FeedbackCard({ review }: FeedbackProps) {
    return (
        <div className="group relative p-6 bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl"></div>

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                            <AvatarImage src={review.user.image || undefined} alt={review.user.name || "User"} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-violet-100 text-violet-700 font-bold">
                                {review.user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {/* Status dot */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{review.user.name || "Anonymous User"}</p>
                        <p className="text-xs text-slate-500 font-medium">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <Quote className="h-8 w-8 text-rose-200/50 group-hover:text-rose-400/30 transition-colors" />
            </div>

            <div className="mb-3">
                <RatingStars currentRating={review.rating} readOnly size={18} />
            </div>

            {review.comment && (
                <p className="text-slate-600 text-[15px] leading-relaxed relative z-10">
                    "{review.comment}"
                </p>
            )}

            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-violet-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"></div>
        </div>
    )
}
