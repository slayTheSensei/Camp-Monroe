import { createSupabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import type {
  HostInquiry,
  StrInquiry,
  OpenWindow,
  Booking,
  Communication,
  InquiryType,
  InquiryStatus,
  BookedRange,
} from '@/lib/types/retreats'

/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================================================
// mapRow helpers (snake_case -> camelCase)
// ============================================================================

function mapOpenWindow(row: any): OpenWindow {
  return {
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    windowType: row.window_type,
    label: row.label,
    description: row.description ?? null,
    isPublic: row.is_public,
    sortOrder: row.sort_order,
    notes: row.notes ?? null,
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
    groupSizeBucket: row.group_size_bucket ?? null,
    prefStart1: row.pref_start_1,
    prefEnd1: row.pref_end_1,
    prefStart2: row.pref_start_2 ?? null,
    prefEnd2: row.pref_end_2 ?? null,
    prefStart3: row.pref_start_3 ?? null,
    prefEnd3: row.pref_end_3 ?? null,
    flexibility: row.flexibility ?? null,
    supportNeeds: row.support_needs ?? [],
    additionalNotes: row.additional_notes ?? null,
    status: row.status,
    priorityScore: row.priority_score ?? null,
    assignedOwner: row.assigned_owner ?? null,
    adminNotes: row.admin_notes ?? null,
    holdExpiresAt: row.hold_expires_at ?? null,
    linkedOpenWindowId: row.linked_open_window_id ?? null,
    createdAt: row.created_at,
  }
}

function mapStrInquiry(row: any): StrInquiry {
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
    linkedOpenWindowId: row.linked_open_window_id ?? null,
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
// Public anon client (for generateStaticParams / public pages that don't need cookies)
// ============================================================================

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ============================================================================
// Open Windows
// ============================================================================

export async function getOpenWindows(): Promise<OpenWindow[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('open_windows')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: true })
  if (error) {
    console.error('getOpenWindows:', error)
    return []
  }
  return (data ?? []).map(mapOpenWindow)
}

export async function getOpenWindowById(id: string): Promise<OpenWindow | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.from('open_windows').select('*').eq('id', id).maybeSingle()
  if (error || !data) return null
  return mapOpenWindow(data)
}

/** Public-page query: only public windows, filtered by type. Uses anon client so it works without cookies. */
export async function getPublicOpenWindows(kind: 'host' | 'str'): Promise<OpenWindow[]> {
  const supabase = anonClient()
  // Include both matching type AND 'both'
  const { data, error } = await supabase
    .from('open_windows')
    .select('*')
    .eq('is_public', true)
    .in('window_type', [kind, 'both'])
    .gte('end_date', new Date().toISOString().slice(0, 10))
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: true })
  if (error) {
    console.error('getPublicOpenWindows:', error)
    return []
  }
  return (data ?? []).map(mapOpenWindow)
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

export async function getStrInquiries(filters: InquiryFilters = {}): Promise<StrInquiry[]> {
  const supabase = await createSupabaseServer()
  let q = supabase.from('str_inquiries').select('*').order('submitted_at', { ascending: false })
  if (filters.status && filters.status !== 'all') q = q.eq('status', filters.status)
  const { data, error } = await q
  if (error) {
    console.error('getStrInquiries:', error)
    return []
  }
  let rows = (data ?? []).map(mapStrInquiry)
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

export async function getStrInquiry(id: string): Promise<StrInquiry | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.from('str_inquiries').select('*').eq('id', id).maybeSingle()
  if (error || !data) return null
  return mapStrInquiry(data)
}

export async function getInquiry(type: InquiryType, id: string) {
  return type === 'host' ? getHostInquiry(id) : getStrInquiry(id)
}

export async function getInquiryCounts(): Promise<Record<InquiryStatus, number>> {
  const supabase = await createSupabaseServer()
  const [host, str] = await Promise.all([
    supabase.from('host_inquiries').select('status'),
    supabase.from('str_inquiries').select('status'),
  ])
  const counts: Record<InquiryStatus, number> = {
    new: 0,
    reviewing: 0,
    hold: 0,
    confirmed: 0,
    declined: 0,
  }
  for (const row of host.data ?? []) counts[row.status as InquiryStatus]++
  for (const row of str.data ?? []) counts[row.status as InquiryStatus]++
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

/** Publicly-safe booked-range query: selects only start_date + end_date + inquiry_type. */
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

// ============================================================================
// Admin user directory (for assigned_owner dropdown)
// ============================================================================

export async function getAdminUserOptions(): Promise<{ id: string; email: string }[]> {
  // Reads from a SECURITY DEFINER-safe pattern: use service role if available, else skip.
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

// Exported for reuse by server actions
export const _mappers = {
  mapOpenWindow,
  mapHostInquiry,
  mapStrInquiry,
  mapBooking,
  mapCommunication,
}
