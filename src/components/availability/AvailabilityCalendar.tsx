'use client'

import { useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import type { Season, PublicBlackout, BookedRange, InquiryType } from '@/lib/types/retreats'
import {
  dayAvailability,
  firstBlockedAfter,
  nightsBetween,
  ymd,
  addDays,
  leadDaysFor,
  MIN_NIGHTS,
  type AvailabilityContext,
} from '@/lib/availability'

export type SelectedRange = {
  start: string
  end: string
  nights: number
  valid: boolean
}

export type AvailabilityCalendarProps = {
  inquiryKind: InquiryType
  seasons: Season[]
  blackouts: PublicBlackout[]
  bookedRanges: BookedRange[]
  /** Fires with the current selection. `valid=false` when < MIN_NIGHTS so the legend can show feedback. */
  onSelect: (range: SelectedRange | null) => void
}

export default function AvailabilityCalendar({
  inquiryKind,
  seasons,
  blackouts,
  bookedRanges,
  onSelect,
}: AvailabilityCalendarProps) {
  const leadDays = leadDaysFor(inquiryKind)
  const ctx: AvailabilityContext = useMemo(
    () => ({ seasons, blackouts, bookedRanges, leadDays }),
    [seasons, blackouts, bookedRanges, leadDays]
  )

  const [selectedStart, setSelectedStart] = useState<Date | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null)

  // Start the view on the first month of the first active season,
  // or today if seasons start in the past.
  const firstMonth = useMemo(() => {
    const firstActive = seasons.find((s) => s.isActive)
    if (!firstActive) return new Date()
    const seasonStart = new Date(firstActive.startDate + 'T00:00:00')
    const today = new Date()
    return seasonStart > today ? seasonStart : today
  }, [seasons])

  // Determine if a date is disabled (can't be selected).
  function isDisabled(date: Date): boolean {
    const iso = ymd(date)
    const status = dayAvailability(iso, ctx)
    if (status !== 'available') return true
    // When a start is selected, disable days before (start + MIN_NIGHTS)
    // and days beyond the first blocked date (no fragmented ranges).
    if (selectedStart && !selectedEnd) {
      const start = ymd(selectedStart)
      const minEnd = addDays(start, MIN_NIGHTS)
      if (iso < minEnd) return true
      const firstBlocked = firstBlockedAfter(start, ctx)
      if (firstBlocked && iso >= firstBlocked) return true
      if (iso < start) return true
    }
    return false
  }

  function handleSelect(range: { from?: Date; to?: Date } | undefined) {
    if (!range?.from) {
      setSelectedStart(null)
      setSelectedEnd(null)
      onSelect(null)
      return
    }
    if (range.from && !range.to) {
      setSelectedStart(range.from)
      setSelectedEnd(null)
      return
    }
    if (range.from && range.to) {
      setSelectedStart(range.from)
      setSelectedEnd(range.to)
      const start = ymd(range.from)
      const end = ymd(range.to)
      const nights = nightsBetween(start, end)
      onSelect({ start, end, nights, valid: nights >= MIN_NIGHTS })
    }
  }

  // Full-month modifiers for styling
  const modifiers = useMemo(() => {
    const unavailableDays: Date[] = []
    const outsideSeason: Date[] = []
    if (seasons.length > 0) {
      const minStart = seasons
        .map((s) => s.startDate)
        .sort()[0]
      const maxEnd = seasons
        .map((s) => s.endDate)
        .sort()
        .slice(-1)[0]
      // Walk forward ~14 months to populate modifiers
      const startDate = new Date(minStart + 'T00:00:00')
      const endDate = new Date(maxEnd + 'T00:00:00')
      const horizon = new Date(Math.max(endDate.getTime(), new Date().setMonth(new Date().getMonth() + 14)))
      const d = new Date(startDate)
      while (d <= horizon) {
        const iso = ymd(d)
        const status = dayAvailability(iso, ctx)
        if (status === 'outside_season') outsideSeason.push(new Date(d))
        else if (status === 'unavailable' || status === 'lead_time') unavailableDays.push(new Date(d))
        d.setDate(d.getDate() + 1)
      }
    }
    return { unavailable: unavailableDays, outside: outsideSeason }
  }, [ctx, seasons])

  const nothingAvailable = seasons.length === 0 || seasons.every((s) => !s.isActive)

  if (nothingAvailable) {
    return (
      <div className="bg-cream/5 border border-cream/10 rounded-md p-8 text-center">
        <p className="text-cream/70 text-base leading-relaxed">
          No dates available at the moment.{' '}
          <a href="/#waitlist" className="text-amber underline">
            Join the waitlist
          </a>{' '}
          to hear when future dates open.
        </p>
      </div>
    )
  }

  const selected =
    selectedStart && selectedEnd
      ? { from: selectedStart, to: selectedEnd }
      : selectedStart
      ? { from: selectedStart }
      : undefined

  return (
    <div className="bg-cream/5 border border-cream/10 rounded-md p-4 md:p-6">
      <style>{calendarStyles}</style>
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        disabled={isDisabled}
        modifiers={modifiers}
        modifiersClassNames={{
          unavailable: 'cm-unavailable',
          outside: 'cm-outside-season',
        }}
        numberOfMonths={2}
        defaultMonth={firstMonth}
        pagedNavigation
        className="cm-calendar"
        classNames={{
          months: 'flex flex-col md:flex-row gap-6',
          month: 'flex-1',
          caption: 'text-cream text-center mb-2',
          caption_label: 'font-display text-cream text-lg uppercase tracking-wide',
          head_cell: 'text-cream/40 text-xs uppercase tracking-wider w-10 h-8',
          cell: 'text-center',
          day: 'w-10 h-10 text-sm text-cream hover:bg-amber/20 rounded transition-colors',
          day_selected: 'bg-amber text-forest font-semibold',
          day_range_start: 'bg-amber text-forest font-semibold rounded-l',
          day_range_end: 'bg-amber text-forest font-semibold rounded-r',
          day_range_middle: 'bg-amber/40 text-cream',
          day_disabled: 'opacity-30 cursor-not-allowed hover:bg-transparent',
          day_today: 'ring-1 ring-amber/50',
        }}
      />
    </div>
  )
}

const calendarStyles = `
  .cm-calendar .rdp-root { --rdp-accent-color: #d4a843; --rdp-accent-background-color: #d4a843; color: #f5f0e8; background: transparent; }
  .cm-calendar .rdp-months, .cm-calendar .rdp-month, .cm-calendar .rdp-month_grid, .cm-calendar .rdp-table, .cm-calendar .rdp-week, .cm-calendar .rdp-row { background: transparent; }
  .cm-calendar .rdp-month_caption { color: #f5f0e8; font-family: Georgia, serif; font-style: italic; text-transform: uppercase; letter-spacing: 0.08em; font-size: 1.05rem; padding: 0.5rem 0; background: transparent; }
  .cm-calendar .rdp-weekday { color: rgba(245, 240, 232, 0.4); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; padding: 0.5rem 0; background: transparent; }

  /* Each cell: transparent, small padding so pills don't touch */
  .cm-calendar .rdp-day { padding: 2px; background: transparent; }
  .cm-calendar .rdp-day_button {
    color: #f5f0e8;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    width: 2.25rem;
    height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .cm-calendar .rdp-day_button:hover:not([disabled]) { background: rgba(212, 168, 67, 0.25); }

  /* Range endpoints: solid amber, dark forest text */
  .cm-calendar .rdp-selected .rdp-day_button { background: #d4a843; color: #1a2e1a; font-weight: 700; border-color: #d4a843; }
  /* Range middle: lighter amber, still dark text */
  .cm-calendar .rdp-range_middle .rdp-day_button { background: rgba(212, 168, 67, 0.65); color: #1a2e1a; font-weight: 600; border-color: transparent; }

  .cm-calendar .rdp-disabled .rdp-day_button { background: transparent; color: rgba(245, 240, 232, 0.25); text-decoration: line-through; cursor: not-allowed; border-color: transparent; }
  .cm-calendar .rdp-disabled .rdp-day_button:hover { background: transparent; }
  .cm-calendar .cm-outside-season .rdp-day_button { background: transparent; color: rgba(245, 240, 232, 0.15); border-color: transparent; }
  .cm-calendar .rdp-chevron { fill: #f5f0e8; }
  .cm-calendar .rdp-button_previous, .cm-calendar .rdp-button_next { background: transparent; color: #f5f0e8; }
  .cm-calendar .rdp-button_previous:hover,
  .cm-calendar .rdp-button_next:hover { background: rgba(212, 168, 67, 0.2); }
  .cm-calendar .rdp-today .rdp-day_button { outline: 1px solid rgba(212, 168, 67, 0.5); }
`
