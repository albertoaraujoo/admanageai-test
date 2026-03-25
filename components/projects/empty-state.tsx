import { ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ProjectsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-overlay">
        <ImageIcon size={28} className="text-foreground-muted" />
      </div>
      <div className="max-w-sm">
        <h3 className="text-base font-semibold text-foreground">No projects yet</h3>
        <p className="mt-1.5 text-sm text-foreground-muted">
          Browse ads on the Home page, click &quot;Recreate&quot; and generate your first
          AI-powered image.
        </p>
      </div>
      <Link href="/">
        <Button variant="primary" size="md">
          Browse Ads
        </Button>
      </Link>
    </div>
  )
}
