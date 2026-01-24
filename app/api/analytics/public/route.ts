import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, subMonths, format } from 'date-fns'

export const dynamic = 'force-dynamic' // Ensure real-time data

export async function GET() {
    try {
        // 1. Basic Counts
        const [
            usersCount,
            bookingsCount,
            activeBusesCount,
            activeRoutesCount,
            revenue
        ] = await Promise.all([
            prisma.user.count({ where: { role: 'USER', isActive: true } }),
            prisma.booking.count(),
            prisma.bus.count({ where: { isActive: true } }),
            prisma.route.count({ where: { isActive: true } }),
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'COMPLETED' }
            })
        ])

        // 2. Growth Chart Data (Last 6 Months Bookings)
        // Since MongoDB/Prisma group by date is tricky, we'll do a simpler approach:
        // Fetch counts for specific date ranges (Last 6 months)
        const growthData = []
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i)
            const start = startOfMonth(date)
            const nextMonth = startOfMonth(subMonths(new Date(), i - 1))

            // Limit `nextMonth` to now if it's in future (simplification)

            const count = await prisma.booking.count({
                where: {
                    createdAt: {
                        gte: start,
                        lt: nextMonth
                    }
                }
            })

            growthData.push({
                name: format(date, 'MMM'),
                val: count
            })
        }

        // 3. Satisfaction (Rating)
        // Average rating from Feedback
        const ratingAgg = await prisma.feedback.aggregate({
            _avg: { rating: true },
            where: { rating: { not: undefined } }
        })
        const averageRating = ratingAgg._avg.rating || 4.8 // Default if no ratings

        // Return Data
        return NextResponse.json({
            users: usersCount,
            bookings: bookingsCount,
            buses: activeBusesCount,
            routes: activeRoutesCount,
            revenue: revenue._sum.amount || 0,
            growth: growthData,
            rating: Number(averageRating.toFixed(1))
        })

    } catch (error) {
        console.error('Public Analytics Error:', error)
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }
}
