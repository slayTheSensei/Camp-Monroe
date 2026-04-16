import Link from 'next/link'

type Props = {
  href?: string
  label?: string
}

export default function BackLink({
  href = '/admin/retreats',
  label = 'Back to Retreats',
}: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-4"
    >
      <span aria-hidden="true">←</span>
      {label}
    </Link>
  )
}
