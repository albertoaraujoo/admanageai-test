import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const buttonVariants = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center font-medium rounded-lg border transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
    'active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-40',
    'select-none',
  ],
  variants: {
    variant: {
      primary: [
        'border-transparent bg-primary text-primary-foreground',
        'hover:bg-primary-hover shadow-lg shadow-primary/20',
      ],
      secondary: [
        'border-border-strong bg-surface-overlay text-foreground',
        'hover:bg-surface-hover',
      ],
      ghost: [
        'border-transparent text-foreground-muted',
        'hover:text-foreground hover:bg-white/5',
      ],
      destructive: [
        'border-transparent bg-destructive text-destructive-foreground',
        'hover:opacity-90',
      ],
      outline: [
        'border-border-strong bg-transparent text-foreground',
        'hover:bg-surface-overlay',
      ],
    },
    size: {
      sm: 'h-8 px-3 gap-1.5 text-xs [&_svg]:size-3.5',
      md: 'h-9 px-4 gap-2 text-sm [&_svg]:size-4',
      lg: 'h-11 px-5 gap-2.5 text-sm [&_svg]:size-4',
      icon: 'h-9 w-9 [&_svg]:size-4',
      'icon-sm': 'h-7 w-7 [&_svg]:size-3.5',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      className={twMerge(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
