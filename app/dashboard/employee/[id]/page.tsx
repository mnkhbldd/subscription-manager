'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/lib/store'
import { StatusBadge } from '@/components/status-badge'
import { formatDate, formatDateTime, formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  User,
  Tag,
} from 'lucide-react'

export default function EmployeeRequestDetail() {
  const params = useParams()
  const { getRequestById, getCeoReviewByRequestId, getHrActionByRequestId, getUserById, tags } =
    useApp()

  const request = getRequestById(params.id as string)
  const review = request ? getCeoReviewByRequestId(request.id) : undefined
  const hrAction = request ? getHrActionByRequestId(request.id) : undefined

  if (!request) {
    return (
      <div className="p-6 text-center">
        <p className="text-zinc-500">Request not found.</p>
        <Link href="/dashboard/employee">
          <Button variant="ghost" className="mt-3">
            Go Back
          </Button>
        </Link>
      </div>
    )
  }

  const requestTags = hrAction
    ? hrAction.tagIds.map(id => tags.find(t => t.id === id)).filter(Boolean)
    : []

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <Link
          href="/dashboard/employee"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to my requests
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{request.platformName}</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Submitted on {formatDate(request.createdAt)}</p>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </div>

      {/* Status Alert */}
      {request.status === 'pending' && (
        <Alert className="border-amber-200 bg-amber-50">
          <Clock className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-amber-800 text-sm">
            Your request is waiting for CEO review. You'll be notified once a decision is made.
          </AlertDescription>
        </Alert>
      )}
      {request.status === 'declined' && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800 text-sm">
            Your request was declined. See the CEO's feedback below.
          </AlertDescription>
        </Alert>
      )}
      {request.status === 'processed' && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800 text-sm">
            Your subscription has been set up and the card has been linked.
          </AlertDescription>
        </Alert>
      )}

      {/* Request Info */}
      <Card className="border-zinc-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-700">Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 font-medium">Platform</p>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-sm font-semibold text-zinc-900">{request.platformName}</p>
                <a
                  href={request.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Price</p>
              <p className="text-sm font-semibold text-zinc-900 mt-1">
                {formatCurrency(request.price, request.currency)}
                <span className="text-xs text-zinc-400 font-normal ml-1">/{request.billingCycle}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Billing Cycle</p>
              <Badge variant="secondary" className="mt-1 capitalize text-xs">
                {request.billingCycle}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Gmail</p>
              <p className="text-sm text-zinc-700 mt-1">{request.gmail}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1">Your Justification</p>
            <p className="text-sm text-zinc-700 leading-relaxed">{request.reasonNote}</p>
          </div>
        </CardContent>
      </Card>

      {/* CEO Review */}
      {review && (
        <Card className={review.decision === 'approved' ? 'border-emerald-200' : 'border-red-200'}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              {review.decision === 'approved' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <CardTitle className="text-sm font-semibold text-zinc-700">
                CEO {review.decision === 'approved' ? 'Approved' : 'Declined'}
              </CardTitle>
              <span className="text-xs text-zinc-400 ml-auto">
                {formatDate(review.reviewedAt)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-700 leading-relaxed">{review.reason}</p>
          </CardContent>
        </Card>
      )}

      {/* HR Action */}
      {hrAction && (
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-sm font-semibold text-zinc-700">HR Processing</CardTitle>
              <span className="text-xs text-zinc-400 ml-auto">
                {formatDate(hrAction.processedAt)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Card Linked:</span>
              <Badge
                variant="outline"
                className={
                  hrAction.cardLinked
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }
              >
                {hrAction.cardLinked ? 'Yes' : 'No'}
              </Badge>
            </div>
            {hrAction.cardLinkedNote && (
              <p className="text-sm text-zinc-700 leading-relaxed">{hrAction.cardLinkedNote}</p>
            )}
            {requestTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-zinc-400" />
                {requestTags.map(tag =>
                  tag ? (
                    <span
                      key={tag.id}
                      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ) : null
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
