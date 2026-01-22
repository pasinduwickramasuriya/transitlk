
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DatePickerWithRange } from '@/components/analytics/DateRangePicker'
import { DateRange } from 'react-day-picker'
import { subDays, format } from 'date-fns'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import {
    Activity,
    CreditCard,
    Users,
    Bus,
    TrendingUp,
    DollarSign,
    RefreshCw,
    Loader2
} from 'lucide-react'

// Colors for Charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AnalyticsPage() {
    // State
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    })
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    // Fetch Data
    const fetchData = useCallback(async () => {
        if (!date?.from || !date?.to) return

        setLoading(true)
        try {
            const query = new URLSearchParams({
                from: date.from.toISOString(),
                to: date.to.toISOString()
            })

            const res = await fetch(`/api/admin/analytics?${query}`)
            if (!res.ok) throw new Error('Failed to fetch analytics')

            const jsonData = await res.json()
            setData(jsonData)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [date])

    // Initial Load & Refresh
    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of revenue, bookings, and system performance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <DatePickerWithRange date={date} setDate={setDate} />
                    <Button onClick={fetchData} variant="outline" size="icon">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            LKR {data?.summary?.totalRevenue?.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            For selected period
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.summary?.totalBookings}</div>
                        <p className="text-xs text-muted-foreground">
                            Confirmed transactions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.summary?.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            +{data?.summary?.newUsers} new in period
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Fleet</CardTitle>
                        <Bus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.summary?.activeBuses}</div>
                        <p className="text-xs text-muted-foreground">
                            Buses currently active
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Revenue Trend - Large Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue & Bookings Trend</CardTitle>
                        <CardDescription>
                            Daily performance over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.charts?.revenueOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(val) => format(new Date(val), 'MMM dd')}
                                        stroke="#888888"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickFormatter={(val) => `LKR ${val}`}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#82ca9d"
                                        fontSize={12}
                                    />
                                    <Tooltip
                                        labelFormatter={(val) => format(new Date(val), 'MMM dd, yyyy')}
                                        formatter={(value: any, name: any) => [
                                            name === 'revenue' ? `LKR ${value.toLocaleString()}` : value,
                                            name === 'revenue' ? 'Revenue' : 'Bookings'
                                        ]}
                                    />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        activeDot={{ r: 8 }}
                                        name="Revenue"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="bookings"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                        name="Bookings"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Booking Status - Pie Chart */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Booking Status</CardTitle>
                        <CardDescription>
                            Distribution of booking statuses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.charts?.bookingsByStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data?.charts?.bookingsByStatus?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions & Payment Methods */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Payment Methods - Bar Chart */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>
                            Popular payment options
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.charts?.paymentsByMethod} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                        {data?.charts?.paymentsByMethod?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions List */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>
                            Latest 5 financial activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data?.recentTransactions?.map((transaction: any) => (
                                <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{transaction.user}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">LKR {transaction.amount.toLocaleString()}</div>
                                        <div className="flex items-center justify-end gap-2 mt-1">
                                            <Badge variant={transaction.status === 'CONFIRMED' ? 'default' : 'secondary'} className="text-[10px]">
                                                {transaction.status}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px]">
                                                {transaction.paymentStatus}
                                            </Badge>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
