import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import InquiryInbox from '@/components/admin/inquiries/InquiryInbox'
import {
  getMembershipRequests,
  getMembershipRequestCounts,
} from '@/lib/data/inquiries'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Membership requests — Camp Monroe Admin',
}

export default async function MembershipInboxPage() {
  const [inquiries, counts] = await Promise.all([
    getMembershipRequests(),
    getMembershipRequestCounts(),
  ])

  return (
    <>
      <PageHeader
        title="Membership requests"
        subtitle="Submissions from /request — by sponsorship, by application."
      />
      <PageBody>
        <InquiryInbox
          kind="membership"
          inquiries={inquiries}
          counts={counts}
        />
      </PageBody>
    </>
  )
}
