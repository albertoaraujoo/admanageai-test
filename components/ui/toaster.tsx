'use client'

import { useEffect, useState } from 'react'
import { toast as toastEmitter, type ToastEvent } from '@/lib/toast'
import { twMerge } from 'tailwind-merge'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const STYLES = {
  success: 'border-success/20 bg-success/10 text-success',
  error: 'border-destructive/20 bg-destructive/10 text-destructive',
  info: 'border-primary/20 bg-primary-muted text-primary',
}

interface ActiveToast extends ToastEvent {
  exiting: boolean
}

export function Toaster() {
  const [toasts, setToasts] = useState<ActiveToast[]>([])

  useEffect(() => {
    return toastEmitter.subscribe((incoming) => {
      const active: ActiveToast = { ...incoming, exiting: false }
      setToasts((prev) => [...prev, active])

      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === incoming.id ? { ...t, exiting: true } : t))
        )
      }, 3500)

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== incoming.id))
      }, 4000)
    })
  }, [])

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.variant]
        return (
          <div
            key={t.id}
            role="alert"
            className={twMerge(
              'flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl text-sm font-medium',
              'transition-all duration-300',
              t.exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0',
              STYLES[t.variant]
            )}
          >
            <Icon size={16} className="shrink-0" />
            <span className="text-foreground">{t.message}</span>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((x) => x.id !== t.id))
              }
              className="ml-auto shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                          aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
