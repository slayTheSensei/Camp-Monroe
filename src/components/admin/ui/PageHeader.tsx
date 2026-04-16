import Link from 'next/link'

type BackLinkConfig = { href: string; label?: string }

type Props = {
  title: string
  subtitle?: React.ReactNode
  /** Optional "← Back to X" link above the title. */
  back?: BackLinkConfig
  /** Right-aligned action slot (e.g. ButtonLinks). Stacks below on mobile. */
  actions?: React.ReactNode
}

/**
 * Every admin page's top section. Consistent title / subtitle / action
 * layout with responsive behavior.
 */
export default function PageHeader({ title, subtitle, back, actions }: Props) {
  return (
    <header className="mb-8 md:mb-12">
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 rounded-sm"
        >
          <span aria-hidden="true">←</span>
          {back.label ?? 'Back'}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </header>
  )
}
