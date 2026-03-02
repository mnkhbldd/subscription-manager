export type Role = 'employee' | 'ceo' | 'hr'
export type BillingCycle = 'monthly' | 'yearly' | 'one-time'
export type RequestStatus = 'pending' | 'approved' | 'declined' | 'processed'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department: string
  initials: string
}

export interface Tag {
  id: string
  name: string
  color: string
  createdBy: string
  createdAt: string
}

export interface SubscriptionRequest {
  id: string
  employeeId: string
  platformName: string
  platformUrl: string
  gmail: string
  gmailPassword: string
  price: number
  currency: string
  billingCycle: BillingCycle
  status: RequestStatus
  reasonNote: string
  createdAt: string
  updatedAt: string
}

export interface CeoReview {
  id: string
  requestId: string
  reviewedBy: string
  decision: 'approved' | 'declined'
  reason: string
  reviewedAt: string
}

export interface HrAction {
  id: string
  requestId: string
  processedBy: string
  cardLinked: boolean
  cardLinkedNote: string
  tagIds: string[]
  processedAt: string
}
