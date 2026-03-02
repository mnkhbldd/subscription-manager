'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/lib/store'
import { formatDate, formatCurrency } from '@/lib/format'
import { StatusBadge } from '@/components/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Building2,
  CalendarDays,
  CreditCard,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'

export default function CeoReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser, getRequestById, getCeoReviewByRequestId, getUserById, addCeoReview } =
    useApp()

  const request = getRequestById(params.id as string)
  const existingReview = request ? getCeoReviewByRequestId(request.id) : undefined
  const employee = request ? getUserById(request.employeeId) : undefined

  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!request) {
    return (
      <div className="p-6 text-center">
        <p className="text-zinc-500">Request not found.</p>
        <Link href="/dashboard/ceo">
          <Button variant="ghost" className="mt-3">Go Back</Button>
        </Link>
      </div>
    )
  }

  const handleDecision = async (decision: 'approved' | 'declined') => {
    if (!reason.trim() || !currentUser) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 700))
    addCeoReview({
      requestId: request.id,
      reviewedBy: currentUser.id,
      decision,
      reason,
    })
    toast.success(`Request ${decision}`, {
      description: `${request.platformName} has been ${decision}.`,
    })
    router.push('/dashboard/ceo')
  }

  const alreadyReviewed = !!existingReview

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <Link
          href="/dashboard/ceo"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to pending reviews
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{request.platformName}</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Subscription request review</p>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </div>

      {alreadyReviewed && (
        <Alert
          className={
            existingReview.decision === 'approved'
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-red-200 bg-red-50'
          }
        >
          {existingReview.decision === 'approved' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <AlertDescription
            className={existingReview.decision === 'approved' ? 'text-emerald-800' : 'text-red-800'}
          >
            You already {existingReview.decision} this request on {formatDate(existingReview.reviewedAt)}.
          </AlertDescription>
        </Alert>
      )}

      {/* Employee Info */}
      <Card className="border-zinc-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-700">Requested By</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-zinc-100 text-zinc-700 font-semibold">
                {employee?.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-zinc-900">{employee?.name}</p>
              <p className="text-sm text-zinc-500 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {employee?.department}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-zinc-400 flex items-center gap-1 justify-end">
                <CalendarDays className="w-3 h-3" /> Submitted {formatDate(request.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Info */}
      <Card className="border-zinc-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-700">Platform Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Platform</p>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="font-semibold text-zinc-900">{request.platformName}</p>
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
              <p className="text-xs text-zinc-400 font-medium">Cost</p>
              <p className="font-bold text-zinc-900 mt-1">
                {formatCurrency(request.price, request.currency)}
                <span className="text-xs text-zinc-400 font-normal ml-1">/{request.billingCycle}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Billing Cycle</p>
              <Badge variant="secondary" className="capitalize text-xs mt-1">{request.billingCycle}</Badge>
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Gmail</p>
              <p className="text-sm text-zinc-700 mt-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                {request.gmail}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs text-zinc-400 font-medium mb-1.5">Employee Justification</p>
            <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 rounded-lg p-3 border border-zinc-100">
              {request.reasonNote}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {!alreadyReviewed ? (
        <Card className="border-zinc-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-700">Your Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 font-medium block mb-1.5">
                Reason / Feedback <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Write your reason for approving or declining this request. This will be visible to the employee."
                rows={4}
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!reason.trim() || submitting}
                onClick={() => handleDecision('approved')}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                disabled={!reason.trim() || submitting}
                onClick={() => handleDecision('declined')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </div>
            {!reason.trim() && (
              <p className="text-xs text-zinc-400 text-center">
                Please write a reason before making a decision.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card
          className={
            existingReview.decision === 'approved' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
          }
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              {existingReview.decision === 'approved' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <CardTitle className="text-sm font-semibold text-zinc-700">Your Review</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-700 leading-relaxed">{existingReview.reason}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
