import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import TimelineAdmin from './TimelineAdmin'
import { getTimelineItemsAdmin } from '@/lib/data/content-admin'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'History timeline — Camp Monroe Admin',
}

export default async function TimelineContentPage() {
  const items = await getTimelineItemsAdmin()

  return (
    <>
      <PageHeader
        title="History timeline"
        subtitle="The ordered timeline rendered on /history. Reorder, edit copy, hide items, or add new ones."
      />
      <PageBody>
        <TimelineAdmin items={items} />
      </PageBody>
    </>
  )
}
