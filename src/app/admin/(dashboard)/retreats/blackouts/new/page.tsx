import BlackoutEditor from '@/components/admin/retreats/BlackoutEditor'
import BackLink from '@/components/admin/retreats/BackLink'

export default function NewBlackoutPage() {
  return (
    <div>
      <BackLink href="/admin/retreats/blackouts" label="Back to Blackouts" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Blackout</h1>
        <p className="text-gray-500 text-sm mt-1">
          Block dates from public availability.
        </p>
      </div>
      <BlackoutEditor isNew />
    </div>
  )
}
