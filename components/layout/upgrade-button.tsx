'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { useCredits } from '@/components/credits/credits-context'

export function UpgradeButton() {
  const { isPro, upgradeToPro, downgradeToPro } = useAppStore()
  const { balance, loading } = useCredits()

  const showLoader = loading && balance === null

  if (isPro) {
    return (
      <button
        onClick={() => {
          downgradeToPro()
          toast.success('Switched back to Free plan.')
        }}
        className="group flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/15 py-1.5 pl-3 pr-1.5 text-xs font-semibold text-amber-400 transition-all hover:border-amber-500/60 hover:bg-amber-500/25 active:scale-95"
        title="Click to switch back to Free plan"
      >
        <Sparkles size={12} />
        Pro
        <span className="flex min-w-[22px] items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
          {showLoader ? (
            <Loader2 size={10} className="animate-spin" />
          ) : (
            <span key={balance} className="credit-tick">
              {balance ?? '—'}
            </span>
          )}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={() => {
        upgradeToPro()
        toast.success('Upgraded to Pro! Watermark removed from all your projects.')
      }}
      className="group flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/15 py-1.5 pl-3 pr-1.5 text-xs font-semibold text-primary transition-all hover:border-primary/60 hover:bg-primary/25 active:scale-95"
    >
      <Sparkles size={12} />
      Upgrade
      <span className="flex min-w-[22px] items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
        {showLoader ? (
          <Loader2 size={10} className="animate-spin" />
        ) : (
          <span key={balance} className="credit-tick">
            {balance ?? '—'}
          </span>
        )}
      </span>
    </button>
  )
}
