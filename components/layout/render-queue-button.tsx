'use client'

import { useState, useRef, useEffect } from 'react'
import { SlidersHorizontal, X, FolderOpen } from 'lucide-react'

export function RenderQueueButton() {
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors
          ${open ? 'bg-white/10 text-foreground' : 'text-foreground-muted hover:bg-white/5 hover:text-foreground'}`}
        aria-label="Render queue"
      >
        <SlidersHorizontal size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 flex w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Render queue</h3>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="flex min-h-[220px] flex-col items-center justify-center px-6 py-10">
            <p className="text-sm text-foreground-muted">No active running jobs</p>
          </div>

          {/* Footer */}
          <div className="border-t border-border">
            <button className="flex w-full items-center gap-2.5 px-5 py-3.5 text-sm text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground">
              <FolderOpen size={14} />
              Browse all media jobs
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
