import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import PartnerWaysAdmin from './PartnerWaysAdmin'
import { getWaysToPartnerItemsAdmin } from '@/lib/data/content-admin'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Ways to partner — Camp Monroe Admin',
}

export default async function PartnerWaysContentPage() {
  const items = await getWaysToPartnerItemsAdmin()

  return (
    <>
      <PageHeader
        title="Ways to partner"
        subtitle="The four ways shown on /partner. Reorder, edit copy, hide items, or add new ones."
      />
      <PageBody>
        <PartnerWaysAdmin items={items} />
      </PageBody>
    </>
  )
}
