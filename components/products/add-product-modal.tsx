'use client'

import { X, Globe, Edit3, ShoppingBag, Upload, ChevronRight } from 'lucide-react'

interface AddProductModalProps {
  onClose: () => void
  onSelectUrl: () => void
  onSelectManual: () => void
}

export function AddProductModal({ onClose, onSelectUrl, onSelectManual }: AddProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-base font-semibold text-foreground">
            How do you want to add product?
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2 px-6 pb-6">
          {/* Import from URL */}
          <button
            onClick={onSelectUrl}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface-overlay px-4 py-4 text-left transition-all hover:border-border-strong hover:bg-surface-hover"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Globe size={18} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Import from URL</p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                Paste a product page link and we&apos;ll pull the details for you
              </p>
            </div>
            <ChevronRight size={16} className="shrink-0 text-foreground-muted" />
          </button>

          {/* Enter Manually */}
          <button
            onClick={onSelectManual}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface-overlay px-4 py-4 text-left transition-all hover:border-border-strong hover:bg-surface-hover"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
              <Edit3 size={18} className="text-foreground-muted" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Enter Manually</p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                Manually enter all the product details
              </p>
            </div>
            <ChevronRight size={16} className="shrink-0 text-foreground-muted" />
          </button>

          {/* Sync from Shopify - Coming Soon */}
          <div className="flex cursor-not-allowed items-center gap-4 rounded-xl border border-border bg-surface-overlay/50 px-4 py-4 opacity-60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
              <ShoppingBag size={18} className="text-foreground-muted" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Sync from Shopify</p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                Automatically import and update all your products from Shopify
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-surface-overlay px-2.5 py-0.5 text-[10px] font-medium text-foreground-muted">
              Coming soon
            </span>
          </div>

          {/* Bulk Upload - Coming Soon */}
          <div className="flex cursor-not-allowed items-center gap-4 rounded-xl border border-border bg-surface-overlay/50 px-4 py-4 opacity-60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
              <Upload size={18} className="text-foreground-muted" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Bulk Upload</p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                Download a template, fill in your product details, and upload it to add multiple
                products at once.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-surface-overlay px-2.5 py-0.5 text-[10px] font-medium text-foreground-muted">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
