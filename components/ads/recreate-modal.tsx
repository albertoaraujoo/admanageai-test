'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  X,
  RefreshCw,
  Upload,
  ChevronDown,
  ArrowLeft,
  Flame,
  ImageIcon,
  Package,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import type { Ad } from '@/types/ad'
import type { Product } from '@/types/product'
import { useAppStore } from '@/lib/store'
import { requestCreditsRefresh, useCredits } from '@/components/credits/credits-context'
import { startGenerationAndPoll } from '@/lib/generation-flow'
import { toast } from '@/lib/toast'
import { Skeleton } from '@/components/ui/skeleton'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ASPECT_RATIOS = [
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Portrait (9:16)', value: '9:16' },
  { label: 'Landscape (16:9)', value: '16:9' },
  { label: 'Portrait (4:5)', value: '4:5' },
  { label: 'Landscape (4:3)', value: '4:3' },
  { label: 'Portrait (3:4)', value: '3:4' },
]

const EMPTY_POINTS = ['', '', '', '', '']

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildPrompt(ad: Ad, headline: string, points: string[]): string {
  const validPoints = points.filter(Boolean)
  return [
    headline ? `Product: ${headline}.` : null,
    validPoints.length > 0 ? `Key benefits: ${validPoints.join(', ')}.` : null,
    `Style inspired by: ${ad.title} (${ad.category}).`,
    'Professional product advertisement. High-end commercial scene, studio quality.',
  ]
    .filter(Boolean)
    .join(' ')
}

// ---------------------------------------------------------------------------
// Main modal
// ---------------------------------------------------------------------------

interface RecreateModalProps {
  ad: Ad
  onClose: () => void
}

type Step = 'form' | 'generating' | 'done'

export function RecreateModal({ ad, onClose }: RecreateModalProps) {
  const router = useRouter()
  const { products, isPro, addProject } = useAppStore()
  const { balance: apiCredits, optimisticDecrement } = useCredits()

  // Form state
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [headline, setHeadline] = useState('')
  const [sellingPoints, setSellingPoints] = useState<string[]>(EMPTY_POINTS)
  const [aspectRatio, setAspectRatio] = useState('1:1')

  // UI state
  const [autofillOpen, setAutofillOpen] = useState(false)
  const [step, setStep] = useState<Step>('form')
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Autofill from a saved product
  const handleAutofill = (product: Product) => {
    setHeadline(product.name)
    const pts = [...product.sellingPoints, '', '', '', '', ''].slice(0, 5)
    setSellingPoints(pts)
    if (product.imageUrl) {
      setImagePreview(product.imageUrl)
      setImageUrl(product.imageUrl)
    }
    setAutofillOpen(false)
    toast.success(`Filled from "${product.name}"`)
  }

  // Local file upload (preview only — NanaBanana needs HTTPS URL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string)
      setImageUrl('') // local file can't go to API — clear remote url
    }
    reader.readAsDataURL(file)
  }

  const updatePoint = (i: number, val: string) =>
    setSellingPoints((prev) => prev.map((p, idx) => (idx === i ? val : p)))

  const handleGenerate = () => {
    if (apiCredits !== null && apiCredits <= 0) {
      toast.error('No API credits left. Add credits in your NanoBanana account.')
      return
    }

    const projectId = `proj-${Date.now()}`
    const prompt = buildPrompt(ad, headline, sellingPoints)
    const remoteImageUrl = imageUrl.startsWith('https://') ? imageUrl : undefined

    addProject({
      id: projectId,
      title: `${ad.title}${headline ? ' × ' + headline : ''}`,
      imageUrl: '',
      thumbnailUrl: '',
      status: 'generating',
      sourceAdId: ad.id,
      productId: '',
      hasWatermark: !isPro,
      createdAt: new Date().toISOString(),
      type: 'image',
    })

    setStep('generating')

    startTransition(async () => {
      try {
        const url = await startGenerationAndPoll(prompt, remoteImageUrl, aspectRatio)

        const { updateProject } = useAppStore.getState()
        updateProject(projectId, { imageUrl: url, thumbnailUrl: url, status: 'completed' })

        setGeneratedImageUrl(url)
        setStep('done')
        optimisticDecrement()
        toast.success('Image generated successfully!')
        requestCreditsRefresh()
      } catch (err) {
        const { updateProject } = useAppStore.getState()
        updateProject(projectId, { status: 'failed' })
        setStep('form')
        toast.error(err instanceof Error ? err.message : 'Generation failed. Please try again.')
        requestCreditsRefresh()
      }
    })
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-2xl"
        style={{ maxHeight: '90vh' }}
      >
        {/* ── Left: reference ad ── */}
        <div className="relative hidden w-[46%] shrink-0 sm:flex flex-col bg-black">
          <div className="relative flex-1 overflow-hidden" style={{ minHeight: 360 }}>
            <Image
              src={ad.thumbnail}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="600px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          </div>
          <div className="p-5">
            <p className="text-sm font-semibold text-white/90">{ad.title}</p>
            <p className="mt-0.5 text-[11px] text-white/50">{ad.category}</p>
          </div>
        </div>

        {/* ── Right: form / states ── */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
            {step === 'done' ? (
              <button
                onClick={() => setStep('form')}
                className="flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground"
              >
                <ArrowLeft size={13} /> Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={onClose}
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          {step === 'generating' ? (
            <GeneratingState />
          ) : step === 'done' && generatedImageUrl ? (
            <DoneState
              imageUrl={generatedImageUrl}
              isPro={isPro}
              onViewProjects={() => {
                onClose()
                router.push('/projects')
              }}
            />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
                  Add Your Product Info
                </h2>

                {/* Autofill from Product */}
                <div className="relative">
                  <button
                    onClick={() => setAutofillOpen((o) => !o)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white/5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-white/10"
                  >
                    <Package size={14} className="text-foreground-muted" />
                    Autofill from Product
                    <ChevronDown size={13} className={`ml-auto text-foreground-muted transition-transform ${autofillOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {autofillOpen && (
                    <ProductDropdown
                      products={products}
                      onSelect={handleAutofill}
                      onClose={() => setAutofillOpen(false)}
                    />
                  )}
                </div>

                {/* or divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[11px] text-foreground-subtle">or</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Product Image */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">
                    Product Image <span className="text-destructive">*</span>
                  </label>
                  <label
                    htmlFor="recreate-image-upload"
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-surface-overlay p-5 transition-all hover:border-border-strong hover:bg-surface-hover"
                  >
                    {imagePreview ? (
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                        <Image src={imagePreview} alt="Product preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-hover">
                        <Upload size={18} className="text-foreground-muted" />
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-xs font-medium text-foreground">
                        {imagePreview ? 'Click to change' : 'Drag and drop a image to upload'}
                      </p>
                      <p className="mt-0.5 text-[11px] text-foreground-muted">Max 50MB for uploaded photo</p>
                      <p className="mt-0.5 text-[11px] text-primary underline-offset-2 hover:underline">
                        Choose from Smart Assets
                      </p>
                    </div>
                    <input
                      id="recreate-image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* Top Headline */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">
                    Top Headline <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Premium Juice Cleanse"
                    className="rounded-lg border border-border bg-surface-overlay px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>

                {/* Selling Points */}
                {sellingPoints.map((sp, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground-muted">
                      Selling Point {i + 1}{i < 2 && <span className="text-destructive"> *</span>}
                    </label>
                    <input
                      type="text"
                      value={sp}
                      onChange={(e) => updatePoint(i, e.target.value)}
                      placeholder={`e.g. ${['100% Safe', 'Promotes Wellness', 'Clinically Tested', 'Gluten Free', 'No Side Effects'][i]}`}
                      className="rounded-lg border border-border bg-surface-overlay px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                ))}

                {/* Aspect Ratio */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">
                    Aspect Ratio <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-border bg-surface-overlay px-3 py-2.5 pr-8 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                    >
                      {ASPECT_RATIOS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="shrink-0 border-t border-border p-4">
                {apiCredits !== null && apiCredits <= 5 && apiCredits > 0 && (
                  <p className="mb-2 text-center text-[11px] text-warning">
                    ⚠️ {apiCredits} API credit{apiCredits !== 1 ? 's' : ''} remaining
                  </p>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={isPending || (apiCredits !== null && apiCredits <= 0)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      Generate Image
                      <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                        <Flame size={11} className="fill-orange-400 text-orange-400" />
                        1
                      </span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Product autofill dropdown
// ---------------------------------------------------------------------------

function ProductDropdown({
  products,
  onSelect,
  onClose,
}: {
  products: Product[]
  onSelect: (p: Product) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  if (products.length === 0) {
    return (
      <div
        ref={ref}
        className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-border bg-surface-overlay p-5 shadow-xl"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Package size={22} className="text-foreground-muted" />
          <p className="text-xs text-foreground-muted">No products yet.</p>
          <button
            onClick={() => { window.location.href = '/products' }}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Add a product <ArrowRight size={11} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-border bg-surface-overlay shadow-xl"
    >
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onSelect(product)}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-hover">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="36px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon size={14} className="text-foreground-subtle" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
            {product.category && (
              <p className="truncate text-[11px] text-foreground-muted">{product.category}</p>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Generating state
// ---------------------------------------------------------------------------

function GeneratingState() {
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        const next = prev + Math.max(1, Math.floor((100 - prev) / 12))
        return Math.min(next, 95)
      })
    }, 900)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-8">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <p className="text-sm font-medium text-foreground">Generating your image…</p>
      </div>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-surface-overlay">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-primary" />
          <p className="text-2xl font-semibold text-foreground">{progress}%</p>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3.5 w-1/2" />
      <p className="text-center text-xs text-foreground-muted">This usually takes 20–60 seconds</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Done state
// ---------------------------------------------------------------------------

function DoneState({
  imageUrl,
  isPro,
  onViewProjects,
}: {
  imageUrl: string
  isPro: boolean
  onViewProjects: () => void
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
      <div className="flex items-center gap-2">
        <CheckCircle size={16} className="text-success" />
        <p className="text-sm font-semibold text-foreground">Image generated!</p>
      </div>
      <div className="relative overflow-hidden rounded-xl">
        <Image src={imageUrl} alt="Generated ad image" width={600} height={600} className="w-full object-cover" />
        {!isPro && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <p key={i} className="-rotate-30 select-none text-2xl font-bold text-white/25">
                AdManage.ai &nbsp; AdManage.ai &nbsp; AdManage.ai
              </p>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onViewProjects}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-overlay py-2.5 text-sm font-medium text-foreground transition-all hover:bg-white/5"
      >
        View in Projects
      </button>
    </div>
  )
}
