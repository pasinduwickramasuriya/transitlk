import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'OPERATOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const bookingId = params.id

        // Verify ownership (the booking must belong to a bus owned by the operator)
        const operator = await prisma.operator.findFirst({
            where: { isActive: true }
        })

        if (!operator) {
            return NextResponse.json({ error: 'Operator not found' }, { status: 404 })
        }

        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                bus: {
                    operatorId: operator.id
                }
            }
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found or access denied' }, { status: 404 })
        }

        // Cancel the booking
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'CANCELLED',
                // Optionally handle refund logic or seat release here if not handled by detailed business logic
            }
        })

        return NextResponse.json({ success: true, booking: updatedBooking })

    } catch (error) {
        console.error("Cancel Booking Error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
