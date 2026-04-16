import { getSeasons } from '@/lib/data/retreats'
import SeasonList from '@/components/admin/retreats/SeasonList'
import PageHeader from '@/components/admin/ui/PageHeader'
import { ButtonLink } from '@/components/admin/ui/Button'

export const dynamic = 'force-dynamic'

export default async function SeasonsPage() {
  const seasons = await getSeasons()
  return (
    <>
      <PageHeader
        title="Seasons"
        subtitle="Operating periods when Camp Monroe is open. Dates outside any active season are unavailable."
        back={{ href: '/admin/retreats', label: 'Back to Retreats' }}
        actions={<ButtonLink href="/admin/retreats/seasons/new">+ New Season</ButtonLink>}
      />
      <SeasonList seasons={seasons} />
    </>
  )
}
