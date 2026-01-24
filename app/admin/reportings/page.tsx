
'use client'

import React, { useState } from 'react'
import { startOfMonth, endOfMonth } from 'date-fns'
import { DateRange } from 'react-day-picker'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DatePickerWithRange } from '@/components/analytics/DateRangePicker'
import { FileDown, Loader2, Table as TableIcon } from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner is used for toasts

const REPORT_TYPES = [
    { value: 'REVENUE', label: 'Revenue Report' },
    { value: 'BOOKINGS', label: 'Bookings Report' },
    { value: 'PASSENGERS', label: 'Passenger Growth' },
    { value: 'OPERATIONS', label: 'Bus Operations' },
]

export default function ReportingsPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: new Date(),
    })
    const [reportType, setReportType] = useState('REVENUE')
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [headers, setHeaders] = useState<string[]>([])

    // GENERATE REPORT
    const handleGenerate = async () => {
        if (!date?.from || !date?.to) {
            toast.error("Please select a date range")
            return
        }

        setLoading(true)
        setData([])
        setHeaders([])

        try {
            const query = new URLSearchParams({
                type: reportType,
                from: date.from.toISOString(),
                to: date.to.toISOString()
            })

            const res = await fetch(`/api/admin/reports?${query}`)
            if (!res.ok) throw new Error('Failed to fetch report')

            const result = await res.json()
            const reportData = result.data || []

            if (reportData.length > 0) {
                setHeaders(Object.keys(reportData[0]))
                setData(reportData)
                toast.success(`Generated ${reportData.length} records.`)
            } else {
                toast.info("No records found for this period.")
            }

        } catch (error) {
            console.error(error)
            toast.error("Failed to generate report")
        } finally {
            setLoading(false)
        }
    }

    // EXPORT CSV
    const exportCSV = () => {
        if (data.length === 0) return

        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // EXPORT PDF
    const exportPDF = () => {
        if (data.length === 0) return

        const doc = new jsPDF()

        doc.text(`${REPORT_TYPES.find(t => t.value === reportType)?.label}`, 14, 15)
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22)

        const tableColumn = headers
        const tableRows = data.map(row => headers.map(header => row[header]))

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        })

        doc.save(`${reportType}_report.pdf`)
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Reportings</h1>
                    <p className="text-muted-foreground">
                        Generate and export detailed system reports.
                    </p>
                </div>
            </div>

            {/* CONTROLS */}
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Select report type and date range</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="grid gap-2 w-full md:w-[250px]">
                        <label className="text-sm font-medium">Report Type</label>
                        <Select value={reportType} onValueChange={setReportType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {REPORT_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2 w-full md:w-auto">
                        <label className="text-sm font-medium">Date Range</label>
                        <DatePickerWithRange date={date} setDate={setDate} />
                    </div>

                    <Button onClick={handleGenerate} disabled={loading} className="w-full md:w-auto">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TableIcon className="mr-2 h-4 w-4" />}
                        Generate Report
                    </Button>
                </CardContent>
            </Card>

            {/* PREVIEW & ACTIONS */}
            {data.length > 0 && (
                <div className="space-y-4 animate-in fade-in-50">
                    <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">
                            Found <strong>{data.length}</strong> records.
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={exportCSV}>
                                <FileDown className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                            <Button variant="outline" size="sm" onClick={exportPDF}>
                                <FileDown className="mr-2 h-4 w-4" />
                                Export PDF
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHead key={header}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.slice(0, 10).map((row, i) => (
                                    <TableRow key={i}>
                                        {headers.map((header) => (
                                            <TableCell key={header}>
                                                {typeof row[header] === 'number'
                                                    ? row[header].toLocaleString()
                                                    : row[header]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {data.length > 10 && (
                            <div className="p-4 text-center text-xs text-muted-foreground border-t">
                                Showing first 10 rows. Export to see full data.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
