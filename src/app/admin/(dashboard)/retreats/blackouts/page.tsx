import Link from 'next/link'
import { getBlackouts } from '@/lib/data/retreats'
import BlackoutList from '@/components/admin/retreats/BlackoutList'

export const dynamic = 'force-dynamic'

export default async function BlackoutsPage() {
  const blackouts = await getBlackouts()
  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blackouts</h1>
          <p className="text-gray-500 text-sm mt-1">
            Dates inside a season that are off-limits: internal events, CGRC member buyouts, or other reasons.
          </p>
        </div>
        <Link
          href="/admin/retreats/blackouts/new"
          className="px-3 py-2 text-xs font-medium text-cream bg-forest rounded-md hover:bg-forest/90"
        >
          + New Blackout
        </Link>
      </div>
      <BlackoutList blackouts={blackouts} />
    </div>
  )
}
