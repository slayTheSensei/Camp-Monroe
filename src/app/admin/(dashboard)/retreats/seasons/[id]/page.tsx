import { notFound } from 'next/navigation'
import { getSeasonById } from '@/lib/data/retreats'
import SeasonEditor from '@/components/admin/retreats/SeasonEditor'

export const dynamic = 'force-dynamic'

export default async function EditSeasonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const s = await getSeasonById(id)
  if (!s) notFound()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Season</h1>
        <p className="text-gray-500 text-sm mt-1">{s.label}</p>
      </div>
      <SeasonEditor initial={s} />
    </div>
  )
}
