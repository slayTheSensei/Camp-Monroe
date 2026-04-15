import { render } from '@react-email/render'
import { createElement } from 'react'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { getResend, getFromAddress, getAdminRecipients, getSiteUrl } from './resend'
import AcknowledgmentEmail from './templates/AcknowledgmentEmail'
import HoldEmail from './templates/HoldEmail'
import ConfirmationEmail from './templates/ConfirmationEmail'
import DeclineEmail from './templates/DeclineEmail'
import AdminAlertEmail from './templates/AdminAlertEmail'
import type { HostInquiry, StrInquiry, Booking, CommunicationKind, InquiryType } from '@/lib/types/retreats'

type SendResult = { messageId?: string; error?: string }

async function logCommunication(
  inquiryType: InquiryType,
  inquiryId: string,
  kind: CommunicationKind,
  subject: string,
  body: string,
  resendMessageId: string | null,
  sentBy: string | null = null
) {
  const supabase = createSupabaseAdmin()
  await supabase.from('communications').insert({
    inquiry_id: inquiryId,
    inquiry_type: inquiryType,
    kind,
    subject,
    body_preview: body.slice(0, 500),
    resend_message_id: resendMessageId,
    sent_by: sentBy,
  })
}

function bestName(inquiry: HostInquiry | StrInquiry) {
  return inquiry.name.split(/[\s,]/)[0] || inquiry.name
}

// ============================================================================
// Acknowledgment (sent on inquiry submit)
// ============================================================================

export async function sendAck(type: InquiryType, inquiry: HostInquiry | StrInquiry): Promise<SendResult> {
  try {
    const el = createElement(AcknowledgmentEmail, {
      recipientName: bestName(inquiry),
      inquiryKind: type,
    })
    const html = await render(el)
    const subject =
      type === 'host'
        ? 'We received your retreat inquiry — Camp Monroe'
        : 'Thanks for your stay request — Camp Monroe'
    const { data, error } = await getResend().emails.send({
      from: getFromAddress(),
      to: inquiry.email,
      subject,
      html,
    })
    if (error) return { error: error.message }
    await logCommunication(type, inquiry.id, 'ack_email', subject, 'Acknowledgment sent.', data?.id ?? null)
    return { messageId: data?.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'send failed' }
  }
}

// ============================================================================
// Admin alert (sent on inquiry submit)
// ============================================================================

export async function sendAdminAlert(
  type: InquiryType,
  inquiry: HostInquiry | StrInquiry
): Promise<SendResult> {
  const recipients = getAdminRecipients()
  if (recipients.length === 0) return { error: 'No admin recipients configured' }
  try {
    const summary =
      type === 'host'
        ? `Preferred dates: ${(inquiry as HostInquiry).prefStart1} – ${(inquiry as HostInquiry).prefEnd1}. Concept: ${(inquiry as HostInquiry).retreatConcept.slice(0, 140)}`
        : `Requested ${(inquiry as StrInquiry).startDate} – ${(inquiry as StrInquiry).endDate}, party ${(inquiry as StrInquiry).partySize ?? '?'}.`
    const adminUrl = `${getSiteUrl()}/admin/retreats/${type}/${inquiry.id}`
    const el = createElement(AdminAlertEmail, {
      inquiryKind: type,
      name: inquiry.name,
      organization: (inquiry as HostInquiry).organization ?? null,
      email: inquiry.email,
      summary,
      adminUrl,
    })
    const html = await render(el)
    const subject =
      type === 'host'
        ? `[Retreats] New host inquiry — ${(inquiry as HostInquiry).organization || inquiry.name}`
        : `[Retreats] New STR request — ${inquiry.name}`
    const { data, error } = await getResend().emails.send({
      from: getFromAddress(),
      to: recipients,
      subject,
      html,
    })
    if (error) return { error: error.message }
    return { messageId: data?.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'send failed' }
  }
}

// ============================================================================
// Hold notice
// ============================================================================

export async function sendHoldNotice(
  type: InquiryType,
  inquiry: HostInquiry | StrInquiry,
  startDate: string,
  endDate: string,
  holdExpiresAt: string,
  sentBy: string | null
): Promise<SendResult> {
  try {
    const el = createElement(HoldEmail, {
      recipientName: bestName(inquiry),
      startDate,
      endDate,
      holdExpiresAt,
    })
    const html = await render(el)
    const subject = 'Soft hold placed on your Camp Monroe dates'
    const { data, error } = await getResend().emails.send({
      from: getFromAddress(),
      to: inquiry.email,
      subject,
      html,
    })
    if (error) return { error: error.message }
    await logCommunication(type, inquiry.id, 'hold_email', subject, `Hold ${startDate} – ${endDate}`, data?.id ?? null, sentBy)
    return { messageId: data?.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'send failed' }
  }
}

// ============================================================================
// Confirmation
// ============================================================================

export async function sendConfirmation(
  type: InquiryType,
  inquiry: HostInquiry | StrInquiry,
  booking: Booking,
  pdfUrl: string | null,
  sentBy: string | null
): Promise<SendResult> {
  try {
    const el = createElement(ConfirmationEmail, {
      recipientName: bestName(inquiry),
      startDate: booking.startDate,
      endDate: booking.endDate,
      groupSize: booking.groupSize,
      pdfUrl,
      bookingId: booking.id,
      inquiryKind: type,
    })
    const html = await render(el)
    const subject = 'Your Camp Monroe dates are confirmed'
    const { data, error } = await getResend().emails.send({
      from: getFromAddress(),
      to: inquiry.email,
      subject,
      html,
    })
    if (error) return { error: error.message }
    await logCommunication(type, inquiry.id, 'confirm_email', subject, `Confirmed ${booking.startDate} – ${booking.endDate}`, data?.id ?? null, sentBy)
    return { messageId: data?.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'send failed' }
  }
}

// ============================================================================
// Decline
// ============================================================================

export async function sendDecline(
  type: InquiryType,
  inquiry: HostInquiry | StrInquiry,
  reason: string,
  sentBy: string | null
): Promise<SendResult> {
  try {
    const el = createElement(DeclineEmail, {
      recipientName: bestName(inquiry),
      reason,
    })
    const html = await render(el)
    const subject = 'A note on your Camp Monroe inquiry'
    const { data, error } = await getResend().emails.send({
      from: getFromAddress(),
      to: inquiry.email,
      subject,
      html,
    })
    if (error) return { error: error.message }
    await logCommunication(type, inquiry.id, 'decline_email', subject, reason, data?.id ?? null, sentBy)
    return { messageId: data?.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'send failed' }
  }
}

// ============================================================================
// Manual email (admin-composed)
// ============================================================================

export async function sendManualEmail(
  type: InquiryType,
  inquiry: HostInquiry | StrInquiry,
  kind: CommunicationKind,
  subject: string,
  bodyText: string,
  sentBy: string | null
): Promise<SendResult> {
  try {
    // Minimal wrapper: plain paragraph HTML around the supplied text.
    const html = `<!DOCTYPE html><html><body style="font-family:Helvetica,Arial,sans-serif;color:#1a2e1a;background:#f5f0e8;margin:0;padding:40px 24px;"><div style="max-width:560px;margin:0 auto;">${bodyText
      .split('\n\n')
      .map((p) => `<p style="margin:0 0 16px;line-height:1.6;">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('')}</div></body></html>`
    const { data, error } = await getResend().emails.send({
      from: getFromAddress(),
      to: inquiry.email,
      subject,
      html,
    })
    if (error) return { error: error.message }
    if (kind === 'manual_note') {
      // Still log it, but don't send an email if kind says manual_note.
      await logCommunication(type, inquiry.id, kind, subject, bodyText, data?.id ?? null, sentBy)
    } else {
      await logCommunication(type, inquiry.id, kind, subject, bodyText, data?.id ?? null, sentBy)
    }
    return { messageId: data?.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'send failed' }
  }
}

/** Log a manual-note entry (no email sent). */
export async function logManualNote(
  type: InquiryType,
  inquiryId: string,
  subject: string,
  body: string,
  sentBy: string | null
): Promise<void> {
  await logCommunication(type, inquiryId, 'manual_note', subject, body, null, sentBy)
}
