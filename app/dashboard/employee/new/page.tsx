'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Eye, EyeOff, SendHorizonal } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { BillingCycle } from '@/lib/types'

export default function NewRequestPage() {
  const { currentUser, addRequest } = useApp()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    platformName: '',
    platformUrl: '',
    gmail: '',
    gmailPassword: '',
    price: '',
    currency: 'USD',
    billingCycle: 'monthly' as BillingCycle,
    reasonNote: '',
  })

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const isValid =
    form.platformName.trim() &&
    form.platformUrl.trim() &&
    form.gmail.trim() &&
    form.gmailPassword.trim() &&
    form.price.trim() &&
    form.reasonNote.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !isValid) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    addRequest({
      employeeId: currentUser.id,
      platformName: form.platformName,
      platformUrl: form.platformUrl,
      gmail: form.gmail,
      gmailPassword: form.gmailPassword,
      price: parseFloat(form.price),
      currency: form.currency,
      billingCycle: form.billingCycle,
      reasonNote: form.reasonNote,
    })
    toast.success('Request submitted!', {
      description: `Your ${form.platformName} request is now pending CEO review.`,
    })
    router.push('/dashboard/employee')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/employee"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to my requests
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">New Subscription Request</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          Fill in the details and your CEO will review the request.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* Platform */}
          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-700">Platform Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="platformName">Platform Name <span className="text-red-500">*</span></Label>
                <Input
                  id="platformName"
                  placeholder="e.g. GitHub Copilot"
                  value={form.platformName}
                  onChange={e => set('platformName', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="platformUrl">Platform URL <span className="text-red-500">*</span></Label>
                <Input
                  id="platformUrl"
                  type="url"
                  placeholder="https://example.com/pricing"
                  value={form.platformUrl}
                  onChange={e => set('platformUrl', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-700">Account Credentials</CardTitle>
              <CardDescription className="text-xs">
                HR will use these to join the platform and link the company card.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="gmail">Gmail Address <span className="text-red-500">*</span></Label>
                <Input
                  id="gmail"
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={form.gmail}
                  onChange={e => set('gmail', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gmailPassword">Gmail Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="gmailPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your Gmail password"
                    value={form.gmailPassword}
                    onChange={e => set('gmailPassword', e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-700">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select value={form.currency} onValueChange={v => set('currency', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Billing Cycle <span className="text-red-500">*</span></Label>
                <Select
                  value={form.billingCycle}
                  onValueChange={v => set('billingCycle', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Justification */}
          <Card className="border-zinc-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-700">Justification</CardTitle>
              <CardDescription className="text-xs">
                Explain why this subscription is needed for your work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe why you need this subscription and how it will benefit your work..."
                rows={4}
                value={form.reasonNote}
                onChange={e => set('reasonNote', e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/dashboard/employee">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-zinc-900 hover:bg-zinc-800"
              disabled={!isValid || submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SendHorizonal className="w-4 h-4" />
                  Submit Request
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
