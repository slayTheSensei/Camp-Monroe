'use client'

import type { HostInquiry, StrInquiry } from '@/lib/types/retreats'

type Props = {
  inquiry: HostInquiry | StrInquiry
  type: 'host' | 'str'
}

export default function RequestDetails({ inquiry, type }: Props) {
  if (type === 'host') {
    const h = inquiry as HostInquiry
    return (
      <div className="space-y-4">
        <Field label="Retreat concept" multiline value={h.retreatConcept} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Audience" value={h.audienceType ?? '—'} />
          <Field label="Group size" value={h.groupSizeBucket ?? '—'} />
        </div>
        <Field label="Flexibility" value={h.flexibility ?? '—'} />
        {h.supportNeeds.length > 0 && (
          <Field label="Support needs" value={h.supportNeeds.join(', ')} />
        )}
        {h.additionalNotes && <Field label="Additional notes" multiline value={h.additionalNotes} />}
      </div>
    )
  }
  const s = inquiry as StrInquiry
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Party size" value={s.partySize ?? '—'} />
        <Field label="Purpose" value={s.purposeOfStay ?? '—'} />
      </div>
      <Field label="Affiliation" value={s.affiliation ?? '—'} />
      {s.additionalNotes && <Field label="Additional notes" multiline value={s.additionalNotes} />}
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
