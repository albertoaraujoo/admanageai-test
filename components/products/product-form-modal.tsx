'use client'

import { ArrowLeft, X } from 'lucide-react'
import { ProductForm } from './product-form'
import type { BrandData } from './brand-fetch-modal'
import type { Product } from '@/types/product'

interface ProductFormModalProps {
  prefill?: BrandData | null
  editProduct?: Product | null
  onBack?: () => void
  onClose: () => void
  onSuccess: () => void
}

export function ProductFormModal({
  prefill,
  editProduct,
  onBack,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  const title = editProduct ? 'Edit product' : 'Setup your product'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Back"
            >
              <ArrowLeft size={15} />
            </button>
          )}
          <h2 className="flex-1 text-sm font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <ProductForm
            initialPrefill={prefill}
            editProduct={editProduct}
            onSuccess={onSuccess}
            hideImportButton
          />
        </div>
      </div>
    </div>
  )
}
