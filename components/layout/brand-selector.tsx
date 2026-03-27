'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, Settings, UserPlus, Plus, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useSidebar } from './sidebar-context'

export function BrandSelector() {
  const { data: session, status } = useSession()
  const { collapsed } = useSidebar()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const name = session?.user?.name ?? ''
  const email = session?.user?.email ?? ''
  const avatar = session?.user?.image ?? ''

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : status === 'loading'
      ? '…'
      : 'A'

  const firstName = name.split(' ')[0] || 'My'
  const brandName = name ? `${firstName}'s Brand Space` : 'My Brand Space'

  // Close dropdown when sidebar collapses
  useEffect(() => {
    if (collapsed) setOpen(false)
  }, [collapsed])

  if (collapsed) {
    return (
      <div className="flex justify-center border-b border-border py-3" title={brandName}>
        <WorkspaceAvatar initials={initials} size="sm" />
      </div>
    )
  }

  return (
    <div ref={ref} className="relative border-b border-border">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm transition-colors hover:bg-white/5"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <WorkspaceAvatar initials={initials} size="sm" />
          <span className="truncate text-xs font-medium text-foreground-muted">{brandName}</span>
        </div>
        <ChevronDown
          size={13}
          className={`shrink-0 text-foreground-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-b-xl border-x border-b border-border bg-surface-raised shadow-2xl shadow-black/40">
          {/* Workspace card */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <WorkspaceAvatar initials={initials} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{brandName}</p>
                <p className="text-[11px] text-foreground-muted">Free Plan · 1 Member</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-overlay px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-white/5">
                <Settings size={12} className="text-foreground-muted" />
                Settings
              </button>
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-overlay px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-white/5">
                <UserPlus size={12} className="text-foreground-muted" />
                Invite
              </button>
            </div>
          </div>

          {/* Create new brand space */}
          <button className="flex w-full items-center gap-2.5 border-t border-border px-4 py-3 text-xs text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-border">
              <Plus size={9} />
            </span>
            Create new brand space
          </button>

          {/* Signed in as */}
          <div className="border-t border-border px-4 py-3">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
              Signed in as
            </p>
            <div className="flex items-center gap-2.5">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={name}
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
              ) : (
                <WorkspaceAvatar initials={initials} size="sm" />
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">{name || 'User'}</p>
                {email && (
                  <p className="truncate text-[11px] text-foreground-muted">{email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-2.5 border-t border-border px-4 py-3 text-sm text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

function WorkspaceAvatar({ initials, size }: { initials: string; size: 'sm' | 'lg' }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-purple-400 font-bold text-white
        ${size === 'lg' ? 'h-10 w-10 text-sm' : 'h-6 w-6 text-[10px]'}`}
    >
      {initials}
    </div>
  )
}
