import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { Toaster } from '@/components/ui/toaster'
import { CreditsProvider } from '@/components/credits/credits-context'
import { SidebarProvider } from '@/components/layout/sidebar-context'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <CreditsProvider>
      <SidebarProvider>
        <div className="flex h-full min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col bg-surface-raised">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
          <Toaster />
        </div>
      </SidebarProvider>
    </CreditsProvider>
  )
}
