import Link from 'next/link'
import type { OpenWindow } from '@/lib/types/retreats'

type Props = {
  windows: OpenWindow[]
}

export default function OpenWindowList({ windows }: Props) {
  if (windows.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-400 text-sm">
          No open windows yet. Create one to make dates visible on the public pages.
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
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Public</th>
            <th className="px-4 py-3 font-medium">Sort</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {windows.map((w) => (
            <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {w.startDate} → {w.endDate}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/retreats/open-windows/${w.id}`}
                  className="text-gray-900 font-medium hover:text-amber"
                >
                  {w.label}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-500 capitalize">{w.windowType}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                    w.isPublic ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {w.isPublic ? 'Public' : 'Hidden'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400">{w.sortOrder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
