'use client'

import { useTransition, useState } from 'react'
import { X, Globe, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BrandFetchModalProps {
  onClose: () => void
  onFetch: (data: BrandData) => void
}

export interface BrandData {
  name: string
  description: string
  sellingPoints: string[]
  category: string
}

const FAKE_BRANDS: Record<string, BrandData> = {
  default: {
    name: 'AdManage.ai',
    description: 'Built by media buyers, for media buyers. Launch Ads 10x Faster.',
    sellingPoints: [
      'Launch 100+ ads in 5 clicks',
      'AI-powered creative generation',
      '1M+ ads launched monthly',
    ],
    category: 'SaaS',
  },
  ecommerce: {
    name: 'Premium Store',
    description: 'Premium products with fast delivery across the country.',
    sellingPoints: [
      'Free shipping on orders over $50',
      '30-day money-back guarantee',
      '24/7 customer support',
    ],
    category: 'Sale',
  },
  beauty: {
    name: 'Beauté Collection',
    description: 'Natural and vegan cosmetics for sensitive skin.',
    sellingPoints: [
      '100% cruelty-free',
      'Dermatologically tested formula',
      'Available in 12 shades',
    ],
    category: 'Beauty & Personal Care',
  },
}

function resolveFakeBrand(url: string): BrandData {
  const lower = url.toLowerCase()
  if (lower.includes('beauty') || lower.includes('cosmet') || lower.includes('skin')) {
    return FAKE_BRANDS.beauty
  }
  if (lower.includes('shop') || lower.includes('store')) {
    return FAKE_BRANDS.ecommerce
  }
  return FAKE_BRANDS.default
}

export function BrandFetchModal({ onClose, onFetch }: BrandFetchModalProps) {
  const [url, setUrl] = useState('')
  const [done, setDone] = useState(false)
  const [fetched, setFetched] = useState<BrandData | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleFetch = () => {
    if (!url.trim()) return

    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 2200))
      const data = resolveFakeBrand(url)
      setFetched(data)
      setDone(true)
    })
  }

  const handleUse = () => {
    if (fetched) {
      onFetch(fetched)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Import from URL</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 p-6">
          {!done ? (
            <>
              <div>
                <label
                  htmlFor="brand-url"
                  className="mb-2 block text-xs font-medium text-foreground-muted"
                >
                  Product or Brand URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="brand-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                    placeholder="https://your-store.com/product"
                    className="flex-1 rounded-lg border border-border bg-surface-overlay px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                    disabled={isPending}
                  />
                </div>
                <p className="mt-2 text-[11px] text-foreground-subtle">
                  Our AI will extract the product name, description and selling points automatically.
                </p>
              </div>

              <Button onClick={handleFetch} disabled={!url.trim() || isPending} size="md" className="w-full">
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Analyzing URL…
                  </>
                ) : (
                  <>
                    <Globe size={14} />
                    Import
                  </>
                )}
              </Button>

              {isPending && (
                <div className="flex flex-col gap-2">
                  {['Accessing the URL…', 'Extracting product info…', 'Organizing data…'].map(
                    (step, i) => (
                      <div key={step} className="flex items-center gap-2 text-xs text-foreground-muted">
                        <Loader2
                          size={11}
                          className="animate-spin text-primary"
                          style={{ animationDelay: `${i * 0.3}s` }}
                        />
                        {step}
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          ) : fetched ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle size={16} />
                <span className="font-medium">Product found!</span>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-overlay p-4">
                <div>
                  <p className="mb-0.5 text-[10px] uppercase tracking-wider text-foreground-subtle">
                    Name
                  </p>
                  <p className="text-sm font-semibold text-foreground">{fetched.name}</p>
                </div>
                <div>
                  <p className="mb-0.5 text-[10px] uppercase tracking-wider text-foreground-subtle">
                    Description
                  </p>
                  <p className="text-sm text-foreground-muted">{fetched.description}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-foreground-subtle">
                    Selling Points
                  </p>
                  <ul className="flex flex-col gap-1">
                    {fetched.sellingPoints.map((sp) => (
                      <li
                        key={sp}
                        className="flex items-start gap-1.5 text-xs text-foreground-muted"
                      >
                        <CheckCircle size={11} className="mt-0.5 shrink-0 text-success" />
                        {sp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setDone(false)}
                  className="flex-1"
                >
                  Try another URL
                </Button>
                <Button size="md" onClick={handleUse} className="flex-1">
                  Use this data
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
