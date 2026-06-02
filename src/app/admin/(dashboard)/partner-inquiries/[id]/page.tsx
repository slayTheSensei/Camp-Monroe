import { notFound } from 'next/navigation'
import PageBody from '@/components/admin/ui/PageBody'
import InquiryTriage from '@/components/admin/inquiries/InquiryTriage'
import { getPartnerInquiry } from '@/lib/data/inquiries'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const inquiry = await getPartnerInquiry(id)
  return {
    title: inquiry
      ? `${inquiry.name} — Partner inquiry`
      : 'Partner inquiry — Camp Monroe Admin',
  }
}

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const inquiry = await getPartnerInquiry(id)
  if (!inquiry) notFound()

  return (
    <PageBody>
      <InquiryTriage kind="partner" inquiry={inquiry} />
    </PageBody>
  )
}
