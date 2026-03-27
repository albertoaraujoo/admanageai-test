import { ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ProjectsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface-overlay">
        <ImageIcon size={34} className="text-foreground-muted" />
      </div>
      <div className="max-w-sm">
        <h3 className="text-base font-semibold text-foreground">No projects found.</h3>
        <p className="mt-1.5 text-sm font-normal text-zinc-400">
          Add your first one to start creating.
        </p>
      </div>
      <Link href="/home">
        <Button variant="primary" size="md">
          Browse Ads
        </Button>
      </Link>
    </div>
  )
}
