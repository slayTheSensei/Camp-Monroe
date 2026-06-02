/**
 * Public inquiries data layer — membership requests + partner inquiries.
 *
 * Scope: these are the two non-retreat public forms. Retreat inquiries
 * (host_inquiries, buyout_inquiries) live in ./retreats.ts. See
 * ../types/inquiries.ts for the naming-scope explanation.
 */
import { createSupabaseServer } from '@/lib/supabase-server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import type { InquiryStatus } from '@/lib/types/retreats'
import type {
  MembershipRequest,
  PartnerInquiry,
  MembershipChapter,
  PartnerContext,
} from '@/lib/types/inquiries'

/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================================================
// mapRow helpers
// ============================================================================

function mapMembershipRequest(row: any): MembershipRequest {
  return {
    id: row.id,
    submittedAt: row.submitted_at,
    name: row.name,
    email: row.email,
    chapter: row.chapter ?? null,
    hasSponsor: row.has_sponsor ?? false,
    sponsorName: row.sponsor_name ?? null,
    note: row.note ?? null,
    status: row.status,
    priorityScore: row.priority_score ?? null,
    assignedOwner: row.assigned_owner ?? null,
    adminNotes: row.admin_notes ?? null,
    holdExpiresAt: row.hold_expires_at ?? null,
    createdAt: row.created_at,
  }
}

function mapPartnerInquiry(row: any): PartnerInquiry {
  return {
    id: row.id,
    submittedAt: row.submitted_at,
    name: row.name,
    organization: row.organization ?? null,
    email: row.email,
    context: row.context ?? null,
    message: row.message ?? null,
    status: row.status,
    priorityScore: row.priority_score ?? null,
    assignedOwner: row.assigned_owner ?? null,
    adminNotes: row.admin_notes ?? null,
    holdExpiresAt: row.hold_expires_at ?? null,
    createdAt: row.created_at,
  }
}

// ============================================================================
// Filters
// ============================================================================

export type InquiryFilters = {
  status?: InquiryStatus | 'all'
  search?: string
}

const ZERO_COUNTS: Record<InquiryStatus, number> = {
  new: 0,
  reviewing: 0,
  hold: 0,
  confirmed: 0,
  declined: 0,
}

// ============================================================================
// Membership requests
// ============================================================================

export async function getMembershipRequests(
  filters: InquiryFilters = {}
): Promise<MembershipRequest[]> {
  const supabase = await createSupabaseServer()
  let q = supabase
    .from('membership_requests')
    .select('*')
    .order('submitted_at', { ascending: false })
  if (filters.status && filters.status !== 'all') q = q.eq('status', filters.status)
  const { data, error } = await q
  if (error) {
    console.error('getMembershipRequests:', error)
    return []
  }
  let rows = (data ?? []).map(mapMembershipRequest)
  if (filters.search) {
    const s = filters.search.toLowerCase()
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        (r.sponsorName ?? '').toLowerCase().includes(s)
    )
  }
  return rows
}

export async function getMembershipRequest(
  id: string
): Promise<MembershipRequest | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('membership_requests')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return null
  return mapMembershipRequest(data)
}

export async function getMembershipRequestCounts(): Promise<
  Record<InquiryStatus, number>
> {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.from('membership_requests').select('status')
  const counts: Record<InquiryStatus, number> = { ...ZERO_COUNTS }
  for (const row of data ?? []) counts[row.status as InquiryStatus]++
  return counts
}

// ============================================================================
// Partner inquiries
// ============================================================================

export async function getPartnerInquiries(
  filters: InquiryFilters = {}
): Promise<PartnerInquiry[]> {
  const supabase = await createSupabaseServer()
  let q = supabase
    .from('partner_inquiries')
    .select('*')
    .order('submitted_at', { ascending: false })
  if (filters.status && filters.status !== 'all') q = q.eq('status', filters.status)
  const { data, error } = await q
  if (error) {
    console.error('getPartnerInquiries:', error)
    return []
  }
  let rows = (data ?? []).map(mapPartnerInquiry)
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

export async function getPartnerInquiry(
  id: string
): Promise<PartnerInquiry | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('partner_inquiries')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return null
  return mapPartnerInquiry(data)
}

export async function getPartnerInquiryCounts(): Promise<
  Record<InquiryStatus, number>
> {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.from('partner_inquiries').select('status')
  const counts: Record<InquiryStatus, number> = { ...ZERO_COUNTS }
  for (const row of data ?? []) counts[row.status as InquiryStatus]++
  return counts
}

// ============================================================================
// Admin-side inserts (called from server actions on /request and /partner)
// ============================================================================

export async function insertMembershipRequest(input: {
  name: string
  email: string
  chapter: MembershipChapter | null
  hasSponsor: boolean
  sponsorName: string | null
  note: string | null
}): Promise<{ id: string } | { error: string }> {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('membership_requests')
    .insert({
      name: input.name,
      email: input.email,
      chapter: input.chapter,
      has_sponsor: input.hasSponsor,
      sponsor_name: input.sponsorName,
      note: input.note,
      status: 'new',
    })
    .select('id')
    .maybeSingle()
  if (error || !data) {
    console.error('insertMembershipRequest:', error)
    return { error: 'Failed to record request.' }
  }
  return { id: data.id }
}

export async function insertPartnerInquiry(input: {
  name: string
  organization: string | null
  email: string
  context: PartnerContext | null
  message: string | null
}): Promise<{ id: string } | { error: string }> {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('partner_inquiries')
    .insert({
      name: input.name,
      organization: input.organization,
      email: input.email,
      context: input.context,
      message: input.message,
      status: 'new',
    })
    .select('id')
    .maybeSingle()
  if (error || !data) {
    console.error('insertPartnerInquiry:', error)
    return { error: 'Failed to record inquiry.' }
  }
  return { id: data.id }
}

// ============================================================================
// Admin-side mutations (used by triage page server actions)
// ============================================================================

export type InquiryUpdate = {
  status?: InquiryStatus
  adminNotes?: string | null
  assignedOwner?: string | null
  priorityScore?: number | null
}

function toDbUpdate(u: InquiryUpdate) {
  const out: Record<string, unknown> = {}
  if (u.status !== undefined) out.status = u.status
  if (u.adminNotes !== undefined) out.admin_notes = u.adminNotes
  if (u.assignedOwner !== undefined) out.assigned_owner = u.assignedOwner
  if (u.priorityScore !== undefined) out.priority_score = u.priorityScore
  return out
}

export async function updateMembershipRequest(
  id: string,
  update: InquiryUpdate
): Promise<{ error?: string }> {
  const supabase = createSupabaseAdmin()
  const { error } = await supabase
    .from('membership_requests')
    .update(toDbUpdate(update))
    .eq('id', id)
  if (error) {
    console.error('updateMembershipRequest:', error)
    return { error: 'Could not save changes.' }
  }
  return {}
}

export async function updatePartnerInquiry(
  id: string,
  update: InquiryUpdate
): Promise<{ error?: string }> {
  const supabase = createSupabaseAdmin()
  const { error } = await supabase
    .from('partner_inquiries')
    .update(toDbUpdate(update))
    .eq('id', id)
  if (error) {
    console.error('updatePartnerInquiry:', error)
    return { error: 'Could not save changes.' }
  }
  return {}
}
