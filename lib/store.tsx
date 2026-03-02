'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Tag, SubscriptionRequest, CeoReview, HrAction } from './types'
import { MOCK_USERS, MOCK_TAGS, MOCK_REQUESTS, MOCK_CEO_REVIEWS, MOCK_HR_ACTIONS } from './mock-data'

interface AppContextType {
  currentUser: User | null
  users: User[]
  tags: Tag[]
  requests: SubscriptionRequest[]
  ceoReviews: CeoReview[]
  hrActions: HrAction[]
  // Auth
  login: (userId: string) => void
  logout: () => void
  // Requests
  addRequest: (data: Omit<SubscriptionRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => string
  // CEO
  addCeoReview: (data: Omit<CeoReview, 'id' | 'reviewedAt'>) => void
  // HR
  addHrAction: (data: Omit<HrAction, 'id' | 'processedAt'>) => void
  // Tags
  addTag: (data: Omit<Tag, 'id' | 'createdAt'>) => void
  updateTag: (id: string, updates: Partial<Tag>) => void
  deleteTag: (id: string) => void
  // Helpers
  getUserById: (id: string) => User | undefined
  getRequestById: (id: string) => SubscriptionRequest | undefined
  getCeoReviewByRequestId: (requestId: string) => CeoReview | undefined
  getHrActionByRequestId: (requestId: string) => HrAction | undefined
  getTagById: (id: string) => Tag | undefined
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users] = useState<User[]>(MOCK_USERS)
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS)
  const [requests, setRequests] = useState<SubscriptionRequest[]>(MOCK_REQUESTS)
  const [ceoReviews, setCeoReviews] = useState<CeoReview[]>(MOCK_CEO_REVIEWS)
  const [hrActions, setHrActions] = useState<HrAction[]>(MOCK_HR_ACTIONS)

  useEffect(() => {
    const stored = localStorage.getItem('submanager_user')
    if (stored) {
      const user = MOCK_USERS.find(u => u.id === stored)
      if (user) setCurrentUser(user)
    }
  }, [])

  const login = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem('submanager_user', userId)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('submanager_user')
  }

  const addRequest = (data: Omit<SubscriptionRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): string => {
    const id = `req${Date.now()}`
    const newRequest: SubscriptionRequest = {
      ...data,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setRequests(prev => [newRequest, ...prev])
    return id
  }

  const addCeoReview = (data: Omit<CeoReview, 'id' | 'reviewedAt'>) => {
    const review: CeoReview = {
      ...data,
      id: `rev${Date.now()}`,
      reviewedAt: new Date().toISOString(),
    }
    setCeoReviews(prev => [...prev, review])
    setRequests(prev =>
      prev.map(r =>
        r.id === data.requestId
          ? { ...r, status: data.decision, updatedAt: new Date().toISOString() }
          : r
      )
    )
  }

  const addHrAction = (data: Omit<HrAction, 'id' | 'processedAt'>) => {
    const action: HrAction = {
      ...data,
      id: `ha${Date.now()}`,
      processedAt: new Date().toISOString(),
    }
    setHrActions(prev => [...prev, action])
    setRequests(prev =>
      prev.map(r =>
        r.id === data.requestId
          ? { ...r, status: 'processed', updatedAt: new Date().toISOString() }
          : r
      )
    )
  }

  const addTag = (data: Omit<Tag, 'id' | 'createdAt'>) => {
    const tag: Tag = { ...data, id: `t${Date.now()}`, createdAt: new Date().toISOString() }
    setTags(prev => [...prev, tag])
  }

  const updateTag = (id: string, updates: Partial<Tag>) => {
    setTags(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))
  }

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id))
  }

  const getUserById = (id: string) => users.find(u => u.id === id)
  const getRequestById = (id: string) => requests.find(r => r.id === id)
  const getCeoReviewByRequestId = (requestId: string) => ceoReviews.find(r => r.requestId === requestId)
  const getHrActionByRequestId = (requestId: string) => hrActions.find(a => a.requestId === requestId)
  const getTagById = (id: string) => tags.find(t => t.id === id)

  return (
    <AppContext.Provider
      value={{
        currentUser, users, tags, requests, ceoReviews, hrActions,
        login, logout,
        addRequest, addCeoReview, addHrAction,
        addTag, updateTag, deleteTag,
        getUserById, getRequestById, getCeoReviewByRequestId, getHrActionByRequestId, getTagById,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
