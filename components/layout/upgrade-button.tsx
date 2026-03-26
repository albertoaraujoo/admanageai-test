'use client'

import { useAppStore } from '@/lib/store'
import { Sparkles, Zap, Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useCredits } from '@/components/credits/credits-context'

export function UpgradeButton() {
  const { isPro, upgradeToPro } = useAppStore()
  const { balance, loading } = useCredits()

  if (isPro) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400">
        <Sparkles size={12} />
        Pro
      </div>
    )
  }

  const handleUpgrade = () => {
    upgradeToPro()
    toast.success('Upgraded to Pro! Watermark removed from all your projects.')
  }

  const showLoader = loading && balance === null

  return (
    <button
      onClick={handleUpgrade}
      className="group flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/15 py-1.5 pl-3 pr-2 text-xs font-semibold text-primary transition-all hover:border-primary/60 hover:bg-primary/25 active:scale-95"
    >
      <Sparkles size={12} />
      Upgrade
      <span className="flex items-center gap-1 rounded-md bg-amber-500/20 px-1.5 py-0.5 text-amber-400">
        {showLoader ? (
          <Loader2 size={10} className="animate-spin" />
        ) : (
          <Zap size={10} className="fill-amber-400" />
        )}
        {balance ?? '—'}
      </span>
    </button>
  )
}
