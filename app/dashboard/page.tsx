'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'

export default function DashboardRedirect() {
  const { currentUser } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      router.replace(`/dashboard/${currentUser.role}`)
    }
  }, [currentUser, router])

  return null
}
