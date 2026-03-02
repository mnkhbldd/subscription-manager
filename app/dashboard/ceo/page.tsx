'use client'

import Link from 'next/link'
import { useApp } from '@/lib/store'
import { formatDate, formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ClockIcon, CheckCircle2, XCircle, ArrowRight, Layers, Building2 } from 'lucide-react'

export default function CeoDashboard() {
  const { requests, ceoReviews, getUserById } = useApp()

  const pending = requests.filter(r => r.status === 'pending')
  const reviewed = ceoReviews

  const stats = {
    pending: pending.length,
    approved: ceoReviews.filter(r => r.decision === 'approved').length,
    declined: ceoReviews.filter(r => r.decision === 'declined').length,
    total: requests.length,
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Pending Reviews</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Review and approve subscription requests from your team</p>
        </div>
        <Link href="/dashboard/ceo/history">
          <Button variant="outline" size="sm">
            View History
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Awaiting Review', value: stats.pending, icon: ClockIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Total Requests', value: stats.total, icon: Layers, color: 'text-zinc-500', bg: 'bg-zinc-50' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Declined', value: stats.declined, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
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

      {/* Pending Requests */}
      {pending.length === 0 ? (
        <Card className="border-zinc-200 border-dashed">
          <CardContent className="py-16 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-zinc-700 font-semibold">All caught up!</p>
            <p className="text-zinc-400 text-sm mt-1">No pending subscription requests to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
            {pending.length} request{pending.length !== 1 ? 's' : ''} waiting
          </h2>
          {pending.map(req => {
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
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-sm text-zinc-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {employee?.name} · {employee?.department}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-zinc-900">
                        {formatCurrency(req.price, req.currency)}
                        <span className="text-xs text-zinc-400 font-normal">/{req.billingCycle === 'one-time' ? 'once' : req.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">{formatDate(req.createdAt)}</p>
                    </div>
                    <Link href={`/dashboard/ceo/${req.id}`}>
                      <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 shrink-0">
                        Review
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                  <p className="text-sm text-zinc-500 mt-3 line-clamp-2 pl-14">{req.reasonNote}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
