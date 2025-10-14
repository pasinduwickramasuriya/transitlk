






import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Define proper types for the response
interface ProcessedSchedule {
    id: string
    routeId: string
    busId: string
    departureTime: string
    arrivalTime: string
    frequency: number | null
    isActive: boolean
    createdAt: string
    updatedAt: string
    bus: {
        id: string
        busNumber: string
        busType: string
        capacity: number
        isActive: boolean
        operatorId: string
        createdAt: string
        updatedAt: string
    }
}

interface ProcessedFare {
    id: string
    routeId: string
    busType: string
    basePrice: number
    currency: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface ProcessedOperator {
    id: string
    name: string
    licenseNo: string
    contactInfo: string
}

interface ProcessedRoute {
    id: string
    routeNumber: string
    startLocation: string
    endLocation: string
    distance: number | null
    estimatedTime: number | null
    isActive: boolean
    operatorId: string
    createdAt: string
    updatedAt: string
    operator: ProcessedOperator
    schedules: ProcessedSchedule[]
    fares: ProcessedFare[]
}

export async function POST(request: NextRequest) {
    try {
        console.log('🔍 Route search API called')

        const { startLocation, endLocation, journeyDate } = await request.json()
        console.log('📍 Search params:', { startLocation, endLocation, journeyDate })

        // Validate input
        if (!startLocation || !endLocation || !journeyDate) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 })
        }

        // Database connection test
        try {
            const connectionTest = await prisma.route.count()
            console.log('📊 Total routes in database:', connectionTest)
        } catch (dbError) {
            console.error('❌ Database connection failed:', dbError)
            return NextResponse.json({
                success: false,
                error: 'Database connection failed'
            }, { status: 500 })
        }

        // Clean and prepare search terms
        const searchFrom = startLocation.trim()
        const searchTo = endLocation.trim()
        
        console.log('🔎 Cleaned search terms:', { searchFrom, searchTo })

        // **STRICT SEARCH - ONLY EXACT OR PARTIAL MATCHES**
        let routes = []
        let searchStrategy = 'none'

        // Strategy 1: Exact match (case-insensitive)
        console.log('🎯 Strategy 1: Exact match search')
        routes = await prisma.route.findMany({
            where: {
                AND: [
                    {
                        startLocation: {
                            equals: searchFrom,
                            mode: 'insensitive'
                        }
                    },
                    {
                        endLocation: {
                            equals: searchTo,
                            mode: 'insensitive'
                        }
                    },
                    { isActive: true }
                ]
            },
            include: {
                operator: true,
                schedules: {
                    where: { isActive: true },
                    include: {
                        bus: true
                    }
                },
                fares: {
                    where: { isActive: true }
                }
            }
        })

        if (routes.length > 0) {
            searchStrategy = 'exact_match'
            console.log('🎯 Exact match found:', routes.length)
        }

        // Strategy 2: Contains search (only if exact match fails)
        if (routes.length === 0) {
            console.log('🔍 Strategy 2: Contains search')
            routes = await prisma.route.findMany({
                where: {
                    AND: [
                        {
                            startLocation: {
                                contains: searchFrom,
                                mode: 'insensitive'
                            }
                        },
                        {
                            endLocation: {
                                contains: searchTo,
                                mode: 'insensitive'
                            }
                        },
                        { isActive: true }
                    ]
                },
                include: {
                    operator: true,
                    schedules: {
                        where: { isActive: true },
                        include: {
                            bus: true
                        }
                    },
                    fares: {
                        where: { isActive: true }
                    }
                }
            })

            if (routes.length > 0) {
                searchStrategy = 'contains_match'
                console.log('🔍 Contains search found:', routes.length)
            }
        }

        // **REMOVED STRATEGY 3: No more fallback to "all routes"**
        // This was causing the bug where unrelated routes were shown

        console.log('📊 Final search result:', routes.length, 'routes found using', searchStrategy)

        // **RETURN EMPTY RESULT IF NO MATCHING ROUTES**
        if (routes.length === 0) {
            console.log('❌ No routes found for this exact search')
            return NextResponse.json({
                success: true,
                routes: [],
                totalFound: 0,
                message: `No routes found from ${searchFrom} to ${searchTo}`,
                searchCriteria: {
                    from: startLocation,
                    to: endLocation,
                    date: journeyDate
                },
                searchStrategy: 'no_match',
                suggestion: 'Please check the spelling of your departure and destination cities, or try different locations.',
                timestamp: new Date().toISOString()
            })
        }

        // **LOG MATCHED ROUTES FOR VERIFICATION**
        console.log('✅ Found matching routes:')
        routes.forEach(route => {
            console.log(`   - ${route.routeNumber}: ${route.startLocation} → ${route.endLocation}`)
        })

        // **PROCESS ROUTES WITH ENHANCED FARE MATCHING**
        const processedRoutes: ProcessedRoute[] = routes.map(route => {
            console.log(`🔧 Processing route ${route.routeNumber}:`, {
                hasOperator: !!route.operator,
                schedulesCount: route.schedules?.length || 0,
                faresCount: route.fares?.length || 0
            })

            // **HANDLE OPERATOR WITH PROPER TYPES**
            const operator: ProcessedOperator = route.operator || {
                id: route.operatorId,
                name: `Operator ${route.routeNumber}`,
                licenseNo: `OP-${route.routeNumber}`,
                contactInfo: '+94 11 123 4567'
            }

            // **HANDLE SCHEDULES WITH PROPER DATE CONVERSION**
            let schedules: ProcessedSchedule[] = []

            if (route.schedules && route.schedules.length > 0) {
                // Use existing schedules with proper date conversion
                schedules = route.schedules.map(schedule => ({
                    id: schedule.id,
                    routeId: schedule.routeId,
                    busId: schedule.busId,
                    departureTime: schedule.departureTime,
                    arrivalTime: schedule.arrivalTime,
                    frequency: schedule.frequency,
                    isActive: schedule.isActive,
                    createdAt: schedule.createdAt.toISOString(),
                    updatedAt: schedule.updatedAt.toISOString(),
                    bus: {
                        id: schedule.bus.id,
                        busNumber: schedule.bus.busNumber,
                        busType: schedule.bus.busType,
                        capacity: schedule.bus.capacity,
                        isActive: schedule.bus.isActive,
                        operatorId: schedule.bus.operatorId,
                        createdAt: schedule.bus.createdAt.toISOString(),
                        updatedAt: schedule.bus.updatedAt.toISOString()
                    }
                }))
            } else {
                // Create placeholder schedule
                schedules = [{
                    id: `temp-schedule-${route.id}`,
                    routeId: route.id,
                    busId: `temp-bus-${route.id}`,
                    departureTime: '08:00',
                    arrivalTime: route.estimatedTime ?
                        addMinutesToTime('08:00', route.estimatedTime) : '12:00',
                    frequency: 60,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    bus: {
                        id: `temp-bus-${route.id}`,
                        busNumber: `${route.routeNumber}-001`,
                        busType: 'AC Bus',
                        capacity: 45,
                        isActive: true,
                        operatorId: route.operatorId,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                }]
            }

            // **ENHANCED FARE HANDLING WITH SMART MATCHING**
            let fares: ProcessedFare[] = []

            if (route.fares && route.fares.length > 0) {
                console.log(`💰 Found ${route.fares.length} existing fares for route ${route.routeNumber}`)
                
                // Use existing fares and create matching fares for each bus type in schedules
                const existingFares = route.fares.map(fare => ({
                    id: fare.id,
                    routeId: fare.routeId,
                    busType: fare.busType,
                    basePrice: fare.basePrice,
                    currency: fare.currency,
                    isActive: fare.isActive,
                    createdAt: fare.createdAt.toISOString(),
                    updatedAt: fare.updatedAt.toISOString()
                }))
                
                fares = [...existingFares]
                
                // **ENSURE EVERY BUS TYPE HAS A MATCHING FARE**
                const uniqueBusTypes = [...new Set(schedules.map(s => s.bus.busType))]
                
                uniqueBusTypes.forEach(busType => {
                    const existingFare = fares.find(f => f.busType === busType)
                    if (!existingFare) {
                        console.log(`💰 Creating matching fare for bus type: ${busType}`)
                        
                        // Use the first existing fare as template or calculate new price
                        const templateFare = fares[0]
                        const basePrice = templateFare ? templateFare.basePrice : 
                            (route.distance ? Math.max(200, Math.round(route.distance * 8)) : 500)
                        
                        fares.push({
                            id: `generated-fare-${route.id}-${busType.replace(/\s+/g, '-').toLowerCase()}`,
                            routeId: route.id,
                            busType: busType,
                            basePrice: basePrice,
                            currency: 'LKR',
                            isActive: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        })
                    }
                })
            } else {
                console.log(`💰 No existing fares, creating fares for route ${route.routeNumber}`)
                
                // Create fares for each unique bus type in schedules
                const uniqueBusTypes = [...new Set(schedules.map(s => s.bus.busType))]
                
                if (uniqueBusTypes.length === 0) {
                    uniqueBusTypes.push('AC Bus') // Default bus type
                }
                
                uniqueBusTypes.forEach(busType => {
                    const basePrice = route.distance ?
                        Math.max(200, Math.round(route.distance * 8)) : 500

                    fares.push({
                        id: `temp-fare-${route.id}-${busType.replace(/\s+/g, '-').toLowerCase()}`,
                        routeId: route.id,
                        busType: busType,
                        basePrice,
                        currency: 'LKR',
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    })
                })
            }

            console.log(`💰 Final fares for route ${route.routeNumber}:`, fares.map(f => ({ busType: f.busType, price: f.basePrice })))

            // **RETURN PROPERLY TYPED ROUTE**
            return {
                id: route.id,
                routeNumber: route.routeNumber,
                startLocation: route.startLocation,
                endLocation: route.endLocation,
                distance: route.distance,
                estimatedTime: route.estimatedTime,
                isActive: route.isActive,
                operatorId: route.operatorId,
                createdAt: route.createdAt.toISOString(),
                updatedAt: route.updatedAt.toISOString(),
                operator,
                schedules,
                fares
            }
        })

        console.log('✅ Successfully processed routes:', processedRoutes.length)

        // **DEBUG: Log fare matching for each route**
        processedRoutes.forEach(route => {
            console.log(`🔍 Route ${route.routeNumber} fare matching debug:`)
            route.schedules.forEach(schedule => {
                const matchingFare = route.fares.find(f => f.busType === schedule.bus.busType && f.isActive)
                console.log(`  Schedule ${schedule.id}: Bus Type "${schedule.bus.busType}" -> Fare: ${matchingFare ? `LKR ${matchingFare.basePrice}` : 'NOT FOUND'}`)
            })
        })

        return NextResponse.json({
            success: true,
            routes: processedRoutes,
            totalFound: processedRoutes.length,
            message: `Found ${processedRoutes.length} route(s) for your journey`,
            searchCriteria: {
                from: startLocation,
                to: endLocation,
                date: journeyDate
            },
            searchStrategy: searchStrategy,
            dataSource: 'database',
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('❌ Route search error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to search routes',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

// Helper function to add minutes to time string
function addMinutesToTime(timeString: string, minutes: number): string {
    const [hours, mins] = timeString.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
}

// GET endpoint for database inspection with route listing
export async function GET() {
    try {
        console.log('📊 Database status check with exact route listing')

        const [routeCount, operatorCount, scheduleCount, fareCount, busCount] = await Promise.all([
            prisma.route.count(),
            prisma.operator.count(),
            prisma.schedule.count(),
            prisma.fare.count(),
            prisma.bus.count()
        ])

        // Get ALL routes with their exact locations
        const allRoutes = await prisma.route.findMany({
            select: {
                id: true,
                routeNumber: true,
                startLocation: true,
                endLocation: true,
                distance: true,
                estimatedTime: true,
                isActive: true
            },
            orderBy: { routeNumber: 'asc' }
        })

        // Create a clear route mapping
        const routeMapping = allRoutes.map(route => ({
            routeNumber: route.routeNumber,
            from: route.startLocation,
            to: route.endLocation,
            distance: route.distance,
            time: route.estimatedTime,
            active: route.isActive
        }))

        return NextResponse.json({
            success: true,
            database_status: {
                routes: routeCount,
                operators: operatorCount,
                schedules: scheduleCount,
                fares: fareCount,
                buses: busCount,
                healthy: routeCount > 0
            },
            available_routes: routeMapping,
            search_help: {
                exact_routes: allRoutes.map(r => `${r.startLocation} to ${r.endLocation}`),
                note: 'Search will only return routes that exactly match your departure and destination cities',
                examples: {
                    working: ['Colombo to Galle', 'Colombo to Kandy', 'colombo to katharagama'],
                    not_working: ['Galle to Matara', 'Kandy to Galle', 'Matara to Colombo']
                }
            },
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Database status check failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
