'use client'

import React from 'react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { ArrowUpRight, Bus, Clock, Users, Leaf, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

// --- DATA ---
const GROWTH = [
    { name: 'Jan', val: 1200 }, { name: 'Feb', val: 1900 },
    { name: 'Mar', val: 2400 }, { name: 'Apr', val: 3800 },
    { name: 'May', val: 5100 }, { name: 'Jun', val: 7600 },
]

const PEAK = [
    { time: '6A', vol: 40 }, { time: '9A', vol: 95 },
    { time: '12P', vol: 45 }, { time: '3P', vol: 55 },
    { time: '6P', vol: 100 }, { time: '9P', vol: 70 },
]

const SATISFACTION = [
    { name: '5★', val: 65, color: '#10b981' },
    { name: '4★', val: 25, color: '#3b82f6' },
    { name: '3★', val: 10, color: '#f59e0b' },
]

const STATS = [
    { label: 'Active Users', value: '14.2k', trend: '+12%', icon: Users },
    { label: 'On-Time %', value: '98.4%', trend: '+2.1%', icon: Clock },
    { label: 'CO₂ Saved', value: '850t', trend: '+54%', icon: Leaf },
    { label: 'Active Buses', value: '342', trend: 'LIVE', icon: Bus },
]

export default function AnalyticsPage() {
    return (<>
        <Navbar />
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">

            {/* 1. HEADER */}
            <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-4 border border-blue-100">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                        </span>
                        System Live
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">
                        TransitLK Metrics
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 font-medium max-w-lg">
                        Real-time performance transparency. We track every mile to ensure efficiency.
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Rides</p>
                    <p className="text-3xl font-black tabular-nums tracking-tight">1,240,592</p>
                </div>
            </header>


            <main className="max-w-7xl mx-auto space-y-6">

                {/* 2. STATS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS.map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <stat.icon className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", stat.trend === 'LIVE' ? "bg-red-50 text-red-600 animate-pulse" : "bg-emerald-50 text-emerald-600")}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="text-2xl font-black tracking-tight text-slate-900">{stat.value}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* 3. CHARTS ROW 1 */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Growth Area Chart */}
                    <Card className="lg:col-span-2 shadow-sm border-slate-100 rounded-3xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-6">
                            <CardTitle className="text-base font-bold text-slate-800">Growth Velocity</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-slate-300" />
                        </CardHeader>
                        <CardContent className="h-[280px] px-6 pb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={GROWTH}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v) => `${v / 1000}k`} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={2} fill="#eff6ff" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Satisfaction Donut */}
                    <Card className="shadow-sm border-slate-100 rounded-3xl">
                        <CardHeader className="pb-2 px-6 pt-6">
                            <CardTitle className="text-base font-bold text-slate-800">Sentiment</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[280px] relative flex items-center justify-center px-6 pb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={SATISFACTION} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="val" stroke="none">
                                        {SATISFACTION.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-slate-900 tracking-tight">4.8</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 4. CHARTS ROW 2 */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="shadow-sm border-slate-100 rounded-3xl">
                        <CardHeader className="pb-2 px-6 pt-6">
                            <CardTitle className="text-base font-bold text-slate-800">Traffic Volume (Hourly)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[220px] px-6 pb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={PEAK}>
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                                    <Bar dataKey="vol" fill="#3b82f6" radius={[6, 6, 6, 6]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Simple Info Card */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
                        <Activity className="h-40 w-40 text-slate-800/50 absolute -right-8 -bottom-8" />
                        <div>
                            <h3 className="text-xl font-bold mb-2">Fleet Efficiency</h3>
                            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">AI-driven routing reduces fuel consumption and improves arrival times.</p>
                        </div>
                        <div className="mt-8 relative z-10">
                            <span className="text-4xl font-black text-emerald-400 tracking-tight">15%</span>
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Efficiency Gain</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <div className="text-center mt-12 py-8 border-t border-slate-200">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-600/20 transition-transform transform hover:scale-105 inline-flex items-center gap-2">
                    View Full Report <ArrowUpRight className="h-4 w-4" />
                </button>
            </div>
            <Footer />
        </div></>
    )
}