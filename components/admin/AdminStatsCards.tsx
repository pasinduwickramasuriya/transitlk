import { Card, CardContent } from '@/components/ui/card'
import { Users, Building2, Bus, Route, CreditCard, TrendingUp } from 'lucide-react'

interface AdminStatsCardsProps {
  stats: {
    totalUsers: number
    activeUsers: number
    totalOperators: number
    totalBuses: number
    totalRoutes: number
    dailyBookings: number
    monthlyRevenue: number
    totalBookings: number
  }
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      subtitle: `${stats.activeUsers} active`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Operators',
      value: stats.totalOperators.toLocaleString(),
      subtitle: 'Active operators',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Buses',
      value: stats.totalBuses.toLocaleString(),
      subtitle: 'Fleet size',
      icon: Bus,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Routes',
      value: stats.totalRoutes.toLocaleString(),
      subtitle: 'Active routes',
      icon: Route,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Daily Bookings',
      value: stats.dailyBookings.toLocaleString(),
      subtitle: 'Today',
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Monthly Revenue',
      value: `LKR ${stats.monthlyRevenue.toLocaleString()}`,
      subtitle: 'This month',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
