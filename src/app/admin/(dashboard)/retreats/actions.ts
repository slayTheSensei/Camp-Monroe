'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServer } from '@/lib/supabase-server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { computeHoldExpiry } from '@/lib/pipeline/holds'
import { detectConflicts } from '@/lib/pipeline/conflicts'
import {
  sendHoldNotice,
  sendConfirmation,
  sendDecline,
  sendManualEmail,
  logManualNote,
} from '@/lib/email/send'
import { generateBookingPDF, uploadBookingPDF, getBookingPDFSignedUrl } from '@/lib/pdf/generate'
import { getInquiry, _mappers } from '@/lib/data/retreats'
import type {
  InquiryType,
  InquiryStatus,
  CommunicationKind,
  Booking,
  BlackoutCategory,
} from '@/lib/types/retreats'

async function requireAuthUser() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user
}

function tableFor(type: InquiryType) {
  return type === 'host' ? 'host_inquiries' : 'buyout_inquiries'
}

/** Allowlist of safe fields per inquiry type. */
const ALLOWED_FIELDS: Record<InquiryType, string[]> = {
  host: [
    'status',
    'priority_score',
    'assigned_owner',
    'admin_notes',
    'hold_expires_at',
  ],
  buyout: ['status', 'admin_notes', 'hold_expires_at'],
}

export async function updateInquiryField(
  type: InquiryType,
  id: string,
  field: string,
  value: unknown
): Promise<{ error?: string }> {
  try {
    await requireAuthUser()
    if (!ALLOWED_FIELDS[type].includes(field)) {
      return { error: `Field ${field} not updatable` }
    }
    const admin = createSupabaseAdmin()
    const { error } = await admin
      .from(tableFor(type))
      .update({ [field]: value })
      .eq('id', id)
    if (error) return { error: error.message }
    revalidatePath(`/admin/retreats/${type}/${id}`)
    revalidatePath('/admin/retreats')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'update failed' }
  }
}

export async function placeHold(
  type: InquiryType,
  id: string,
  days: number = 7
): Promise<{ error?: string; holdExpiresAt?: string }> {
  try {
    const user = await requireAuthUser()
    const inquiry = await getInquiry(type, id)
    if (!inquiry) return { error: 'Inquiry not found' }
    const holdExpiresAt = computeHoldExpiry(days)
    const admin = createSupabaseAdmin()
    const { error } = await admin
      .from(tableFor(type))
      .update({ status: 'hold', hold_expires_at: holdExpiresAt })
      .eq('id', id)
    if (error) return { error: error.message }

    await sendHoldNotice(
      type,
      inquiry,
      inquiry.startDate,
      inquiry.endDate,
      holdExpiresAt,
      user.id
    )
    revalidatePath(`/admin/retreats/${type}/${id}`)
    revalidatePath('/admin/retreats')
    return { holdExpiresAt }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'place hold failed' }
  }
}

export async function releaseHold(type: InquiryType, id: string): Promise<{ error?: string }> {
  try {
    await requireAuthUser()
    const admin = createSupabaseAdmin()
    const { error } = await admin
      .from(tableFor(type))
      .update({ status: 'reviewing', hold_expires_at: null })
      .eq('id', id)
    if (error) return { error: error.message }
    revalidatePath(`/admin/retreats/${type}/${id}`)
    revalidatePath('/admin/retreats')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'release hold failed' }
  }
}

export type ConfirmBookingPayload = {
  startDate: string
  endDate: string
  groupSize?: number | null
  notes?: string | null
}

export async function confirmBooking(
  type: InquiryType,
  id: string,
  payload: ConfirmBookingPayload
): Promise<{ error?: string; bookingId?: string; conflicts?: string[] }> {
  try {
    const user = await requireAuthUser()
    const inquiry = await getInquiry(type, id)
    if (!inquiry) return { error: 'Inquiry not found' }

    // Hard-block on any conflict (DL-007 — no overlap allowed)
    const conflicts = await detectConflicts(payload.startDate, payload.endDate, {
      excludeInquiry: { type, id },
    })
    if (conflicts.length > 0) {
      return {
        error: 'Cannot confirm — conflicts exist on these dates',
        conflicts: conflicts.map((c) => c.label),
      }
    }

    const admin = createSupabaseAdmin()

    // 1. Insert booking
    const { data: bookingRow, error: bookingErr } = await admin
      .from('bookings')
      .insert({
        inquiry_id: id,
        inquiry_type: type,
        start_date: payload.startDate,
        end_date: payload.endDate,
        group_size: payload.groupSize ?? null,
        notes: payload.notes ?? null,
        confirmed_by: user.id,
      })
      .select('*')
      .single()
    if (bookingErr || !bookingRow) return { error: bookingErr?.message ?? 'Booking insert failed' }

    const booking: Booking = _mappers.mapBooking(bookingRow)

    // 2. Update inquiry status
    await admin
      .from(tableFor(type))
      .update({ status: 'confirmed', hold_expires_at: null })
      .eq('id', id)

    // 3. PDF (non-fatal)
    let pdfUrl: string | null = null
    try {
      const buf = await generateBookingPDF(booking, inquiry, type)
      const path = await uploadBookingPDF(booking.id, buf)
      await admin.from('bookings').update({ pdf_storage_path: path }).eq('id', booking.id)
      booking.pdfStoragePath = path
      pdfUrl = await getBookingPDFSignedUrl(path)
    } catch (e) {
      console.error('PDF generation/upload failed (non-fatal):', e)
    }

    // 4. Confirmation email + communications row
    await sendConfirmation(type, inquiry, booking, pdfUrl, user.id)

    revalidatePath(`/admin/retreats/${type}/${id}`)
    revalidatePath('/admin/retreats')
    revalidatePath('/admin/retreats/calendar')
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return { bookingId: booking.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'confirm failed' }
  }
}

export async function declineInquiry(
  type: InquiryType,
  id: string,
  reason: string
): Promise<{ error?: string }> {
  try {
    const user = await requireAuthUser()
    const inquiry = await getInquiry(type, id)
    if (!inquiry) return { error: 'Inquiry not found' }
    const admin = createSupabaseAdmin()
    const { error } = await admin
      .from(tableFor(type))
      .update({ status: 'declined', hold_expires_at: null })
      .eq('id', id)
    if (error) return { error: error.message }
    await sendDecline(type, inquiry, reason, user.id)
    revalidatePath(`/admin/retreats/${type}/${id}`)
    revalidatePath('/admin/retreats')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'decline failed' }
  }
}

export async function reopenInquiry(type: InquiryType, id: string): Promise<{ error?: string }> {
  try {
    await requireAuthUser()
    const admin = createSupabaseAdmin()
    const { error } = await admin
      .from(tableFor(type))
      .update({ status: 'reviewing', hold_expires_at: null })
      .eq('id', id)
    if (error) return { error: error.message }
    revalidatePath(`/admin/retreats/${type}/${id}`)
    revalidatePath('/admin/retreats')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'reopen failed' }
  }
}

export async function cancelBooking(
  type: InquiryType,
  inquiryId: string
): Promise<{ error?: string }> {
  try {
    await requireAuthUser()
    const admin = createSupabaseAdmin()
    await admin
      .from('bookings')
      .delete()
      .eq('inquiry_type', type)
      .eq('inquiry_id', inquiryId)
    await admin.from(tableFor(type)).update({ status: 'reviewing' }).eq('id', inquiryId)
    revalidatePath(`/admin/retreats/${type}/${inquiryId}`)
    revalidatePath('/admin/retreats')
    revalidatePath('/admin/retreats/calendar')
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'cancel failed' }
  }
}

export async function sendCommunication(
  type: InquiryType,
  id: string,
  kind: CommunicationKind,
  subject: string,
  body: string
): Promise<{ error?: string; messageId?: string }> {
  try {
    const user = await requireAuthUser()
    if (kind === 'manual_note') {
      await logManualNote(type, id, subject, body, user.id)
      revalidatePath(`/admin/retreats/${type}/${id}`)
      return {}
    }
    const inquiry = await getInquiry(type, id)
    if (!inquiry) return { error: 'Inquiry not found' }
    const res = await sendManualEmail(type, inquiry, kind, subject, body, user.id)
    revalidatePath(`/admin/retreats/${type}/${id}`)
    return res
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'send failed' }
  }
}

// ============================================================================
// Seasons CRUD
// ============================================================================

export type SeasonInput = {
  label: string
  startDate: string
  endDate: string
  isActive: boolean
}

export async function createSeason(input: SeasonInput): Promise<{ error?: string; id?: string }> {
  try {
    const user = await requireAuthUser()
    const admin = createSupabaseAdmin()
    const { data, error } = await admin
      .from('seasons')
      .insert({
        label: input.label,
        start_date: input.startDate,
        end_date: input.endDate,
        is_active: input.isActive,
        created_by: user.id,
      })
      .select('id')
      .single()
    if (error || !data) return { error: error?.message ?? 'Insert failed' }
    revalidatePath('/admin/retreats/seasons')
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return { id: data.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'create failed' }
  }
}

export async function updateSeason(
  id: string,
  input: Partial<SeasonInput>
): Promise<{ error?: string }> {
  try {
    await requireAuthUser()
    const admin = createSupabaseAdmin()
    const row: Record<string, unknown> = {}
    if (input.label !== undefined) row.label = input.label
    if (input.startDate !== undefined) row.start_date = input.startDate
    if (input.endDate !== undefined) row.end_date = input.endDate
    if (input.isActive !== undefined) row.is_active = input.isActive
    const { error } = await admin.from('seasons').update(row).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/retreats/seasons')
    revalidatePath(`/admin/retreats/seasons/${id}`)
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'update failed' }
  }
}

export async function deleteSeason(id: string): Promise<{ error?: string }> {
  try {
    await requireAuthUser()
    const admin = createSupabaseAdmin()
    const { error } = await admin.from('seasons').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/retreats/seasons')
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'delete failed' }
  }
}

// ============================================================================
// Blackouts CRUD
// ============================================================================

export type BlackoutInput = {
  startDate: string
  endDate: string
  category: BlackoutCategory
  label: string
  adminNotes?: string | null
}

export async function createBlackout(
  input: BlackoutInput
): Promise<{ error?: string; id?: string }> {
  try {
    const user = await requireAuthUser()
    const admin = createSupabaseAdmin()
    const { data, error } = await admin
      .from('blackouts')
      .insert({
        start_date: input.startDate,
        end_date: input.endDate,
        category: input.category,
        label: input.label,
        admin_notes: input.adminNotes ?? null,
        created_by: user.id,
      })
      .select('id')
      .single()
    if (error || !data) return { error: error?.message ?? 'Insert failed' }
    revalidatePath('/admin/retreats/blackouts')
    revalidatePath('/admin/retreats/calendar')
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return { id: data.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'create failed' }
  }
}

export async function updateBlackout(
  id: string,
  input: Partial<BlackoutInput>
): Promise<{ error?: string }> {
  try {
    await requireAuthUser()
    const admin = createSupabaseAdmin()
    const row: Record<string, unknown> = {}
    if (input.startDate !== undefined) row.start_date = input.startDate
    if (input.endDate !== undefined) row.end_date = input.endDate
    if (input.category !== undefined) row.category = input.category
    if (input.label !== undefined) row.label = input.label
    if (input.adminNotes !== undefined) row.admin_notes = input.adminNotes
    const { error } = await admin.from('blackouts').update(row).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/retreats/blackouts')
    revalidatePath(`/admin/retreats/blackouts/${id}`)
    revalidatePath('/admin/retreats/calendar')
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'update failed' }
  }
}

export async function deleteBlackout(id: string): Promise<{ error?: string }> {
  try {
    await requireAuthUser()
    const admin = createSupabaseAdmin()
    const { error } = await admin.from('blackouts').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/retreats/blackouts')
    revalidatePath('/admin/retreats/calendar')
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'delete failed' }
  }
}

export async function setStatus(
  type: InquiryType,
  id: string,
  status: InquiryStatus
): Promise<{ error?: string }> {
  return updateInquiryField(type, id, 'status', status)
}
