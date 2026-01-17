import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { rating, comment, bookingId } = await req.json()

        // Enforce "One User, One Review" policy
        // Check if user has already submitted ANY feedback
        const existingFeedback = await prisma.feedback.findFirst({
            where: {
                userId: session.user.id
            }
        })

        if (existingFeedback) {
            // Update existing feedback
            const updatedFeedback = await prisma.feedback.update({
                where: {
                    id: existingFeedback.id
                },
                data: {
                    rating,
                    comment,
                    bookingId: bookingId || existingFeedback.bookingId, // Update bookingId if provided, else keep existing? Or allow nulling it?
                    // Assuming if new review is submitted, we overwrite content.
                    // If bookingId is provided in new request, use it. If not, maybe null it?
                    // Let's assume passed bookingId overrides.
                }
            })
            return NextResponse.json(updatedFeedback)
        }

        // Create new feedback
        const newFeedback = await prisma.feedback.create({
            data: {
                userId: session.user.id,
                bookingId: bookingId || null,
                rating,
                comment,
            },
        })

        return NextResponse.json(newFeedback)
    } catch (error) {
        console.error('Feedback error:', error)
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const limit = searchParams.get('limit')

        const reviews = await prisma.feedback.findMany({
            take: limit ? parseInt(limit) : undefined,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        })

        return NextResponse.json(reviews)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        )
    }
}
