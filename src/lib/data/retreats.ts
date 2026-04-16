import { createSupabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import type {
  HostInquiry,
  BuyoutInquiry,
  Season,
  Blackout,
  PublicBlackout,
  Booking,
  Communication,
  InquiryType,
  InquiryStatus,
  BookedRange,
} from '@/lib/types/retreats'

/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================================================
// mapRow helpers
// ============================================================================

function mapSeason(row: any): Season {
  return {
    id: row.id,
    label: row.label,
    startDate: row.start_date,
    endDate: row.end_date,
    isActive: row.is_active,
    createdAt: row.created_at,
    createdBy: row.created_by ?? null,
  }
}

function mapBlackout(row: any): Blackout {
  return {
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    category: row.category,
    label: row.label,
    adminNotes: row.admin_notes ?? null,
    createdAt: row.created_at,
    createdBy: row.created_by ?? null,
  }
}

function mapHostInquiry(row: any): HostInquiry {
  return {
    id: row.id,
    submittedAt: row.submitted_at,
    name: row.name,
    organization: row.organization ?? null,
    email: row.email,
    phone: row.phone ?? null,
    retreatConcept: row.retreat_concept,
    audienceType: row.audience_type ?? null,
    groupSize: row.group_size ?? null,
    startDate: row.start_date,
    endDate: row.end_date,
    supportNeeds: row.support_needs ?? [],
    additionalNotes: row.additional_notes ?? null,
    status: row.status,
    priorityScore: row.priority_score ?? null,
    assignedOwner: row.assigned_owner ?? null,
    adminNotes: row.admin_notes ?? null,
    holdExpiresAt: row.hold_expires_at ?? null,
    createdAt: row.created_at,
  }
}

function mapBuyoutInquiry(row: any): BuyoutInquiry {
  return {
    id: row.id,
    submittedAt: row.submitted_at,
    name: row.name,
    email: row.email,
    startDate: row.start_date,
    endDate: row.end_date,
    partySize: row.party_size ?? null,
    purposeOfStay: row.purpose_of_stay ?? null,
    affiliation: row.affiliation ?? null,
    additionalNotes: row.additional_notes ?? null,
    status: row.status,
    adminNotes: row.admin_notes ?? null,
    holdExpiresAt: row.hold_expires_at ?? null,
    createdAt: row.created_at,
  }
}

function mapBooking(row: any): Booking {
  return {
    id: row.id,
    inquiryId: row.inquiry_id,
    inquiryType: row.inquiry_type,
    startDate: row.start_date,
    endDate: row.end_date,
    groupSize: row.group_size ?? null,
    notes: row.notes ?? null,
    pdfStoragePath: row.pdf_storage_path ?? null,
    confirmedAt: row.confirmed_at,
    confirmedBy: row.confirmed_by ?? null,
    createdAt: row.created_at,
  }
}

function mapCommunication(row: any): Communication {
  return {
    id: row.id,
    inquiryId: row.inquiry_id,
    inquiryType: row.inquiry_type,
    kind: row.kind,
    sentAt: row.sent_at,
    sentBy: row.sent_by ?? null,
    subject: row.subject ?? null,
    bodyPreview: row.body_preview ?? null,
    resendMessageId: row.resend_message_id ?? null,
    createdAt: row.created_at,
  }
}

// ============================================================================
// Public anon client (no cookies, build-safe)
// ============================================================================

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ============================================================================
// Seasons
// ============================================================================

export async function getSeasons(): Promise<Season[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .order('start_date', { ascending: true })
  if (error) {
    console.error('getSeasons:', error)
    return []
  }
  return (data ?? []).map(mapSeason)
}

export async function getSeasonById(id: string): Promise<Season | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.from('seasons').select('*').eq('id', id).maybeSingle()
  if (error || !data) return null
  return mapSeason(data)
}

/** Public: active seasons only. */
export async function getActiveSeasons(): Promise<Season[]> {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('is_active', true)
    .order('start_date', { ascending: true })
  if (error) {
    console.error('getActiveSeasons:', error)
    return []
  }
  return (data ?? []).map(mapSeason)
}

// ============================================================================
// Blackouts
// ============================================================================

export async function getBlackouts(): Promise<Blackout[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('blackouts')
    .select('*')
    .order('start_date', { ascending: true })
  if (error) {
    console.error('getBlackouts:', error)
    return []
  }
  return (data ?? []).map(mapBlackout)
}

export async function getBlackoutById(id: string): Promise<Blackout | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.from('blackouts').select('*').eq('id', id).maybeSingle()
  if (error || !data) return null
  return mapBlackout(data)
}

/** Public: expose only dates + label (no admin_notes, no category detail). */
export async function getPublicBlackouts(
  fromDate?: string,
  toDate?: string
): Promise<PublicBlackout[]> {
  const supabase = anonClient()
  let q = supabase.from('blackouts').select('start_date, end_date, label')
  if (fromDate) q = q.gte('end_date', fromDate)
  if (toDate) q = q.lte('start_date', toDate)
  const { data, error } = await q.order('start_date', { ascending: true })
  if (error) {
    console.error('getPublicBlackouts:', error)
    return []
  }
  return (data ?? []).map((r: any) => ({
    startDate: r.start_date,
    endDate: r.end_date,
    label: r.label,
  }))
}

// ============================================================================
// Inquiries
// ============================================================================

export type InquiryFilters = {
  status?: InquiryStatus | 'all'
  search?: string
}

export async function getHostInquiries(filters: InquiryFilters = {}): Promise<HostInquiry[]> {
  const supabase = await createSupabaseServer()
  let q = supabase.from('host_inquiries').select('*').order('submitted_at', { ascending: false })
  if (filters.status && filters.status !== 'all') q = q.eq('status', filters.status)
  const { data, error } = await q
  if (error) {
    console.error('getHostInquiries:', error)
    return []
  }
  let rows = (data ?? []).map(mapHostInquiry)
  if (filters.search) {
    const s = filters.search.toLowerCase()
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        (r.organization ?? '').toLowerCase().includes(s)
    )
  }
  return rows
}

export async function getBuyoutInquiries(
  filters: InquiryFilters = {}
): Promise<BuyoutInquiry[]> {
  const supabase = await createSupabaseServer()
  let q = supabase.from('buyout_inquiries').select('*').order('submitted_at', { ascending: false })
  if (filters.status && filters.status !== 'all') q = q.eq('status', filters.status)
  const { data, error } = await q
  if (error) {
    console.error('getBuyoutInquiries:', error)
    return []
  }
  let rows = (data ?? []).map(mapBuyoutInquiry)
  if (filters.search) {
    const s = filters.search.toLowerCase()
    rows = rows.filter(
      (r) => r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s)
    )
  }
  return rows
}

export async function getHostInquiry(id: string): Promise<HostInquiry | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.from('host_inquiries').select('*').eq('id', id).maybeSingle()
  if (error || !data) return null
  return mapHostInquiry(data)
}

export async function getBuyoutInquiry(id: string): Promise<BuyoutInquiry | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.from('buyout_inquiries').select('*').eq('id', id).maybeSingle()
  if (error || !data) return null
  return mapBuyoutInquiry(data)
}

export async function getInquiry(type: InquiryType, id: string) {
  return type === 'host' ? getHostInquiry(id) : getBuyoutInquiry(id)
}

export async function getInquiryCounts(): Promise<Record<InquiryStatus, number>> {
  const supabase = await createSupabaseServer()
  const [host, buyout] = await Promise.all([
    supabase.from('host_inquiries').select('status'),
    supabase.from('buyout_inquiries').select('status'),
  ])
  const counts: Record<InquiryStatus, number> = {
    new: 0,
    reviewing: 0,
    hold: 0,
    confirmed: 0,
    declined: 0,
  }
  for (const row of host.data ?? []) counts[row.status as InquiryStatus]++
  for (const row of buyout.data ?? []) counts[row.status as InquiryStatus]++
  return counts
}

// ============================================================================
// Bookings
// ============================================================================

export async function getBookings(): Promise<Booking[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('start_date', { ascending: true })
  if (error) {
    console.error('getBookings:', error)
    return []
  }
  return (data ?? []).map(mapBooking)
}

export async function getBookingForInquiry(
  type: InquiryType,
  inquiryId: string
): Promise<Booking | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('inquiry_type', type)
    .eq('inquiry_id', inquiryId)
    .maybeSingle()
  if (error || !data) return null
  return mapBooking(data)
}

/** Public: only start_date/end_date/inquiry_type, never admin-visible columns. */
export async function getBookedRanges(fromDate?: string, toDate?: string): Promise<BookedRange[]> {
  const supabase = anonClient()
  let q = supabase.from('bookings').select('start_date, end_date, inquiry_type')
  if (fromDate) q = q.gte('end_date', fromDate)
  if (toDate) q = q.lte('start_date', toDate)
  const { data, error } = await q
  if (error) {
    console.error('getBookedRanges:', error)
    return []
  }
  return (data ?? []).map((r: any) => ({
    startDate: r.start_date,
    endDate: r.end_date,
    inquiryType: r.inquiry_type,
  }))
}

// ============================================================================
// Communications
// ============================================================================

export async function getCommunications(
  type: InquiryType,
  inquiryId: string
): Promise<Communication[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('communications')
    .select('*')
    .eq('inquiry_type', type)
    .eq('inquiry_id', inquiryId)
    .order('sent_at', { ascending: false })
  if (error) {
    console.error('getCommunications:', error)
    return []
  }
  return (data ?? []).map(mapCommunication)
}

/** Count of confirmed bookings starting between now and `daysAhead`. */
export async function getUpcomingBookingsCount(daysAhead: number = 90): Promise<number> {
  const supabase = await createSupabaseServer()
  const today = new Date().toISOString().slice(0, 10)
  const horizon = new Date()
  horizon.setDate(horizon.getDate() + daysAhead)
  const horizonIso = horizon.toISOString().slice(0, 10)
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .gte('start_date', today)
    .lte('start_date', horizonIso)
  return count ?? 0
}

/** Count of active blackouts (overlapping today or in the future). */
export async function getActiveBlackoutsCount(): Promise<number> {
  const supabase = await createSupabaseServer()
  const today = new Date().toISOString().slice(0, 10)
  const { count } = await supabase
    .from('blackouts')
    .select('*', { count: 'exact', head: true })
    .gte('end_date', today)
  return count ?? 0
}

// ============================================================================
// Admin user directory
// ============================================================================

export async function getAdminUserOptions(): Promise<{ id: string; email: string }[]> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return []
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 })
  if (error || !data) return []
  return data.users.map((u) => ({ id: u.id, email: u.email ?? '' }))
}

// Exported mappers for action layer use
export const _mappers = {
  mapSeason,
  mapBlackout,
  mapHostInquiry,
  mapBuyoutInquiry,
  mapBooking,
  mapCommunication,
}
