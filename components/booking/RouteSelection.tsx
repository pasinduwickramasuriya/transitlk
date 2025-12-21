
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, AlertCircle, Search } from 'lucide-react'
import { RouteData, ScheduleData, SearchData } from '@/types/booking'
import { RouteCard } from './RouteCard'

interface RouteSelectionProps {
  routes: RouteData[]
  searchData: SearchData
  onBusSelection: (route: RouteData, schedule: ScheduleData) => void
  onBackToSearch: () => void
}

export function RouteSelection({ routes, searchData, onBusSelection, onBackToSearch }: RouteSelectionProps) {
  // **INLINE EMPTY STATE - NO SEPARATE COMPONENT NEEDED**
  if (routes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20"></div>

          <div className="relative p-12">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-6">No Routes Available</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-8">
              Sorry, no bus routes from <strong>&quot;{searchData.from}&quot;</strong> to <strong>&quot;{searchData.to}&quot;</strong> on {new Date(searchData.date).toLocaleDateString()}.
            </p>

            <div className="space-y-4 mb-8">
              <p className="text-sm text-gray-500">Available routes in our system:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { from: 'Colombo', to: 'Kandy' },
                  { from: 'Colombo', to: 'Galle' },
                  { from: 'colombo', to: 'katharagama' }
                ].map((route, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-cyan-50 px-3 py-1"
                  >
                    {route.from} → {route.to}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={onBackToSearch}
              className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-2xl"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Try Different Route
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // **ROUTES FOUND - DISPLAY LIST**
  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20"></div>

        <div className="relative">
          {/* Header */}
          <div className="p-8 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Routes</h2>
                <p className="text-gray-700 text-lg">
                  {searchData.from} → {searchData.to} • {new Date(searchData.date).toLocaleDateString()}
                </p>
              </div>
              <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 px-4 py-2 text-lg">
                {routes.length} route{routes.length > 1 ? 's' : ''} found
              </Badge>
            </div>
          </div>

          {/* Routes List */}
          <div className="p-8 pt-0 space-y-6">
            {routes.map((route) => (
              <div key={route.id}>
                {route.schedules.map((schedule) => (
                  <RouteCard
                    key={schedule.id}
                    route={route}
                    schedule={schedule}
                    onSelect={() => onBusSelection(route, schedule)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}









