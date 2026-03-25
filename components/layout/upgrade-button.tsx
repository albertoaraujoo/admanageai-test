'use client'

import { useAppStore } from '@/lib/store'
import { Sparkles } from 'lucide-react'
import { toast } from '@/lib/toast'

export function UpgradeButton() {
  const { isPro, upgradeToPro } = useAppStore()

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
    toast.success('Upgrade para Pro realizado! Marca d\'água removida.')
  }

  return (
    <button
      onClick={handleUpgrade}
      className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/25 hover:border-primary/60 active:scale-95"
    >
      <Sparkles size={12} />
      Upgrade
    </button>
  )
}
