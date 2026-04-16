'use client'

import type { HostInquiry, BuyoutInquiry } from '@/lib/types/retreats'

type Props = {
  inquiry: HostInquiry | BuyoutInquiry
  type: 'host' | 'buyout'
}

export default function RequestDetails({ inquiry, type }: Props) {
  if (type === 'host') {
    const h = inquiry as HostInquiry
    return (
      <div className="space-y-4">
        <Field label="Retreat concept" multiline value={h.retreatConcept} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Audience" value={h.audienceType ?? '—'} />
          <Field label="Group size" value={h.groupSize?.toString() ?? '—'} />
        </div>
        {h.supportNeeds.length > 0 && (
          <Field label="Support needs" value={h.supportNeeds.join(', ')} />
        )}
        {h.additionalNotes && <Field label="Additional notes" multiline value={h.additionalNotes} />}
      </div>
    )
  }
  const b = inquiry as BuyoutInquiry
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Party size" value={b.partySize ?? '—'} />
        <Field label="Purpose" value={b.purposeOfStay ?? '—'} />
      </div>
      <Field label="Affiliation" value={b.affiliation ?? '—'} />
      {b.additionalNotes && <Field label="Additional notes" multiline value={b.additionalNotes} />}
    </div>
  )
}

function Field({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-xs tracking-wider uppercase text-gray-500 mb-1">{label}</p>
      <p className={`text-sm text-gray-900 ${multiline ? 'whitespace-pre-wrap' : ''}`}>{value}</p>
    </div>
  )
}
