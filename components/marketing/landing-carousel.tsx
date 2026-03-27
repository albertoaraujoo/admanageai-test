'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight, Volume2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

const ease = [0.33, 1, 0.68, 1] as const

const CARDS = [
  {
    src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=480&h=854&fit=crop&q=80',
    alt: 'Creative portrait ad style 1',
  },
  {
    src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=480&h=854&fit=crop&q=80',
    alt: 'Product lifestyle',
  },
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&h=854&fit=crop&q=80',
    alt: 'Fashion creative',
  },
  {
    src: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=480&h=854&fit=crop&q=80',
    alt: 'E-commerce product',
  },
  {
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&h=854&fit=crop&q=80',
    alt: 'Wellness creative',
  },
  {
    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=480&h=854&fit=crop&q=80',
    alt: 'UGC style',
  },
] as const

export function LandingCarousel({ className }: { className?: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  function scrollByDir(dir: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.min(el.clientWidth * 0.7, 320) * dir
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className={twMerge('relative', className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-48 -translate-y-1/2 rounded-[100%] opacity-90 blur-3xl"
        style={{
          background:
            'linear-gradient(90deg, rgba(251, 146, 60, 0.25), rgba(124, 92, 252, 0.35), rgba(244, 114, 182, 0.2))',
        }}
        aria-hidden
      />

      <div
        ref={scrollerRef}
        className="landing-hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-1 pr-16 pt-2 sm:gap-5"
      >
        {CARDS.map((card, index) => (
          <motion.article
            key={card.src}
            className="relative w-[140px] shrink-0 snap-center overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg sm:w-[168px]"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-32px' }}
            transition={{
              duration: reduce ? 0 : 0.45,
              delay: reduce ? 0 : index * 0.06,
              ease,
            }}
          >
            <div className="relative aspect-[9/16] w-full">
              <Image
                src={card.src}
                alt={card.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 140px, 168px"
              />
              <span className="absolute left-2 top-2 rounded bg-primary/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white shadow-sm">
                AI generated
              </span>
              <button
                type="button"
                aria-label="Mute (decorative)"
                className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur-sm"
              >
                <Volume2 size={12} strokeWidth={2} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll carousel right"
        onClick={() => scrollByDir(1)}
        className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-zinc-800 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
      >
        <ChevronRight size={20} strokeWidth={2} />
      </button>
    </div>
  )
}
