import { notFound } from 'next/navigation'
import { getBlackoutById } from '@/lib/data/retreats'
import BlackoutEditor from '@/components/admin/retreats/BlackoutEditor'
import PageHeader from '@/components/admin/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default async function EditBlackoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const b = await getBlackoutById(id)
  if (!b) notFound()
  return (
    <>
      <PageHeader
        title="Edit Blackout"
        subtitle={b.label}
        back={{ href: '/admin/retreats/blackouts', label: 'Back to Blackouts' }}
      />
      <BlackoutEditor initial={b} />
    </>
  )
}
