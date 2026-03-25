import { CreditsDisplay } from './credits-display'
import { UpgradeButton } from './upgrade-button'
import { UserAvatar } from './user-avatar'
import { Settings } from 'lucide-react'

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-end gap-3 border-b border-border bg-surface-raised px-6">
      <CreditsDisplay />
      <UpgradeButton />
      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
        aria-label="Settings"
      >
        <Settings size={15} />
      </button>
      <UserAvatar />
    </header>
  )
}
