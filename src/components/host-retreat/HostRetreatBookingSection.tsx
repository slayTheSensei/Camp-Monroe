'use client'

import { useState } from 'react'
import type { Season, PublicBlackout, BookedRange } from '@/lib/types/retreats'
import { formatRangeSummary, MIN_NIGHTS, leadDaysFor } from '@/lib/availability'
import AvailabilityCalendar, {
  type SelectedRange,
} from '@/components/availability/AvailabilityCalendar'
import AvailabilityLegend from '@/components/availability/AvailabilityLegend'
import HostInquiryForm from './HostInquiryForm'

type Props = {
  seasons: Season[]
  blackouts: PublicBlackout[]
  bookedRanges: BookedRange[]
}

export default function HostRetreatBookingSection({ seasons, blackouts, bookedRanges }: Props) {
  const [selection, setSelection] = useState<SelectedRange | null>(null)

  const validRange = selection?.valid
    ? { start: selection.start, end: selection.end, nights: selection.nights }
    : null

  const summaryLabel = validRange ? formatRangeSummary(validRange.start, validRange.end) : null

  return (
    <div className="space-y-10">
      <div>
        <AvailabilityLegend
          selectedLabel={summaryLabel}
          selectedNights={selection?.nights ?? 0}
          minNights={MIN_NIGHTS}
          leadDays={leadDaysFor('host')}
        />
        <AvailabilityCalendar
          inquiryKind="host"
          seasons={seasons}
          blackouts={blackouts}
          bookedRanges={bookedRanges}
          onSelect={setSelection}
        />
      </div>
      <HostInquiryForm
        selectedRange={validRange}
        onClearRange={() => setSelection(null)}
      />
    </div>
  )
}
