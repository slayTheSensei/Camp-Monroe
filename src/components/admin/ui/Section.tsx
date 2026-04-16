type Props = {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  /** If true, renders without the top border + top padding (useful at very top of a PageBody). */
  first?: boolean
}

/**
 * A labeled group inside a PageBody.
 * Subsequent sections automatically get a subtle divider + spacing above them
 * via CSS :not(:first-child) selectors applied at the PageBody level.
 */
export default function Section({ title, action, children }: Props) {
  return (
    <section className="flex flex-col gap-3 section-root">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
