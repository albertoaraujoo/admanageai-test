'use client'

import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export function UserAvatar() {
  const user = useAppStore((s) => s.user)
  const logout = useAppStore((s) => s.logout)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <div className="relative">
      <button
        aria-label="User menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-400 text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
      >
        {initials}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 min-w-48 overflow-hidden rounded-xl border border-border bg-surface-raised shadow-xl">
            <div className="border-b border-border px-4 py-3">
              <p className="text-xs font-semibold text-foreground">{user?.name ?? 'User'}</p>
              <p className="text-xs text-foreground-muted">{user?.email ?? ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-foreground-muted transition-colors hover:bg-white/5 hover:text-destructive"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
