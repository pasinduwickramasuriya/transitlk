"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RatingStars } from "./RatingStars"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface FeedbackFormProps {
    bookingId?: string
    onSuccess?: () => void
}

export function FeedbackForm({ bookingId, onSuccess }: FeedbackFormProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [rating, setRating] = React.useState(5) // Default 5 stars
    const [comment, setComment] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!session) {
            toast.error("You must be logged in to submit a review.")
            return
        }

        setLoading(true)
        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rating,
                    comment,
                    bookingId: bookingId || null,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to submit feedback")
            }

            toast.success("Thank you for your feedback!")
            setComment("")
            if (onSuccess) onSuccess()
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (!session) {
        return (
            <div className="text-center p-4 border rounded-lg bg-gray-50">
                <p className="text-muted-foreground">Please sign in to leave a review.</p>
                <Button variant="link" onClick={() => router.push("/auth/signin")}>
                    Sign In
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
            <div className="space-y-2">
                <Label>Rate your experience</Label>
                <RatingStars
                    currentRating={rating}
                    onRatingChange={setRating}
                    size={28}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                    id="comment"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Review
            </Button>
        </form>
    )
}
