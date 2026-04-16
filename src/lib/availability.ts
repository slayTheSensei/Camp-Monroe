// Availability computation for the public calendar.
// Rules (DL-006, DL-007):
//   if day not inside any active season   -> 'outside_season'
//   else if day < today + leadDays         -> 'lead_time'
//   else if day overlaps any unavailable   -> 'unavailable' (merges blackouts + bookings)
//   else                                   -> 'available'

import type {
  Season,
  PublicBlackout,
  BookedRange,
  DayAvailability,
  InquiryType,
} from '@/lib/types/retreats'

export const MIN_NIGHTS = 3

/** Lead time per inquiry kind (Q6). */
export function leadDaysFor(type: InquiryType): number {
  return type === 'host' ? 14 : 7
}

/** ISO date (YYYY-MM-DD) for a Date, local time. */
export function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Today in ISO date (local). */
export function todayIso(): string {
  return ymd(new Date())
}

/** Inclusive overlap for ISO date strings. */
export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return !(aEnd < bStart || bEnd < aStart)
}

/** Is `iso` within [start, end] inclusive? */
export function isWithin(iso: string, start: string, end: string): boolean {
  return iso >= start && iso <= end
}

export type AvailabilityContext = {
  seasons: Season[]
  blackouts: PublicBlackout[]
  bookedRanges: BookedRange[]
  leadDays: number
  /** Override for testing. */
  today?: string
}

/** Returns the availability state for a single day. */
export function dayAvailability(iso: string, ctx: AvailabilityContext): DayAvailability {
  // 1. Outside any active season?
  const inSeason = ctx.seasons.some(
    (s) => s.isActive && isWithin(iso, s.startDate, s.endDate)
  )
  if (!inSeason) return 'outside_season'

  // 2. Lead time
  const today = ctx.today ?? todayIso()
  const leadCutoff = addDays(today, ctx.leadDays)
  if (iso < leadCutoff) return 'lead_time'

  // 3. Blackouts or bookings
  for (const b of ctx.blackouts) {
    if (isWithin(iso, b.startDate, b.endDate)) return 'unavailable'
  }
  for (const r of ctx.bookedRanges) {
    if (isWithin(iso, r.startDate, r.endDate)) return 'unavailable'
  }

  return 'available'
}

/** Add N days to an ISO date (YYYY-MM-DD), returning a new ISO date. */
export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + days)
  return ymd(dt)
}

/**
 * Given a proposed start date, find the earliest date that is unavailable
 * at or after (start + MIN_NIGHTS). Used to disable the sub-range that would
 * break the no-fragmentation rule.
 */
export function firstBlockedAfter(
  start: string,
  ctx: AvailabilityContext,
  horizonDays = 365
): string | null {
  for (let i = 1; i <= horizonDays; i++) {
    const iso = addDays(start, i)
    const s = dayAvailability(iso, ctx)
    if (s !== 'available') return iso
  }
  return null
}

/** Is a proposed [start, end] range fully valid? */
export function isRangeValid(
  start: string,
  end: string,
  ctx: AvailabilityContext
): { valid: boolean; reason?: string } {
  if (end < start) return { valid: false, reason: 'End date is before start date' }
  const nights = nightsBetween(start, end)
  if (nights < MIN_NIGHTS) return { valid: false, reason: `Minimum stay is ${MIN_NIGHTS} nights` }

  // Check every day in the range
  for (let i = 0; i <= nights; i++) {
    const iso = addDays(start, i)
    const s = dayAvailability(iso, ctx)
    if (s !== 'available') {
      return { valid: false, reason: `${iso} is ${s.replace('_', ' ')}` }
    }
  }
  return { valid: true }
}

/** Nights between two ISO dates (end - start in days). */
export function nightsBetween(startIso: string, endIso: string): number {
  const [sy, sm, sd] = startIso.split('-').map(Number)
  const [ey, em, ed] = endIso.split('-').map(Number)
  const s = new Date(sy, sm - 1, sd).getTime()
  const e = new Date(ey, em - 1, ed).getTime()
  return Math.round((e - s) / (1000 * 60 * 60 * 24))
}

/** Human-readable range summary: "Sept 5 – Sept 12 · 7 nights" */
export function formatRangeSummary(startIso: string, endIso: string): string {
  const s = new Date(startIso + 'T00:00:00')
  const e = new Date(endIso + 'T00:00:00')
  const sameYear = s.getFullYear() === e.getFullYear()
  const sameMonth = sameYear && s.getMonth() === e.getMonth()
  const sFmt = s.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
  const eFmt = e.toLocaleDateString('en-US', {
    month: sameMonth ? undefined : 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const nights = nightsBetween(startIso, endIso)
  return `${sFmt} – ${eFmt} · ${nights} night${nights === 1 ? '' : 's'}`
}
