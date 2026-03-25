import { CreditsDisplay } from './credits-display'
import { UpgradeButton } from './upgrade-button'
import { Settings } from 'lucide-react'

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-end gap-3 border-b border-border bg-surface-raised px-6">
      <CreditsDisplay />
      <UpgradeButton />
      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
        aria-label="Configurações"
      >
        <Settings size={15} />
      </button>
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-400 text-xs font-semibold text-white">
        U
      </div>
    </header>
  )
}
