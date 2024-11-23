"use client"

import { cn } from "@/lib/utils"
import { Calendar, LayoutDashboard, Settings, Users2, FolderKanban, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./Logo"
import { useState } from "react"

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    color: 'text-sky-500'
  },
  {
    label: 'Calendar',
    icon: CalendarDays,
    href: '/calendar',
    color: 'text-violet-500'
  },
  {
    label: 'Post Overview',
    icon: Calendar,
    href: '/posts',
    color: 'text-violet-500'
  },
  {
    label: 'Projects',
    icon: FolderKanban,
    href: '/projects',
    color: 'text-violet-500'
  },
  {
    label: 'Team',
    icon: Users2,
    href: '/team',
    color: 'text-pink-500'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    color: 'text-orange-500'
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div 
      className={cn(
        "relative space-y-4 py-4 flex flex-col h-full bg-[#141517] text-white transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-9 bg-[#141517] p-1.5 rounded-full hover:bg-[#2A2B31] transition-colors"
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
      <div className="px-3 py-2 flex-1">
        <Link href="/" className={cn(
          "flex items-center pl-3 mb-14",
          isOpen ? "space-x-3" : "justify-center"
        )}>
          <Logo className="w-8 h-8" />
          {isOpen && (
            <h1 className="text-2xl font-bold">
              SocialFlow
            </h1>
          )}
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                isOpen ? "justify-start" : "justify-center"
              )}
            >
              <div className={cn(
                "flex items-center",
                isOpen ? "flex-1" : "flex-col"
              )}>
                <route.icon className={cn("h-5 w-5", isOpen ? "mr-3" : "", "text-[#5B5FED]")} />
                {isOpen && route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}