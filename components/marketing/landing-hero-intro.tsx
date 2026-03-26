'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { LandingCtaButton } from '@/components/marketing/landing-cta-button'

const ease = [0.33, 1, 0.68, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const

export function LandingHeroIntro() {
  const reduce = useReducedMotion()
  const duration = reduce ? 0 : 0.55
  const stagger = reduce ? 0 : 0.1

  return (
    <motion.section
      className="mx-auto max-w-3xl px-4 pt-12 text-center sm:px-6 sm:pt-16"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: reduce ? 0 : 0.06 },
        },
      }}
    >
      <motion.h1
        variants={fadeUp}
        transition={{ duration, ease }}
        className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl sm:leading-[1.02]"
      >
        AI Ads that Win.
      </motion.h1>
      <motion.p
        variants={fadeUp}
        transition={{ duration, ease }}
        className="mx-auto mt-6 max-w-xl text-pretty text-base font-normal leading-relaxed text-white/85 sm:text-lg"
      >
        Paste a product URL. Get 10 image ads. Test what converts — automatically.
      </motion.p>
      <motion.p
        variants={fadeUp}
        transition={{ duration, ease }}
        className="mt-2 text-sm text-white/55"
      >
        (yes, it&apos;s really that simple)
      </motion.p>

      <motion.div
        variants={fadeUp}
        transition={{ duration, ease }}
        className="mt-10 flex justify-center"
      >
        <LandingCtaButton
          href="/login"
          label="Create your first free ad"
          size="lg"
          className="w-full max-w-md sm:w-auto"
        />
      </motion.div>

      <motion.div
        variants={fadeUp}
        transition={{ duration, ease }}
        className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/75"
      >
        <span className="inline-flex items-center gap-2">
          <Check size={16} className="shrink-0 text-emerald-400" strokeWidth={2.5} />
          No credit card required
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-orange-600"
            aria-hidden
          >
            G2
          </span>
          Rated 4.8/5 on G2
        </span>
      </motion.div>
    </motion.section>
  )
}
