'use client'

import { Zap, AlertCircle, Loader2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useCredits } from '@/components/credits/credits-context'

export function CreditsDisplay() {
  const { balance, loading, error } = useCredits()

  const credits = balance ?? 0
  const isLow = balance !== null && balance <= 5 && balance > 0
  const isEmpty = balance !== null && balance <= 0

  if (loading && balance === null) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-overlay px-2.5 py-1.5 text-xs font-medium text-foreground-muted">
        <Loader2 size={12} className="animate-spin shrink-0" />
        <span>Credits</span>
      </div>
    )
  }

  if (error && balance === null) {
    return (
      <div
        className="max-w-[140px] truncate rounded-lg border border-warning/30 bg-warning/10 px-2.5 py-1.5 text-[11px] font-medium text-warning"
        title={error}
      >
        Credits unavailable
      </div>
    )
  }

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
      title={
        isEmpty
          ? 'No API credits — add credits in NanoBanana'
          : `${credits} API credits remaining`
      }
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
        <span
          key={balance}
          className={`credit-tick ${isEmpty ? 'text-destructive' : 'text-foreground'}`}
        >
          {credits}
        </span>{' '}
        credits
      </span>
    </div>
  )
}
