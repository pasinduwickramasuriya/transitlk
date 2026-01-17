"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
    maxRating?: number
    currentRating?: number
    onRatingChange?: (rating: number) => void
    readOnly?: boolean
    size?: number
    className?: string
}

export function RatingStars({
    maxRating = 5,
    currentRating = 0,
    onRatingChange,
    readOnly = false,
    size = 20,
    className,
}: RatingStarsProps) {
    const [hoverRating, setHoverRating] = React.useState(0)

    const handleMouseEnter = (index: number) => {
        if (!readOnly) {
            setHoverRating(index)
        }
    }

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverRating(0)
        }
    }

    const handleClick = (index: number) => {
        if (!readOnly && onRatingChange) {
            onRatingChange(index)
        }
    }

    return (
        <div className={cn("flex items-center space-x-1", className)}>
            {Array.from({ length: maxRating }).map((_, i) => {
                const starIndex = i + 1
                return (
                    <Star
                        key={i}
                        size={size}
                        className={cn(
                            "transition-colors",
                            readOnly ? "cursor-default" : "cursor-pointer",
                            starIndex <= (hoverRating || currentRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-transparent text-gray-300"
                        )}
                        onMouseEnter={() => handleMouseEnter(starIndex)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starIndex)}
                    />
                )
            })}
        </div>
    )
}
