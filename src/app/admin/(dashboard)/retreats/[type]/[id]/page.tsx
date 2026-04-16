import { notFound } from 'next/navigation'
import {
  getInquiry,
  getCommunications,
  getBookingForInquiry,
  getAdminUserOptions,
} from '@/lib/data/retreats'
import { detectConflicts } from '@/lib/pipeline/conflicts'
import InquiryForm from '@/components/admin/retreats/InquiryForm'
import type { HostInquiry, BuyoutInquiry } from '@/lib/types/retreats'

export const dynamic = 'force-dynamic'

type Params = { type: string; id: string }

export default async function InquiryDetailPage({ params }: { params: Promise<Params> }) {
  const { type: rawType, id } = await params
  if (rawType !== 'host' && rawType !== 'buyout') notFound()
  const type = rawType as 'host' | 'buyout'

  const [inquiry, communications, booking, admins] = await Promise.all([
    getInquiry(type, id),
    getCommunications(type, id),
    getBookingForInquiry(type, id),
    getAdminUserOptions(),
  ])
  if (!inquiry) notFound()

  // Single range now — no preference list
  const start =
    type === 'host' ? (inquiry as HostInquiry).startDate : (inquiry as BuyoutInquiry).startDate
  const end =
    type === 'host' ? (inquiry as HostInquiry).endDate : (inquiry as BuyoutInquiry).endDate
  const conflicts = await detectConflicts(start, end, { excludeInquiry: { type, id } })

  return (
    <InquiryForm
      type={type}
      inquiry={inquiry}
      conflicts={conflicts}
      communications={communications}
      existingBooking={booking}
      admins={admins}
    />
  )
}
