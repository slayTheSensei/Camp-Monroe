import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import FrontDoorInbox from '@/components/admin/front-door/FrontDoorInbox'
import {
  getPartnerInquiries,
  getPartnerInquiryCounts,
} from '@/lib/data/front-door'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Partner inquiries — Camp Monroe Admin',
}

export default async function PartnerInboxPage() {
  const [inquiries, counts] = await Promise.all([
    getPartnerInquiries(),
    getPartnerInquiryCounts(),
  ])

  return (
    <>
      <PageHeader
        title="Partner inquiries"
        subtitle="Front-door submissions from /partner — investors, press, policymakers, community."
      />
      <PageBody>
        <FrontDoorInbox kind="partner" inquiries={inquiries} counts={counts} />
      </PageBody>
    </>
  )
}
