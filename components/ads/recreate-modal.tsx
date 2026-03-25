'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, RefreshCw, Package, ImageIcon, Wand2, ArrowRight } from 'lucide-react'
import type { Ad } from '@/types/ad'
import type { Product } from '@/types/product'
import { useAppStore } from '@/lib/store'
import { requestCreditsRefresh, useCredits } from '@/components/credits/credits-context'
import { startGenerationAndPoll } from '@/lib/generation-flow'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface RecreateModalProps {
  ad: Ad
  onClose: () => void
}

function buildPrompt(ad: Ad, product: Product): string {
  return [
    `Create a high-impact static image advertisement for "${product.name}".`,
    product.description ? `Product description: ${product.description}.` : '',
    product.sellingPoints.filter(Boolean).length > 0
      ? `Key selling points: ${product.sellingPoints.filter(Boolean).join(', ')}.`
      : '',
    `Visual style inspired by: "${ad.title}". Category: ${ad.category}.`,
    'Make it professional, eye-catching, and conversion-focused.',
  ]
    .filter(Boolean)
    .join(' ')
}

export function RecreateModal({ ad, onClose }: RecreateModalProps) {
  const { products, isPro, addProject } = useAppStore()
  const { balance: apiCredits } = useCredits()
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    products[0]?.id ?? null
  )
  const [isPending, startTransition] = useTransition()
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [step, setStep] = useState<'select' | 'generating' | 'done'>('select')
  const overlayRef = useRef<HTMLDivElement>(null)

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleGenerate = () => {
    if (!selectedProduct) {
      toast.error('Please select a product before generating.')
      return
    }

    if (apiCredits !== null && apiCredits <= 0) {
      toast.error('No API credits left. Add credits in your NanoBanana account.')
      return
    }

    const projectId = `proj-${Date.now()}`
    const prompt = buildPrompt(ad, selectedProduct)

    addProject({
      id: projectId,
      title: `${ad.title} × ${selectedProduct.name}`,
      imageUrl: '',
      thumbnailUrl: '',
      status: 'generating',
      sourceAdId: ad.id,
      productId: selectedProduct.id,
      hasWatermark: !isPro,
      createdAt: new Date().toISOString(),
      type: 'image',
    })

    setStep('generating')

    startTransition(async () => {
      try {
        const imageUrl = await startGenerationAndPoll(prompt)

        const { updateProject } = useAppStore.getState()
        updateProject(projectId, {
          imageUrl,
          thumbnailUrl: imageUrl,
          status: 'completed',
        })

        setGeneratedImageUrl(imageUrl)
        setStep('done')
        toast.success('Image generated successfully!')
        requestCreditsRefresh()
      } catch (err) {
        const { updateProject } = useAppStore.getState()
        updateProject(projectId, { status: 'failed' })
        setStep('select')
        toast.error(err instanceof Error ? err.message : 'Generation failed. Please try again.')
        requestCreditsRefresh()
      }
    })
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      aria-label="Recreate Ad"
    >
      <div className="relative flex w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-2xl">
        {/* Left — Ad Preview */}
        <div className="relative flex w-[42%] shrink-0 flex-col bg-black">
          <div className="relative min-h-[320px] flex-1 overflow-hidden">
            <Image
              src={ad.thumbnail}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="500px"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold text-white/90">{ad.title}</p>
            <p className="mt-0.5 text-[11px] text-white/50">{ad.category}</p>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
              Add Your Product Info
            </h2>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Close modal"
            >
              <X size={15} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === 'done' && generatedImageUrl ? (
              <DoneState imageUrl={generatedImageUrl} isPro={isPro} onClose={onClose} />
            ) : step === 'generating' ? (
              <GeneratingState />
            ) : (
              <SelectProductStep
                products={products}
                selectedProductId={selectedProductId}
                onSelect={setSelectedProductId}
              />
            )}
          </div>

          {/* Footer CTA */}
          {step === 'select' && (
            <div className="border-t border-border p-5">
              {/* Credits warning */}
              {apiCredits !== null && apiCredits <= 5 && apiCredits > 0 && (
                <p className="mb-3 text-center text-[11px] text-warning">
                  ⚠️ {apiCredits} API credit{apiCredits !== 1 ? 's' : ''} remaining
                </p>
              )}
              <Button
                onClick={handleGenerate}
                disabled={
                  !selectedProduct ||
                  isPending ||
                  (apiCredits !== null && apiCredits <= 0)
                }
                size="lg"
                className="w-full"
              >
                {isPending ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Wand2 size={15} />
                    Generate Image
                    <span className="ml-auto flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold">
                      🔥 1
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SelectProductStep({
  products,
  selectedProductId,
  onSelect,
}: {
  products: Product[]
  selectedProductId: string | null
  onSelect: (id: string) => void
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-overlay">
          <Package size={24} className="text-foreground-muted" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">No products yet</p>
          <p className="mt-1 text-xs text-foreground-muted">
            Go to Products and add your first product to get started.
          </p>
        </div>
        <button
          onClick={() => {
            window.location.href = '/products'
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          Set up a product
          <ArrowRight size={12} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium text-foreground-muted">
        Select the product to promote
      </p>
      <div className="flex flex-col gap-2">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelect(product.id)}
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
              selectedProductId === product.id
                ? 'border-primary bg-primary-muted'
                : 'border-border bg-surface-overlay hover:border-border-strong'
            }`}
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-hover">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon size={16} className="text-foreground-subtle" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
              {product.description && (
                <p className="mt-0.5 truncate text-xs text-foreground-muted">
                  {product.description}
                </p>
              )}
            </div>
            {selectedProductId === product.id && (
              <div className="h-4 w-4 shrink-0 rounded-full border-2 border-primary bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function GeneratingState() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <p className="text-sm font-medium text-foreground">Generating your image…</p>
      </div>
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3.5 w-1/2" />
      <p className="text-center text-xs text-foreground-muted">
        This usually takes 20–60 seconds
      </p>
    </div>
  )
}

function DoneState({
  imageUrl,
  isPro,
  onClose,
}: {
  imageUrl: string
  isPro: boolean
  onClose: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={imageUrl}
          alt="Generated ad image"
          width={600}
          height={600}
          className="w-full object-cover"
        />
        {!isPro && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <p
                key={i}
                className="rotate-[-30deg] select-none text-2xl font-bold text-white/25"
              >
                AdManage.ai &nbsp; AdManage.ai &nbsp; AdManage.ai
              </p>
            ))}
          </div>
        )}
      </div>
      <Button onClick={onClose} variant="secondary" size="md" className="w-full">
        View in Projects
      </Button>
    </div>
  )
}
