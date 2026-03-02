'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/store'
import { AppSidebar } from '@/components/app-sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-zinc-50/50">{children}</main>
    </div>
  )
}
