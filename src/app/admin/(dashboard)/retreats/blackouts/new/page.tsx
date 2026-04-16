import BlackoutEditor from '@/components/admin/retreats/BlackoutEditor'

export default function NewBlackoutPage() {
  return (
    <div>
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
