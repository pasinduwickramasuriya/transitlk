'use client'

import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center relative">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-lg",
              index <= currentStep 
                ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-cyan-200 scale-110" 
                : "bg-white text-gray-400 shadow-gray-100",
              index === currentStep && "ring-4 ring-cyan-200 animate-pulse"
            )}>
              {index < currentStep ? (
                <CheckCircle className="h-6 w-6" />
              ) : index === currentStep ? (
                <div className="w-3 h-3 bg-white rounded-full animate-ping" />
              ) : (
                index + 1
              )}
            </div>
            <div className="ml-4 hidden md:block">
              <span className={cn(
                "font-semibold text-sm transition-colors duration-300",
                index <= currentStep ? "text-cyan-700" : "text-gray-400"
              )}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-20 h-1 mx-6 rounded-full transition-all duration-700 hidden md:block",
                index < currentStep 
                  ? "bg-gradient-to-r from-cyan-600 to-blue-700" 
                  : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}




