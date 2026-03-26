'use client'

import { useActionState, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import { ImageIcon, Plus, Minus, Globe, Loader2, CheckCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { BrandFetchModal, type BrandData } from './brand-fetch-modal'
import type { Product } from '@/types/product'

type FormState = {
  error?: string
  success?: boolean
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          Saving…
        </>
      ) : (
        <>
          <CheckCircle size={15} />
          Create Product
        </>
      )}
    </Button>
  )
}

export function ProductForm() {
  const { addProduct } = useAppStore()
  const [imagePreview, setImagePreview] = useState<string>('')
  const [sellingPoints, setSellingPoints] = useState<string[]>(['', '', ''])
  const [brandFetchOpen, setBrandFetchOpen] = useState(false)
  const [prefilled, setPrefilled] = useState<BrandData | null>(null)
  const [, startImageTransition] = useTransition()

  const createProduct = async (
    _prev: FormState,
    formData: FormData
  ): Promise<FormState> => {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    if (!name?.trim()) return { error: 'Product name is required.' }

    const product: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      description: description?.trim() ?? '',
      imageUrl: imagePreview,
      sellingPoints: sellingPoints.filter((sp) => sp.trim() !== ''),
      category: category?.trim() ?? '',
      createdAt: new Date().toISOString(),
      assetCount: 0,
    }

    addProduct(product)
    toast.success(`Product "${product.name}" created successfully!`)
    return { success: true }
  }

  const [state, action] = useActionState<FormState, FormData>(createProduct, {})

  const handleBrandFetch = (data: BrandData) => {
    setPrefilled(data)
    setSellingPoints(data.sellingPoints)
    if (data.imageUrl) {
      setImagePreview(data.imageUrl)
    }
    toast.success('Data imported! Review the fields and save your product.')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    startImageTransition(() => {
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    })
  }

  const updateSellingPoint = (index: number, value: string) => {
    setSellingPoints((prev) => prev.map((sp, i) => (i === index ? value : sp)))
  }

  const addSellingPoint = () => setSellingPoints((prev) => [...prev, ''])
  const removeSellingPoint = (index: number) =>
    setSellingPoints((prev) => prev.filter((_, i) => i !== index))

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-success/20 bg-success/5 py-12 text-center">
        <CheckCircle size={32} className="text-success" />
        <div>
          <p className="text-base font-semibold text-foreground">Product created!</p>
          <p className="mt-1 text-sm text-foreground-muted">
            You can now use it to generate ads.
          </p>
        </div>
        <Button variant="secondary" size="md" onClick={() => window.location.reload()}>
          Create another product
        </Button>
      </div>
    )
  }

  return (
    <>
      <form action={action} className="flex flex-col gap-6">
        {/* Brand autofill */}
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-4">
          <p className="text-xs text-foreground-muted">
            Auto-fill from your brand or product URL
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setBrandFetchOpen(true)}
          >
            <Globe size={13} />
            Import from URL
          </Button>
        </div>

        {/* Product name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium text-foreground-muted">
            Product Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={prefilled?.name ?? ''}
            key={prefilled?.name ?? 'name-empty'}
            placeholder="e.g. AdManage.ai — The #1 Ad Launcher"
            className="rounded-lg border border-border bg-surface-overlay px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-xs font-medium text-foreground-muted">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={prefilled?.category ?? ''}
            key={prefilled?.category ?? 'cat-empty'}
            placeholder="e.g. SaaS, E-commerce, Health…"
            className="rounded-lg border border-border bg-surface-overlay px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-xs font-medium text-foreground-muted">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={prefilled?.description ?? ''}
            key={prefilled?.description ?? 'desc-empty'}
            placeholder="Describe your product in up to 400 characters…"
            maxLength={400}
            className="resize-none rounded-lg border border-border bg-surface-overlay px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Selling points */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground-muted">
              Key Selling Points (USPs)
            </label>
            <button
              type="button"
              onClick={addSellingPoint}
              className="flex items-center gap-1 text-[11px] text-primary transition-colors hover:text-primary-hover"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {sellingPoints.map((sp, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-overlay text-[10px] font-bold text-foreground-muted">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={sp}
                  onChange={(e) => updateSellingPoint(i, e.target.value)}
                  placeholder={`Selling point ${i + 1}…`}
                  className="flex-1 rounded-lg border border-border bg-surface-overlay px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                />
                {sellingPoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSellingPoint(i)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remove selling point ${i + 1}`}
                  >
                    <Minus size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product image upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-foreground-muted">Product Image</label>
          <label
            htmlFor="product-image"
            className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface-overlay p-6 transition-all hover:border-border-strong hover:bg-surface-hover"
          >
            {imagePreview ? (
              <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-hover">
                <ImageIcon size={22} className="text-foreground-muted" />
              </div>
            )}
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">
                {imagePreview ? 'Click to change' : 'Drag & drop or click to upload'}
              </p>
              <p className="mt-0.5 text-[11px] text-foreground-muted">Max 50MB — PNG, JPG, WEBP</p>
            </div>
            <input
              id="product-image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Error */}
        {state.error && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="ghost" size="md">
            Discard
          </Button>
          <SubmitButton />
        </div>
      </form>

      {brandFetchOpen && (
        <BrandFetchModal onClose={() => setBrandFetchOpen(false)} onFetch={handleBrandFetch} />
      )}
    </>
  )
}
