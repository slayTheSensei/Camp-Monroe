'use client'

import type { HostInquiry, StrInquiry } from '@/lib/types/retreats'
import type { Conflict } from '@/lib/pipeline/conflicts'
import ConflictBadge from '../ConflictBadge'

type Props = {
  inquiry: HostInquiry | StrInquiry
  type: 'host' | 'str'
  conflictsByRange: Conflict[][]
}

export default function DatePreferences({ inquiry, type, conflictsByRange }: Props) {
  const ranges = buildRanges(inquiry, type)
  return (
    <div className="space-y-4">
      {ranges.map((r, i) => {
        if (!r) return null
        const conflicts = conflictsByRange[i] ?? []
        return (
          <div
            key={i}
            className="border border-gray-200 rounded-md p-4 bg-gray-50/50"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs tracking-wider uppercase text-gray-500">
                {type === 'host' ? `Preference ${i + 1}` : 'Requested dates'}
              </p>
              <ConflictBadge count={conflicts.length} />
            </div>
            <p className="text-sm font-medium text-gray-900">
              {r.start} → {r.end}
            </p>
            {conflicts.length > 0 && (
              <ul className="mt-2 space-y-1">
                {conflicts.map((c) => (
                  <li key={`${c.source}-${c.id}`} className="text-xs text-red-700">
                    {c.label} ({c.startDate} → {c.endDate})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

function buildRanges(inquiry: HostInquiry | StrInquiry, type: 'host' | 'str') {
  if (type === 'host') {
    const h = inquiry as HostInquiry
    return [
      { start: h.prefStart1, end: h.prefEnd1 },
      h.prefStart2 && h.prefEnd2 ? { start: h.prefStart2, end: h.prefEnd2 } : null,
      h.prefStart3 && h.prefEnd3 ? { start: h.prefStart3, end: h.prefEnd3 } : null,
    ]
  }
  const s = inquiry as StrInquiry
  return [{ start: s.startDate, end: s.endDate }]
}
