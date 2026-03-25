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
        <h3 className="text-base font-semibold text-foreground">
          Nenhum projeto ainda
        </h3>
        <p className="mt-1.5 text-sm text-foreground-muted">
          Explore os anúncios na Home, clique em &quot;Recreate&quot; e gere sua primeira imagem com IA.
        </p>
      </div>
      <Link href="/">
        <Button variant="primary" size="md">
          Explorar Anúncios
        </Button>
      </Link>
    </div>
  )
}
