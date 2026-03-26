'use client'

import { useTransition } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const [isPending, startTransition] = useTransition()

  function handleGoogleLogin() {
    startTransition(async () => {
      await signIn('google', { callbackUrl: '/' })
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — gradient */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/30 via-purple-900/20 to-surface p-10 lg:flex lg:w-[55%]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/40">
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
          <span className="text-base font-semibold tracking-tight text-foreground">
            AdManage<span className="text-primary">.ai</span>
          </span>
        </div>

        {/* Hero content */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              AI-Powered Ad Creation
            </p>
            <h1 className="text-4xl font-bold leading-tight text-foreground">
              Create stunning
              <br />
              <span className="text-primary">image ads</span> in seconds
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">
              Browse thousands of templates, import your product, and generate high-converting ads
              with a single click.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Real API credits', 'No watermark on Pro', 'Instant generation'].map((feat) => (
              <span
                key={feat}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground-muted backdrop-blur-sm"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2 lg:hidden">
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
            <span className="text-sm font-semibold text-foreground">
              AdManage<span className="text-primary">.ai</span>
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-foreground-muted">Sign in with your Google account to continue</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isPending}
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin text-primary" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
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

          <p className="text-center text-xs text-foreground-muted">
            By signing in you agree to our{' '}
            <span className="cursor-pointer text-foreground-muted underline underline-offset-2 hover:text-foreground">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="cursor-pointer text-foreground-muted underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
