'use client'

import React from 'react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { ArrowUpRight, Bus, Clock, Users, Leaf, Activity, Shield, Heart, Zap, Map, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

// --- MOCK DATA FOR CHARTS (Static shapes) ---
const PEAK = [
    { time: '6A', vol: 40 }, { time: '9A', vol: 95 },
    { time: '12P', vol: 45 }, { time: '3P', vol: 55 },
    { time: '6P', vol: 100 }, { time: '9P', vol: 70 },
]

const SATISFACTION_TEMPLATE = [
    { name: '5★', val: 65, color: '#10b981' },
    { name: '4★', val: 25, color: '#3b82f6' },
    { name: '3★', val: 10, color: '#f59e0b' },
]

export default function AnalyticsPage() {
    const [stats, setStats] = React.useState({
        users: 0,
        bookings: 0,
        buses: 0,
        routes: 0,
        revenue: 0,
        rating: 0,
        growth: [] as { name: string; val: number }[]
    })
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/analytics/public')
                if (res.ok) {
                    const data = await res.json()
                    setStats(data)
                }
            } catch (error) {
                console.error("Failed to fetch analytics", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Computed Stats for display
    const displayStats = [
        { label: 'Active Commuters', value: stats.users.toLocaleString(), trend: '+12%', icon: Users },
        { label: 'Successful Journeys', value: stats.bookings.toLocaleString(), trend: '+8%', icon: Clock },
        { label: 'CO₂ Emissions Saved', value: `${Math.round(stats.bookings * 1.5)}kg`, trend: '+54%', icon: Leaf },
        { label: 'Live Fleet Size', value: stats.buses.toString(), trend: 'LIVE', icon: Bus },
    ]

    return (<>
        <Navbar />
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* 1. HERO / ABOUT US HEADER */}
            <section className="bg-white border-b border-slate-200 pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/3 w-80 h-80 bg-cyan-100/50 rounded-full blur-3xl opacity-50" />

                <div className="max-w-4xl mx-auto text-center relative z-10 mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-6 border border-blue-100">
                        Our Mission & Impact
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-8 leading-tight">
                        Revolutionizing <span className="text-blue-600">Sri Lankan Transit.</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        TransitLK is more than app; we are a movement to digitize and modernize public transport across the island.
                        By connecting commuters, operators, and data, we make every journey safer, faster, and more reliable.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start relative z-10">

                    {/* LEFT COLUMN: WHO WE ARE */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Who We Are</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Born from a desire to end the chaos of uncertain bus schedules, TransitLK is a team of engineers, designers, and transport experts.
                                We saw millions of hours wasted waiting at bus stops and decided to build a solution. Today, we manage the largest digital transport network in Sri Lanka.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Our Service Promise</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="bg-blue-100 p-2 rounded-lg h-fit"><Smartphone className="h-5 w-5 text-blue-600" /></div>
                                    <div>
                                        <h4 className="font-bold">Digital First Booking</h4>
                                        <p className="text-sm text-slate-600">No more queues. Book your seat from your phone, instantly.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="bg-emerald-100 p-2 rounded-lg h-fit"><Map className="h-5 w-5 text-emerald-600" /></div>
                                    <div>
                                        <h4 className="font-bold">Real-Time Precision</h4>
                                        <p className="text-sm text-slate-600">Live GPS tracking means you know exactly when your bus arrives.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="bg-amber-100 p-2 rounded-lg h-fit"><Shield className="h-5 w-5 text-amber-600" /></div>
                                    <div>
                                        <h4 className="font-bold">Safety & Standards</h4>
                                        <p className="text-sm text-slate-600">Every operator is vetted. Every journey is monitored.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: TRANSPARENCY CARD */}
                    <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20" />

                        <h3 className="text-2xl font-bold mb-6 relative z-10">Why We Share Our Data</h3>
                        <p className="text-slate-300 mb-8 leading-relaxed relative z-10">
                            Trust is earned through transparency. We publish our operational metrics in real-time so our community—commuters like you—can see exactly how we perform. We have nothing to hide.
                        </p>

                        <div className="grid grid-cols-2 gap-8 relative z-10 border-t border-slate-700 pt-8">
                            <div>
                                <p className="text-4xl font-black text-white">
                                    {loading ? "..." : stats.bookings.toLocaleString()}
                                </p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Total Journeys</p>
                            </div>
                            <div>
                                <p className="text-4xl font-black text-white">
                                    {loading ? "..." : stats.rating.toFixed(1)}
                                </p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Average Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. LIVE METRICS HEADER */}
            <div className="bg-slate-50 py-20 px-6">
                <div className="max-w-7xl mx-auto mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
                        Our Impact by the Numbers
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        These aren't just statistics. They represent time saved, carbon emissions reduced, and thousands of daily connections made.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto space-y-6">

                    {/* 3. STATS GRID */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {displayStats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:border-blue-300 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <stat.icon className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", stat.trend === 'LIVE' ? "bg-red-50 text-red-600 animate-pulse" : "bg-emerald-50 text-emerald-600")}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <div className="text-3xl font-black tracking-tight text-slate-900">
                                    {loading ? "..." : stat.value}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* 4. CHARTS ROW 1 */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Growth Area Chart */}
                        <Card className="lg:col-span-2 shadow-sm border-slate-200/60 rounded-3xl">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-6">
                                <CardTitle className="text-base font-bold text-slate-800">Community Growth (Bookings)</CardTitle>
                                <ArrowUpRight className="h-4 w-4 text-slate-300" />
                            </CardHeader>
                            <CardContent className="h-[280px] px-6 pb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.growth.length > 0 ? stats.growth : [{ name: 'Loading', val: 0 }]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v) => `${v}`} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontSize: '12px' }} />
                                        <Area type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={2} fill="#eff6ff" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Satisfaction Donut */}
                        <Card className="shadow-sm border-slate-200/60 rounded-3xl">
                            <CardHeader className="pb-2 px-6 pt-6">
                                <CardTitle className="text-base font-bold text-slate-800">Passenger Sentiment</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[280px] relative flex items-center justify-center px-6 pb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={SATISFACTION_TEMPLATE} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="val" stroke="none">
                                            {SATISFACTION_TEMPLATE.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                                        {loading ? "-" : stats.rating.toFixed(1)}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>


                </div>
            </div>

            {/* CALL TO ACTION */}
            <div className="text-center bg-white py-16 px-6 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Start Your Journey With Us</h2>
                <p className="text-slate-500 max-w-xl mx-auto mb-8">Join thousands of Sri Lankans who trust TransitLK for their daily commute. Experience the future of public transport today.</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-600/20 transition-transform transform hover:scale-105 inline-flex items-center gap-2">
                    Book a Ticket Now <ArrowUpRight className="h-4 w-4" />
                </button>
            </div>

            <Footer />
        </div></>
    )
}