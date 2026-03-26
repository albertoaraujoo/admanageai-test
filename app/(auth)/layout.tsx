import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#121212] antialiased">
      {children}
      <Toaster />
    </div>
  )
}
