'use client'

import React from 'react'

const steps = [
  {
    number: '1',
    title: 'Create Account',
    description: 'Sign up in seconds to access all features and personalize your journey experience.',
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    number: '2', 
    title: 'Find & Book',
    description: 'Use our smart journey planner to find routes and book your tickets instantly.',
    gradient: 'from-cyan-600 to-purple-600'
  },
  {
    number: '3',
    title: 'Track & Travel',
    description: 'Follow your bus in real-time and enjoy a stress-free journey.',
    gradient: 'from-purple-600 to-pink-600'
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Journey, Simplified
          </h2>
          <p className="text-lg text-gray-600">
            Get started with TransitLK in three easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <span className="text-white text-2xl font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
