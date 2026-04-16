import { notFound } from 'next/navigation'
import { getSeasonById } from '@/lib/data/retreats'
import SeasonEditor from '@/components/admin/retreats/SeasonEditor'
import PageHeader from '@/components/admin/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default async function EditSeasonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const s = await getSeasonById(id)
  if (!s) notFound()
  return (
    <>
      <PageHeader
        title="Edit Season"
        subtitle={s.label}
        back={{ href: '/admin/retreats/seasons', label: 'Back to Seasons' }}
      />
      <SeasonEditor initial={s} />
    </>
  )
}
