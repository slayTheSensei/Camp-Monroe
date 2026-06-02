import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import InquiryInbox from '@/components/admin/inquiries/InquiryInbox'
import {
  getPartnerInquiries,
  getPartnerInquiryCounts,
} from '@/lib/data/inquiries'

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
        subtitle="Submissions from /partner — investors, press, policymakers, community."
      />
      <PageBody>
        <InquiryInbox kind="partner" inquiries={inquiries} counts={counts} />
      </PageBody>
    </>
  )
}
