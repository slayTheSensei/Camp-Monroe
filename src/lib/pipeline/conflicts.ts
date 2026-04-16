// Date-range overlap detection for the Retreats Pipeline v2.
// All dates are ISO YYYY-MM-DD strings; string comparison is valid for this format.
// Per DL-007: no-overlap policy — every source of a conflict is a HARD BLOCK
// on confirming a booking (not just a visual warning). The admin UI surfaces
// conflicts; the confirm flow aborts if any are present.

import { createSupabaseServer } from '@/lib/supabase-server'

export type ConflictSource = 'booking' | 'host_hold' | 'buyout_hold' | 'blackout'

export type Conflict = {
  source: ConflictSource
  id: string
  startDate: string
  endDate: string
  label: string
}

/** Pure interval-overlap check (inclusive). */
export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return !(aEnd < bStart || bEnd < aStart)
}

export type DetectConflictsOptions = {
  excludeInquiry?: { type: 'host' | 'buyout'; id: string }
  excludeBookingId?: string
}

/**
 * Detect overlapping confirmed bookings, host holds, buyout holds, and blackouts
 * in the given window. Pass `excludeInquiry` when editing an inquiry so it
 * doesn't flag against itself.
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
      label: `Confirmed ${b.inquiry_type === 'host' ? 'Retreat' : 'Buyout'}`,
    })
  }

  // Host holds
  const { data: hostHolds } = await supabase
    .from('host_inquiries')
    .select('id, start_date, end_date, name, organization')
    .eq('status', 'hold')
    .lte('start_date', endDate)
    .gte('end_date', startDate)
  for (const h of hostHolds ?? []) {
    if (opts.excludeInquiry?.type === 'host' && opts.excludeInquiry.id === h.id) continue
    conflicts.push({
      source: 'host_hold',
      id: h.id,
      startDate: h.start_date,
      endDate: h.end_date,
      label: `Host hold — ${h.organization || h.name}`,
    })
  }

  // Buyout holds
  const { data: buyoutHolds } = await supabase
    .from('buyout_inquiries')
    .select('id, start_date, end_date, name')
    .eq('status', 'hold')
    .lte('start_date', endDate)
    .gte('end_date', startDate)
  for (const b of buyoutHolds ?? []) {
    if (opts.excludeInquiry?.type === 'buyout' && opts.excludeInquiry.id === b.id) continue
    conflicts.push({
      source: 'buyout_hold',
      id: b.id,
      startDate: b.start_date,
      endDate: b.end_date,
      label: `Buyout hold — ${b.name}`,
    })
  }

  // Blackouts (internal events, member buyouts, other)
  const { data: blackouts } = await supabase
    .from('blackouts')
    .select('id, start_date, end_date, category, label')
    .lte('start_date', endDate)
    .gte('end_date', startDate)
  for (const bl of blackouts ?? []) {
    conflicts.push({
      source: 'blackout',
      id: bl.id,
      startDate: bl.start_date,
      endDate: bl.end_date,
      label: `Blackout — ${bl.label}`,
    })
  }

  return conflicts
}
