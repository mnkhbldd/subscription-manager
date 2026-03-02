import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/store'
import { Toaster } from '@/components/ui/sonner'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SubManager — Subscription Management',
  description: 'Company subscription request and approval management platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <AppProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AppProvider>
      </body>
    </html>
  )
}
