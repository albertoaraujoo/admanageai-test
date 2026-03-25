import { SidebarNav } from './sidebar-nav'
import { BrandSelector } from './brand-selector'

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

      {/* Brand selector — client component reads user from store */}
      <BrandSelector />

      <SidebarNav />
    </aside>
  )
}
