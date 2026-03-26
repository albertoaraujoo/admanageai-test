import Link from 'next/link'
import { ChevronDown, Zap } from 'lucide-react'
import { LandingCarousel } from '@/components/marketing/landing-carousel'
import { LandingCtaButton } from '@/components/marketing/landing-cta-button'
import { LandingHeroIntro } from '@/components/marketing/landing-hero-intro'

const NAV_MAIN = [
  { label: 'Platform', href: '#platform', hasChevron: true },
  { label: 'API', href: '#platform', hasChevron: false },
  { label: 'Scale', href: '#platform', hasChevron: false },
  { label: 'Resources', href: '#platform', hasChevron: true },
  { label: 'Pricing', href: '#platform', hasChevron: false },
] as const

const LOGO_ROW_1 = [
  'Zumper',
  'Kitsch',
  'Drift',
  'Scentbird',
  'Bombas',
  "Mary Ruth's",
  'Bioma',
] as const

const LOGO_ROW_2 = [
  'Elevate',
  'Binance',
  'Weee!',
  'Comcast',
  'AppLovin',
  'Alibaba.com',
  'ByteDance',
] as const

const HERO_STATS = [
  { value: '20M+', label: 'Ads analyzed' },
  { value: '10M+', label: 'Ads created' },
  { value: '$650M+', label: 'Ad spend' },
] as const

function LandingHeader() {
  return (
    <header className="relative z-20 pt-4 sm:pt-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            AdManage<span className="text-violet-300">.ai</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0 rounded-full border border-white/10 bg-black/25 px-2 py-1.5 backdrop-blur-md md:flex"
          aria-label="Primary"
        >
          {NAV_MAIN.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-0.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
              {item.hasChevron && <ChevronDown size={14} className="opacity-60" strokeWidth={2} />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <Link
            href="/login"
            className="hidden text-[11px] font-semibold uppercase tracking-wider text-white/90 transition-colors hover:text-white sm:inline"
          >
            Book a demo
          </Link>
          <LandingCtaButton href="/login" label="Create" size="sm" className="shadow-none" />
        </div>
      </div>
    </header>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface-raised/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/90">
            <Zap size={14} className="text-primary-foreground" />
          </div>
          <span className="text-sm text-foreground-muted">
            AdManage.ai — AI image ads for performance teams
          </span>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-foreground-muted">
          <Link href="/login" className="hover:text-foreground">
            Sign in
          </Link>
          <span className="text-foreground-subtle">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ── Dark hero band (Creatify-style mesh) ───────────────── */}
      <div className="relative min-h-[min(92vh,880px)] pb-24 pt-0 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 100% 80% at 50% 100%, rgba(99, 102, 241, 0.45), transparent 55%),
              radial-gradient(ellipse 70% 50% at 15% 20%, rgba(59, 130, 246, 0.35), transparent 50%),
              radial-gradient(ellipse 55% 45% at 90% 15%, rgba(192, 132, 252, 0.3), transparent 45%),
              radial-gradient(ellipse 60% 40% at 80% 85%, rgba(253, 186, 116, 0.2), transparent 50%),
              linear-gradient(180deg, #050510 0%, #0a0a12 40%, #080816 100%)
            `,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <LandingHeader />

          <LandingHeroIntro />
        </div>
      </div>

      {/* ── Light sections ─────────────────────────────────────── */}
      <div className="relative z-10 -mt-16 rounded-t-[2rem] bg-[#f4f4f5] pb-20 pt-14 text-zinc-900 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] sm:rounded-t-[2.5rem] sm:pt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <LandingCarousel className="mb-20" />

          <p className="text-center text-lg font-medium text-zinc-800 sm:text-xl">
            Supporting more than 15,000 brands and agencies
          </p>

          <div className="mt-10 flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
              {LOGO_ROW_1.map((name) => (
                <span
                  key={name}
                  className="text-sm font-semibold uppercase tracking-wide text-zinc-700"
                >
                  {name}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-55">
              {LOGO_ROW_2.map((name) => (
                <span
                  key={name}
                  className="text-sm font-semibold uppercase tracking-wide text-zinc-700"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div
            className="mx-auto mt-16 max-w-4xl rounded-2xl border border-zinc-200/80 bg-white px-4 py-8 shadow-sm sm:px-8 sm:py-10"
            id="platform"
          >
            <div className="grid grid-cols-1 divide-y divide-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="py-6 text-center sm:px-4 sm:py-2">
                  <p className="text-3xl font-bold tabular-nums text-zinc-900 sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-3xl text-center">
            <h2 className="text-balance text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl sm:leading-tight">
              The #1 AI ad platform built for performance
            </h2>
            <p className="mt-4 text-pretty text-base text-zinc-600 sm:text-lg">
              Transform any product page into a winning image ad — created, tested, and optimized in
              minutes.
            </p>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  )
}
