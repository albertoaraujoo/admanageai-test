'use client'

import { ChevronDown } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function BrandSelector() {
  const user = useAppStore((s) => s.user)

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'A'

  const brandName = user?.name ? `${user.name.split(' ')[0]}'s Brand` : "My Brand"

  return (
    <button className="flex w-full items-center justify-between gap-2 border-b border-border px-4 py-3 text-sm transition-colors hover:bg-white/5">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-400 text-[10px] font-bold text-white">
          {initials}
        </div>
        <span className="truncate text-xs font-medium text-foreground-muted">
          {brandName}
        </span>
      </div>
      <ChevronDown size={13} className="shrink-0 text-foreground-muted" />
    </button>
  )
}
