'use client'

import Link from 'next/link'
import { useApp } from '@/lib/store'
import { StatusBadge } from '@/components/status-badge'
import { formatDate, formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, ExternalLink, FileText, Clock, CheckCircle2, XCircle, Layers } from 'lucide-react'
import { useState } from 'react'
import { RequestStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const FILTER_OPTIONS: { label: string; value: RequestStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Declined', value: 'declined' },
  { label: 'Processed', value: 'processed' },
]

export default function EmployeeDashboard() {
  const { currentUser, requests } = useApp()
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all')

  const myRequests = requests.filter(r => r.employeeId === currentUser?.id)
  const filtered = filter === 'all' ? myRequests : myRequests.filter(r => r.status === filter)

  const stats = {
    total: myRequests.length,
    pending: myRequests.filter(r => r.status === 'pending').length,
    approved: myRequests.filter(r => r.status === 'approved').length,
    declined: myRequests.filter(r => r.status === 'declined').length,
    processed: myRequests.filter(r => r.status === 'processed').length,
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Subscriptions</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Track your subscription requests and their status</p>
        </div>
        <Link href="/dashboard/employee/new">
          <Button className="bg-zinc-900 hover:bg-zinc-800">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Layers, color: 'text-zinc-600' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600' },
          { label: 'Approved', value: stats.approved + stats.processed, icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Declined', value: stats.declined, icon: XCircle, color: 'text-red-500' },
        ].map(stat => (
          <Card key={stat.label} className="border-zinc-200">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-zinc-900 mt-0.5">{stat.value}</p>
                </div>
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Requests Table */}
      <Card className="border-zinc-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Requests</CardTitle>
            <div className="flex gap-1.5">
              {FILTER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full font-medium transition-colors',
                    filter === opt.value
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm font-medium">No requests found</p>
              <p className="text-zinc-400 text-xs mt-1">
                {filter === 'all' ? 'Submit your first subscription request.' : `No ${filter} requests.`}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-100">
                  <TableHead className="text-xs font-semibold text-zinc-500">Platform</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500">Billing</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500">Price</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500">Submitted</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(req => (
                  <TableRow key={req.id} className="border-zinc-100 hover:bg-zinc-50">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm text-zinc-900">{req.platformName}</p>
                        <a
                          href={req.platformUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1 mt-0.5"
                          onClick={e => e.stopPropagation()}
                        >
                          {req.platformUrl.replace('https://', '').split('/')[0]}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {req.billingCycle}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(req.price, req.currency)}
                      </span>
                      <span className="text-xs text-zinc-400">/{req.billingCycle === 'one-time' ? 'once' : req.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500">{formatDate(req.createdAt)}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/employee/${req.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
