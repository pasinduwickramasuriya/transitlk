'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Bus, Activity, Wifi, AlertTriangle, RefreshCw } from 'lucide-react'

interface FleetStats {
  totalBuses: number
  activeBuses: number
  gpsEnabled: number
  needsAttention: number
}

export function DynamicStatsCards() {
  const [stats, setStats] = useState<FleetStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      console.log('📊 Fetching real-time fleet stats...')

      const response = await fetch('/api/operator/buses/stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Real-time stats received:', data)

        setStats({
          totalBuses: data.totalBuses || 0,
          activeBuses: data.status?.active || 0,
          gpsEnabled: data.devices?.connected || 0,
          needsAttention: data.devices?.disconnected || 0
        })

        setLastUpdated(new Date())
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Error fetching real-time stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch stats on mount and every 30 seconds
  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (!stats && loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Loading real-time stats...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Real-Time Fleet Status</h3>
          <div className="flex items-center text-sm text-gray-500">
            <RefreshCw 
              className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} 
              onClick={() => !loading && fetchStats()}
              role="button"
              tabIndex={0}
            />
            {lastUpdated && (
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
              <Bus className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.totalBuses || 0}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.activeBuses || 0}</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
              <Wifi className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.gpsEnabled || 0}</p>
            <p className="text-sm text-gray-600">GPS On</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.needsAttention || 0}</p>
            <p className="text-sm text-gray-600">Issues</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
