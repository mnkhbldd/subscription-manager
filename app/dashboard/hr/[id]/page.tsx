'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/lib/store'
import { formatDate, formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  CreditCard,
  Mail,
  Lock,
  Tag,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function HrProcessPage() {
  const params = useParams()
  const router = useRouter()
  const {
    currentUser,
    getRequestById,
    getCeoReviewByRequestId,
    getHrActionByRequestId,
    getUserById,
    tags,
    addHrAction,
  } = useApp()

  const request = getRequestById(params.id as string)
  const review = request ? getCeoReviewByRequestId(request.id) : undefined
  const existingAction = request ? getHrActionByRequestId(request.id) : undefined
  const employee = request ? getUserById(request.employeeId) : undefined

  const [showPassword, setShowPassword] = useState(false)
  const [cardLinked, setCardLinked] = useState(true)
  const [note, setNote] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  if (!request) {
    return (
      <div className="p-6 text-center">
        <p className="text-zinc-500">Request not found.</p>
        <Link href="/dashboard/hr">
          <Button variant="ghost" className="mt-3">Go Back</Button>
        </Link>
      </div>
    )
  }

  const alreadyProcessed = !!existingAction

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !note.trim()) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 700))
    addHrAction({
      requestId: request.id,
      processedBy: currentUser.id,
      cardLinked,
      cardLinkedNote: note,
      tagIds: selectedTagIds,
    })
    toast.success('Subscription processed!', {
      description: `${request.platformName} has been marked as processed.`,
    })
    router.push('/dashboard/hr')
  }

  const actionTags = existingAction
    ? existingAction.tagIds.map(id => tags.find(t => t.id === id)).filter(Boolean)
    : []

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <Link
          href="/dashboard/hr"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to approved queue
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">{request.platformName}</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          {alreadyProcessed ? 'Already processed' : 'Process this subscription request'}
        </p>
      </div>

      {alreadyProcessed && (
        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            This request has already been processed on {formatDate(existingAction.processedAt)}.
          </AlertDescription>
        </Alert>
      )}

      {/* Employee Info */}
      <Card className="border-zinc-200">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-zinc-100 font-semibold text-zinc-700">
                {employee?.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-zinc-900">{employee?.name}</p>
              <p className="text-sm text-zinc-500 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {employee?.department}
              </p>
            </div>
            <div className="ml-auto text-right text-sm text-zinc-500">
              <p>Submitted {formatDate(request.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials — HR Sensitive View */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            Account Credentials
          </CardTitle>
          <CardDescription className="text-xs">
            Use these credentials to sign in and link the company card.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-white rounded-lg border border-amber-100 p-3 space-y-3">
            <div>
              <p className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                <Mail className="w-3 h-3" /> Gmail
              </p>
              <p className="text-sm font-semibold text-zinc-800 mt-0.5 select-all">{request.gmail}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" /> Password
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm font-semibold text-zinc-800 font-mono select-all">
                  {showPassword ? request.gmailPassword : '••••••••••••'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-zinc-500">Platform:</p>
            <a
              href={request.platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
            >
              {request.platformUrl.replace('https://', '')}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="border-zinc-200">
        <CardContent className="pt-4 pb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Price</p>
              <p className="font-bold text-zinc-900 mt-1">{formatCurrency(request.price, request.currency)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Cycle</p>
              <Badge variant="secondary" className="capitalize text-xs mt-1">{request.billingCycle}</Badge>
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">CEO Note</p>
              <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{review?.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HR Action Form */}
      {!alreadyProcessed ? (
        <form onSubmit={handleSubmit}>
          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Processing Action
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Card Linked Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Card Successfully Linked</p>
                  <p className="text-xs text-zinc-500">Toggle if the company card was linked</p>
                </div>
                <Switch
                  checked={cardLinked}
                  onCheckedChange={setCardLinked}
                />
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">
                  Processing Note <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="e.g. Successfully linked company Visa card ending in 4242. Subscription is active."
                  rows={3}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Assign Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded-full font-medium border-2 transition-all',
                        selectedTagIds.includes(tag.id)
                          ? 'text-white border-transparent'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                      )}
                      style={
                        selectedTagIds.includes(tag.id)
                          ? { backgroundColor: tag.color, borderColor: tag.color }
                          : {}
                      }
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
                {tags.length === 0 && (
                  <p className="text-xs text-zinc-400">
                    No tags yet.{' '}
                    <Link href="/dashboard/hr/tags" className="text-blue-500 hover:underline">
                      Create tags
                    </Link>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800"
                disabled={!note.trim() || submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Processed
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      ) : (
        /* Already Processed View */
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Processing Record
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-xs text-zinc-500">Card Linked:</p>
              <Badge
                variant="outline"
                className={
                  existingAction.cardLinked
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-xs'
                    : 'bg-red-50 text-red-700 border-red-200 text-xs'
                }
              >
                {existingAction.cardLinked ? 'Yes' : 'No'}
              </Badge>
            </div>
            <p className="text-sm text-zinc-700">{existingAction.cardLinkedNote}</p>
            {actionTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {actionTags.map(tag =>
                  tag ? (
                    <span
                      key={tag.id}
                      className="text-xs px-2.5 py-1 rounded-full font-medium text-white"
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
