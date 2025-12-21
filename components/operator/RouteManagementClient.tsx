/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Route, MapPin, Clock, Activity, Calendar, Users, RefreshCcw } from 'lucide-react'
import { RoutesTable } from '@/components/operator/RoutesTable'
import { RoutesFilters } from '@/components/operator/RoutesFilters'
import { CreateRouteDialog } from '@/components/operator/CreateRouteDialog'
import { StopsTable } from '@/components/operator/StopsTable'
//  import { StopsFilters } from '@/components/operator/StopsFilters'
import { SchedulesTable } from '@/components/operator/SchedulesTable'
// import { SchedulesFilters } from '@/components/operator/SchedulesFilters'
import { CreateStopDialog } from '@/components/operator/CreateStopDialog'
import { CreateScheduleDialog } from '@/components/operator/CreateScheduleDialog'
import { cn } from '@/lib/utils'

interface Stats {
  totalRoutes: number
  activeRoutes: number
  inactiveRoutes: number
  totalStops: number
  totalSchedules: number
  activeSchedules: number
  inactiveSchedules: number
  recentRoutes: number
  recentStops: number
  recentSchedules: number
  totalBuses: number
}

interface Operator {
  id: string
  name: string
}

interface RouteManagementClientProps {
  operator: Operator
  stats: Stats
  initialSearchParams: any
}

export function RouteManagementClient({ 
  operator, 
  stats: initialStats, 
  initialSearchParams 
}: RouteManagementClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State for active tab
  const [activeTab, setActiveTab] = useState(initialSearchParams.tab || 'routes')
  const [stats, setStats] = useState(initialStats)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Update active tab when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'routes'
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams, activeTab])

  // Handle tab change
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    
    // Update URL with new tab
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', newTab)
    
    // Reset page to 1 when changing tabs
    params.set('page', '1')
    
    // Clear search and filters when changing tabs
    params.delete('search')
    params.delete('routeId')
    params.delete('busId')
    params.delete('status')
    params.delete('sortBy')
    params.delete('sortOrder')
    params.delete('coordinateFilter')
    params.delete('timeFilter')
    params.delete('hasStops')
    params.delete('hasSchedules')
    
    router.push(`?${params.toString()}`)
  }


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Management System</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive management of routes, stops, and schedules for your bus fleet
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Operator: <span className="font-medium">{operator.name}</span> • ID: <span className="font-mono">{operator.id}</span>
          </p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <CreateRouteDialog operatorId={operator.id}>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Route className="w-4 h-4" />
              <span>Add Route</span>
            </Button>
          </CreateRouteDialog>
          
          <CreateStopDialog operatorId={operator.id}>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Add Stop</span>
            </Button>
          </CreateStopDialog>
          
          <CreateScheduleDialog operatorId={operator.id}>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Add Schedule</span>
            </Button>
          </CreateScheduleDialog>
        </div>
      </div>

      {/* Comprehensive Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Routes"
          value={stats.totalRoutes}
          icon={Route}
          color="text-blue-600"
          bgColor="bg-blue-50"
          subtitle={`+${stats.recentRoutes} this week`}
          loading={isRefreshing}
        />
        <StatsCard
          title="Active Routes"
          value={stats.activeRoutes}
          icon={Activity}
          color="text-green-600"
          bgColor="bg-green-50"
          subtitle={`${stats.inactiveRoutes} inactive`}
          loading={isRefreshing}
        />
        <StatsCard
          title="Total Stops"
          value={stats.totalStops}
          icon={MapPin}
          color="text-purple-600"
          bgColor="bg-purple-50"
          subtitle={`+${stats.recentStops} this week`}
          loading={isRefreshing}
        />
        <StatsCard
          title="Total Schedules"
          value={stats.totalSchedules}
          icon={Calendar}
          color="text-orange-600"
          bgColor="bg-orange-50"
          subtitle={`+${stats.recentSchedules} this week`}
          loading={isRefreshing}
        />
        <StatsCard
          title="Active Schedules"
          value={stats.activeSchedules}
          icon={Clock}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
          subtitle={`${stats.inactiveSchedules} inactive`}
          loading={isRefreshing}
        />
        <StatsCard
          title="Available Buses"
          value={stats.totalBuses}
          icon={Users}
          color="text-pink-600"
          bgColor="bg-pink-50"
          subtitle="Ready for scheduling"
          loading={isRefreshing}
        />
      </div>

      {/* Main Content Tabs with Working Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger 
            value="routes" 
            className={cn(
              "flex items-center space-x-2 transition-all",
              "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700",
              "data-[state=active]:border-blue-200 data-[state=active]:shadow-sm"
            )}
          >
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Routes ({stats.totalRoutes})</span>
            <span className="sm:hidden">Routes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="stops" 
            className={cn(
              "flex items-center space-x-2 transition-all",
              "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700",
              "data-[state=active]:border-purple-200 data-[state=active]:shadow-sm"
            )}
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Stops ({stats.totalStops})</span>
            <span className="sm:hidden">Stops</span>
          </TabsTrigger>
          <TabsTrigger 
            value="schedules" 
            className={cn(
              "flex items-center space-x-2 transition-all",
              "data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700",
              "data-[state=active]:border-orange-200 data-[state=active]:shadow-sm"
            )}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedules ({stats.totalSchedules})</span>
            <span className="sm:hidden">Schedules</span>
          </TabsTrigger>
        </TabsList>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Route className="h-5 w-5 text-blue-600" />
                Bus Routes
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your bus routes and their configurations
              </p>
            </div>
            <CreateRouteDialog operatorId={operator.id}>
              <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                <span>Add New Route</span>
              </Button>
            </CreateRouteDialog>
          </div>

          <RoutesFilters />
          <RoutesTable />
        </TabsContent>

        {/* Stops Tab */}
        <TabsContent value="stops" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                Route Stops
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage stops for all your routes with GPS coordinates
              </p>
            </div>
            <CreateStopDialog operatorId={operator.id}>
              <Button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4" />
                <span>Add New Stop</span>
              </Button>
            </CreateStopDialog>
          </div>

          {/* <StopsFilters /> */}
          <StopsTable />
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Bus Schedules
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage schedules by assigning buses to routes with specific times
              </p>
            </div>
            <CreateScheduleDialog operatorId={operator.id}>
              <Button className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4" />
                <span>Add New Schedule</span>
              </Button>
            </CreateScheduleDialog>
          </div>

          {/* <SchedulesFilters /> */}
          <SchedulesTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ✅ ENHANCED STATS CARD COMPONENT
interface StatsCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  subtitle?: string
  loading?: boolean
}

function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  subtitle,
  loading = false 
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg transition-all duration-200",
            bgColor,
            "group-hover:scale-105"
          )}>
            <Icon className={cn("h-5 w-5", color)} />
          </div>
          <div className="flex-1 min-w-0">
            {loading ? (
              <>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                {subtitle && (
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse mt-1"></div>
                )}
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-gray-900 transition-colors">
                  {value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 truncate">{title}</p>
                {subtitle && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
