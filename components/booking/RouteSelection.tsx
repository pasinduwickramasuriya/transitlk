
// 'use client'

// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { ArrowLeft, ArrowRight, AlertCircle, Search } from 'lucide-react'
// import { RouteData, ScheduleData, SearchData } from '@/types/booking'
// import { RouteCard } from './RouteCard'

// interface RouteSelectionProps {
//   routes: RouteData[]
//   searchData: SearchData
//   onBusSelection: (route: RouteData, schedule: ScheduleData) => void
//   onBackToSearch: () => void
// }

// export function RouteSelection({ routes, searchData, onBusSelection, onBackToSearch }: RouteSelectionProps) {
//   // **INLINE EMPTY STATE - NO SEPARATE COMPONENT NEEDED**
//   if (routes.length === 0) {
//     return (
//       <div className="max-w-4xl mx-auto text-center">
//         <div className="relative">
//           <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20"></div>

//           <div className="relative p-12">
//             <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
//               <AlertCircle className="h-16 w-16 text-red-500" />
//             </div>

//             <h2 className="text-4xl font-bold text-gray-900 mb-6">No Routes Available</h2>
//             <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-8">
//               Sorry, no bus routes from <strong>"{searchData.from}"</strong> to <strong>"{searchData.to}"</strong> on {new Date(searchData.date).toLocaleDateString()}.
//             </p>

//             <div className="space-y-4 mb-8">
//               <p className="text-sm text-gray-500">Available routes in our system:</p>
//               <div className="flex flex-wrap gap-2 justify-center">
//                 {[
//                   { from: 'Colombo', to: 'Kandy' },
//                   { from: 'Colombo', to: 'Galle' },
//                   { from: 'colombo', to: 'katharagama' }
//                 ].map((route, index) => (
//                   <Badge
//                     key={index}
//                     variant="outline"
//                     className="cursor-pointer hover:bg-cyan-50 px-3 py-1"
//                   >
//                     {route.from} → {route.to}
//                   </Badge>
//                 ))}
//               </div>
//             </div>

//             <Button
//               onClick={onBackToSearch}
//               className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold px-8 py-3 rounded-2xl"
//             >
//               <ArrowLeft className="h-5 w-5 mr-2" />
//               Try Different Route
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // **ROUTES FOUND - DISPLAY LIST**
//   return (
//     <div className="max-w-5xl mx-auto">
//       <div className="relative">
//         <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20"></div>

//         <div className="relative">
//           {/* Header */}
//           <div className="p-8 pb-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Routes</h2>
//                 <p className="text-gray-700 text-lg">
//                   {searchData.from} → {searchData.to} • {new Date(searchData.date).toLocaleDateString()}
//                 </p>
//               </div>
//               <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 px-4 py-2 text-lg">
//                 {routes.length} route{routes.length > 1 ? 's' : ''} found
//               </Badge>
//             </div>
//           </div>

//           {/* Routes List */}
//           <div className="p-8 pt-0 space-y-6">
//             {routes.map((route) => (
//               <div key={route.id}>
//                 {route.schedules.map((schedule) => (
//                   <RouteCard
//                     key={schedule.id}
//                     route={route}
//                     schedule={schedule}
//                     onSelect={() => onBusSelection(route, schedule)}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }








'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, AlertCircle, MapPin, Calendar, TrendingUp } from 'lucide-react'
import { RouteData, ScheduleData, SearchData } from '@/types/booking'
import { RouteCard } from './RouteCard'

interface RouteSelectionProps {
  routes: RouteData[]
  searchData: SearchData
  onBusSelection: (route: RouteData, schedule: ScheduleData) => void
  onBackToSearch: () => void
}

export function RouteSelection({ routes, searchData, onBusSelection, onBackToSearch }: RouteSelectionProps) {
  // Empty State with Pastel Colors
  if (routes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Decorative Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-violet-50/80 to-sky-50/80 rounded-[2.5rem] -z-10"></div>
          
          {/* Main Container */}
          <div className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border-2 border-white/60 p-8 sm:p-12">
            {/* Icon with Glow */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-rose-300/30 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-rose-100/80 to-pink-100/80 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto border-2 border-white/60 shadow-xl">
                <AlertCircle className="h-14 w-14 text-rose-400" strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-4xl font-black text-slate-800 mb-4 text-center bg-gradient-to-r from-rose-600 via-violet-600 to-sky-600 bg-clip-text text-transparent">
              No Routes Available
            </h2>

            {/* Description */}
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8 text-center leading-relaxed">
              We couldn't find any bus routes from{' '}
              <span className="font-bold text-rose-600 bg-rose-50/50 px-2 py-1 rounded-lg">
                {searchData.from}
              </span>{' '}
              to{' '}
              <span className="font-bold text-violet-600 bg-violet-50/50 px-2 py-1 rounded-lg">
                {searchData.to}
              </span>{' '}
              on{' '}
              <span className="font-bold text-sky-600 bg-sky-50/50 px-2 py-1 rounded-lg">
                {new Date(searchData.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </p>

            {/* Popular Routes */}
            <div className="bg-gradient-to-br from-violet-50/50 via-sky-50/50 to-teal-50/50 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/60 mb-8">
              <p className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-500" />
                Popular Routes Available
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { from: 'Colombo', to: 'Kandy', color: 'from-violet-200/70 to-fuchsia-200/70 text-violet-700 border-violet-200/50' },
                  { from: 'Colombo', to: 'Galle', color: 'from-sky-200/70 to-cyan-200/70 text-sky-700 border-sky-200/50' },
                  { from: 'Colombo', to: 'Katharagama', color: 'from-rose-200/70 to-pink-200/70 text-rose-700 border-rose-200/50' }
                ].map((route, index) => (
                  <Badge
                    key={index}
                    className={`bg-gradient-to-r ${route.color} cursor-pointer hover:scale-105 transition-transform duration-300 px-4 py-2 text-sm font-bold shadow-lg backdrop-blur-xl border-2`}
                  >
                    {route.from} → {route.to}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <Button
              onClick={onBackToSearch}
              className="group relative overflow-hidden bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-bold px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto mx-auto block"
            >
              <ArrowLeft className="h-5 w-5 mr-2 inline group-hover:-translate-x-1 transition-transform duration-300" />
              Try Different Route
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Routes Found with Pastel Design
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-sky-50/50 to-teal-50/50 rounded-[2.5rem] -z-10"></div>

        {/* Main Container */}
        <div className="bg-white/35 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border-2 border-white/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-100/50 via-sky-100/50 to-teal-100/50 backdrop-blur-xl p-6 sm:p-8 border-b-2 border-white/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-800 bg-gradient-to-r from-violet-600 via-sky-600 to-teal-600 bg-clip-text text-transparent">
                  Available Routes
                </h2>
                
                {/* Route Info Cards */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/60 shadow-md">
                    <MapPin className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-bold text-slate-700">
                      {searchData.from} → {searchData.to}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/60 shadow-md">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    <span className="text-sm font-bold text-slate-700">
                      {new Date(searchData.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Routes Count Badge */}
              <Badge className="bg-gradient-to-r from-emerald-200/80 to-teal-200/80 text-emerald-700 border-2 border-emerald-300/50 px-5 py-2.5 text-base font-black shadow-lg backdrop-blur-xl">
                {routes.length} {routes.length === 1 ? 'Route' : 'Routes'} Found ✨
              </Badge>
            </div>
          </div>

          {/* Routes List */}
          <div className="p-6 sm:p-8 space-y-4">
            {routes.map((route, routeIndex) => (
              <div key={route.id} className="space-y-4">
                {route.schedules.map((schedule, scheduleIndex) => (
                  <div
                    key={schedule.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${(routeIndex * route.schedules.length + scheduleIndex) * 100}ms` }}
                  >
                    <RouteCard
                      route={route}
                      schedule={schedule}
                      onSelect={() => onBusSelection(route, schedule)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer with Back Button */}
          <div className="bg-gradient-to-r from-violet-50/50 via-sky-50/50 to-teal-50/50 backdrop-blur-xl p-6 border-t-2 border-white/60">
            <Button
              onClick={onBackToSearch}
              variant="outline"
              className="group bg-white/60 hover:bg-white/80 backdrop-blur-xl border-2 border-violet-200/50 hover:border-violet-300 text-slate-700 hover:text-violet-700 font-bold px-6 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Modify Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
