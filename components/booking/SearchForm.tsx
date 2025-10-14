// 'use client'

// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Badge } from '@/components/ui/badge'
// import { MapPin, Navigation, Calendar, Search, Loader2, Sparkles } from 'lucide-react'
// import { SearchData } from '@/types/booking'

// interface SearchFormProps {
//   searchData: SearchData
//   onSearchDataChange: (data: SearchData) => void
//   onSearch: (data: SearchData) => void
//   isLoading: boolean
// }

// export function SearchForm({ searchData, onSearchDataChange, onSearch, isLoading }: SearchFormProps) {
//   const popularDestinations = [
//     { from: 'Colombo', to: 'Kandy', icon: '🏛️', description: 'Cultural Capital', routeCode: 'A2' },
//     { from: 'Colombo', to: 'Galle', icon: '🏖️', description: 'Coastal Paradise', routeCode: 'A3' },
//     { from: 'colombo', to: 'katharagama', icon: '🛕', description: 'Sacred City', routeCode: 'A1' }
//   ]

//   const handleSearch = () => {
//     if (!searchData.from.trim() || !searchData.to.trim()) {
//       return
//     }
//     onSearch(searchData)
//   }

//   return (
//     <div className="max-w-7xl mx-auto space-y-12">
//       {/* Hero Section */}
//       <div className="text-center space-y-8">
//         <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-full border border-cyan-200 shadow-lg">
//           <Sparkles className="h-5 w-5 text-cyan-600 animate-pulse" />
//           <span className="text-sm font-semibold text-cyan-700">Live Database Search</span>
//         </div>

//         <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
//           Find Real
//           <span className="block bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
//             Bus Routes
//           </span>
//         </h1>

//         <p className="text-xl text-gray-700 max-w-3xl mx-auto">
//           Search and book authentic bus routes from our live database. Real schedules, real prices, real bookings.
//         </p>
//       </div>

//       {/* Search Form */}
//       <div className="relative">
//         <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20"></div>

//         <div className="relative p-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             {/* From Input */}
//             <div className="space-y-3">
//               <Label className="text-sm font-bold text-gray-800 flex items-center gap-2">
//                 <MapPin className="h-4 w-4 text-cyan-600" />
//                 From
//               </Label>
//               <Input
//                 value={searchData.from}
//                 onChange={(e) => onSearchDataChange({ ...searchData, from: e.target.value })}
//                 placeholder="e.g. Colombo"
//                 className="h-14 pl-4 text-lg border-2 border-white/40 hover:border-cyan-400 focus:border-cyan-500 rounded-2xl bg-white/60 backdrop-blur-sm font-medium"
//                 disabled={isLoading}
//               />
//             </div>

//             {/* To Input */}
//             <div className="space-y-3">
//               <Label className="text-sm font-bold text-gray-800 flex items-center gap-2">
//                 <Navigation className="h-4 w-4 text-teal-600" />
//                 To
//               </Label>
//               <Input
//                 value={searchData.to}
//                 onChange={(e) => onSearchDataChange({ ...searchData, to: e.target.value })}
//                 placeholder="e.g. Kandy"
//                 className="h-14 pl-4 text-lg border-2 border-white/40 hover:border-teal-400 focus:border-teal-500 rounded-2xl bg-white/60 backdrop-blur-sm font-medium"
//                 disabled={isLoading}
//               />
//             </div>

//             {/* Date Input */}
//             <div className="space-y-3">
//               <Label className="text-sm font-bold text-gray-800 flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-blue-600" />
//                 Journey Date
//               </Label>
//               <Input
//                 type="date"
//                 value={searchData.date}
//                 onChange={(e) => onSearchDataChange({ ...searchData, date: e.target.value })}
//                 min={new Date().toISOString().split('T')[0]}
//                 className="h-14 pl-4 text-lg border-2 border-white/40 hover:border-blue-400 focus:border-blue-500 rounded-2xl bg-white/60 backdrop-blur-sm font-medium"
//                 disabled={isLoading}
//               />
//             </div>

//             {/* Search Button */}
//             <div className="flex items-end">
//               <Button 
//                 onClick={handleSearch}
//                 disabled={isLoading}
//                 className="w-full h-14 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center">
//                     <Loader2 className="h-6 w-6 mr-3 animate-spin" />
//                     <span>Searching...</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center">
//                     <Search className="h-6 w-6 mr-3" />
//                     <span>Search Routes</span>
//                   </div>
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Popular Destinations */}
//           <div className="space-y-6">
//             <div className="flex items-center gap-3">
//               <Label className="text-lg font-bold text-gray-800">Available Routes</Label>
//               <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200">
//                 <Sparkles className="h-3 w-3 mr-1" />
//                 Live Database
//               </Badge>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {popularDestinations.map((dest, index) => (
//                 <div
//                   key={index}
//                   className="group cursor-pointer relative"
//                   onClick={() => onSearchDataChange({
//                     ...searchData,
//                     from: dest.from,
//                     to: dest.to
//                   })}
//                 >
//                   <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"></div>

//                   <div className="relative p-0">
//                     <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-600 relative overflow-hidden rounded-t-2xl">
//                       <div className="absolute inset-0 bg-black/20" />
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <span className="text-4xl">{dest.icon}</span>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h3 className="font-bold text-gray-900 mb-2">{dest.from} → {dest.to}</h3>
//                       <p className="text-sm text-gray-700 mb-2">{dest.description}</p>
//                       <Badge variant="outline" className="text-xs">
//                         Route {dest.routeCode}
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }










'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, Calendar, Search, Loader2, Sparkles, TrendingUp } from 'lucide-react'
import { SearchData } from '@/types/booking'

interface SearchFormProps {
  searchData: SearchData
  onSearchDataChange: (data: SearchData) => void
  onSearch: (data: SearchData) => void
  isLoading: boolean
}

export function SearchForm({ searchData, onSearchDataChange, onSearch, isLoading }: SearchFormProps) {
  const popularDestinations = [
    { from: 'Colombo', to: 'Kandy', icon: '🏛️', description: 'Cultural Capital', routeCode: 'A2', gradient: 'from-violet-400 to-fuchsia-400' },
    { from: 'Colombo', to: 'Galle', icon: '🏖️', description: 'Coastal Paradise', routeCode: 'A3', gradient: 'from-sky-400 to-cyan-400' },
    { from: 'colombo', to: 'katharagama', icon: '🛕', description: 'Sacred City', routeCode: 'A1', gradient: 'from-rose-400 to-pink-400' }
  ]

  const handleSearch = () => {
    if (!searchData.from.trim() || !searchData.to.trim()) {
      return
    }
    onSearch(searchData)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 px-4">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        {/* Live Status Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-100/80 to-teal-100/80 backdrop-blur-xl rounded-full border-2 border-white/60 shadow-lg hover:scale-105 transition-transform duration-300">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
          <span className="text-sm font-black text-emerald-700">Live Database Search</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 leading-tight">
          Find Your
          <span className="block bg-gradient-to-r from-violet-500 via-blue-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
            Perfect Route
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Search and book authentic bus routes from our live database.{' '}
          <span className="font-bold text-violet-600">Real schedules</span>,{' '}
          <span className="font-bold text-fuchsia-600">real prices</span>,{' '}
          <span className="font-bold text-pink-600">real bookings</span>.
        </p>
      </div>

      {/* Search Form Container */}
      <div className="relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-sky-50/50 to-teal-50/50 rounded-[2.5rem] -z-10"></div>

        {/* Main Form */}
        <div className="bg-white/35 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border-2 border-white/60 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* From Input */}
            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl flex items-center justify-center shadow-md">
                  <MapPin className="h-4 w-4 text-violet-600" />
                </div>
                Departure From
              </Label>
              <Input
                value={searchData.from}
                onChange={(e) => onSearchDataChange({ ...searchData, from: e.target.value })}
                placeholder="e.g. Colombo"
                className="h-14 px-4 text-base border-2 border-white/60 hover:border-violet-300 focus:border-violet-400 rounded-2xl bg-white/60 backdrop-blur-xl font-semibold shadow-lg focus:shadow-xl transition-all duration-300"
                disabled={isLoading}
              />
            </div>

            {/* To Input */}
            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-md">
                  <Navigation className="h-4 w-4 text-sky-600" />
                </div>
                Arrival To
              </Label>
              <Input
                value={searchData.to}
                onChange={(e) => onSearchDataChange({ ...searchData, to: e.target.value })}
                placeholder="e.g. Kandy"
                className="h-14 px-4 text-base border-2 border-white/60 hover:border-sky-300 focus:border-sky-400 rounded-2xl bg-white/60 backdrop-blur-xl font-semibold shadow-lg focus:shadow-xl transition-all duration-300"
                disabled={isLoading}
              />
            </div>

            {/* Date Input */}
            <div className="space-y-2.5">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl flex items-center justify-center shadow-md">
                  <Calendar className="h-4 w-4 text-teal-600" />
                </div>
                Journey Date
              </Label>
              <Input
                type="date"
                value={searchData.date}
                onChange={(e) => onSearchDataChange({ ...searchData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="h-14 px-4 text-base border-2 border-white/60 hover:border-teal-300 focus:border-teal-400 rounded-2xl bg-white/60 backdrop-blur-xl font-semibold shadow-lg focus:shadow-xl transition-all duration-300"
                disabled={isLoading}
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-black text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    <span>Search Routes</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Popular Destinations */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-violet-600" />
                <Label className="text-lg font-black text-slate-800">Popular Routes</Label>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-200/80 to-teal-200/80 text-emerald-700 border-2 border-emerald-300/50 backdrop-blur-xl shadow-md">
                <Sparkles className="h-3 w-3 mr-1" />
                Available Now
              </Badge>
            </div>

            {/* Route Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularDestinations.map((dest, index) => (
                <div
                  key={index}
                  className="group cursor-pointer relative"
                  onClick={() => onSearchDataChange({
                    ...searchData,
                    from: dest.from,
                    to: dest.to
                  })}
                >
                  {/* Card Container */}
                  <div className="relative bg-white/60 backdrop-blur-xl rounded-[1.5rem] border-2 border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                    {/* Image Header with Gradient */}
                    <div className={`h-28 bg-gradient-to-br ${dest.gradient} relative overflow-hidden`}>
                      {/* Overlay Pattern */}
                      <div className="absolute inset-0 bg-black/10"></div>

                      {/* Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl drop-shadow-lg filter group-hover:scale-110 transition-transform duration-300">
                          {dest.icon}
                        </span>
                      </div>

                      {/* Route Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 backdrop-blur-xl text-slate-700 font-bold shadow-lg border-2 border-white/60">
                          {dest.routeCode}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-black text-slate-800 text-lg">
                        {dest.from} → {dest.to}
                      </h3>
                      <p className="text-sm text-slate-600 font-semibold">
                        {dest.description}
                      </p>

                      {/* Click Indicator */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-violet-600 transition-colors duration-300">
                        <div className="w-1.5 h-1.5 bg-violet-400 rounded-full group-hover:animate-pulse"></div>
                        <span className="font-semibold">Click to select</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
