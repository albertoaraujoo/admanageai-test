'use client'

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { UpgradeButton } from './upgrade-button'
import { RenderQueueButton } from './render-queue-button'
import { useSidebar } from './sidebar-context'

export function Topbar() {
  const { collapsed, toggle } = useSidebar()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface-raised px-4">
      {/* Left: sidebar toggle */}
      <button
        onClick={toggle}
        title={collapsed ? 'Open sidebar' : 'Close sidebar'}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
        aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
      >
        {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
      </button>

      {/* Right: queue + upgrade */}
      <div className="flex items-center gap-3">
        <RenderQueueButton />
        <UpgradeButton />
      </div>
    </header>
  )
}
