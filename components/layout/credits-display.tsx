'use client'

import { useAppStore } from '@/lib/store'
import { Zap, AlertCircle } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export function CreditsDisplay() {
  const credits = useAppStore((s) => s.credits)
  const isLow = credits <= 5
  const isEmpty = credits === 0

  return (
    <div
      className={twMerge(
        'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all',
        isEmpty
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : isLow
            ? 'border-warning/30 bg-warning/10 text-warning'
            : 'border-border bg-surface-overlay text-foreground-muted'
      )}
      title={isEmpty ? 'No credits available' : `${credits} credits remaining`}
    >
      {isEmpty ? (
        <AlertCircle size={12} className="shrink-0" />
      ) : (
        <Zap
          size={12}
          className={twMerge(
            'shrink-0',
            isLow ? 'fill-warning text-warning' : 'fill-amber-400 text-amber-400'
          )}
        />
      )}
      <span>
        <span className={isEmpty ? 'text-destructive' : 'text-foreground'}>{credits}</span>{' '}
        credits
      </span>
    </div>
  )
}
