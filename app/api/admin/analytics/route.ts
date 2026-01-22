
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, subDays, format } from 'date-fns'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const from = searchParams.get('from')
        const to = searchParams.get('to')

        // Default to last 30 days if not provided
        const startDate = from ? new Date(from) : subDays(new Date(), 30)
        const endDate = to ? new Date(to) : new Date()

        console.log(`📊 Fetching analytics from ${startDate.toISOString()} to ${endDate.toISOString()}`)

        // 1. Revenue & Bookings (Aggregated)
        const bookings = await prisma.booking.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                },
                status: {
                    in: ['CONFIRMED', 'COMPLETED']
                }
            },
            include: {
                payment: true
            }
        })

        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
        const totalBookings = bookings.length

        // 2. Total Users (All time vs New in period)
        const totalUsers = await prisma.user.count()
        const newUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })

        // 3. Active Buses
        const activeBuses = await prisma.bus.count({
            where: { isActive: true }
        })

        // 4. Booking Status Distribution
        const bookingsByStatusRaw = await prisma.booking.groupBy({
            by: ['status'],
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _count: {
                _all: true
            }
        })

        const bookingsByStatus = bookingsByStatusRaw.map(item => ({
            name: item.status,
            value: item._count._all
        }))

        // 5. Payment Methods Distribution
        const paymentsRaw = await prisma.payment.groupBy({
            by: ['method'],
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                },
                status: 'COMPLETED'
            },
            _count: {
                _all: true
            }
        })

        const paymentsByMethod = paymentsRaw.map(item => ({
            name: item.method.replace('_', ' '),
            value: item._count._all
        }))

        // 6. Daily Stats (Revenue & Bookings over time)
        // Group bookings by date
        const dailyStatsMap = new Map()

        // Initialize aggregation map
        bookings.forEach(booking => {
            const dateKey = format(booking.createdAt, 'yyyy-MM-dd')
            if (!dailyStatsMap.has(dateKey)) {
                dailyStatsMap.set(dateKey, { date: dateKey, revenue: 0, bookings: 0 })
            }
            const update = dailyStatsMap.get(dateKey)
            update.revenue += booking.totalAmount || 0
            update.bookings += 1
        })

        // Convert to array and sort
        const dailyStats = Array.from(dailyStatsMap.values()).sort((a, b) => a.date.localeCompare(b.date))

        // 7. Recent Transactions (Bookings with Payments)
        const recentTransactions = await prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                payment: { select: { status: true, method: true } }
            }
        })

        return NextResponse.json({
            summary: {
                totalRevenue,
                totalBookings,
                totalUsers,
                newUsers,
                activeBuses
            },
            charts: {
                revenueOverTime: dailyStats,
                bookingsByStatus,
                paymentsByMethod
            },
            recentTransactions: recentTransactions.map(t => ({
                id: t.id,
                user: t.user.name || t.user.email || 'Unknown',
                amount: t.totalAmount,
                status: t.status,
                paymentStatus: t.payment?.status || 'PENDING',
                date: t.createdAt
            }))
        })

    } catch (error: any) {
        console.error('❌ Analytics API Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics data', details: error.message },
            { status: 500 }
        )
    }
}
