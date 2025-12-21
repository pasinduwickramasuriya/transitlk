'use client'

import { signOut } from 'next-auth/react'
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
import { LogOut, Zap } from 'lucide-react'

interface OperatorHeaderProps {
    title?: string
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string
    }
}

export function OperatorHeader({ title = 'Dashboard', user }: OperatorHeaderProps) {
    const initials = user?.name?.slice(0, 2).toUpperCase() || 'OP'

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-6">

                {/* LEFT: Brand & Page Title */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                            <Zap className="h-4 w-4" />
                        </div>
                        <span className="hidden font-bold text-slate-900 md:inline-block">TransitLK</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200" />
                    <h1 className="text-sm font-semibold text-slate-700">{title}</h1>
                </div>


                {/* RIGHT: Actions & Profile */}
                <div className="flex items-center gap-2">

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1">
                                <Avatar className="h-9 w-9 border border-slate-200">
                                    <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                                    <AvatarFallback className="bg-slate-100 text-slate-700 font-medium">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                {/* ✅ CENTERED DETAILS HERE */}
                                <div className="flex flex-col space-y-1 items-center text-center p-2">
                                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                                    <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600 justify-center" // Centered logout button text too
                                onClick={() => signOut({ callbackUrl: '/' })} // REDIRECT TO HOME
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}