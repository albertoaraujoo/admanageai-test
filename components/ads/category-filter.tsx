'use client'

import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import type { AdCategory } from '@/types/ad'
import { AD_CATEGORIES } from '@/lib/mock-ads'

interface CategoryFilterProps {
  onFilterChange: (category: AdCategory | null) => void
}

export function CategoryFilter({ onFilterChange }: CategoryFilterProps) {
  const [active, setActive] = useState<AdCategory | null>(null)

  const select = (cat: AdCategory | null) => {
    setActive(cat)
    onFilterChange(cat)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select(null)}
        className={twMerge(
          'rounded-md px-3 py-1 text-xs font-medium transition-all',
          active === null
            ? 'bg-primary text-white'
            : 'border border-border text-foreground-muted hover:text-foreground hover:border-border-strong'
        )}
      >
        All
      </button>
      {AD_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => select(cat)}
          className={twMerge(
            'rounded-md px-3 py-1 text-xs font-medium transition-all',
            active === cat
              ? 'bg-primary text-white'
              : 'border border-border text-foreground-muted hover:text-foreground hover:border-border-strong'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
