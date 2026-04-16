'use client'

import type { HostInquiry, BuyoutInquiry } from '@/lib/types/retreats'
import type { Conflict } from '@/lib/pipeline/conflicts'
import ConflictBadge from '../ConflictBadge'
import { nightsBetween } from '@/lib/availability'

type Props = {
  inquiry: HostInquiry | BuyoutInquiry
  conflicts: Conflict[]
}

export default function DateRange({ inquiry, conflicts }: Props) {
  const nights = nightsBetween(inquiry.startDate, inquiry.endDate)
  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-md p-4 bg-gray-50/50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs tracking-wider uppercase text-gray-500">Requested dates</p>
          <ConflictBadge count={conflicts.length} />
        </div>
        <p className="text-sm font-medium text-gray-900">
          {inquiry.startDate} → {inquiry.endDate}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {nights} night{nights === 1 ? '' : 's'}
        </p>
        {conflicts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-red-700 mb-1">
              Conflicts — confirming will be blocked until resolved
            </p>
            <ul className="space-y-1">
              {conflicts.map((c) => (
                <li key={`${c.source}-${c.id}`} className="text-xs text-red-700">
                  {c.label} ({c.startDate} → {c.endDate})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
