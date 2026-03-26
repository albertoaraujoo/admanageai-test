import { Suspense } from 'react'
import Link from 'next/link'
import { AdGrid } from '@/components/ads/ad-grid'
import { Skeleton } from '@/components/ui/skeleton'
import { MOCK_ADS } from '@/lib/mock-ads'
import { ImageIcon, Flame, ArrowRight, Plus, Wand2, LayoutGrid } from 'lucide-react'

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

const QUICK_TOOLS = [
  {
    label: 'Image Ads',
    icon: ImageIcon,
    badge: '🔥',
    href: '#image-ads',
    description: 'Browse & recreate',
  },
  {
    label: 'Ad Clone',
    icon: LayoutGrid,
    badge: null,
    href: '#',
    description: 'Clone winning ads',
  },
  {
    label: 'New Product',
    icon: Plus,
    badge: null,
    href: '/products',
    description: 'Add your product',
  },
  {
    label: 'Generate',
    icon: Wand2,
    badge: null,
    href: '#image-ads',
    description: 'AI image creation',
  },
]

export default function DashboardHomePage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="group relative col-span-1 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-purple-900/20 to-surface-raised sm:col-span-2">
          <div className="relative z-10 flex h-full min-h-[180px] flex-col justify-between p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Image Ads
              </p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-foreground">
                AI IMAGE ADS →
              </h2>
              <p className="mt-1 text-sm text-foreground-muted">
                Turn your product into high-converting image ads
              </p>
            </div>
            <Link
              href="#image-ads"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover"
            >
              Browse Templates
              <ArrowRight size={13} />
            </Link>
          </div>
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-4 right-16 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface-overlay p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
              My Projects
            </p>
            <div>
              <p className="text-lg font-bold text-foreground">PROJECTS →</p>
              <p className="text-xs text-foreground-muted">View your generated ads</p>
            </div>
            <Link
              href="/projects"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              Open Projects <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface-overlay p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
              Setup
            </p>
            <div>
              <p className="text-lg font-bold text-foreground">PRODUCTS →</p>
              <p className="text-xs text-foreground-muted">Add your product info</p>
            </div>
            <Link
              href="/products"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              Add Product <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {QUICK_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.label}
              href={tool.href}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface-overlay p-4 transition-all hover:border-border-strong hover:bg-surface-hover"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={15} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium text-foreground">{tool.label}</p>
                  {tool.badge && <span className="text-sm">{tool.badge}</span>}
                </div>
                <p className="truncate text-[11px] text-foreground-muted">{tool.description}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <section id="image-ads" className="flex flex-col gap-4 scroll-mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold uppercase tracking-wide text-foreground">
              Image Ads
            </h2>
            <span className="flex items-center gap-1 rounded-md bg-primary-muted px-1.5 py-0.5 text-[10px] font-bold text-primary">
              <Flame size={10} />
              AI
            </span>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground">
            See all
            <ArrowRight size={11} />
          </button>
        </div>
        <p className="text-sm text-foreground-muted">
          Browse high-impact image ads designed to stop the scroll.
        </p>

        <Suspense fallback={<AdGridSkeleton />}>
          <AdGrid ads={MOCK_ADS} />
        </Suspense>
      </section>
    </div>
  )
}
