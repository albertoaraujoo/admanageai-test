import { Suspense } from 'react'
import { AdGrid } from '@/components/ads/ad-grid'
import { Skeleton } from '@/components/ui/skeleton'
import { MOCK_ADS } from '@/lib/mock-ads'
import { ExternalLink } from 'lucide-react'

function AdGridSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Image Ads
            </h1>
            <span className="rounded-md bg-primary-muted px-1.5 py-0.5 text-[10px] font-bold text-primary">
              AI
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground-muted">
            Browse high-impact image ads designed to stop the scroll.
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary-hover">
          See all
          <ExternalLink size={12} />
        </button>
      </div>

      {/* Ad grid with suspense */}
      <Suspense fallback={<AdGridSkeleton />}>
        <AdGrid ads={MOCK_ADS} />
      </Suspense>
    </div>
  )
}
