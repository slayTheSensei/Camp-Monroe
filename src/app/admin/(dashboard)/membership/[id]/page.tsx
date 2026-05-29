import { notFound } from 'next/navigation'
import PageBody from '@/components/admin/ui/PageBody'
import FrontDoorTriage from '@/components/admin/front-door/FrontDoorTriage'
import { getMembershipRequest } from '@/lib/data/front-door'

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
      <FrontDoorTriage kind="membership" inquiry={inquiry} />
    </PageBody>
  )
}
