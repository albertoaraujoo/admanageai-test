import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={twMerge(
        'animate-pulse rounded-lg bg-white/5',
        className
      )}
      {...props}
    />
  )
}
