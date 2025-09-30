// // import { prisma } from '@/lib/prisma'
// // import { Role, BookingStatus, PaymentStatus } from '@prisma/client'
// // import bcrypt from 'bcryptjs'

// // // Users Service
// // export class UsersService {
// //   static async getAll(params: {
// //     page: number
// //     search?: string
// //     role?: string
// //     status?: string
// //     limit?: number
// //   }) {
// //     const { page, search, role, status, limit = 10 } = params
// //     const skip = (page - 1) * limit

// //     const where: any = {}

// //     if (search) {
// //       where.OR = [
// //         { name: { contains: search, mode: 'insensitive' } },
// //         { email: { contains: search, mode: 'insensitive' } },
// //       ]
// //     }

// //     if (role && role !== 'all') {
// //       where.role = role.toUpperCase() as Role
// //     }

// //     if (status && status !== 'all') {
// //       where.isActive = status === 'active'
// //     }

// //     const [users, total] = await Promise.all([
// //       prisma.user.findMany({
// //         where,
// //         skip,
// //         take: limit,
// //         orderBy: { createdAt: 'desc' },
// //         select: {
// //           id: true,
// //           name: true,
// //           email: true,
// //           phoneNumber: true,
// //           role: true,
// //           isActive: true,
// //           createdAt: true,
// //           updatedAt: true,
// //           _count: {
// //             select: {
// //               bookings: true,
// //               feedback: true,
// //             }
// //           }
// //         },
// //       }),
// //       prisma.user.count({ where }),
// //     ])

// //     return {
// //       users,
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //     }
// //   }

// //   static async getById(id: string) {
// //     return await prisma.user.findUnique({
// //       where: { id },
// //       include: {
// //         bookings: {
// //           include: {
// //             schedule: {
// //               include: {
// //                 route: true,
// //                 bus: true,
// //               }
// //             },
// //             payment: true,
// //           },
// //           orderBy: { createdAt: 'desc' },
// //           take: 10,
// //         },
// //         feedback: {
// //           include: {
// //             booking: {
// //               include: {
// //                 schedule: {
// //                   include: {
// //                     route: true,
// //                   }
// //                 }
// //               }
// //             }
// //           },
// //           orderBy: { createdAt: 'desc' },
// //           take: 5,
// //         },
// //         _count: {
// //           select: {
// //             bookings: true,
// //             feedback: true,
// //             notifications: true,
// //           }
// //         }
// //       },
// //     })
// //   }

// //   static async create(data: {
// //     name: string
// //     email: string
// //     phoneNumber?: string
// //     password: string
// //     role: Role
// //   }) {
// //     const hashedPassword = await bcrypt.hash(data.password, 12)
    
// //     return await prisma.user.create({
// //       data: {
// //         ...data,
// //         password: hashedPassword,
// //       },
// //     })
// //   }

// //   static async update(id: string, data: {
// //     name?: string
// //     email?: string
// //     phoneNumber?: string
// //     role?: Role
// //     isActive?: boolean
// //   }) {
// //     return await prisma.user.update({
// //       where: { id },
// //       data,
// //     })
// //   }

// //   static async delete(id: string) {
// //     return await prisma.user.delete({
// //       where: { id },
// //     })
// //   }
// // }

// // // Operators Service
// // export class OperatorsService {
// //   static async getAll(params: {
// //     page: number
// //     search?: string
// //     status?: string
// //     limit?: number
// //   }) {
// //     const { page, search, status, limit = 10 } = params
// //     const skip = (page - 1) * limit

// //     const where: any = {}

// //     if (search) {
// //       where.OR = [
// //         { name: { contains: search, mode: 'insensitive' } },
// //         { licenseNo: { contains: search, mode: 'insensitive' } },
// //       ]
// //     }

// //     if (status && status !== 'all') {
// //       where.isActive = status === 'active'
// //     }

// //     const [operators, total] = await Promise.all([
// //       prisma.operator.findMany({
// //         where,
// //         skip,
// //         take: limit,
// //         orderBy: { createdAt: 'desc' },
// //         include: {
// //           _count: {
// //             select: {
// //               buses: true,
// //               routes: true,
// //             }
// //           }
// //         },
// //       }),
// //       prisma.operator.count({ where }),
// //     ])

// //     return {
// //       operators,
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //     }
// //   }

// //   static async getById(id: string) {
// //     return await prisma.operator.findUnique({
// //       where: { id },
// //       include: {
// //         buses: {
// //           include: {
// //             device: true,
// //             schedules: {
// //               include: {
// //                 route: true,
// //               }
// //             },
// //           },
// //           orderBy: { createdAt: 'desc' },
// //         },
// //         routes: {
// //           include: {
// //             stops: true,
// //             schedules: {
// //               include: {
// //                 bus: true,
// //               }
// //             },
// //             _count: {
// //               select: {
// //                 schedules: true,
// //               }
// //             }
// //           },
// //           orderBy: { createdAt: 'desc' },
// //         },
// //         _count: {
// //           select: {
// //             buses: true,
// //             routes: true,
// //           }
// //         }
// //       },
// //     })
// //   }

// //   static async create(data: {
// //     name: string
// //     licenseNo: string
// //     contactInfo: string
// //   }) {
// //     return await prisma.operator.create({
// //       data,
// //     })
// //   }

// //   static async update(id: string, data: {
// //     name?: string
// //     licenseNo?: string
// //     contactInfo?: string
// //     isActive?: boolean
// //   }) {
// //     return await prisma.operator.update({
// //       where: { id },
// //       data,
// //     })
// //   }

// //   static async delete(id: string) {
// //     return await prisma.operator.delete({
// //       where: { id },
// //     })
// //   }
// // }

// // // Buses Service
// // export class BusesService {
// //   static async getAll(params: {
// //     page: number
// //     search?: string
// //     operatorId?: string
// //     status?: string
// //     limit?: number
// //   }) {
// //     const { page, search, operatorId, status, limit = 10 } = params
// //     const skip = (page - 1) * limit

// //     const where: any = {}

// //     if (search) {
// //       where.OR = [
// //         { busNumber: { contains: search, mode: 'insensitive' } },
// //         { busType: { contains: search, mode: 'insensitive' } },
// //       ]
// //     }

// //     if (operatorId && operatorId !== 'all') {
// //       where.operatorId = operatorId
// //     }

// //     if (status && status !== 'all') {
// //       where.isActive = status === 'active'
// //     }

// //     const [buses, total] = await Promise.all([
// //       prisma.bus.findMany({
// //         where,
// //         skip,
// //         take: limit,
// //         orderBy: { createdAt: 'desc' },
// //         include: {
// //           operator: {
// //             select: {
// //               id: true,
// //               name: true,
// //             }
// //           },
// //           device: true,
// //           _count: {
// //             select: {
// //               schedules: true,
// //               bookings: true,
// //             }
// //           }
// //         },
// //       }),
// //       prisma.bus.count({ where }),
// //     ])

// //     return {
// //       buses,
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //     }
// //   }

// //   static async getById(id: string) {
// //     return await prisma.bus.findUnique({
// //       where: { id },
// //       include: {
// //         operator: true,
// //         device: true,
// //         schedules: {
// //           include: {
// //             route: true,
// //             bookings: {
// //               include: {
// //                 user: {
// //                   select: {
// //                     name: true,
// //                     email: true,
// //                   }
// //                 }
// //               }
// //             }
// //           },
// //           orderBy: { departureTime: 'asc' },
// //         },
// //         positions: {
// //           orderBy: { timestamp: 'desc' },
// //           take: 10,
// //         },
// //         _count: {
// //           select: {
// //             schedules: true,
// //             bookings: true,
// //           }
// //         }
// //       },
// //     })
// //   }

// //   static async create(data: {
// //     busNumber: string
// //     capacity: number
// //     busType: string
// //     operatorId: string
// //   }) {
// //     return await prisma.bus.create({
// //       data,
// //       include: {
// //         operator: {
// //           select: {
// //             id: true,
// //             name: true,
// //           }
// //         }
// //       }
// //     })
// //   }

// //   static async update(id: string, data: {
// //     busNumber?: string
// //     capacity?: number
// //     busType?: string
// //     isActive?: boolean
// //   }) {
// //     return await prisma.bus.update({
// //       where: { id },
// //       data,
// //       include: {
// //         operator: {
// //           select: {
// //             id: true,
// //             name: true,
// //           }
// //         }
// //       }
// //     })
// //   }

// //   static async delete(id: string) {
// //     return await prisma.bus.delete({
// //       where: { id },
// //     })
// //   }
// // }

// // // Routes Service
// // export class RoutesService {
// //   static async getAll(params: {
// //     page: number
// //     search?: string
// //     operatorId?: string
// //     status?: string
// //     limit?: number
// //   }) {
// //     const { page, search, operatorId, status, limit = 10 } = params
// //     const skip = (page - 1) * limit

// //     const where: any = {}

// //     if (search) {
// //       where.OR = [
// //         { routeNumber: { contains: search, mode: 'insensitive' } },
// //         { startLocation: { contains: search, mode: 'insensitive' } },
// //         { endLocation: { contains: search, mode: 'insensitive' } },
// //       ]
// //     }

// //     if (operatorId && operatorId !== 'all') {
// //       where.operatorId = operatorId
// //     }

// //     if (status && status !== 'all') {
// //       where.isActive = status === 'active'
// //     }

// //     const [routes, total] = await Promise.all([
// //       prisma.route.findMany({
// //         where,
// //         skip,
// //         take: limit,
// //         orderBy: { createdAt: 'desc' },
// //         include: {
// //           operator: {
// //             select: {
// //               id: true,
// //               name: true,
// //             }
// //           },
// //           _count: {
// //             select: {
// //               stops: true,
// //               schedules: true,
// //             }
// //           }
// //         },
// //       }),
// //       prisma.route.count({ where }),
// //     ])

// //     return {
// //       routes,
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //     }
// //   }

// //   static async getById(id: string) {
// //     return await prisma.route.findUnique({
// //       where: { id },
// //       include: {
// //         operator: true,
// //         stops: {
// //           orderBy: { order: 'asc' },
// //         },
// //         schedules: {
// //           include: {
// //             bus: {
// //               select: {
// //                 id: true,
// //                 busNumber: true,
// //                 capacity: true,
// //               }
// //             },
// //             bookings: {
// //               include: {
// //                 user: {
// //                   select: {
// //                     name: true,
// //                     email: true,
// //                   }
// //                 }
// //               }
// //             }
// //           },
// //           orderBy: { departureTime: 'asc' },
// //         },
// //         fares: {
// //           where: { isActive: true },
// //         },
// //         _count: {
// //           select: {
// //             stops: true,
// //             schedules: true,
// //           }
// //         }
// //       },
// //     })
// //   }

// //   static async create(data: {
// //     routeNumber: string
// //     startLocation: string
// //     endLocation: string
// //     distance?: number
// //     estimatedTime?: number
// //     operatorId: string
// //   }) {
// //     return await prisma.route.create({
// //       data,
// //       include: {
// //         operator: {
// //           select: {
// //             id: true,
// //             name: true,
// //           }
// //         }
// //       }
// //     })
// //   }

// //   static async update(id: string, data: {
// //     routeNumber?: string
// //     startLocation?: string
// //     endLocation?: string
// //     distance?: number
// //     estimatedTime?: number
// //     isActive?: boolean
// //   }) {
// //     return await prisma.route.update({
// //       where: { id },
// //       data,
// //       include: {
// //         operator: {
// //           select: {
// //             id: true,
// //             name: true,
// //           }
// //         }
// //       }
// //     })
// //   }

// //   static async delete(id: string) {
// //     return await prisma.route.delete({
// //       where: { id },
// //     })
// //   }
// // }

// // // Additional Services
// // export class StopsService {
// //   static async getByRouteId(routeId: string) {
// //     return await prisma.stop.findMany({
// //       where: { routeId },
// //       orderBy: { order: 'asc' },
// //       include: {
// //         route: {
// //           select: {
// //             id: true,
// //             routeNumber: true,
// //           }
// //         }
// //       }
// //     })
// //   }

// //   static async create(data: {
// //     name: string
// //     latitude: number
// //     longitude: number
// //     order: number
// //     routeId: string
// //   }) {
// //     return await prisma.stop.create({
// //       data,
// //     })
// //   }

// //   static async update(id: string, data: {
// //     name?: string
// //     latitude?: number
// //     longitude?: number
// //     order?: number
// //   }) {
// //     return await prisma.stop.update({
// //       where: { id },
// //       data,
// //     })
// //   }

// //   static async delete(id: string) {
// //     return await prisma.stop.delete({
// //       where: { id },
// //     })
// //   }
// // }

// // export class DevicesService {
// //   static async getAll(params: {
// //     page: number
// //     search?: string
// //     status?: string
// //     limit?: number
// //   }) {
// //     const { page, search, status, limit = 10 } = params
// //     const skip = (page - 1) * limit

// //     const where: any = {}

// //     if (search) {
// //       where.OR = [
// //         { deviceId: { contains: search, mode: 'insensitive' } },
// //         { name: { contains: search, mode: 'insensitive' } },
// //       ]
// //     }

// //     if (status && status !== 'all') {
// //       where.isActive = status === 'active'
// //     }

// //     const [devices, total] = await Promise.all([
// //       prisma.device.findMany({
// //         where,
// //         skip,
// //         take: limit,
// //         orderBy: { createdAt: 'desc' },
// //         include: {
// //           bus: {
// //             select: {
// //               id: true,
// //               busNumber: true,
// //               operator: {
// //                 select: {
// //                   name: true,
// //                 }
// //               }
// //             }
// //           },
// //           _count: {
// //             select: {
// //               positions: true,
// //             }
// //           }
// //         },
// //       }),
// //       prisma.device.count({ where }),
// //     ])

// //     return {
// //       devices,
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //     }
// //   }

// //   static async getById(id: string) {
// //     return await prisma.device.findUnique({
// //       where: { id },
// //       include: {
// //         bus: {
// //           include: {
// //             operator: true,
// //           }
// //         },
// //         positions: {
// //           orderBy: { timestamp: 'desc' },
// //           take: 20,
// //         },
// //         _count: {
// //           select: {
// //             positions: true,
// //           }
// //         }
// //       },
// //     })
// //   }

// //   static async create(data: {
// //     deviceId: string
// //     name: string
// //     busId?: string
// //   }) {
// //     return await prisma.device.create({
// //       data,
// //       include: {
// //         bus: {
// //           select: {
// //             id: true,
// //             busNumber: true,
// //           }
// //         }
// //       }
// //     })
// //   }

// //   static async update(id: string, data: {
// //     deviceId?: string
// //     name?: string
// //     isActive?: boolean
// //     busId?: string
// //   }) {
// //     return await prisma.device.update({
// //       where: { id },
// //       data,
// //       include: {
// //         bus: {
// //           select: {
// //             id: true,
// //             busNumber: true,
// //           }
// //         }
// //       }
// //     })
// //   }

// //   static async delete(id: string) {
// //     return await prisma.device.delete({
// //       where: { id },
// //     })
// //   }
// // }

// // export class SchedulesService {
// //   static async getAll(params: {
// //     page: number
// //     routeId?: string
// //     busId?: string
// //     status?: string
// //     limit?: number
// //   }) {
// //     const { page, routeId, busId, status, limit = 10 } = params
// //     const skip = (page - 1) * limit

// //     const where: any = {}

// //     if (routeId && routeId !== 'all') {
// //       where.routeId = routeId
// //     }

// //     if (busId && busId !== 'all') {
// //       where.busId = busId
// //     }

// //     if (status && status !== 'all') {
// //       where.isActive = status === 'active'
// //     }

// //     const [schedules, total] = await Promise.all([
// //       prisma.schedule.findMany({
// //         where,
// //         skip,
// //         take: limit,
// //         orderBy: { departureTime: 'asc' },
// //         include: {
// //           route: {
// //             select: {
// //               id: true,
// //               routeNumber: true,
// //               startLocation: true,
// //               endLocation: true,
// //             }
// //           },
// //           bus: {
// //             select: {
// //               id: true,
// //               busNumber: true,
// //               capacity: true,
// //             }
// //           },
// //           _count: {
// //             select: {
// //               bookings: true,
// //             }
// //           }
// //         },
// //       }),
// //       prisma.schedule.count({ where }),
// //     ])

// //     return {
// //       schedules,
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //     }
// //   }

// //   static async getById(id: string) {
// //     return await prisma.schedule.findUnique({
// //       where: { id },
// //       include: {
// //         route: {
// //           include: {
// //             stops: true,
// //             operator: true,
// //           }
// //         },
// //         bus: {
// //           include: {
// //             operator: true,
// //           }
// //         },
// //         bookings: {
// //           include: {
// //             user: {
// //               select: {
// //                 name: true,
// //                 email: true,
// //               }
// //             },
// //             payment: true,
// //           },
// //           orderBy: { createdAt: 'desc' },
// //         },
// //         _count: {
// //           select: {
// //             bookings: true,
// //           }
// //         }
// //       },
// //     })
// //   }

// //   static async create(data: {
// //     routeId: string
// //     busId: string
// //     departureTime: string
// //     arrivalTime: string
// //     frequency?: number
// //   }) {
// //     return await prisma.schedule.create({
// //       data,
// //       include: {
// //         route: {
// //           select: {
// //             id: true,
// //             routeNumber: true,
// //           }
// //         },
// //         bus: {
// //           select: {
// //             id: true,
// //             busNumber: true,
// //           }
// //         }
// //       }
// //     })
// //   }

// //   static async update(id: string, data: {
// //     departureTime?: string
// //     arrivalTime?: string
// //     frequency?: number
// //     isActive?: boolean
// //   }) {
// //     return await prisma.schedule.update({
// //       where: { id },
// //       data,
// //       include: {
// //         route: {
// //           select: {
// //             id: true,
// //             routeNumber: true,
// //           }
// //         },
// //         bus: {
// //           select: {
// //             id: true,
// //             busNumber: true,
// //           }
// //         }
// //       }
// //     })
// //   }

// //   static async delete(id: string) {
// //     return await prisma.schedule.delete({
// //       where: { id },
// //     })
// //   }
// // }

// // export class AdminDashboardService {
// //   static async getStats() {
// //     const [
// //       totalUsers,
// //       activeUsers,
// //       totalOperators,
// //       totalBuses,
// //       totalRoutes,
// //       totalDevices,
// //       dailyBookings,
// //       monthlyRevenue,
// //       totalBookings,
// //       completedPayments
// //     ] = await Promise.all([
// //       prisma.user.count(),
// //       prisma.user.count({ where: { isActive: true } }),
// //       prisma.operator.count({ where: { isActive: true } }),
// //       prisma.bus.count({ where: { isActive: true } }),
// //       prisma.route.count({ where: { isActive: true } }),
// //       prisma.device.count({ where: { isActive: true } }),
// //       prisma.booking.count({
// //         where: {
// //           createdAt: {
// //             gte: new Date(new Date().setHours(0, 0, 0, 0))
// //           }
// //         }
// //       }),
// //       prisma.payment.aggregate({
// //         where: {
// //           status: 'COMPLETED',
// //           createdAt: {
// //             gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
// //           }
// //         },
// //         _sum: {
// //           amount: true
// //         }
// //       }),
// //       prisma.booking.count(),
// //       prisma.payment.count({ where: { status: 'COMPLETED' } })
// //     ])

// //     return {
// //       totalUsers,
// //       activeUsers,
// //       totalOperators, 
// //       totalBuses,
// //       totalRoutes,
// //       totalDevices,
// //       dailyBookings,
// //       monthlyRevenue: monthlyRevenue._sum.amount || 0,
// //       totalBookings,
// //       completedPayments,
// //       systemUptime: 99.9, // You can implement this based on your monitoring
// //     }
// //   }

// //   static async getAllBookings(params: {
// //     page: number
// //     search?: string
// //     status?: string
// //     limit?: number
// //   }) {
// //     const { page, search, status, limit = 10 } = params
// //     const skip = (page - 1) * limit

// //     const where: any = {}

// //     if (search) {
// //       where.OR = [
// //         { passengerName: { contains: search, mode: 'insensitive' } },
// //         { passengerPhone: { contains: search, mode: 'insensitive' } },
// //       ]
// //     }

// //     if (status && status !== 'all') {
// //       where.status = status.toUpperCase() as BookingStatus
// //     }

// //     const [bookings, total] = await Promise.all([
// //       prisma.booking.findMany({
// //         where,
// //         skip,
// //         take: limit,
// //         orderBy: { createdAt: 'desc' },
// //         include: {
// //           user: {
// //             select: {
// //               name: true,
// //               email: true,
// //             }
// //           },
// //           schedule: {
// //             include: {
// //               route: {
// //                 select: {
// //                   routeNumber: true,
// //                   startLocation: true,
// //                   endLocation: true,
// //                 }
// //               },
// //               bus: {
// //                 select: {
// //                   busNumber: true,
// //                 }
// //               }
// //             }
// //           },
// //           payment: true,
// //           ticket: true,
// //         },
// //       }),
// //       prisma.booking.count({ where }),
// //     ])

// //     return {
// //       bookings,
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //     }
// //   }

// //   static async getAllPayments(params: {
// //     page: number
// //     status?: string
// //     limit?: number
// //   }) {
// //     const { page, status, limit = 10 } = params
// //     const skip = (page - 1) * limit

// //     const where: any = {}

// //     if (status && status !== 'all') {
// //       where.status = status.toUpperCase() as PaymentStatus
// //     }

// //     const [payments, total] = await Promise.all([
// //       prisma.payment.findMany({
// //         where,
// //         skip,
// //         take: limit,
// //         orderBy: { createdAt: 'desc' },
// //         include: {
// //           booking: {
// //             include: {
// //               user: {
// //                 select: {
// //                   name: true,
// //                   email: true,
// //                 }
// //               },
// //               schedule: {
// //                 include: {
// //                   route: {
// //                     select: {
// //                       routeNumber: true,
// //                     }
// //                   },
// //                   bus: {
// //                     select: {
// //                       busNumber: true,
// //                     }
// //                   }
// //                 }
// //               },
// //             }
// //           },
// //         },
// //       }),
// //       prisma.payment.count({ where }),
// //     ])

// //     return {
// //       payments,
// //       total,
// //       totalPages: Math.ceil(total / limit),
// //     }
// //   }

// //   static async getLivePositions() {
// //     // Get the latest position for each device
// //     const devices = await prisma.device.findMany({
// //       where: { isActive: true },
// //       include: {
// //         bus: {
// //           select: {
// //             id: true,
// //             busNumber: true,
// //             capacity: true,
// //             operator: {
// //               select: {
// //                 name: true,
// //               }
// //             }
// //           }
// //         },
// //         positions: {
// //           orderBy: { timestamp: 'desc' },
// //           take: 1,
// //         }
// //       }
// //     })

// //     return devices.map(device => ({
// //       deviceId: device.deviceId,
// //       name: device.name,
// //       bus: device.bus ? {
// //         busNumber: device.bus.busNumber,
// //         capacity: device.bus.capacity,
// //         operator: device.bus.operator?.name,
// //       } : null,
// //       latestPosition: device.positions[0] || null,
// //     }))
// //   }
// // }



// // ✅ FIXED: Updated service to return data matching your interfaces
// export class AdminDashboardService {
//   static async getStats() {
//     await new Promise(resolve => setTimeout(resolve, 100))
    
//     return {
//       totalUsers: 1250,
//       activeUsers: 890,
//       totalOperators: 25,
//       totalBuses: 150,
//       totalRoutes: 45,
//       dailyBookings: 320,
//       monthlyRevenue: 2540000,
//       totalBookings: 8970
//     }
//   }

//   static async getAllBookings({ page = 1, limit = 10 }) {
//     await new Promise(resolve => setTimeout(resolve, 100))
    
//     // ✅ FIXED: Mock data structure matches BookingWithDetails interface
//     const mockBookings = [
//       {
//         id: '1',
//         seatNumber: 'A12',
//         status: 'CONFIRMED',
//         totalAmount: 350,
//         passengerName: 'John Doe',
//         passengerPhone: '+94712345678',
//         createdAt: new Date(),
//         user: {
//           name: 'John Doe',
//           email: 'john@example.com'
//         },
//         schedule: {
//           bus: {
//             busNumber: 'CBK-1234'
//           },
//           route: {
//             routeNumber: 'RT001',
//             startLocation: 'Colombo Fort',
//             endLocation: 'Kandy Bus Stand'
//           }
//         },
//         ticket: {
//           id: 'ticket1',
//           qrCode: 'QR123456'
//         },
//         payment: {
//           id: 'payment1',
//           amount: 350,
//           status: 'COMPLETED',
//           paymentMethod: 'EZ_CASH'
//         }
//       },
//       {
//         id: '2',
//         seatNumber: 'B05',
//         status: 'PENDING',
//         totalAmount: 280,
//         passengerName: 'Jane Smith',
//         passengerPhone: '+94723456789',
//         createdAt: new Date(Date.now() - 1000 * 60 * 30),
//         user: {
//           name: 'Jane Smith',
//           email: 'jane@example.com'
//         },
//         schedule: {
//           bus: {
//             busNumber: 'GL-5678'
//           },
//           route: {
//             routeNumber: 'RT002',
//             startLocation: 'Galle Bus Stand',
//             endLocation: 'Colombo Fort'
//           }
//         },
//         ticket: null,
//         payment: null
//       },
//       {
//         id: '3',
//         seatNumber: 'C08',
//         status: 'COMPLETED',
//         totalAmount: 420,
//         passengerName: 'Bob Wilson',
//         passengerPhone: '+94734567890',
//         createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
//         user: {
//           name: null, // ✅ Test null name
//           email: 'bob@example.com'
//         },
//         schedule: {
//           bus: {
//             busNumber: 'KD-9012'
//           },
//           route: {
//             routeNumber: 'RT003',
//             startLocation: 'Kandy Bus Stand',
//             endLocation: 'Jaffna Central'
//           }
//         },
//         ticket: {
//           id: 'ticket3',
//           qrCode: 'QR789012'
//         },
//         payment: {
//           id: 'payment3',
//           amount: 420,
//           status: 'COMPLETED',
//           paymentMethod: 'CARD'
//         }
//       }
//     ]

//     return {
//       bookings: mockBookings.slice(0, limit),
//       total: mockBookings.length,
//       page,
//       totalPages: Math.ceil(mockBookings.length / limit)
//     }
//   }

//   static async getLivePositions() {
//     await new Promise(resolve => setTimeout(resolve, 100))
    
//     // ✅ FIXED: Mock data structure matches LivePosition interface
//     return [
//       {
//         deviceId: 'dev1',
//         name: 'Demo Bus 001',
//         bus: {
//           busNumber: 'CBK-1234',
//           capacity: 45,
//           operator: 'Demo Transport'
//         },
//         latestPosition: {
//           id: 'pos1',
//           latitude: 6.9271,
//           longitude: 79.8612,
//           speed: 35,
//           heading: 180,
//           timestamp: new Date(),
//           busId: 'bus1',
//           deviceId: 'dev1'
//         }
//       },
//       {
//         deviceId: 'dev2',
//         name: 'Demo Bus 002',
//         bus: {
//           busNumber: 'GL-5678',
//           capacity: 50,
//           operator: 'Demo Transport'
//         },
//         latestPosition: {
//           id: 'pos2',
//           latitude: 6.0535,
//           longitude: 80.2210,
//           speed: 0,
//           heading: 90,
//           timestamp: new Date(Date.now() - 1000 * 60 * 5),
//           busId: 'bus2',
//           deviceId: 'dev2'
//         }
//       },
//       {
//         deviceId: 'dev3',
//         name: 'Demo Bus 003',
//         bus: null, // ✅ Test null bus
//         latestPosition: {
//           id: 'pos3',
//           latitude: 7.2906,
//           longitude: 80.6337,
//           speed: 25,
//           heading: 270,
//           timestamp: new Date(Date.now() - 1000 * 60 * 2),
//           busId: null,
//           deviceId: 'dev3'
//         }
//       }
//     ]
//   }
// }




import { prisma } from '@/lib/prisma'
import { Role, BookingStatus, PaymentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

// ===== USERS SERVICE =====
export class UsersService {
  /**
   * Get all users with pagination and filters
   */
  static async getAll(params: {
    page: number
    search?: string
    role?: string
    status?: string
    limit?: number
  }) {
    const { page, search, role, status, limit = 10 } = params
    const skip = (page - 1) * limit

    const where: any = {}

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Role filter
    if (role && role !== 'all') {
      where.role = role.toUpperCase() as Role
    }

    // Status filter
    if (status && status !== 'all') {
      where.isActive = status === 'active'
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              bookings: true,
              feedback: true,
            }
          }
        },
      }),
      prisma.user.count({ where }),
    ])

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    }
  }

  /**
   * Get user by ID
   */
  static async getById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            schedule: {
              include: {
                route: true,
                bus: true,
              }
            },
            payment: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        feedback: {
          include: {
            booking: {
              include: {
                schedule: {
                  include: {
                    route: true,
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            bookings: true,
            feedback: true,
            notifications: true,
          }
        }
      },
    })
  }

  /**
   * Create new user
   */
  static async create(data: {
    name: string
    email: string
    phoneNumber?: string
    password: string
    role: Role
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    })
  }

  /**
   * Update user
   */
  static async update(id: string, data: {
    name?: string
    email?: string
    phoneNumber?: string
    role?: Role
    isActive?: boolean
  }) {
    return await prisma.user.update({
      where: { id },
      data,
    })
  }

  /**
   * Delete user
   */
  static async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
    })
  }
}

// ===== OPERATORS SERVICE =====
export class OperatorsService {
  static async getAll(params: {
    page: number
    search?: string
    status?: string
    limit?: number
  }) {
    const { page, search, status, limit = 10 } = params
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { licenseNo: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status && status !== 'all') {
      where.isActive = status === 'active'
    }

    const [operators, total] = await Promise.all([
      prisma.operator.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              buses: true,
              routes: true,
            }
          }
        },
      }),
      prisma.operator.count({ where }),
    ])

    return {
      operators,
      total,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async getById(id: string) {
    return await prisma.operator.findUnique({
      where: { id },
      include: {
        buses: {
          include: {
            device: true,
            schedules: {
              include: {
                route: true,
              }
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        routes: {
          include: {
            stops: true,
            schedules: {
              include: {
                bus: true,
              }
            },
            _count: {
              select: {
                schedules: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            buses: true,
            routes: true,
          }
        }
      },
    })
  }

  static async create(data: {
    name: string
    licenseNo: string
    contactInfo: string
  }) {
    return await prisma.operator.create({
      data,
    })
  }

  static async update(id: string, data: {
    name?: string
    licenseNo?: string
    contactInfo?: string
    isActive?: boolean
  }) {
    return await prisma.operator.update({
      where: { id },
      data,
    })
  }

  static async delete(id: string) {
    return await prisma.operator.delete({
      where: { id },
    })
  }
}

// ===== BUSES SERVICE =====
export class BusesService {
  static async getAll(params: {
    page: number
    search?: string
    operatorId?: string
    status?: string
    limit?: number
  }) {
    const { page, search, operatorId, status, limit = 10 } = params
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { busNumber: { contains: search, mode: 'insensitive' } },
        { busType: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (operatorId && operatorId !== 'all') {
      where.operatorId = operatorId
    }

    if (status && status !== 'all') {
      where.isActive = status === 'active'
    }

    const [buses, total] = await Promise.all([
      prisma.bus.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          operator: {
            select: {
              id: true,
              name: true,
            }
          },
          device: true,
          _count: {
            select: {
              schedules: true,
              bookings: true,
            }
          }
        },
      }),
      prisma.bus.count({ where }),
    ])

    return {
      buses,
      total,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async getById(id: string) {
    return await prisma.bus.findUnique({
      where: { id },
      include: {
        operator: true,
        device: true,
        schedules: {
          include: {
            route: true,
            bookings: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  }
                }
              }
            }
          },
          orderBy: { departureTime: 'asc' },
        },
        positions: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            schedules: true,
            bookings: true,
          }
        }
      },
    })
  }

  static async create(data: {
    busNumber: string
    capacity: number
    busType: string
    operatorId: string
  }) {
    return await prisma.bus.create({
      data,
      include: {
        operator: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })
  }

  static async update(id: string, data: {
    busNumber?: string
    capacity?: number
    busType?: string
    isActive?: boolean
  }) {
    return await prisma.bus.update({
      where: { id },
      data,
      include: {
        operator: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })
  }

  static async delete(id: string) {
    return await prisma.bus.delete({
      where: { id },
    })
  }
}

// ===== ROUTES SERVICE =====
export class RoutesService {
  static async getAll(params: {
    page: number
    search?: string
    operatorId?: string
    status?: string
    limit?: number
  }) {
    const { page, search, operatorId, status, limit = 10 } = params
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { routeNumber: { contains: search, mode: 'insensitive' } },
        { startLocation: { contains: search, mode: 'insensitive' } },
        { endLocation: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (operatorId && operatorId !== 'all') {
      where.operatorId = operatorId
    }

    if (status && status !== 'all') {
      where.isActive = status === 'active'
    }

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          operator: {
            select: {
              id: true,
              name: true,
            }
          },
          _count: {
            select: {
              stops: true,
              schedules: true,
            }
          }
        },
      }),
      prisma.route.count({ where }),
    ])

    return {
      routes,
      total,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async getById(id: string) {
    return await prisma.route.findUnique({
      where: { id },
      include: {
        operator: true,
        stops: {
          orderBy: { order: 'asc' },
        },
        schedules: {
          include: {
            bus: {
              select: {
                id: true,
                busNumber: true,
                capacity: true,
              }
            },
            bookings: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  }
                }
              }
            }
          },
          orderBy: { departureTime: 'asc' },
        },
        fares: {
          where: { isActive: true },
        },
        _count: {
          select: {
            stops: true,
            schedules: true,
          }
        }
      },
    })
  }

  static async create(data: {
    routeNumber: string
    startLocation: string
    endLocation: string
    distance?: number
    estimatedTime?: number
    operatorId: string
  }) {
    return await prisma.route.create({
      data,
      include: {
        operator: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })
  }

  static async update(id: string, data: {
    routeNumber?: string
    startLocation?: string
    endLocation?: string
    distance?: number
    estimatedTime?: number
    isActive?: boolean
  }) {
    return await prisma.route.update({
      where: { id },
      data,
      include: {
        operator: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })
  }

  static async delete(id: string) {
    return await prisma.route.delete({
      where: { id },
    })
  }
}

// ===== ADMIN DASHBOARD SERVICE =====
export class AdminDashboardService {
  /**
   * Get dashboard statistics from database
   */
  static async getStats() {
    const [
      totalUsers,
      activeUsers,
      totalOperators,
      totalBuses,
      totalRoutes,
      totalDevices,
      dailyBookings,
      monthlyRevenue,
      totalBookings,
      completedPayments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.operator.count({ where: { isActive: true } }),
      prisma.bus.count({ where: { isActive: true } }),
      prisma.route.count({ where: { isActive: true } }),
      prisma.device.count({ where: { isActive: true } }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: {
          amount: true
        }
      }),
      prisma.booking.count(),
      prisma.payment.count({ where: { status: 'COMPLETED' } })
    ])

    return {
      totalUsers,
      activeUsers,
      totalOperators, 
      totalBuses,
      totalRoutes,
      totalDevices,
      dailyBookings,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      totalBookings,
      completedPayments,
      systemUptime: 99.9, // Implement based on your monitoring
    }
  }

  /**
   * Get all bookings from database
   */
  static async getAllBookings(params: {
    page: number
    search?: string
    status?: string
    limit?: number
  }) {
    const { page, search, status, limit = 10 } = params
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { passengerName: { contains: search, mode: 'insensitive' } },
        { passengerPhone: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase() as BookingStatus
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            }
          },
          schedule: {
            include: {
              route: {
                select: {
                  routeNumber: true,
                  startLocation: true,
                  endLocation: true,
                }
              },
              bus: {
                select: {
                  busNumber: true,
                }
              }
            }
          },
          payment: true,
          ticket: true,
        },
      }),
      prisma.booking.count({ where }),
    ])

    return {
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Get live bus positions from database
   */
  static async getLivePositions() {
    // Get the latest position for each device
    const devices = await prisma.device.findMany({
      where: { isActive: true },
      include: {
        bus: {
          select: {
            id: true,
            busNumber: true,
            capacity: true,
            operator: {
              select: {
                name: true,
              }
            }
          }
        },
        positions: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        }
      }
    })

    return devices.map(device => ({
      deviceId: device.deviceId,
      name: device.name,
      bus: device.bus ? {
        busNumber: device.bus.busNumber,
        capacity: device.bus.capacity,
        operator: device.bus.operator?.name,
      } : null,
      latestPosition: device.positions[0] || null,
    }))
  }
}
