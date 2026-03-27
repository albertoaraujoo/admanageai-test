'use client'

import { useActionState, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import { ImageIcon, Plus, Minus, Globe, Loader2, CheckCircle, ChevronDown } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { BrandFetchModal, type BrandData } from './brand-fetch-modal'
import type { Product } from '@/types/product'

const CATEGORIES = [
  'E-commerce',
  'Beauty & Personal Care',
  'SaaS / Technology',
  'Fashion & Apparel',
  'Food & Beverage',
  'Health & Wellness',
  'Home & Living',
  'Sports & Outdoors',
  'Other',
]

type FormState = {
  error?: string
  success?: boolean
}

interface ProductFormProps {
  /** Pre-fill data coming from an external modal flow (URL fetch). */
  initialPrefill?: BrandData | null
  /** When provided, the form is in edit mode — updates the existing product instead of creating. */
  editProduct?: Product | null
  /** Called after the product is saved — use to close a parent modal. */
  onSuccess?: () => void
  /** When true, hides the "Import from URL" banner (already part of a modal flow). */
  hideImportButton?: boolean
}

function SubmitButton({ label }: { label: string }) {
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
          {label}
        </>
      )}
    </Button>
  )
}

export function ProductForm({
  initialPrefill,
  editProduct,
  onSuccess,
  hideImportButton = false,
}: ProductFormProps) {
  const { addProduct, updateProduct } = useAppStore()

  const isEditMode = Boolean(editProduct)

  // editProduct takes precedence over initialPrefill for initial field values
  const initial: BrandData | null = editProduct
    ? {
        name: editProduct.name,
        description: editProduct.description,
        sellingPoints:
          editProduct.sellingPoints.length > 0 ? editProduct.sellingPoints : ['', '', ''],
        category: editProduct.category,
        imageUrl: editProduct.imageUrl,
      }
    : (initialPrefill ?? null)

  const [imagePreview, setImagePreview] = useState<string>(initial?.imageUrl ?? '')
  const [sellingPoints, setSellingPoints] = useState<string[]>(
    initial?.sellingPoints?.length ? initial.sellingPoints : ['', '', '']
  )
  const [brandFetchOpen, setBrandFetchOpen] = useState(false)
  const [prefilled, setPrefilled] = useState<BrandData | null>(initial)
  const [, startImageTransition] = useTransition()

  const submitProduct = async (_prev: FormState, formData: FormData): Promise<FormState> => {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    if (!name?.trim()) return { error: 'Product name is required.' }

    if (isEditMode && editProduct) {
      updateProduct(editProduct.id, {
        name: name.trim(),
        description: description?.trim() ?? '',
        imageUrl: imagePreview,
        sellingPoints: sellingPoints.filter((sp) => sp.trim() !== ''),
        category: category?.trim() ?? '',
      })
      toast.success(`Product "${name.trim()}" updated successfully!`)
    } else {
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
    }

    onSuccess?.()
    return { success: true }
  }

  const [state, action] = useActionState<FormState, FormData>(submitProduct, {})

  const handleBrandFetch = (data: BrandData) => {
    setPrefilled(data)
    setSellingPoints(data.sellingPoints)
    if (data.imageUrl) setImagePreview(data.imageUrl)
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

  const updateSellingPoint = (index: number, value: string) =>
    setSellingPoints((prev) => prev.map((sp, i) => (i === index ? value : sp)))

  const addSellingPoint = () => setSellingPoints((prev) => [...prev, ''])
  const removeSellingPoint = (index: number) =>
    setSellingPoints((prev) => prev.filter((_, i) => i !== index))

  if (state.success && !onSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-success/20 bg-success/5 py-12 text-center">
        <CheckCircle size={32} className="text-success" />
        <div>
          <p className="text-base font-semibold text-foreground">
            {isEditMode ? 'Product updated!' : 'Product created!'}
          </p>
          <p className="mt-1 text-sm text-foreground-muted">You can now use it to generate ads.</p>
        </div>
        <Button variant="secondary" size="md" onClick={() => window.location.reload()}>
          {isEditMode ? 'Back to products' : 'Create another product'}
        </Button>
      </div>
    )
  }

  return (
    <>
      <form action={action} className="flex flex-col gap-5">
        {/* Brand autofill — only shown when not already inside modal import flow and not editing */}
        {!hideImportButton && !isEditMode && (
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
        )}

        {/* Basic Info heading */}
        <div>
          <h3 className="text-sm font-semibold text-foreground">Basic Info</h3>
          <p className="mt-0.5 text-xs text-foreground-muted">
            Core details that help us describe and highlight your product.
          </p>
        </div>

        {/* Product name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium text-foreground-muted">
            Product name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={prefilled?.name ?? ''}
            key={`name-${prefilled?.name ?? 'empty'}`}
            placeholder="e.g. Men's Quarter-Zip Hoodie"
            className="rounded-lg border border-border bg-surface-overlay px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-xs font-medium text-foreground-muted">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              defaultValue={prefilled?.category ?? ''}
              key={`cat-${prefilled?.category ?? 'empty'}`}
              className="w-full appearance-none rounded-lg border border-border bg-surface-overlay px-3 py-2.5 pr-8 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            >
              <option value="" disabled>
                Select a product category…
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-xs font-medium text-foreground-muted">
            Product description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={prefilled?.description ?? ''}
            key={`desc-${prefilled?.description ?? 'empty'}`}
            placeholder="e.g. Street-ready hoodie made from soft cotton blend."
            maxLength={5000}
            className="resize-none rounded-lg border border-border bg-surface-overlay px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Selling points */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground-muted">
              Selling points (USPs)
            </label>
            <button
              type="button"
              onClick={addSellingPoint}
              className="flex items-center gap-1 text-[11px] text-primary transition-colors hover:text-primary/80"
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
                  placeholder={`e.g. Soft cotton blend, Sporty street style…`}
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

        {/* Assets / Product Image */}
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-xs font-semibold text-foreground">Assets</p>
            <p className="mt-0.5 text-[11px] text-foreground-muted">
              Upload and manage all visuals related to your product.
            </p>
          </div>
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
                <Plus size={22} className="text-foreground-muted" />
              </div>
            )}
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">
                {imagePreview ? 'Click to change' : 'Drag & drop or click to upload'}
              </p>
              <p className="mt-0.5 text-[11px] text-foreground-muted">
                Max 50MB — PNG, JPG, WEBP
              </p>
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
          <SubmitButton label={isEditMode ? 'Save changes' : 'Create Product'} />
        </div>
      </form>

      {brandFetchOpen && (
        <BrandFetchModal
          onClose={() => setBrandFetchOpen(false)}
          onFetch={handleBrandFetch}
        />
      )}
    </>
  )
}
