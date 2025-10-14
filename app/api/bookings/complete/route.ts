
// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//   apiVersion: '2025-08-27.basil'
// })

// export async function POST(request: NextRequest) {
//   try {
//     console.log('🎯 Starting booking completion...')
    
//     // Get Stripe session ID from request
//     const { sessionId } = await request.json()

//     if (!sessionId) {
//       return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
//     }

//     // 1. Verify Stripe Payment
//     console.log('🔍 Retrieving Stripe session:', sessionId)
//     const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)

//     if (stripeSession.payment_status !== 'paid') {
//       console.log('❌ Payment not completed:', stripeSession.payment_status)
//       return NextResponse.json({ 
//         error: 'Payment not completed',
//         paymentStatus: stripeSession.payment_status 
//       }, { status: 400 })
//     }

//     console.log('✅ Payment verified as PAID')

//     // 2. Extract Metadata
//     const metadata = stripeSession.metadata!
//     console.log('📦 Metadata:', metadata)

//     const {
//       scheduleId,
//       seatNumbers,
//       userId, // This is email
//       journeyDate,
//       departureTime,
//       passengerName,
//       passengerPhone
//     } = metadata

//     // 3. Find User by Email
//     console.log('👤 Finding user:', userId)
//     const user = await prisma.user.findUnique({
//       where: { email: userId }
//     })

//     if (!user) {
//       console.log('❌ User not found')
//       return NextResponse.json({ error: 'User not found' }, { status: 404 })
//     }

//     console.log('✅ User found:', user.id)

//     // 4. Get Schedule Details
//     console.log('🚌 Finding schedule:', scheduleId)
//     const schedule = await prisma.schedule.findUnique({
//       where: { id: scheduleId },
//       include: {
//         bus: true,
//         route: true
//       }
//     })

//     if (!schedule) {
//       console.log('❌ Schedule not found')
//       return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
//     }

//     console.log('✅ Schedule found, Bus:', schedule.bus.busNumber)

//     // 5. Parse Seat Numbers and Amount
//     const seats = seatNumbers.split(',').map(Number)
//     const totalAmount = (stripeSession.amount_total || 0) / 100

//     console.log('💰 Total Amount:', totalAmount, 'LKR')
//     console.log('🪑 Seats:', seats)

//     // 6. Create Multiple Bookings (One per Seat)
//     console.log('💾 Creating bookings for', seats.length, 'seats...')
    
//     const amountPerSeat = totalAmount / seats.length
//     const bookings = []

//     for (const seatNumber of seats) {
//       const booking = await prisma.booking.create({
//         data: {
//           user: { connect: { id: user.id } },
//           schedule: { connect: { id: scheduleId } },
//           bus: { connect: { id: schedule.busId } },
//           seatNumber: seatNumber,
//           passengerName: passengerName || user.name || 'Passenger',
//           passengerPhone: passengerPhone || user.phoneNumber || 'N/A',
//           journeyDate: new Date(journeyDate),
//           status: 'CONFIRMED',
//           totalAmount: amountPerSeat,
//         },
//         include: {
//           schedule: {
//             include: {
//               route: true,
//               bus: true
//             }
//           }
//         }
//       })

//       bookings.push(booking)
//       console.log(`✅ Booking created for seat ${seatNumber}:`, booking.id)
//     }

//     console.log('✅ All', bookings.length, 'bookings created')

//     // 7. Create Single Payment Record (for first booking)
//     console.log('💳 Creating payment record...')
//     const payment = await prisma.payment.create({
//       data: {
//         booking: { connect: { id: bookings[0].id } },
//         amount: totalAmount,
//         currency: 'LKR',
//         method: 'CREDIT_CARD',
//         status: 'COMPLETED',
//         transactionId: stripeSession.payment_intent as string,
//         stripeSessionId: sessionId
//       }
//     })

//     console.log('✅ Payment record created:', payment.id)

//     // 8. Create Ticket (with all seat numbers)
//     console.log('🎫 Creating ticket...')
//     const ticketNumber = `TKT-${Date.now()}-${bookings[0].id.slice(-6).toUpperCase()}`
//     const ticket = await prisma.ticket.create({
//       data: {
//         booking: { connect: { id: bookings[0].id } },
//         ticketNumber: ticketNumber,
//         qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${bookings[0].id}`,
//         isValid: true,
//         isUsed: false
//       }
//     })

//     console.log('✅ Ticket created:', ticket.ticketNumber)



//     // 10. Return Complete Booking Data
//     return NextResponse.json({
//       success: true,
//       booking: {
//         ...bookings[0], // Main booking
//         payment,
//         ticket,
//         seats: seats, // All seat numbers
//         allBookings: bookings, // All individual bookings
//         totalAmount: totalAmount
//       },
//       message: `Booking confirmed for ${seats.length} seat(s)!`
//     })

//   } catch (error: any) {
//     console.error('❌❌❌ BOOKING ERROR:', error.message)
//     console.error('Stack trace:', error.stack)
    
//     return NextResponse.json(
//       { 
//         error: error.message || 'Booking completion failed',
//         details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       },
//       { status: 500 }
//     )
//   }
// }





import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil'
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const meta = session.metadata!
    const seats = meta.seatNumbers.split(',').map(Number)
    const amount = (session.amount_total || 0) / 100

    // Find user
    const user = await prisma.user.findUnique({ where: { email: meta.userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Get schedule
    const schedule = await prisma.schedule.findUnique({
      where: { id: meta.scheduleId },
      include: { bus: true, route: true }
    })
    if (!schedule) return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })

    // Create ONE booking with all seats
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        scheduleId: meta.scheduleId,
        busId: schedule.busId,
        seatNumbers: seats.join(','), // "1,2,3"
        passengerName: meta.passengerName || user.name || 'Passenger',
        passengerPhone: meta.passengerPhone || user.phoneNumber || '',
        journeyDate: new Date(meta.journeyDate),
        status: 'CONFIRMED',
        totalAmount: amount
      },
      include: {
        schedule: { include: { route: true, bus: true } }
      }
    })

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount,
        currency: 'LKR',
        method: 'CREDIT_CARD',
        status: 'COMPLETED',
        transactionId: session.payment_intent as string,
        stripeSessionId: sessionId
      }
    })

    // Create ticket
    const ticketNum = `TKT-${Date.now()}-${booking.id.slice(-6).toUpperCase()}`
    const ticket = await prisma.ticket.create({
      data: {
        bookingId: booking.id,
        ticketNumber: ticketNum,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${booking.id}`,
        isValid: true,
        isUsed: false
      }
    })

    // Send notification
    // await prisma.notification.create({
    //   data: {
    //     userId: user.id,
    //     title: 'Booking Confirmed! 🎉',
    //     message: `Ticket ${ticketNum} confirmed. Seats: ${seats.join(', ')}`,
    //     type: 'BOOKING_CONFIRMATION',
    //     isRead: false
    //   }
    // })

    console.log('✅ Booking complete:', booking.id)

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        payment,
        ticket,
        seats,
        totalAmount: amount
      }
    })

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
