/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, startOfDay, endOfDay } from 'date-fns'
import { DateRange } from 'react-day-picker'
import {
    Search, RefreshCw, MapPin, Bus, Clock,
    CheckCircle2, CreditCard, MoreHorizontal, Loader2, FileDown, AlertTriangle
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
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { DatePickerWithRange } from '@/components/analytics/DateRangePicker'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
    payment?: { method: string; status: string }
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
    initialDateRange: DateRange | undefined
}

export function BookingsClient({ bookings: initialData, initialStats, initialDateRange }: BookingsClientProps) {
    const router = useRouter()

    // 2. State
    const [bookings, setBookings] = useState<Booking[]>(initialData)
    const [stats, setStats] = useState(initialStats)
    const [date, setDate] = useState<DateRange | undefined>(initialDateRange)
    const [searchQuery, setSearchQuery] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null) // For modals
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [showTicketDialog, setShowTicketDialog] = useState(false)

    // 3. Centralized Data Fetching
    const fetchBookings = async (currentDate: DateRange | undefined) => {
        if (!currentDate?.from) return false;

        try {
            const params = new URLSearchParams()
            params.set('from', currentDate.from.toISOString())
            if (currentDate.to) {
                params.set('to', currentDate.to.toISOString())
            } else {
                params.set('to', endOfDay(currentDate.from).toISOString())
            }

            const response = await fetch(`/api/operator/bookings?${params.toString()}`)
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
    const handleDateChange = (newDate: DateRange | undefined) => {
        setDate(newDate)
        if (newDate?.from) {
            const params = new URLSearchParams()
            params.set('from', newDate.from.toISOString())
            if (newDate.to) params.set('to', newDate.to.toISOString())

            router.push(`?${params.toString()}`) // Update URL
            fetchBookings(newDate)
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

    // Auto-Refresh
    useEffect(() => {
        const interval = setInterval(() => fetchBookings(date), 30000) // Increased to 30s
        return () => clearInterval(interval)
    }, [date])


    // Filter Logic
    const filteredData = bookings.filter(b =>
        b.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.schedule.route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.ticket?.ticketNumber || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Actions
    const handleCancelBooking = async () => {
        if (!selectedBooking) return;

        try {
            const res = await fetch(`/api/operator/bookings/${selectedBooking.id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                toast.success("Booking cancelled successfully")
                setShowCancelDialog(false)
                fetchBookings(date) // Refresh list
            } else {
                toast.error("Failed to cancel booking")
            }
        } catch (error) {
            console.error(error)
            toast.error("An error occurred")
        }
    }

    // Export PDF
    const exportPDF = () => {
        if (filteredData.length === 0) {
            toast.error("No data to export")
            return
        }

        const doc = new jsPDF()
        doc.text(`Bookings Report`, 14, 15)
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22)

        const tableColumn = ["ID", "Passenger", "Route", "Bus", "Status", "Amount"]
        const tableRows = filteredData.map(row => [
            row.ticket?.ticketNumber || row.id.substring(0, 8),
            row.passengerName,
            row.schedule.route.routeNumber,
            row.bus.busNumber,
            row.status,
            `Rs ${row.totalAmount}`
        ])

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        })

        doc.save(`bookings_report.pdf`)
        toast.success("PDF Downloaded")
    }

    // Export CSV
    const exportCSV = () => {
        if (filteredData.length === 0) return

        const headers = ["Ticket No", "Passenger", "Phone", "Route", "From", "To", "Bus", "Seat", "Date", "Status", "Amount"]
        const csvContent = [
            headers.join(','),
            ...filteredData.map(row => [
                row.ticket?.ticketNumber || row.id,
                `"${row.passengerName}"`,
                row.passengerPhone,
                row.schedule.route.routeNumber,
                `"${row.schedule.route.startLocation}"`,
                `"${row.schedule.route.endLocation}"`,
                row.bus.busNumber,
                `"${row.seatNumbers}"`,
                // Assuming we want booking or journey date here, but using created at for now or journey date if available in object
                // The booking object structure in props doesn't explicitly show journeyDate, assuming it exists or using available
                row.status,
                row.totalAmount
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `bookings_export.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }


    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        Bookings Management
                        {isRefreshing && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                    </h1>
                    <p className="text-sm text-slate-500">Manage reservations, view reports, and track revenue.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <DatePickerWithRange date={date} setDate={handleDateChange} />

                    <Button variant="outline" size="icon" onClick={onRefresh} disabled={isRefreshing}>
                        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <FileDown className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={exportCSV}>Export CSV</DropdownMenuItem>
                            <DropdownMenuItem onClick={exportPDF}>Export PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Bookings" value={stats.totalBookings} icon={<Bus />} color="bg-blue-50 text-blue-600" />
                <StatCard label="Confirmed" value={stats.confirmed} icon={<CheckCircle2 />} color="bg-emerald-50 text-emerald-600" />
                <StatCard label="Pending" value={stats.pending} icon={<Clock />} color="bg-amber-50 text-amber-600" />
                <StatCard label="Revenue" value={`Rs ${stats.revenue.toLocaleString()}`} icon={<CreditCard />} color="bg-slate-100 text-slate-900" isMoney />
            </div>

            {/* --- SEARCH --- */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search passenger, bus, or route..."
                        className="pl-9 bg-slate-50 border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-500">
                    Showing {filteredData.length} records
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
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
                                        No bookings found.
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
                                            <div className="flex justify-end gap-1 text-[10px] text-slate-400 uppercase">
                                                <span>{row.payment?.method || 'CASH'}</span>
                                            </div>
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
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedBooking(row)
                                                        setShowTicketDialog(true)
                                                    }}>
                                                        View Details
                                                    </DropdownMenuItem>

                                                    {row.status !== 'CANCELLED' && (
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            onClick={() => {
                                                                setSelectedBooking(row)
                                                                setShowCancelDialog(true)
                                                            }}
                                                        >
                                                            Cancel Booking
                                                        </DropdownMenuItem>
                                                    )}
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

            {/* CANCEL CONFIRMATION DIALOG */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Cancel Booking?
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel the booking for <strong>{selectedBooking?.passengerName}</strong>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Keep Booking</Button>
                        <Button variant="destructive" onClick={handleCancelBooking}>Yes, Cancel It</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* TICKET DETAILS DIALOG */}
            <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>
                            Ref: {selectedBooking?.ticket?.ticketNumber || selectedBooking?.id}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedBooking && (
                        <div className="grid gap-4 py-4 text-sm">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Name:</span>
                                <span className="col-span-3">{selectedBooking.passengerName}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Mobile:</span>
                                <span className="col-span-3">{selectedBooking.passengerPhone}</span>
                            </div>
                            <div className="border-t my-2"></div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Route:</span>
                                <span className="col-span-3">{selectedBooking.schedule.route.routeNumber} ({selectedBooking.schedule.route.startLocation} - {selectedBooking.schedule.route.endLocation})</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Bus:</span>
                                <span className="col-span-3">{selectedBooking.bus.busNumber}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Seats:</span>
                                <span className="col-span-3 font-mono bg-slate-100 p-1 rounded inline-block">{selectedBooking.seatNumbers}</span>
                            </div>
                            <div className="border-t my-2"></div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Total:</span>
                                <span className="col-span-3 font-bold text-lg">Rs {selectedBooking.totalAmount}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Status:</span>
                                <span className="col-span-3"><StatusBadge status={selectedBooking.status} /></span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

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