import { Button } from '@/components/ui/button'
import { Avatar } from '@radix-ui/react-avatar'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, Search } from 'lucide-react'
import { AvatarFallback, AvatarImage } from '../ui/avatar'

export function DashboardHeader() {
  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold hidden sm:block">TransitLK Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4" />
            <span className="sr-only">Search</span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          <Avatar className="w-8 h-8">
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
