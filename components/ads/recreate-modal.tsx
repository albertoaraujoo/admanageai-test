'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, RefreshCw, ChevronLeft, ChevronRight, Package, ImageIcon } from 'lucide-react'
import type { Ad } from '@/types/ad'
import type { Product } from '@/types/product'
import { useAppStore } from '@/lib/store'
import { nanobanana } from '@/lib/nanobanana'
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
  const { products, spendCredit, isPro, addProject } = useAppStore()
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    products[0]?.id ?? null
  )
  const [isPending, startTransition] = useTransition()
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [step, setStep] = useState<'select' | 'generating' | 'done'>('select')
  const [adPreviewIndex, setAdPreviewIndex] = useState(0)
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
      toast.error('Selecione um produto antes de gerar.')
      return
    }

    const credited = spendCredit()
    if (!credited) {
      toast.error('Sem créditos disponíveis. Faça upgrade para continuar.')
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
        const taskId = await nanobanana.generateImage({ prompt })
        const imageUrl = await nanobanana.waitForCompletion(taskId)

        const { updateProject } = useAppStore.getState()
        updateProject(projectId, {
          imageUrl,
          thumbnailUrl: imageUrl,
          status: 'completed',
        })

        setGeneratedImageUrl(imageUrl)
        setStep('done')
        toast.success('Imagem gerada com sucesso!')
      } catch (err) {
        const { updateProject } = useAppStore.getState()
        updateProject(projectId, { status: 'failed' })
        setStep('select')
        toast.error(err instanceof Error ? err.message : 'Falha na geração.')
      }
    })
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      aria-label="Recreate Ad"
    >
      <div className="relative flex w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-2xl">
        {/* Left — Ad Preview */}
        <div className="relative flex w-[45%] shrink-0 flex-col bg-black">
          <div className="relative flex-1 overflow-hidden">
            <Image
              src={ad.thumbnail}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="500px"
            />
            {/* Navigation arrows */}
            <button
              onClick={() => setAdPreviewIndex((i) => Math.max(0, i - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
              aria-label="Anúncio anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setAdPreviewIndex((i) => i + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
              aria-label="Próximo anúncio"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="border-t border-white/10 p-4">
            <p className="text-xs font-medium text-white">{ad.title}</p>
            <p className="mt-0.5 text-[11px] text-white/50">{ad.category}</p>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted">
                Adicionar informações do produto
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Fechar modal"
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
              <Button
                onClick={handleGenerate}
                disabled={!selectedProduct || isPending}
                size="lg"
                className="w-full"
              >
                <RefreshCw size={15} className={isPending ? 'animate-spin' : ''} />
                Gerar Imagem
                <span className="ml-auto flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-xs">
                  🔥 10
                </span>
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
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-overlay">
          <Package size={22} className="text-foreground-muted" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Nenhum produto cadastrado</p>
          <p className="mt-1 text-xs text-foreground-muted">
            Vá em Produtos e cadastre seu primeiro produto para continuar.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-foreground-muted">Selecione o produto a ser promovido</p>
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
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-hover">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon size={18} className="text-foreground-subtle" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
              <p className="mt-0.5 truncate text-xs text-foreground-muted">{product.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function GeneratingState() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <p className="text-sm text-foreground-muted">Gerando sua imagem...</p>
      </div>
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
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
          alt="Imagem gerada"
          width={600}
          height={600}
          className="w-full object-cover"
        />
        {!isPro && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <p
                key={i}
                className="rotate-[-30deg] text-2xl font-bold text-white/25 select-none"
              >
                AdManage.ai &nbsp; AdManage.ai &nbsp; AdManage.ai
              </p>
            ))}
          </div>
        )}
      </div>
      <Button onClick={onClose} variant="secondary" size="md" className="w-full">
        Ver em Projetos
      </Button>
    </div>
  )
}
