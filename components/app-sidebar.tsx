'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  Plus,
  LayoutList,
  ClockIcon,
  History,
  CheckSquare,
  TableIcon,
  Tag,
  LogOut,
  CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const EMPLOYEE_NAV = [
  { href: '/dashboard/employee', icon: LayoutList, label: 'My Requests' },
  { href: '/dashboard/employee/new', icon: Plus, label: 'New Request' },
]

const CEO_NAV = [
  { href: '/dashboard/ceo', icon: ClockIcon, label: 'Pending Reviews' },
  { href: '/dashboard/ceo/history', icon: History, label: 'Review History' },
]

const HR_NAV = [
  { href: '/dashboard/hr', icon: CheckSquare, label: 'Approved Queue' },
  { href: '/dashboard/hr/all', icon: TableIcon, label: 'All Subscriptions' },
  { href: '/dashboard/hr/tags', icon: Tag, label: 'Manage Tags' },
]

export function AppSidebar() {
  const { currentUser, logout, requests } = useApp()
  const pathname = usePathname()
  const router = useRouter()

  if (!currentUser) return null

  const navItems =
    currentUser.role === 'employee'
      ? EMPLOYEE_NAV
      : currentUser.role === 'ceo'
      ? CEO_NAV
      : HR_NAV

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const badgeCount =
    currentUser.role === 'ceo'
      ? requests.filter(r => r.status === 'pending').length
      : currentUser.role === 'hr'
      ? requests.filter(r => r.status === 'approved').length
      : 0

  const badgeHref = currentUser.role === 'ceo' ? '/dashboard/ceo' : '/dashboard/hr'

  const roleLabel =
    currentUser.role === 'ceo' ? 'CEO' : currentUser.role === 'hr' ? 'HR' : 'Employee'

  return (
    <aside className="flex flex-col h-full w-60 border-r bg-zinc-50 shrink-0">
      <div className="p-4 space-y-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-zinc-900 leading-tight">SubManager</p>
            <p className="text-[10px] text-zinc-500 leading-tight">Subscription Control</p>
          </div>
        </div>

        <Separator />

        {/* Current User */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white border border-zinc-200">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="text-xs bg-zinc-200 font-semibold">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 truncate">{currentUser.name}</p>
            <p className="text-xs text-zinc-500">{roleLabel}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-3 py-2">
          Navigation
        </p>
        {navItems.map(item => {
          const isActive = pathname === item.href
          const showBadge = item.href === badgeHref && badgeCount > 0
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                    isActive ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'
                  )}
                >
                  {badgeCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 mt-auto border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-zinc-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
