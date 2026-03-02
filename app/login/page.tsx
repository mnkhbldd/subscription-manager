'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'
import { MOCK_USERS } from '@/lib/mock-data'
import { User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CreditCard, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const ROLE_COLORS: Record<string, string> = {
  employee: 'bg-blue-100 text-blue-700 border-blue-200',
  ceo: 'bg-violet-100 text-violet-700 border-violet-200',
  hr: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const ROLE_LABELS: Record<string, string> = {
  employee: 'Employee',
  ceo: 'CEO',
  hr: 'HR',
}

function UserCard({ user, selected, onSelect }: { user: User; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
        selected
          ? 'border-zinc-900 bg-zinc-50 shadow-sm'
          : 'border-zinc-100 bg-white hover:border-zinc-300 hover:bg-zinc-50'
      )}
    >
      <Avatar className="w-10 h-10 shrink-0">
        <AvatarFallback
          className={cn('text-sm font-semibold', selected ? 'bg-zinc-900 text-white' : 'bg-zinc-100')}
        >
          {user.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
        <p className="text-xs text-zinc-500">{user.department}</p>
      </div>
      <Badge variant="outline" className={cn('text-xs shrink-0', ROLE_COLORS[user.role])}>
        {ROLE_LABELS[user.role]}
      </Badge>
    </button>
  )
}

export default function LoginPage() {
  const { login } = useApp()
  const router = useRouter()
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  const employees = MOCK_USERS.filter(u => u.role === 'employee')
  const executives = MOCK_USERS.filter(u => u.role !== 'employee')

  const handleLogin = () => {
    if (!selectedUserId) return
    login(selectedUserId)
    const user = MOCK_USERS.find(u => u.id === selectedUserId)
    if (user) router.push(`/dashboard/${user.role}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 shadow-lg">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">SubManager</h1>
            <p className="text-zinc-500 text-sm mt-1">Company Subscription Management</p>
          </div>
        </div>

        <Card className="shadow-xl border-zinc-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Choose an Account</CardTitle>
            <CardDescription>
              Select any account to explore the demo. No password required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Employees */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Employees</p>
              <div className="space-y-2">
                {employees.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    selected={selectedUserId === user.id}
                    onSelect={() => setSelectedUserId(user.id)}
                  />
                ))}
              </div>
            </div>

            {/* Executives */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Leadership</p>
              <div className="space-y-2">
                {executives.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    selected={selectedUserId === user.id}
                    onSelect={() => setSelectedUserId(user.id)}
                  />
                ))}
              </div>
            </div>

            <Button
              className="w-full bg-zinc-900 hover:bg-zinc-800 h-11"
              onClick={handleLogin}
              disabled={!selectedUserId}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-zinc-400">
          This is a demo environment with mocked data.
        </p>
      </div>
    </div>
  )
}
