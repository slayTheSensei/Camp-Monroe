// Date-range overlap detection for the Retreats Pipeline.
// All dates are ISO YYYY-MM-DD strings; string comparison is valid for this format.

import { createSupabaseServer } from '@/lib/supabase-server'

export type ConflictSource = 'booking' | 'host_hold' | 'str_hold'

export type Conflict = {
  source: ConflictSource
  id: string
  startDate: string
  endDate: string
  label: string
}

/** Pure interval-overlap check: inclusive dates overlap when neither ends before the other starts. */
export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return !(aEnd < bStart || bEnd < aStart)
}

export type DetectConflictsOptions = {
  excludeInquiry?: { type: 'host' | 'str'; id: string }
  excludeBookingId?: string
}

/**
 * Detect overlapping confirmed bookings, host holds, and STR holds in the
 * given window. Pass `excludeInquiry` when editing an inquiry so it doesn't
 * flag against itself.
 */
export async function detectConflicts(
  startDate: string,
  endDate: string,
  opts: DetectConflictsOptions = {}
): Promise<Conflict[]> {
  const supabase = await createSupabaseServer()
  const conflicts: Conflict[] = []

  // Bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, start_date, end_date, inquiry_type, inquiry_id')
    .lte('start_date', endDate)
    .gte('end_date', startDate)
  for (const b of bookings ?? []) {
    if (opts.excludeBookingId && b.id === opts.excludeBookingId) continue
    conflicts.push({
      source: 'booking',
      id: b.id,
      startDate: b.start_date,
      endDate: b.end_date,
      label: `Confirmed ${b.inquiry_type === 'host' ? 'Retreat' : 'STR'}`,
    })
  }

  // Host holds
  const { data: hostHolds } = await supabase
    .from('host_inquiries')
    .select('id, pref_start_1, pref_end_1, name, organization')
    .eq('status', 'hold')
    .lte('pref_start_1', endDate)
    .gte('pref_end_1', startDate)
  for (const h of hostHolds ?? []) {
    if (opts.excludeInquiry?.type === 'host' && opts.excludeInquiry.id === h.id) continue
    conflicts.push({
      source: 'host_hold',
      id: h.id,
      startDate: h.pref_start_1,
      endDate: h.pref_end_1,
      label: `Host hold — ${h.organization || h.name}`,
    })
  }

  // STR holds
  const { data: strHolds } = await supabase
    .from('str_inquiries')
    .select('id, start_date, end_date, name')
    .eq('status', 'hold')
    .lte('start_date', endDate)
    .gte('end_date', startDate)
  for (const s of strHolds ?? []) {
    if (opts.excludeInquiry?.type === 'str' && opts.excludeInquiry.id === s.id) continue
    conflicts.push({
      source: 'str_hold',
      id: s.id,
      startDate: s.start_date,
      endDate: s.end_date,
      label: `STR hold — ${s.name}`,
    })
  }

  return conflicts
}
