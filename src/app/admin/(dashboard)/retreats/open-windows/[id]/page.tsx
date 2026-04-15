import { notFound } from 'next/navigation'
import { getOpenWindowById } from '@/lib/data/retreats'
import OpenWindowEditor from '@/components/admin/retreats/OpenWindowEditor'

export const dynamic = 'force-dynamic'

export default async function EditOpenWindowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const w = await getOpenWindowById(id)
  if (!w) notFound()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Open Window</h1>
        <p className="text-gray-500 text-sm mt-1">{w.label}</p>
      </div>
      <OpenWindowEditor initial={w} />
    </div>
  )
}
