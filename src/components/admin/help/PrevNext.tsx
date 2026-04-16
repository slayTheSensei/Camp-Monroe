import Link from 'next/link'
import type { DocArticle } from '@/lib/docs'

type Props = {
  prev: DocArticle | null
  next: DocArticle | null
}

export default function PrevNext({ prev, next }: Props) {
  if (!prev && !next) return null
  return (
    <div className="mt-16 pt-8 border-t border-gray-200 grid sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={`/admin/help/${prev.path}`}
          className="group block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-amber/50"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider">← Previous</p>
          <p className="mt-1 text-sm font-medium text-gray-900 group-hover:text-amber">
            {prev.title}
          </p>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/admin/help/${next.path}`}
          className="group block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-amber/50 sm:text-right"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider">Next →</p>
          <p className="mt-1 text-sm font-medium text-gray-900 group-hover:text-amber">
            {next.title}
          </p>
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}
