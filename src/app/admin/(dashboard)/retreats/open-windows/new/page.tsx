import OpenWindowEditor from '@/components/admin/retreats/OpenWindowEditor'

export default function NewOpenWindowPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Open Window</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create a new public-facing date block.
        </p>
      </div>
      <OpenWindowEditor isNew />
    </div>
  )
}
