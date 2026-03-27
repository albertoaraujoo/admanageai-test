'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

const MotionLink = motion(Link)

const rootVariants = {
  rest: {},
  hover: {},
} as const

const fillVariants = {
  rest: { x: '-100%' },
  hover: { x: '0%' },
} as const

export interface LandingCtaButtonProps {
  href: string
  label: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: {
    root: 'min-h-9 rounded-md',
    icon: 'w-9 min-w-9',
    label: 'px-3 py-2 text-[10px] sm:text-[11px]',
  },
  md: {
    root: 'min-h-10 rounded-lg',
    icon: 'w-10 min-w-10',
    label: 'px-4 py-2.5 text-[11px]',
  },
  lg: {
    root: 'min-h-12 rounded-lg sm:min-h-14',
    icon: 'w-12 min-w-12 sm:w-14 sm:min-w-14',
    label: 'px-4 py-3 text-[11px] sm:px-6 sm:py-3.5 sm:text-xs',
  },
} as const

export function LandingCtaButton({ href, label, className, size = 'md' }: LandingCtaButtonProps) {
  const prefersReducedMotion = useReducedMotion()
  const s = sizeClasses[size]

  const slideTransition = {
    duration: prefersReducedMotion ? 0 : 0.5,
    ease: [0.33, 1, 0.68, 1] as const,
  }

  return (
    <MotionLink
      href={href}
      data-slot="landing-cta"
      className={twMerge(
        'relative inline-flex max-w-full overflow-hidden border border-white/90 shadow-lg outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060a]',
        s.root,
        className
      )}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
      variants={rootVariants}
    >
      <span className="absolute inset-0 z-0 bg-black" aria-hidden />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-primary"
        variants={fillVariants}
        transition={slideTransition}
      />
      <span
        className={twMerge(
          'relative z-10 flex items-center justify-center border-r border-white/25 bg-primary',
          s.icon
        )}
      >
        <ChevronRight className="size-4 text-white" strokeWidth={2.75} aria-hidden />
      </span>
      <span
        className={twMerge(
          'relative z-10 flex min-w-0 flex-1 items-center justify-center px-2 font-mono font-semibold uppercase tracking-wide text-white',
          s.label
        )}
      >
        {label}
      </span>
    </MotionLink>
  )
}
