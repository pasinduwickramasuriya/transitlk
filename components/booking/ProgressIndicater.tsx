// 'use client'

// import { CheckCircle } from 'lucide-react'
// import { cn } from '@/lib/utils'

// interface ProgressIndicatorProps {
//   steps: string[]
//   currentStep: number
// }

// export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
//   return (
//     <div className="mb-12">
//       <div className="flex items-center justify-between mb-8">
//         {steps.map((step, index) => (
//           <div key={step} className="flex items-center relative">
//             <div className={cn(
//               "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-lg",
//               index <= currentStep 
//                 ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-cyan-200 scale-110" 
//                 : "bg-white text-gray-400 shadow-gray-100",
//               index === currentStep && "ring-4 ring-cyan-200 animate-pulse"
//             )}>
//               {index < currentStep ? (
//                 <CheckCircle className="h-6 w-6" />
//               ) : index === currentStep ? (
//                 <div className="w-3 h-3 bg-white rounded-full animate-ping" />
//               ) : (
//                 index + 1
//               )}
//             </div>
//             <div className="ml-4 hidden md:block">
//               <span className={cn(
//                 "font-semibold text-sm transition-colors duration-300",
//                 index <= currentStep ? "text-cyan-700" : "text-gray-400"
//               )}>
//                 {step}
//               </span>
//             </div>
//             {index < steps.length - 1 && (
//               <div className={cn(
//                 "w-20 h-1 mx-6 rounded-full transition-all duration-700 hidden md:block",
//                 index < currentStep 
//                   ? "bg-gradient-to-r from-cyan-600 to-blue-700" 
//                   : "bg-gray-200"
//               )} />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }







'use client'

import { CheckCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-16 px-4 sm:px-8">
      {/* Main Progress Container */}
      <div className="relative bg-white/40 backdrop-blur-3xl rounded-[2rem] p-8 border-2 border-white/60 shadow-2xl">
        {/* Decorative Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-50/50 via-sky-50/50 to-teal-50/50 rounded-[2rem] -z-10"></div>
        
        {/* Steps Container */}
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep
            
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                {/* Step Circle */}
                <div className="relative group">
                  {/* Glow Effect for Current Step */}
                  {isCurrent && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400/40 via-fuchsia-400/40 to-pink-400/40 rounded-[1.5rem] blur-xl animate-pulse scale-150"></div>
                  )}
                  
                  <div className={cn(
                    "relative w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-lg transition-all duration-500 shadow-xl backdrop-blur-xl border-2",
                    isCompleted && "bg-gradient-to-br from-emerald-200/90 to-teal-200/90 text-emerald-700 border-emerald-300/50 shadow-emerald-200/50 scale-105",
                    isCurrent && "bg-gradient-to-br from-violet-200/90 via-fuchsia-200/90 to-pink-200/90 text-violet-700 border-violet-300/50 shadow-violet-200/50 scale-110 animate-bounce",
                    isUpcoming && "bg-white/60 text-slate-400 border-slate-200/50 shadow-slate-100/50"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="h-8 w-8 drop-shadow-lg" strokeWidth={3} />
                    ) : isCurrent ? (
                      <div className="relative">
                        <Sparkles className="h-8 w-8 drop-shadow-lg animate-spin-slow" strokeWidth={3} />
                        <div className="absolute inset-0 bg-white/30 rounded-full blur-sm"></div>
                      </div>
                    ) : (
                      <span className="text-2xl font-black">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className={cn(
                      "px-4 py-2 rounded-2xl backdrop-blur-xl transition-all duration-300 border-2",
                      isCompleted && "bg-emerald-100/80 border-emerald-200/60",
                      isCurrent && "bg-gradient-to-r from-violet-100/80 via-fuchsia-100/80 to-pink-100/80 border-violet-200/60 shadow-lg shadow-violet-200/50",
                      isUpcoming && "bg-white/50 border-slate-200/50"
                    )}>
                      <span className={cn(
                        "font-bold text-sm transition-colors duration-300 drop-shadow-sm",
                        isCompleted && "text-emerald-700",
                        isCurrent && "text-violet-700 animate-pulse",
                        isUpcoming && "text-slate-400"
                      )}>
                        {step}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 px-4 hidden md:block">
                    <div className="relative h-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full overflow-hidden shadow-inner">
                      {/* Progress Fill */}
                      <div className={cn(
                        "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out",
                        index < currentStep 
                          ? "w-full bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 shadow-lg shadow-emerald-200/50" 
                          : "w-0 bg-slate-200"
                      )}>
                        {/* Shimmer Effect */}
                        {index < currentStep && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Progress Percentage */}
        <div className="mt-24 flex items-center justify-center">
          <div className="bg-gradient-to-r from-violet-100/80 via-fuchsia-100/80 to-pink-100/80 backdrop-blur-xl rounded-full px-6 py-3 border-2 border-violet-200/60 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-white/60 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 rounded-full transition-all duration-700 ease-out shadow-lg"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-black text-violet-700">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
