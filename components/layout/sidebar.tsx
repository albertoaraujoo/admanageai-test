import { ChevronDown } from 'lucide-react'
import { SidebarNav } from './sidebar-nav'

export function Sidebar() {
  return (
    <aside className="flex h-full w-[var(--sidebar-width)] shrink-0 flex-col border-r border-border bg-surface-raised">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/30">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-tight">
          AdManage<span className="text-primary">.ai</span>
        </span>
      </div>

      {/* Brand selector */}
      <button className="flex items-center justify-between gap-2 border-b border-border px-4 py-3 text-sm text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-purple-400" />
          <span className="truncate text-xs font-medium">Minha Marca</span>
        </div>
        <ChevronDown size={13} />
      </button>

      <SidebarNav />
    </aside>
  )
}
