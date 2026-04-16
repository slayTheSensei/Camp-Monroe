import SeasonEditor from '@/components/admin/retreats/SeasonEditor'
import PageHeader from '@/components/admin/ui/PageHeader'

export default function NewSeasonPage() {
  return (
    <>
      <PageHeader
        title="New Season"
        subtitle="Add an operating window (e.g. main summer, winter pilot)."
        back={{ href: '/admin/retreats/seasons', label: 'Back to Seasons' }}
      />
      <SeasonEditor isNew />
    </>
  )
}
