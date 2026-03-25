import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const badgeVariants = tv({
  base: 'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border select-none',
  variants: {
    variant: {
      default: 'border-border bg-surface-overlay text-foreground-muted',
      primary: 'border-transparent bg-primary-muted text-primary',
      success: 'border-transparent bg-success/15 text-success',
      warning: 'border-transparent bg-warning/15 text-warning',
      destructive: 'border-transparent bg-destructive/15 text-destructive',
      pro: 'border-transparent bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps
  extends ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={twMerge(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </span>
  )
}
