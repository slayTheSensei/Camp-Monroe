type Props = {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}

/**
 * A labeled group inside a PageBody. PageBody handles inter-section spacing
 * automatically — sections themselves are tight (8px between title and body).
 */
export default function Section({ title, action, children }: Props) {
  return (
    <section className="flex flex-col gap-2 section-root">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
