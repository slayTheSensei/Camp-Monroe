import SeasonEditor from '@/components/admin/retreats/SeasonEditor'
import BackLink from '@/components/admin/retreats/BackLink'

export default function NewSeasonPage() {
  return (
    <div>
      <BackLink href="/admin/retreats/seasons" label="Back to Seasons" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Season</h1>
        <p className="text-gray-500 text-sm mt-1">
          Add an operating window (e.g. main summer, winter pilot).
        </p>
      </div>
      <SeasonEditor isNew />
    </div>
  )
}
