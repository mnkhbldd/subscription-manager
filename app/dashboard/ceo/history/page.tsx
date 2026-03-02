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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle2, XCircle, ArrowLeft, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CeoHistoryPage() {
  const { requests, ceoReviews, getUserById } = useApp()
  const [filter, setFilter] = useState<'all' | 'approved' | 'declined'>('all')

  const reviewedRequests = requests
    .filter(r => r.status === 'approved' || r.status === 'declined' || r.status === 'processed')
    .map(r => ({ request: r, review: ceoReviews.find(rev => rev.requestId === r.id) }))
    .filter(item => item.review)

  const filtered =
    filter === 'all'
      ? reviewedRequests
      : reviewedRequests.filter(item => item.review?.decision === filter)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/ceo" className="text-zinc-400 hover:text-zinc-700">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Review History</h1>
          <p className="text-zinc-500 text-sm mt-0.5">All your past subscription decisions</p>
        </div>
      </div>

      <Card className="border-zinc-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {filtered.length} decision{filtered.length !== 1 ? 's' : ''}
            </CardTitle>
            <div className="flex gap-1.5">
              {(['all', 'approved', 'declined'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full font-medium transition-colors capitalize',
                    filter === f
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-zinc-400 text-sm">No reviews found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-100">
                  <TableHead className="text-xs font-semibold text-zinc-500">Employee</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500">Platform</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500">Price</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500">Decision</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500">Reason</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500">Date</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(({ request, review }) => {
                  const employee = getUserById(request.employeeId)
                  return (
                    <TableRow key={request.id} className="border-zinc-100 hover:bg-zinc-50">
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
                          <p className="text-sm font-semibold text-zinc-900">{request.platformName}</p>
                          <a
                            href={request.platformUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-300 hover:text-zinc-600"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-semibold text-zinc-900">
                          {formatCurrency(request.price, request.currency)}
                        </p>
                        <p className="text-[10px] text-zinc-400 capitalize">{request.billingCycle}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {review?.decision === 'approved' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <Badge
                            variant="outline"
                            className={
                              review?.decision === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-xs'
                                : 'bg-red-50 text-red-700 border-red-200 text-xs'
                            }
                          >
                            {review?.decision === 'approved' ? 'Approved' : 'Declined'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-xs text-zinc-500 truncate">{review?.reason}</p>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-400">
                        {review ? formatDate(review.reviewedAt) : '—'}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/ceo/${request.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
