import Link from 'next/link'
import type { Blackout, BlackoutCategory } from '@/lib/types/retreats'

type Props = {
  blackouts: Blackout[]
}

const categoryLabels: Record<BlackoutCategory, string> = {
  internal_event: 'Internal event',
  member_buyout: 'Member buyout',
  other: 'Other',
}

export default function BlackoutList({ blackouts }: Props) {
  if (blackouts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-400 text-sm">
          No blackouts. Add one to block dates from public availability.
        </p>
      </div>
    )
  }
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
            <th className="px-4 py-3 font-medium">Dates</th>
            <th className="px-4 py-3 font-medium">Label</th>
            <th className="px-4 py-3 font-medium">Category</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {blackouts.map((b) => (
            <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {b.startDate} → {b.endDate}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/retreats/blackouts/${b.id}`}
                  className="text-gray-900 font-medium hover:text-amber"
                >
                  {b.label}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-500">{categoryLabels[b.category]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
