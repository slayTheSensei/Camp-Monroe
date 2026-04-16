import { getBlackouts } from '@/lib/data/retreats'
import BlackoutList from '@/components/admin/retreats/BlackoutList'
import PageHeader from '@/components/admin/ui/PageHeader'
import { ButtonLink } from '@/components/admin/ui/Button'

export const dynamic = 'force-dynamic'

export default async function BlackoutsPage() {
  const blackouts = await getBlackouts()
  return (
    <>
      <PageHeader
        title="Blackouts"
        subtitle="Dates inside a season that are off-limits: internal events, CGRC member buyouts, or other reasons."
        back={{ href: '/admin/retreats', label: 'Back to Retreats' }}
        actions={<ButtonLink href="/admin/retreats/blackouts/new">+ New Blackout</ButtonLink>}
      />
      <BlackoutList blackouts={blackouts} />
    </>
  )
}
