import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { Toaster } from '@/components/ui/toaster'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
