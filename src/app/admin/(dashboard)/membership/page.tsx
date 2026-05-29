import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import FrontDoorInbox from '@/components/admin/front-door/FrontDoorInbox'
import {
  getMembershipRequests,
  getMembershipRequestCounts,
} from '@/lib/data/front-door'

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
        subtitle="Front-door submissions from /request — by sponsorship, by application."
      />
      <PageBody>
        <FrontDoorInbox
          kind="membership"
          inquiries={inquiries}
          counts={counts}
        />
      </PageBody>
    </>
  )
}
