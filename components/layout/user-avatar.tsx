'use client'

import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useAppStore } from '@/lib/store'
import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

export function UserAvatar() {
  const { data: session, status } = useSession()
  const clearWorkspace = useAppStore((s) => s.clearWorkspace)
  const [open, setOpen] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const name = session?.user?.name ?? ''
  const imageUrl = session?.user?.image
  const showPhoto = Boolean(imageUrl && !imageFailed)

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  async function handleLogout() {
    setOpen(false)
    clearWorkspace()
    await signOut({ callbackUrl: '/login' })
  }

  if (status === 'loading') {
    return (
      <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-surface-overlay" />
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="User menu"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-purple-400 text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
      >
        {showPhoto && imageUrl ? (
          <Image
            src={imageUrl}
            alt={name ? `${name} profile` : 'Profile'}
            fill
            sizes="32px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 min-w-48 overflow-hidden rounded-xl border border-border bg-surface-raised shadow-xl">
            <div className="border-b border-border px-4 py-3">
              <p className="text-xs font-semibold text-foreground">{name || 'User'}</p>
              <p className="text-xs text-foreground-muted">{session?.user?.email ?? ''}</p>
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
