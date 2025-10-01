

// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { getServerSession } from 'next-auth'

// interface BusTrackingData {
//   busNumber: string
//   route: string
//   currentLocation: {
//     lat: number
//     lng: number
//     address: string
//   }
//   nextStop: string
//   estimatedArrival: string
//   status: 'on_time' | 'delayed' | 'boarding' | 'departed'
//   capacity: {
//     occupied: number
//     total: number
//   }
//   lastUpdated: string
//   operator?: string
//   speed?: number
//   heading?: number
// }

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession()
    
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     // Get user for bookings
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email }
//     })

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 })
//     }

//     // Get user's active bookings
//     const userBookings = await prisma.booking.findMany({
//       where: {
//         userId: user.id,
//         status: 'CONFIRMED',
//         journeyDate: {
//           gte: new Date(),
//           lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
//         }
//       },
//       include: {
//         schedule: {
//           include: {
//             route: true,
//             bus: {
//               include: {
//                 device: true
//               }
//             }
//           }
//         }
//       }
//     })

//     // Get active buses with recent GPS positions
//     const activeBuses = await prisma.bus.findMany({
//       where: {
//         isActive: true,
//         device: {
//           isActive: true,
//           positions: {
//             some: {
//               timestamp: {
//                 gte: new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
//               }
//             }
//           }
//         }
//       },
//       include: {
//         device: {
//           include: {
//             positions: {
//               orderBy: { timestamp: 'desc' },
//               take: 1
//             }
//           }
//         },
//         operator: true,
//         schedules: {
//           where: { isActive: true },
//           include: { route: true },
//           take: 1
//         }
//       }
//     })

//     // Format bus tracking data
//     const trackingData = {
//       activeBuses: activeBuses
//         .filter((bus: { device: { positions: string | any[] } }) => bus.device?.positions.length > 0)
//         .map((bus: { device: any; schedules: any[]; busNumber: any; capacity: number; operator: { name: any } }) => {
//           const latestPosition = bus.device!.positions[0]
//           const currentSchedule = bus.schedules[0]
          
//           return {
//             busNumber: bus.busNumber,
//             route: currentSchedule ? 
//               `${currentSchedule.route.startLocation} → ${currentSchedule.route.endLocation}` : 
//               'Unknown Route',
//             currentLocation: {
//               lat: latestPosition.latitude,
//               lng: latestPosition.longitude,
//               address: `${latestPosition.latitude.toFixed(4)}, ${latestPosition.longitude.toFixed(4)}`
//             },
//             nextStop: calculateNextStop(latestPosition, currentSchedule?.route),
//             estimatedArrival: currentSchedule?.arrivalTime || 'Unknown',
//             status: calculateBusStatus(latestPosition, currentSchedule) as any,
//             capacity: {
//               occupied: Math.floor(Math.random() * bus.capacity), // Replace with actual data
//               total: bus.capacity
//             },
//             lastUpdated: latestPosition.timestamp.toISOString(),
//             operator: bus.operator?.name,
//             speed: latestPosition.speed || 0,
//             heading: latestPosition.heading || 0
//           } as BusTrackingData
//         }),
        
//       userBookings: userBookings.map((booking: { id: any; schedule: { bus: { busNumber: any; device: any }; route: { startLocation: any; endLocation: any }; departureTime: any }; journeyDate: { toISOString: () => string }; status: string }) => ({
//         id: booking.id,
//         busNumber: booking.schedule.bus.busNumber,
//         route: `${booking.schedule.route.startLocation} → ${booking.schedule.route.endLocation}`,
//         date: booking.journeyDate.toISOString().split('T')[0],
//         time: booking.schedule.departureTime,
//         status: booking.status.toLowerCase(),
//         hasTracking: !!booking.schedule.bus.device
//       }))
//     }

//     return NextResponse.json(trackingData)

//   } catch (error) {
//     console.error('[TRACKING-API] Error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

// // Helper functions
// function calculateNextStop(position: any, route: any): string {
//   // Implement logic to calculate next stop based on position and route
//   // This would typically involve calculating distance to route stops
//   return 'Next Stop' // Placeholder
// }

// function calculateBusStatus(position: any, schedule: any): string {
//   // Implement logic based on schedule adherence, speed, etc.
//   const statuses = ['on_time', 'delayed', 'boarding', 'departed']
//   return statuses[Math.floor(Math.random() * statuses.length)]
// }
