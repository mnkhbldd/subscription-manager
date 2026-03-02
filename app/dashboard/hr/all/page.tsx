'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/lib/store'
import { formatDate, formatCurrency } from '@/lib/format'
import { StatusBadge } from '@/components/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Search, ExternalLink, Tag, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RequestStatus } from '@/lib/types'

export default function AllSubscriptionsPage() {
  const { requests, tags, hrActions, getUserById, getHrActionByRequestId } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all')
  const [filterTagId, setFilterTagId] = useState<string>('all')

  const allRequests = requests.filter(r => {
    const matchSearch =
      r.platformName.toLowerCase().includes(search.toLowerCase()) ||
      getUserById(r.employeeId)?.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    const matchTag =
      filterTagId === 'all' ||
      (() => {
        const action = getHrActionByRequestId(r.id)
        return action ? action.tagIds.includes(filterTagId) : false
      })()
    return matchSearch && matchStatus && matchTag
  })

  const totalMonthly = requests
    .filter(r => r.status === 'processed')
    .reduce((sum, r) => {
      if (r.billingCycle === 'monthly') return sum + r.price
      if (r.billingCycle === 'yearly') return sum + r.price / 12
      return sum
    }, 0)

  const totalYearly = totalMonthly * 12

  const STATUS_FILTERS: { label: string; value: RequestStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Processed', value: 'processed' },
    { label: 'Approved', value: 'approved' },
    { label: 'Pending', value: 'pending' },
    { label: 'Declined', value: 'declined' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/hr" className="text-zinc-400 hover:text-zinc-700">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">All Subscriptions</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Complete view of all subscription requests</p>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-zinc-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Monthly Spend</p>
                <p className="text-xl font-bold text-zinc-900">${totalMonthly.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Yearly Spend (est.)</p>
                <p className="text-xl font-bold text-zinc-900">${totalYearly.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-zinc-200">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search by platform or employee..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap',
                    filterStatus === f.value
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag filter */}
          {tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-2">
              <button
                onClick={() => setFilterTagId('all')}
                className={cn(
                  'text-xs px-3 py-1 rounded-full font-medium border-2 transition-all',
                  filterTagId === 'all'
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                )}
              >
                All Tags
              </button>
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setFilterTagId(tag.id)}
                  className={cn(
                    'text-xs px-3 py-1 rounded-full font-medium border-2 transition-all',
                    filterTagId === tag.id ? 'text-white border-transparent' : 'border-zinc-200 text-zinc-600'
                  )}
                  style={filterTagId === tag.id ? { backgroundColor: tag.color } : {}}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-100">
                <TableHead className="text-xs font-semibold text-zinc-500">Employee</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500">Platform</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500">Price</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500">Status</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500">Tags</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-500">Date</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-zinc-400 text-sm">
                    No subscriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                allRequests.map(req => {
                  const employee = getUserById(req.employeeId)
                  const hrAction = getHrActionByRequestId(req.id)
                  const reqTags = hrAction
                    ? hrAction.tagIds.map(id => tags.find(t => t.id === id)).filter(Boolean)
                    : []

                  return (
                    <TableRow key={req.id} className="border-zinc-100 hover:bg-zinc-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="text-xs bg-zinc-100 font-semibold">
                              {employee?.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-zinc-900">{employee?.name}</p>
                            <p className="text-[10px] text-zinc-400">{employee?.department}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-semibold text-zinc-900">{req.platformName}</p>
                          <a
                            href={req.platformUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-300 hover:text-zinc-600"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <Badge variant="secondary" className="text-[10px] capitalize mt-0.5">
                          {req.billingCycle}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-bold text-zinc-900">
                          {formatCurrency(req.price, req.currency)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {reqTags.map(tag =>
                            tag ? (
                              <span
                                key={tag.id}
                                className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                                style={{ backgroundColor: tag.color }}
                              >
                                {tag.name}
                              </span>
                            ) : null
                          )}
                          {reqTags.length === 0 && (
                            <span className="text-[10px] text-zinc-300">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-400">
                        {formatDate(req.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/hr/${req.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
