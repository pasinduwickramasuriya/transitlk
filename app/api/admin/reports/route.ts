
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, subDays } from 'date-fns'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const from = searchParams.get('from')
        const to = searchParams.get('to')

        if (!type) {
            return NextResponse.json({ error: 'Report type is required' }, { status: 400 })
        }

        // Date Range Logic
        const startDate = from ? new Date(from) : subDays(new Date(), 30)
        const endDate = to ? new Date(to) : new Date()

        let data = []

        switch (type) {
            case 'REVENUE':
                data = await prisma.payment.findMany({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate
                        },
                        status: 'COMPLETED'
                    },
                    include: {
                        booking: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                })
                // Transform for report
                data = data.map(p => ({
                    Date: p.createdAt.toISOString().split('T')[0],
                    BookingID: p.booking?.id || 'N/A',
                    Customer: p.booking?.user?.name || p.booking?.user?.email || 'Unknown',
                    Method: p.method,
                    Amount: p.amount,
                    Currency: p.currency
                }))
                break

            case 'BOOKINGS':
                data = await prisma.booking.findMany({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    include: {
                        user: true,
                        bus: true,
                        schedule: {
                            include: {
                                route: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                })
                data = data.map(b => ({
                    Date: b.createdAt.toISOString().split('T')[0],
                    BookingID: b.id,
                    Customer: b.user?.name || b.user?.email,
                    Route: b.schedule?.route?.routeNumber || 'N/A',
                    Bus: b.bus?.busNumber || 'N/A',
                    Status: b.status,
                    Amount: b.totalAmount
                }))
                break

            case 'PASSENGERS':
                // For passengers, we might want to see who booked in this period
                // or just list all users. Let's do users active/created in period or just all users if range is wide?
                // Let's stick to users who made bookings in this range for specific report, OR just new users.
                // Standard report: "New User Registrations" in period
                data = await prisma.user.findMany({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate
                        },
                        role: 'USER'
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true,
                        createdAt: true,
                        _count: {
                            select: { bookings: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                })
                data = data.map(u => ({
                    DateJoined: u.createdAt.toISOString().split('T')[0],
                    Name: u.name || 'N/A',
                    Email: u.email,
                    Phone: u.phoneNumber || 'N/A',
                    TotalBookings: u._count.bookings
                }))
                break

            case 'OPERATIONS':
                // Bus Performance in this period
                const buses = await prisma.bus.findMany({
                    include: {
                        _count: {
                            select: {
                                bookings: {
                                    where: {
                                        createdAt: { gte: startDate, lte: endDate }
                                    }
                                }
                            }
                        },
                        bookings: {
                            where: {
                                createdAt: { gte: startDate, lte: endDate },
                                status: 'CONFIRMED'
                            },
                            select: {
                                totalAmount: true
                            }
                        }
                    }
                })

                data = buses.map(bus => ({
                    BusNumber: bus.busNumber,
                    Type: bus.busType,
                    Capacity: bus.capacity,
                    TripsBooked: bus._count.bookings,
                    Revenue: bus.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
                }))
                break

            default:
                return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
        }

        return NextResponse.json({
            data,
            meta: {
                type,
                count: data.length,
                generatedAt: new Date().toISOString()
            }
        })

    } catch (error: any) {
        console.error('Report Generation Error:', error)
        return NextResponse.json(
            { error: 'Failed to generate report', details: error.message },
            { status: 500 }
        )
    }
}
