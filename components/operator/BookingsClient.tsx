/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
    Search, RefreshCw, MapPin, Bus, Clock,
    CheckCircle2, CreditCard, MoreHorizontal, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// 1. Clean Interface Definition
interface Booking {
    id: string
    passengerName: string
    passengerPhone: string
    status: string
    totalAmount: number
    seatNumbers: string
    schedule: {
        route: { routeNumber: string; startLocation: string; endLocation: string }
    }
    bus: { busNumber: string }
    payment?: { method: string }
    ticket?: { ticketNumber: string }
}

interface BookingsClientProps {
    bookings: Booking[]
    initialStats: {
        totalBookings: number
        confirmed: number
        revenue: number
        pending: number
    }
    initialDate: Date
}

export function BookingsClient({ bookings: initialData, initialStats, initialDate }: BookingsClientProps) {
    const router = useRouter()

    // 2. Simplified State
    const [bookings, setBookings] = useState<Booking[]>(initialData)
    const [stats, setStats] = useState(initialStats)
    const [date, setDate] = useState<Date>(new Date(initialDate))
    const [searchQuery, setSearchQuery] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)

    // 3. Centralized Data Fetching
    const fetchBookings = async (targetDate: Date) => {
        try {
            const formattedDate = format(targetDate, 'yyyy-MM-dd')
            const response = await fetch(`/api/operator/bookings?date=${formattedDate}`)
            if (response.ok) {
                const data = await response.json()
                setBookings(data.bookings)
                setStats(data.stats)
                return true
            }
        } catch (error) {
            console.error("Fetch error:", error)
        }
        return false
    }

    // Handle Date Change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value)
        if (!isNaN(newDate.getTime())) {
            setDate(newDate)
            router.push(`?date=${e.target.value}`) // Update URL
            fetchBookings(newDate) // Fetch immediately
        }
    }

    // Manual Refresh
    const onRefresh = async () => {
        setIsRefreshing(true)
        const success = await fetchBookings(date)
        setIsRefreshing(false)
        if (success) toast.success("Data updated successfully")
        else toast.error("Failed to update data")
    }

    // Auto-Refresh (Every 15s)
    useEffect(() => {
        const interval = setInterval(() => fetchBookings(date), 15000)
        return () => clearInterval(interval)
    }, [date])

    // Filter Logic
    const filteredData = bookings.filter(b =>
        b.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.schedule.route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        Bookings
                        {isRefreshing && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                    </h1>
                    <p className="text-sm text-slate-500">Manage daily reservations</p>
                </div>

                {/* Date Picker (Simple & Native) */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Input
                            type="date"
                            value={format(date, 'yyyy-MM-dd')}
                            onChange={handleDateChange}
                            className="w-40 font-semibold text-slate-700 border-slate-200 cursor-pointer"
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={onRefresh} disabled={isRefreshing}>
                        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                    </Button>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total" value={stats.totalBookings} icon={<Bus />} color="bg-blue-50 text-blue-600" />
                <StatCard label="Confirmed" value={stats.confirmed} icon={<CheckCircle2 />} color="bg-emerald-50 text-emerald-600" />
                <StatCard label="Pending" value={stats.pending} icon={<Clock />} color="bg-amber-50 text-amber-600" />
                <StatCard label="Revenue" value={`Rs ${stats.revenue.toLocaleString()}`} icon={<CreditCard />} color="bg-slate-100 text-slate-900" isMoney />
            </div>

            {/* --- SEARCH & ACTIONS --- */}
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search passenger, bus, or route..."
                        className="pl-9 bg-slate-50 border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div> */}

            {/* --- DATA TABLE --- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase">Passenger</th>
                                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase">Route</th>
                                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase">Bus Info</th>
                                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase text-right">Payment</th>
                                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase text-center">Status</th>
                                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        No bookings found for {format(date, 'MMMM d, yyyy')}
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* Passenger */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 bg-slate-100 border border-slate-200">
                                                    <AvatarFallback className="text-xs font-bold text-slate-600">
                                                        {row.passengerName.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{row.passengerName}</p>
                                                    <p className="text-xs text-slate-500">{row.passengerPhone}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Route */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                                                    {row.schedule.route.routeNumber}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center text-xs text-slate-600">
                                                <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                                                {row.schedule.route.startLocation} <span className="mx-1 text-slate-300">→</span> {row.schedule.route.endLocation}
                                            </div>
                                        </td>

                                        {/* Bus Info */}
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-mono font-medium text-slate-700">{row.bus.busNumber}</p>
                                            <p className="text-[10px] text-slate-500 uppercase mt-0.5">Seat: <span className="font-bold">{row.seatNumbers}</span></p>
                                        </td>

                                        {/* Payment */}
                                        <td className="px-6 py-4 text-right">
                                            <p className="font-bold text-slate-900">Rs {row.totalAmount.toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">{row.payment?.method || 'CASH'}</p>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge status={row.status} />
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>View Ticket</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">Cancel Booking</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, icon, color, isMoney }: any) {
    return (
        <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                    <p className={cn("text-xl font-bold mt-1", isMoney ? "text-slate-900" : "text-slate-900")}>
                        {value}
                    </p>
                </div>
                <div className={cn("p-2 rounded-lg", color)}>
                    {React.cloneElement(icon, { className: "h-5 w-5" })}
                </div>
            </CardContent>
        </Card>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
    }
    return (
        <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide", styles[status] || "bg-slate-100 text-slate-600 border-slate-200")}>
            {status}
        </span>
    )
}