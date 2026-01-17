"use client"

import * as React from "react"
import { FeedbackCard } from "./FeedbackCard"
import { Loader2 } from "lucide-react"

interface FeedbackListProps {
    limit?: number
}

interface Review {
    id: string
    rating: number
    comment: string | null
    createdAt: string
    user: {
        name: string | null
        image: string | null
    }
}

export function FeedbackList({ limit }: FeedbackListProps) {
    const [reviews, setReviews] = React.useState<Review[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchReviews = async () => {
            try {
                const url = limit ? `/api/feedback?limit=${limit}` : "/api/feedback"
                const response = await fetch(url)
                if (response.ok) {
                    const data = await response.json()
                    setReviews(data)
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [limit])

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500">
                No reviews yet. Be the first to share your experience!
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
                <FeedbackCard key={review.id} review={review} />
            ))}
        </div>
    )
}
