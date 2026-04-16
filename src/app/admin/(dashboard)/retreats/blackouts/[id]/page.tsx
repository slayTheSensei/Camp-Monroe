import { notFound } from 'next/navigation'
import { getBlackoutById } from '@/lib/data/retreats'
import BlackoutEditor from '@/components/admin/retreats/BlackoutEditor'
import BackLink from '@/components/admin/retreats/BackLink'

export const dynamic = 'force-dynamic'

export default async function EditBlackoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const b = await getBlackoutById(id)
  if (!b) notFound()
  return (
    <div>
      <BackLink href="/admin/retreats/blackouts" label="Back to Blackouts" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Blackout</h1>
        <p className="text-gray-500 text-sm mt-1">{b.label}</p>
      </div>
      <BlackoutEditor initial={b} />
    </div>
  )
}
