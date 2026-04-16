import Link from 'next/link'
import { getSeasons } from '@/lib/data/retreats'
import SeasonList from '@/components/admin/retreats/SeasonList'
import BackLink from '@/components/admin/retreats/BackLink'

export const dynamic = 'force-dynamic'

export default async function SeasonsPage() {
  const seasons = await getSeasons()
  return (
    <div>
      <BackLink />
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seasons</h1>
          <p className="text-gray-500 text-sm mt-1">
            Operating periods when Camp Monroe is open. Dates outside any active season are unavailable to prospects.
          </p>
        </div>
        <Link
          href="/admin/retreats/seasons/new"
          className="px-3 py-2 text-xs font-medium text-cream bg-forest rounded-md hover:bg-forest/90"
        >
          + New Season
        </Link>
      </div>
      <SeasonList seasons={seasons} />
    </div>
  )
}
