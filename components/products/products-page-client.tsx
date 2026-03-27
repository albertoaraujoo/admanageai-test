'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Plus, ImageIcon, ShoppingBag, MoreVertical, Pencil, Trash2, Search, ChevronDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useAppStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import type { Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import { AddProductModal } from './add-product-modal'
import { BrandFetchModal, type BrandData } from './brand-fetch-modal'
import { ProductFormModal } from './product-form-modal'

type ModalState = null | 'entry' | 'url' | 'manual'
type ProductFilter = 'all' | 'beauty' | 'clothing' | 'electronics'
const FILTERS: Array<{ id: ProductFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'electronics', label: 'Electronics' },
]

function mapProductToFilter(category: string): ProductFilter | null {
  const cat = category.toLowerCase()
  if (cat.includes('beauty') || cat.includes('personal care') || cat.includes('health')) return 'beauty'
  if (cat.includes('fashion') || cat.includes('apparel') || cat.includes('clothing')) return 'clothing'
  if (cat.includes('tech') || cat.includes('saas') || cat.includes('electronic')) return 'electronics'
  return null
}

export function ProductsPageClient() {
  const products = useAppStore((s) => s.products)
  const [modal, setModal] = useState<ModalState>(null)
  const [activeFilter, setActiveFilter] = useState<ProductFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [prefillData, setPrefillData] = useState<BrandData | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const filteredProducts = products.filter((product) => {
    const matchesFilter =
      activeFilter === 'all' || mapProductToFilter(product.category) === activeFilter

    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      q.length === 0 ||
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)

    return matchesFilter && matchesSearch
  })

  const handleBrandFetch = (data: BrandData) => {
    setPrefillData(data)
    setModal('manual')
  }

  const handleFormSuccess = () => {
    setPrefillData(null)
    setModal(null)
    setEditProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditProduct(product)
    setModal('manual')
  }

  const handleCloseManual = () => {
    setPrefillData(null)
    setEditProduct(null)
    setModal(null)
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Products</h1>
            <p className="mt-1 text-sm font-normal text-zinc-400">
              Manage the products used in your ad campaigns.
            </p>
          </div>
          <Button size="md" onClick={() => setModal('entry')}>
            <Plus size={14} />
            Add product
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-md">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              className="h-10 w-full rounded-xl border border-border bg-surface-overlay pl-9 pr-3 text-sm text-foreground placeholder:text-foreground-subtle transition-all focus:border-border-strong focus:outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as ProductFilter)}
              className="h-10 appearance-none rounded-xl border border-border bg-surface-overlay pl-3 pr-8 text-sm text-foreground transition-all focus:border-border-strong focus:outline-none"
            >
              {FILTERS.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted"
            />
          </div>
        </div>

        {/* Products grid or empty state */}
        {filteredProducts.length === 0 ? (
          <ProductsEmptyState onAdd={() => setModal('entry')} />
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Entry modal */}
      {modal === 'entry' && (
        <AddProductModal
          onClose={() => setModal(null)}
          onSelectUrl={() => setModal('url')}
          onSelectManual={() => {
            setPrefillData(null)
            setModal('manual')
          }}
        />
      )}

      {/* URL import modal */}
      {modal === 'url' && (
        <BrandFetchModal
          onClose={() => setModal('entry')}
          onFetch={handleBrandFetch}
        />
      )}

      {/* Create / Edit product form modal */}
      {modal === 'manual' && (
        <ProductFormModal
          prefill={prefillData}
          editProduct={editProduct}
          onBack={
            editProduct
              ? undefined
              : prefillData
                ? () => setModal('url')
                : () => setModal('entry')
          }
          onClose={handleCloseManual}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// ProductCard
// ---------------------------------------------------------------------------

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
}

function ProductCard({ product, onEdit }: ProductCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const deleteProduct = useAppStore((s) => s.deleteProduct)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteProduct(product.id)
    toast.success(`"${product.name}" deleted.`)
    setMenuOpen(false)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(product)
    setMenuOpen(false)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface-raised transition-all hover:border-border-strong">
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-surface-hover">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon size={24} className="text-foreground-muted" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="truncate text-xs font-semibold text-foreground">{product.name}</p>
        {product.category && (
          <p className="mt-0.5 truncate text-[11px] text-foreground-muted">{product.category}</p>
        )}
        <p className="mt-1 text-[10px] text-foreground-subtle">
          {new Date(product.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Context menu button — always visible on mobile, on hover on desktop */}
      <div
        ref={menuRef}
        className="absolute right-2 top-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-white/80 opacity-0 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white group-hover:opacity-100"
          aria-label="More options"
        >
          <MoreVertical size={13} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-20 mt-1 min-w-[120px] overflow-hidden rounded-xl border border-border bg-surface-overlay shadow-xl">
            <button
              onClick={handleEdit}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-white/5"
            >
              <Pencil size={13} className="text-foreground-muted" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function ProductsEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface-overlay">
        <ShoppingBag size={34} className="text-foreground-muted" />
      </div>
      <div className="max-w-sm">
        <h3 className="text-base font-semibold text-foreground">No products found.</h3>
        <p className="mt-1.5 text-sm font-normal text-zinc-400">
          Add your first one to start creating.
        </p>
      </div>
      <Button variant="primary" size="md" onClick={onAdd}>
        <Plus size={14} />
        Add product
      </Button>
    </div>
  )
}
