import Link from 'next/link'
import { getOpenWindows } from '@/lib/data/retreats'
import OpenWindowList from '@/components/admin/retreats/OpenWindowList'

export const dynamic = 'force-dynamic'

export default async function OpenWindowsPage() {
  const windows = await getOpenWindows()
  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Open Windows</h1>
          <p className="text-gray-500 text-sm mt-1">
            Admin-curated date blocks shown on public pages.
          </p>
        </div>
        <Link
          href="/admin/retreats/open-windows/new"
          className="px-3 py-2 text-xs font-medium text-cream bg-forest rounded-md hover:bg-forest/90"
        >
          + New Window
        </Link>
      </div>
      <OpenWindowList windows={windows} />
    </div>
  )
}
