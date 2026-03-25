'use client'

import { useState } from 'react'
import type { Ad, AdCategory } from '@/types/ad'
import { AdCard } from './ad-card'
import { CategoryFilter } from './category-filter'

interface AdGridProps {
  ads: Ad[]
}

export function AdGrid({ ads }: AdGridProps) {
  const [activeCategory, setActiveCategory] = useState<AdCategory | null>(null)

  const filtered = activeCategory
    ? ads.filter((ad) => ad.category === activeCategory)
    : ads

  return (
    <div className="flex flex-col gap-6">
      <CategoryFilter onFilterChange={setActiveCategory} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-foreground-muted">
          No ads in this category.
        </div>
      )}
    </div>
  )
}
