'use client'

import { useTransition } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2, Mail } from 'lucide-react'
import { toast } from '@/lib/toast'

const LOGIN_SHOWCASE_VIDEO =
  'https://dpbavq092lwjh.cloudfront.net/creatify-made-videos/fa_2.mp4'

export function LoginForm() {
  const [isPending, startTransition] = useTransition()

  function handleGoogleLogin() {
    startTransition(async () => {
      await signIn('google', { callbackUrl: '/home' })
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — light blue radial (Creatify-style) + large video card */}
      <div className="relative hidden min-h-screen flex-col overflow-hidden lg:flex lg:w-1/2">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 130% 100% at 48% 42%, #e8f4fc 0%, #d4e8f7 28%, #bdddf3 55%, #a8d0ef 78%, #94c4e8 100%)
            `,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(147, 197, 253, 0.5), transparent 50%)',
          }}
          aria-hidden
        />

        <div className="relative z-10 flex shrink-0 items-center gap-2.5 px-8 pt-10 lg:px-12">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/35">
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
          <span className="text-base font-semibold tracking-tight text-slate-800">
            AdManage<span className="text-primary">.ai</span>
          </span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <div className="relative w-full max-w-[min(96vw,1100px)] overflow-hidden rounded-3xl border border-slate-900/15 bg-linear-to-br from-indigo-950 via-slate-950 to-slate-900 shadow-[0_32px_90px_-20px_rgba(15,23,42,0.55)] ring-1 ring-slate-800/40">
            <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/30 via-transparent to-black/15" />
            <video
              className="h-[min(54vh,640px)] w-full object-cover object-center sm:h-[min(52vh,600px)] lg:h-[min(56vh,680px)]"
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
              aria-label="Product showcase video (no sound)"
            >
              <source src={LOGIN_SHOWCASE_VIDEO} type="video/mp4" />
            </video>
          </div>
          <p className="mt-4 max-w-2xl text-center text-[11px] leading-relaxed text-slate-600 sm:text-xs">
            Sample reel — public demo asset; plays muted.
          </p>
        </div>
      </div>

      {/* Right — Creatify-style panel (#121212, centered stack) */}
      <div className="flex min-h-dvh w-full flex-1 flex-col items-center justify-center bg-[#121212] px-6 py-10 lg:min-h-screen lg:w-1/2 lg:py-12">
        <div className="w-full max-w-[400px] space-y-8 text-center">
          <div className="flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/40">
              <svg
                width="14"
                height="14"
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
            <span className="text-sm font-semibold text-white">
              AdManage<span className="text-primary">.ai</span>
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[1.65rem]">
              Ready to use AdManage?
            </h2>
            <p className="text-sm text-zinc-500">
              Sign in with Google or email — Google is available now.
            </p>
          </div>

          <div className="space-y-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#262626] px-4 py-4 text-sm font-medium text-white transition-colors hover:bg-[#2e2e2e] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin text-zinc-300" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isPending ? 'Redirecting…' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs lowercase tracking-wide text-zinc-500">or</span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            <div className="space-y-3 text-left">
              <label className="sr-only" htmlFor="login-email">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-zinc-500"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email"
                  className="w-full rounded-2xl border border-zinc-800 bg-surface-overlay py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  toast.info('Email sign-in is coming soon — please use Continue with Google.')
                }
                className="w-full rounded-2xl bg-[#312e81] px-4 py-4 text-sm font-medium text-white transition-colors hover:bg-[#3730a3]"
              >
                Continue with email
              </button>
            </div>

            <p className="text-center text-sm text-zinc-500">
              <span className="cursor-default">Legacy account?</span>{' '}
              <button
                type="button"
                onClick={() => toast.info('Password sign-in is not enabled — use Google.')}
                className="text-zinc-300 underline decoration-zinc-600 underline-offset-2 transition-colors hover:text-white hover:decoration-zinc-400"
              >
                Continue with password
              </button>
            </p>
          </div>

          <p className="text-center text-xs leading-relaxed text-zinc-500">
            By continuing, you agree to our{' '}
            <button
              type="button"
              className="font-medium text-sky-400 underline decoration-sky-400/50 underline-offset-2 transition-colors hover:text-sky-300 hover:decoration-sky-300"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              className="font-medium text-sky-400 underline decoration-sky-400/50 underline-offset-2 transition-colors hover:text-sky-300 hover:decoration-sky-300"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
