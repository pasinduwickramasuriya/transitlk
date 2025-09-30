'use client'

import React from 'react'
import { Shield, Zap, Star, Users } from 'lucide-react'

const benefits = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'PCI DSS compliant payment processing with multiple gateway support including mobile wallets.',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Real-time WebSocket connections ensure instant updates with minimal latency.',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Star,
    title: 'Sri Lankan Context',
    description: 'Designed specifically for Sri Lankan transport patterns and user preferences.',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
]

export function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Built for Sri Lankan Commuters
            </h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-8 h-8 ${benefit.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <benefit.icon className={`h-5 w-5 ${benefit.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Join the Revolution</h3>
            <p className="text-gray-600 mb-6">
              Be part of Sri Lanka's transport transformation. Join thousands of satisfied users.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">25K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-600">150+</div>
                <div className="text-sm text-gray-600">Bus Routes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
