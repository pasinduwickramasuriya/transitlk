// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// //   apiVersion: '2024-11-20.acacia'
// apiVersion: '2025-08-27.basil'
// })

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const body = await request.json()
//     const { 
//       scheduleId, 
//       seatNumbers, 
//       totalAmount, 
//       routeName, 
//       busNumber,
//       journeyDate,
//       departureTime 
//     } = body

//     // Create Stripe Checkout Session
//     const checkoutSession = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'lkr',
//             product_data: {
//               name: `Bus Ticket: ${routeName}`,
//               description: `Bus ${busNumber} | Seats: ${seatNumbers.join(', ')} | ${journeyDate} at ${departureTime}`,
//               images: ['https://your-domain.com/bus-ticket-image.png']
//             },
//             unit_amount: Math.round(totalAmount * 100), // Convert to cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking?cancelled=true`,
//       customer_email: session.user.email,
//       metadata: {
//         scheduleId,
//         seatNumbers: seatNumbers.join(','),
//         userId: session.user.id || session.user.email,
//         journeyDate,
//         departureTime
//       }
//     })

//     return NextResponse.json({ 
//       sessionId: checkoutSession.id,
//       url: checkoutSession.url 
//     })
//   } catch (error: any) {
//     console.error('Stripe checkout error:', error)
//     return NextResponse.json(
//       { error: error.message || 'Payment initialization failed' },
//       { status: 500 }
//     )
//   }
// }





import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

// Initialize Stripe with error handling
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil'
})

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please login to continue' }, { status: 401 })
    }

    // 2. Get request data
    const body = await request.json()
    console.log('📦 Received booking data:', body)

    const { 
      totalAmount, 
      routeName, 
      busNumber,
      scheduleId,
      seatNumbers,
      journeyDate,
      departureTime,
      passengerName,
      passengerPhone
    } = body

    // 3. Validate required fields
    if (!totalAmount || !routeName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 4. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'lkr',
            product_data: {
              name: `Bus Ticket: ${routeName}`,
              description: `Bus ${busNumber} | Seats: ${seatNumbers?.join(', ') || 'N/A'} | ${journeyDate} at ${departureTime}`,
            },
            unit_amount: Math.round(totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking?cancelled=true`,
      customer_email: session.user.email,
      metadata: {
        scheduleId: scheduleId || '',
        seatNumbers: seatNumbers?.join(',') || '',
        userId: session.user.email,
        journeyDate: journeyDate || '',
        departureTime: departureTime || '',
        passengerName: passengerName || '',
        passengerPhone: passengerPhone || ''
      }
    })

    console.log('✅ Stripe session created:', checkoutSession.id)

    return NextResponse.json({ 
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })

  } catch (error: any) {
    console.error('❌ Stripe checkout error:', error)
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: error.message || 'Payment initialization failed',
        details: error.type || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
