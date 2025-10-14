// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { getServerSession } from 'next-auth'

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession()
    
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email }
//     })

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 })
//     }

//     const body = await request.json()
//     const {
//       scheduleId,
//       busId,
//       seatNumber,
//       passengerName,
//       passengerPhone,
//       journeyDate,
//       totalAmount
//     } = body

//     // Validate required fields
//     if (!scheduleId || !busId || !passengerName || !passengerPhone || !journeyDate || !totalAmount) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       )
//     }

//     // Check if seat is available (if seat number provided)
//     if (seatNumber) {
//       const existingBooking = await prisma.booking.findFirst({
//         where: {
//           scheduleId,
//           seatNumber,
//           journeyDate: new Date(journeyDate),
//           status: { in: ['CONFIRMED', 'PENDING'] }
//         }
//       })

//       if (existingBooking) {
//         return NextResponse.json(
//           { error: 'Seat is already booked' },
//           { status: 400 }
//         )
//       }
//     }

//     // Create booking using transaction
//     const result = await prisma.$transaction(async (tx) => {
//       // Create booking
//       const booking = await tx.booking.create({
//         data: {
//           userId: user.id,
//           scheduleId,
//           busId,
//           seatNumber,
//           passengerName,
//           passengerPhone,
//           journeyDate: new Date(journeyDate),
//           totalAmount,
//           status: 'PENDING'
//         }
//       })

//       // Create ticket
//       const ticket = await tx.ticket.create({
//         data: {
//           bookingId: booking.id,
//           ticketNumber: `TLK-${Date.now()}-${booking.id.slice(-4)}`,
//           qrCode: `QR-${booking.id}`,
//           isValid: true,
//           isUsed: false
//         }
//       })

//       // Create payment record
//       const payment = await tx.payment.create({
//         data: {
//           bookingId: booking.id,
//           amount: totalAmount,
//           method: 'CREDIT_CARD', // You would get this from the frontend
//           status: 'PENDING'
//         }
//       })

//       return { booking, ticket, payment }
//     })

//     return NextResponse.json({
//       message: 'Booking created successfully',
//       bookingId: result.booking.id,
//       ticketNumber: result.ticket.ticketNumber
//     })

//   } catch (error) {
//     console.error('Create booking error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }
