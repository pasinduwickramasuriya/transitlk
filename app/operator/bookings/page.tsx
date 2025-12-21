import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { BookingsClient } from '@/components/operator/BookingsClient'
import { startOfDay, endOfDay } from 'date-fns'

export default async function OperatorBookingsPage({
    searchParams,
}: {
    searchParams: { date?: string }
}) {
    const session = await getServerSession(authOptions)

    // 1. Security Check
    if (!session || session.user.role !== 'OPERATOR') {
        redirect('/auth/signin')
    }

    // 2. Find Operator Profile
    // (Assuming User is linked to Operator via ID or a specific field)
    const operator = await prisma.operator.findFirst({
        where: {
            isActive: true
            // Add: userId: session.user.id if your schema supports it
        }
    })

    if (!operator) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-slate-900">Operator Profile Not Found</h1>
                    <p className="text-slate-500">Please contact support to link your account.</p>
                </div>
            </div>
        )
    }

    // 3. Handle Date Logic (Default to Today)
    const selectedDate = searchParams.date ? new Date(searchParams.date) : new Date()
    const start = startOfDay(selectedDate)
    const end = endOfDay(selectedDate)

    // 4. Fetch Initial Bookings (Server Side)
    const bookings = await prisma.booking.findMany({
        where: {
            journeyDate: {
                gte: start,
                lte: end
            },
            bus: {
                operatorId: operator.id
            }
        },
        include: {
            user: { select: { name: true, email: true, image: true } },
            schedule: {
                include: {
                    route: true
                }
            },
            bus: true,
            payment: true,
            ticket: true
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })

    // 5. Calculate Initial Stats
    const stats = {
        totalBookings: bookings.length,
        confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
        revenue: bookings.reduce((sum, b) => sum + (b.payment?.status === 'COMPLETED' ? b.totalAmount : 0), 0),
        pending: bookings.filter(b => b.status === 'PENDING').length
    }

    // 6. Pass Data to Client Component
    return (
        <div className="min-h-screen bg-slate-50/50">
            <BookingsClient
                bookings={JSON.parse(JSON.stringify(bookings))}
                initialStats={stats}
                initialDate={selectedDate}
            />
        </div>
    )
}