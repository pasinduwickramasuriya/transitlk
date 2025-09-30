'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Smartphone, BarChart3, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Real-Time GPS Tracking',
    description: 'Track your bus live with pinpoint accuracy. Know exactly when your bus will arrive.',
    gradient: 'from-blue-50 to-blue-100/50',
    iconBg: 'bg-blue-600',
    highlights: [
      'GPS-based live tracking',
      'WebSocket real-time updates',
      '2-minute accuracy guarantee'
    ]
  },
  {
    icon: Smartphone,
    title: 'Digital Ticketing',
    description: 'Book tickets instantly with QR code validation. No more cash transactions or long queues.',
    gradient: 'from-cyan-50 to-cyan-100/50',
    iconBg: 'bg-cyan-600',
    highlights: [
      'Real-time seat availability',
      'Multi-payment gateways'
    ]
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Powerful insights for operators and data-driven journey planning for passengers.',
    gradient: 'from-purple-50 to-purple-100/50',
    iconBg: 'bg-purple-600',
    highlights: [
      'Fleet management dashboard',
      'Route optimization',
      'Performance analytics'
    ]
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Revolutionizing Sri Lankan Transport
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            TransitLK brings cutting-edge technology to public transport, making travel 
            efficient, reliable, and user-friendly for everyone across Sri Lanka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${feature.gradient}`}
            >
              <CardContent className="p-8">
                <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
