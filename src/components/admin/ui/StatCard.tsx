import Link from 'next/link'

type Tone = 'default' | 'blue' | 'orange' | 'green' | 'gray' | 'amber'

const toneClass: Record<Tone, string> = {
  default: 'text-gray-900',
  blue: 'text-blue-700',
  orange: 'text-orange-700',
  green: 'text-green-700',
  gray: 'text-gray-700',
  amber: 'text-amber',
}

type Props = {
  label: string
  value: React.ReactNode
  tone?: Tone
  sub?: string
  href?: string
}

export default function StatCard({ label, value, tone = 'default', sub, href }: Props) {
  const inner = (
    <>
      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-2xl font-bold mt-1.5 leading-tight ${toneClass[tone]}`}>
        {value}
      </p>
      {/* Reserved sub-label slot keeps all cards the same height */}
      <p className="text-[11px] text-gray-400 mt-0.5 min-h-[1em]">
        {sub ?? '\u00A0'}
      </p>
    </>
  )

  const base =
    'block bg-white rounded-lg border border-gray-200 p-3.5 transition-colors duration-150'

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} hover:border-amber/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60`}
      >
        {inner}
      </Link>
    )
  }
  return <div className={base}>{inner}</div>
}
