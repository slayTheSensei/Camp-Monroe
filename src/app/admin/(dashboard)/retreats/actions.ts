'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServer } from '@/lib/supabase-server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { computeHoldExpiry } from '@/lib/pipeline/holds'
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
  return type === 'host' ? 'host_inquiries' : 'str_inquiries'
}

/** Allowlist of safe fields per inquiry type. Gates arbitrary column updates. */
const ALLOWED_FIELDS: Record<InquiryType, string[]> = {
  host: [
    'status',
    'priority_score',
    'assigned_owner',
    'admin_notes',
    'hold_expires_at',
    'linked_open_window_id',
  ],
  str: [
    'status',
    'admin_notes',
    'hold_expires_at',
    'linked_open_window_id',
  ],
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

    // Resolve the dates we're holding for the email body
    const startDate =
      type === 'host'
        ? // @ts-expect-error: union narrows at runtime
          inquiry.prefStart1
        : // @ts-expect-error: union narrows at runtime
          inquiry.startDate
    const endDate =
      type === 'host'
        ? // @ts-expect-error: union narrows at runtime
          inquiry.prefEnd1
        : // @ts-expect-error: union narrows at runtime
          inquiry.endDate

    await sendHoldNotice(type, inquiry, startDate, endDate, holdExpiresAt, user.id)
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
): Promise<{ error?: string; bookingId?: string }> {
  try {
    const user = await requireAuthUser()
    const inquiry = await getInquiry(type, id)
    if (!inquiry) return { error: 'Inquiry not found' }
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

    // 3. Generate + upload PDF; non-fatal if it fails
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

    // 4. Send confirmation email + insert communications row (email helper logs it)
    await sendConfirmation(type, inquiry, booking, pdfUrl, user.id)

    revalidatePath(`/admin/retreats/${type}/${id}`)
    revalidatePath('/admin/retreats')
    revalidatePath('/admin/retreats/calendar')
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
    await admin
      .from(tableFor(type))
      .update({ status: 'reviewing' })
      .eq('id', inquiryId)
    revalidatePath(`/admin/retreats/${type}/${inquiryId}`)
    revalidatePath('/admin/retreats')
    revalidatePath('/admin/retreats/calendar')
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
// Open Windows CRUD
// ============================================================================

export type OpenWindowInput = {
  startDate: string
  endDate: string
  windowType: 'host' | 'str' | 'both'
  label: string
  description?: string | null
  isPublic: boolean
  sortOrder: number
  notes?: string | null
}

export async function createOpenWindow(input: OpenWindowInput): Promise<{ error?: string; id?: string }> {
  try {
    const user = await requireAuthUser()
    const admin = createSupabaseAdmin()
    const { data, error } = await admin
      .from('open_windows')
      .insert({
        start_date: input.startDate,
        end_date: input.endDate,
        window_type: input.windowType,
        label: input.label,
        description: input.description ?? null,
        is_public: input.isPublic,
        sort_order: input.sortOrder,
        notes: input.notes ?? null,
        created_by: user.id,
      })
      .select('id')
      .single()
    if (error || !data) return { error: error?.message ?? 'Insert failed' }
    revalidatePath('/admin/retreats/open-windows')
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return { id: data.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'create failed' }
  }
}

export async function updateOpenWindow(
  id: string,
  input: Partial<OpenWindowInput>
): Promise<{ error?: string }> {
  try {
    await requireAuthUser()
    const admin = createSupabaseAdmin()
    const row: Record<string, unknown> = {}
    if (input.startDate !== undefined) row.start_date = input.startDate
    if (input.endDate !== undefined) row.end_date = input.endDate
    if (input.windowType !== undefined) row.window_type = input.windowType
    if (input.label !== undefined) row.label = input.label
    if (input.description !== undefined) row.description = input.description
    if (input.isPublic !== undefined) row.is_public = input.isPublic
    if (input.sortOrder !== undefined) row.sort_order = input.sortOrder
    if (input.notes !== undefined) row.notes = input.notes

    const { error } = await admin.from('open_windows').update(row).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/retreats/open-windows')
    revalidatePath(`/admin/retreats/open-windows/${id}`)
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'update failed' }
  }
}

export async function deleteOpenWindow(id: string): Promise<{ error?: string }> {
  try {
    await requireAuthUser()
    const admin = createSupabaseAdmin()
    const { error } = await admin.from('open_windows').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/retreats/open-windows')
    revalidatePath('/host-a-retreat')
    revalidatePath('/stay-at-camp')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'delete failed' }
  }
}

// Convenience: pure status changes via allowlist
export async function setStatus(
  type: InquiryType,
  id: string,
  status: InquiryStatus
): Promise<{ error?: string }> {
  return updateInquiryField(type, id, 'status', status)
}
