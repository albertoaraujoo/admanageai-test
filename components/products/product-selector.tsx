'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, Plus, ImageIcon } from 'lucide-react'
import type { Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import { twMerge } from 'tailwind-merge'

interface ProductSelectorProps {
  products: Product[]
  selectedId: string | null
  onSelect: (id: string) => void
  onNew?: () => void
  onCancel?: () => void
  onConfirm?: (product: Product) => void
}

export function ProductSelector({
  products,
  selectedId,
  onSelect,
  onNew,
  onCancel,
  onConfirm,
}: ProductSelectorProps) {
  const [query, setQuery] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  const selectedProduct = products.find((p) => p.id === selectedId)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Selecionar Produto</h3>
        {onNew && (
          <Button variant="primary" size="sm" onClick={onNew}>
            <Plus size={13} />
            Novo produto
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle"
        />
        <input
          type="text"
          placeholder="Buscar produto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface-overlay py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
        />
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelect(product.id)}
              className={twMerge(
                'flex flex-col overflow-hidden rounded-xl border transition-all text-left',
                selectedId === product.id
                  ? 'border-primary bg-primary-muted'
                  : 'border-border bg-surface-overlay hover:border-border-strong'
              )}
            >
              <div className="relative aspect-square overflow-hidden bg-surface-hover">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon size={20} className="text-foreground-subtle" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-foreground">
                  {product.name}
                </p>
                <p className="mt-0.5 text-[10px] text-foreground-muted">
                  {product.assetCount} assets
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-foreground-muted">
          {products.length === 0
            ? 'Nenhum produto cadastrado ainda.'
            : 'Nenhum resultado para a busca.'}
        </div>
      )}

      {/* Footer actions */}
      {(onCancel || onConfirm) && (
        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          {onCancel && (
            <Button variant="secondary" size="md" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          {onConfirm && (
            <Button
              size="md"
              disabled={!selectedProduct}
              onClick={() => selectedProduct && onConfirm(selectedProduct)}
            >
              Usar este produto
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
