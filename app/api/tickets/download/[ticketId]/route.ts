// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import PDFDocument from 'pdfkit'

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { ticketId: string } }
// ) {
//   try {
//     const { ticketId } = params

//     // Get ticket with all related data
//     const ticket = await prisma.ticket.findUnique({
//       where: { id: ticketId },
//       include: {
//         booking: {
//           include: {
//             schedule: {
//               include: {
//                 bus: true,
//                 route: {
//                   include: {
//                     operator: true
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     })

//     if (!ticket) {
//       return NextResponse.json(
//         { success: false, error: 'Ticket not found' },
//         { status: 404 }
//       )
//     }

//     // Generate PDF
//     const doc = new PDFDocument({ margin: 50 })
//     const chunks: Buffer[] = []

//     doc.on('data', (chunk) => chunks.push(chunk))
    
//     return new Promise((resolve) => {
//       doc.on('end', () => {
//         const pdfBuffer = Buffer.concat(chunks)
        
//         const response = new NextResponse(pdfBuffer, {
//           status: 200,
//           headers: {
//             'Content-Type': 'application/pdf',
//             'Content-Disposition': `attachment; filename="ticket-${ticket.ticketNumber}.pdf"`,
//             'Content-Length': pdfBuffer.length.toString()
//           }
//         })
        
//         resolve(response)
//       })

//       // PDF Content
//       doc.fontSize(20).text('TransitLK Bus Ticket', { align: 'center' })
//       doc.moveDown()
      
//       // Ticket Details
//       doc.fontSize(12)
//       doc.text(`Ticket Number: ${ticket.ticketNumber}`)
//       doc.text(`Passenger: ${ticket.booking.passengerName}`)
//       doc.text(`Phone: ${ticket.booking.passengerPhone}`)
//       doc.moveDown()
      
//       // Journey Details
//       doc.text(`Route: ${ticket.booking.schedule.route.startLocation} → ${ticket.booking.schedule.route.endLocation}`)
//       doc.text(`Bus: ${ticket.booking.schedule.bus.busNumber} (${ticket.booking.schedule.bus.busType})`)
//       doc.text(`Operator: ${ticket.booking.schedule.route.operator.name}`)
//       doc.text(`Seat: ${ticket.booking.seatNumbers}`)
//       doc.text(`Journey Date: ${ticket.booking.journeyDate.toLocaleDateString()}`)
//       doc.text(`Departure: ${ticket.booking.schedule.departureTime}`)
//       doc.text(`Arrival: ${ticket.booking.schedule.arrivalTime}`)
//       doc.moveDown()
      
//       // Amount
//       doc.text(`Total Amount: LKR ${ticket.booking.totalAmount.toLocaleString()}`)
//       doc.moveDown()
      
//       // QR Code placeholder (you can implement actual QR code generation)
//       doc.text(`QR Code: ${ticket.qrCode}`)
//       doc.moveDown()
      
//       // Terms
//       doc.fontSize(10)
//       doc.text('Terms and Conditions:', { underline: true })
//       doc.text('1. This ticket is valid for the specified date and time only.')
//       doc.text('2. Please arrive at the boarding point 15 minutes before departure.')
//       doc.text('3. This ticket is non-transferable and non-refundable.')
      
//       doc.end()
//     })

//   } catch (error) {
//     console.error('Ticket download error:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to generate ticket' },
//       { status: 500 }
//     )
//   }
// }
