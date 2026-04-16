import Link from 'next/link'
import type { Season } from '@/lib/types/retreats'

type Props = {
  seasons: Season[]
}

export default function SeasonList({ seasons }: Props) {
  if (seasons.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-400 text-sm">
          No seasons yet. Create one so the public calendar has an operating window.
        </p>
      </div>
    )
  }
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
            <th className="px-4 py-3 font-medium">Label</th>
            <th className="px-4 py-3 font-medium">Dates</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {seasons.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/retreats/seasons/${s.id}`}
                  className="text-gray-900 font-medium hover:text-amber"
                >
                  {s.label}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {s.startDate} → {s.endDate}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                    s.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {s.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
