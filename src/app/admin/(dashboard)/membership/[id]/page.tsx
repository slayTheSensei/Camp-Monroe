import { notFound } from 'next/navigation'
import PageBody from '@/components/admin/ui/PageBody'
import InquiryTriage from '@/components/admin/inquiries/InquiryTriage'
import { getMembershipRequest } from '@/lib/data/inquiries'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const inquiry = await getMembershipRequest(id)
  return {
    title: inquiry
      ? `${inquiry.name} — Membership request`
      : 'Membership request — Camp Monroe Admin',
  }
}

export default async function MembershipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const inquiry = await getMembershipRequest(id)
  if (!inquiry) notFound()

  return (
    <PageBody>
      <InquiryTriage kind="membership" inquiry={inquiry} />
    </PageBody>
  )
}
