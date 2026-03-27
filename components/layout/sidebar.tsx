'use client'

import { twMerge } from 'tailwind-merge'
import { SidebarNav } from './sidebar-nav'
import { BrandSelector } from './brand-selector'
import { useSidebar } from './sidebar-context'

export function Sidebar() {
  const { collapsed } = useSidebar()

  return (
    <aside
      className={twMerge(
        'flex h-full shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 overflow-hidden',
        collapsed ? 'w-[52px]' : 'w-(--sidebar-width)'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-border px-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/30">
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
        {!collapsed && (
          <span className="ml-2.5 whitespace-nowrap text-sm font-semibold tracking-tight">
            AdManage<span className="text-primary">.ai</span>
          </span>
        )}
      </div>

      {/* Brand selector */}
      <BrandSelector />

      {/* Nav */}
      <SidebarNav />
    </aside>
  )
}
