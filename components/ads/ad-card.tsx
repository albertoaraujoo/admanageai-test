import Image from 'next/image'
import type { Ad } from '@/types/ad'
import { RecreateButton } from './recreate-button'
import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AdCardProps {
  ad: Ad
}

export function AdCard({ ad }: AdCardProps) {
  return (
    <article
      data-slot="ad-card"
      className="group relative overflow-hidden rounded-xl border border-border bg-surface-raised transition-all hover:border-border-strong"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={ad.thumbnail}
          alt={ad.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Like count badge */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
          <Heart size={10} className="fill-white" />
          {ad.likes}
        </div>

        {/* New badge */}
        {ad.isNew && (
          <div className="absolute right-2 top-2">
            <Badge variant="primary">Novo</Badge>
          </div>
        )}

        {/* Recreate button — shows on hover */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <RecreateButton ad={ad} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5">
        <p className="truncate text-xs font-medium text-foreground">{ad.title}</p>
        <p className="mt-0.5 text-[11px] text-foreground-subtle">{ad.category}</p>
      </div>
    </article>
  )
}
