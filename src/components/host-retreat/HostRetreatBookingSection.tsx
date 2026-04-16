'use client'

import { useState } from 'react'
import type { Season, PublicBlackout, BookedRange } from '@/lib/types/retreats'
import { formatRangeSummary } from '@/lib/availability'
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar'
import AvailabilityLegend from '@/components/availability/AvailabilityLegend'
import HostInquiryForm from './HostInquiryForm'

type Props = {
  seasons: Season[]
  blackouts: PublicBlackout[]
  bookedRanges: BookedRange[]
}

export default function HostRetreatBookingSection({ seasons, blackouts, bookedRanges }: Props) {
  const [selectedRange, setSelectedRange] = useState<{
    start: string
    end: string
    nights: number
  } | null>(null)

  return (
    <div className="space-y-10">
      <div>
        <AvailabilityLegend
          selectedLabel={selectedRange ? formatRangeSummary(selectedRange.start, selectedRange.end) : null}
        />
        <AvailabilityCalendar
          inquiryKind="host"
          seasons={seasons}
          blackouts={blackouts}
          bookedRanges={bookedRanges}
          onSelect={setSelectedRange}
        />
      </div>
      <HostInquiryForm
        selectedRange={selectedRange}
        onClearRange={() => setSelectedRange(null)}
      />
    </div>
  )
}
