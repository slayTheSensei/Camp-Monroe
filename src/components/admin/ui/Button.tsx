'use client'

import Link from 'next/link'
import { forwardRef } from 'react'

/**
 * Single source of truth for admin button styling.
 * Variants, sizes, and hover/focus behavior live here — don't restyle buttons
 * ad-hoc in individual pages.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center rounded-md font-semibold tracking-wide uppercase ' +
  'transition-colors duration-150 active:scale-[0.98] whitespace-nowrap ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-forest text-cream hover:bg-forest-light',
  secondary: 'bg-white text-forest border border-forest/20 hover:border-forest/60 hover:bg-forest/5',
  ghost: 'text-forest/70 hover:text-forest hover:bg-forest/5',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[11px]',
  md: 'h-9 px-4 text-xs',
  lg: 'h-11 px-5 text-sm',
}

export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string
) {
  return `${base} ${variantClass[variant]} ${sizeClass[size]}${extra ? ' ' + extra : ''}`
}

// ============================================================================
// Button (onClick)
// ============================================================================

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, ...rest },
  ref
) {
  return (
    <button ref={ref} className={buttonClassName(variant, size, className)} {...rest}>
      {children}
    </button>
  )
})

// ============================================================================
// ButtonLink (next/link)
// ============================================================================

type ButtonLinkProps = {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
  target?: string
  rel?: string
  prefetch?: boolean
  onClick?: () => void
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClassName(variant, size, className)} {...rest}>
      {children}
    </Link>
  )
}
