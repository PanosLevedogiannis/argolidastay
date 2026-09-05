import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

/**
 * Βασικά δομικά στοιχεία της διεπαφής.
 *
 * Κρατιούνται σε ένα αρχείο όσο είναι λίγα — όταν μεγαλώσουν, σπάνε σε
 * ξεχωριστά. Στόχος είναι να μη γράφεται δεύτερη φορά το ίδιο κουμπί με
 * λίγο διαφορετικό padding.
 */

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

// ── Κουμπιά ────────────────────────────────────────────────────────────

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-[transform,background-color,box-shadow] duration-150 ' +
  'active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none'

const buttonVariants = {
  primary: 'bg-clay-500 text-white hover:bg-clay-600 shadow-sm hover:shadow',
  secondary: 'bg-white text-ink-900 ring-1 ring-sand-300 hover:bg-sand-100',
  ghost: 'text-ink-700 hover:bg-sand-100',
} as const

const buttonSizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-13 px-8 text-base',
} as const

type ButtonStyleProps = {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonStyleProps & ComponentProps<'button'>) {
  return (
    <button
      className={cx(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonStyleProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cx(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  )
}

// ── Διάταξη ────────────────────────────────────────────────────────────

export function Container({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <div className={cx('mx-auto w-full max-w-6xl px-5 sm:px-6', className)}>{children}</div>
}

export function Section({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title?: string
  subtitle?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cx('py-14 sm:py-20', className)}>
      <Container>
        {(title || action) && (
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              {title && <h2 className="text-h2 sm:text-h1 text-balance">{title}</h2>}
              {subtitle && <p className="mt-2 text-ink-500 text-pretty">{subtitle}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}

// ── Μικρά στοιχεία ─────────────────────────────────────────────────────

export function Badge({
  tone = 'sand',
  children,
}: {
  tone?: 'sand' | 'ochre' | 'olive' | 'clay'
  children: ReactNode
}) {
  const tones = {
    sand: 'bg-sand-100 text-ink-700',
    ochre: 'bg-ochre-100 text-ochre-500',
    olive: 'bg-olive-100 text-olive-500',
    clay: 'bg-clay-100 text-clay-700',
  } as const

  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-h1 text-clay-500">{value}</div>
      <div className="mt-1 text-sm text-ink-500">{label}</div>
    </div>
  )
}
