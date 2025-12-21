'use client'

import { signOut } from 'next-auth/react'
import {  LogOut} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AdminHeaderProps {
  user: {
    name: string
    email: string
    role: string
    image?: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="pl-2 pr-1 h-9 rounded-full gap-3 hover:bg-slate-100">
              <div className="hidden lg:flex flex-col items-end text-right">
                <span className="text-sm font-medium leading-none text-slate-900">{user.name}</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{user.role}</span>
              </div>
              <Avatar className="h-8 w-8 border border-slate-200">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="bg-slate-100 text-slate-700 font-bold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-slate-500">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}