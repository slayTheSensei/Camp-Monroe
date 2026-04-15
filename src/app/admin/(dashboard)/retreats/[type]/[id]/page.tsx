import { notFound } from 'next/navigation'
import {
  getInquiry,
  getCommunications,
  getBookingForInquiry,
  getAdminUserOptions,
} from '@/lib/data/retreats'
import { detectConflicts } from '@/lib/pipeline/conflicts'
import InquiryForm from '@/components/admin/retreats/InquiryForm'
import type { HostInquiry, StrInquiry } from '@/lib/types/retreats'

export const dynamic = 'force-dynamic'

type Params = { type: string; id: string }

export default async function InquiryDetailPage({ params }: { params: Promise<Params> }) {
  const { type: rawType, id } = await params
  if (rawType !== 'host' && rawType !== 'str') notFound()
  const type = rawType as 'host' | 'str'

  const [inquiry, communications, booking, admins] = await Promise.all([
    getInquiry(type, id),
    getCommunications(type, id),
    getBookingForInquiry(type, id),
    getAdminUserOptions(),
  ])
  if (!inquiry) notFound()

  // Per-range conflicts
  let ranges: { start: string; end: string }[] = []
  if (type === 'host') {
    const h = inquiry as HostInquiry
    ranges = [
      { start: h.prefStart1, end: h.prefEnd1 },
      ...(h.prefStart2 && h.prefEnd2 ? [{ start: h.prefStart2, end: h.prefEnd2 }] : []),
      ...(h.prefStart3 && h.prefEnd3 ? [{ start: h.prefStart3, end: h.prefEnd3 }] : []),
    ]
  } else {
    const s = inquiry as StrInquiry
    ranges = [{ start: s.startDate, end: s.endDate }]
  }

  const conflictsByRange = await Promise.all(
    ranges.map((r) => detectConflicts(r.start, r.end, { excludeInquiry: { type, id } }))
  )

  return (
    <InquiryForm
      type={type}
      inquiry={inquiry}
      conflictsByRange={conflictsByRange}
      communications={communications}
      existingBooking={booking}
      admins={admins}
    />
  )
}
