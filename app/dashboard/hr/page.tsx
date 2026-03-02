'use client'

import Link from 'next/link'
import { useApp } from '@/lib/store'
import { formatDate, formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CheckSquare, ArrowRight, Building2, CreditCard, ListChecks, Clock3 } from 'lucide-react'

export default function HrDashboard() {
  const { requests, hrActions, getUserById } = useApp()

  const approvedQueue = requests.filter(r => r.status === 'approved')
  const processedTotal = requests.filter(r => r.status === 'processed').length
  const totalActive = processedTotal
  const monthlySpend = requests
    .filter(r => r.status === 'processed')
    .reduce((sum, r) => {
      if (r.billingCycle === 'monthly') return sum + r.price
      if (r.billingCycle === 'yearly') return sum + r.price / 12
      return sum
    }, 0)

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Approved Queue</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Process CEO-approved subscriptions and link company cards
          </p>
        </div>
        <Link href="/dashboard/hr/all">
          <Button variant="outline" size="sm">
            All Subscriptions
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Awaiting Processing',
            value: approvedQueue.length,
            icon: Clock3,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
          },
          {
            label: 'Active Subscriptions',
            value: totalActive,
            icon: CheckSquare,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Total Processed',
            value: hrActions.length,
            icon: ListChecks,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
          },
          {
            label: 'Monthly Spend',
            value: `$${monthlySpend.toFixed(0)}`,
            icon: CreditCard,
            color: 'text-violet-500',
            bg: 'bg-violet-50',
          },
        ].map(stat => (
          <Card key={stat.label} className="border-zinc-200">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">{stat.label}</p>
                  <p className="text-xl font-bold text-zinc-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Queue */}
      {approvedQueue.length === 0 ? (
        <Card className="border-dashed border-zinc-200">
          <CardContent className="py-16 text-center">
            <CheckSquare className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-zinc-700 font-semibold">Queue is empty!</p>
            <p className="text-zinc-400 text-sm mt-1">
              No approved requests waiting to be processed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
            {approvedQueue.length} request{approvedQueue.length !== 1 ? 's' : ''} to process
          </h2>
          {approvedQueue.map(req => {
            const employee = getUserById(req.employeeId)
            return (
              <Card
                key={req.id}
                className="border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all"
              >
                <CardContent className="py-4 px-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className="bg-zinc-100 text-zinc-600 text-sm font-semibold">
                        {employee?.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-zinc-900">{req.platformName}</p>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {req.billingCycle}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          CEO Approved
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        {employee?.name} · {employee?.department}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-zinc-900">
                        {formatCurrency(req.price, req.currency)}
                        <span className="text-xs text-zinc-400 font-normal">
                          /{req.billingCycle === 'one-time' ? 'once' : req.billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">Approved {formatDate(req.updatedAt)}</p>
                    </div>
                    <Link href={`/dashboard/hr/${req.id}`}>
                      <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 shrink-0">
                        Process
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 pl-14">
                    <p className="text-xs text-zinc-400 font-medium mb-1">Gmail to use:</p>
                    <p className="text-sm text-zinc-600 font-medium">{req.gmail}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
