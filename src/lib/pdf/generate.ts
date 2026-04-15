import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import BookingSummary from './BookingSummary'
import type { Booking, HostInquiry, StrInquiry, InquiryType } from '@/lib/types/retreats'

const BUCKET = 'booking-pdfs'

export async function generateBookingPDF(
  booking: Booking,
  inquiry: HostInquiry | StrInquiry,
  type: InquiryType
): Promise<Buffer> {
  const el = createElement(BookingSummary, { booking, inquiry, type })
  // renderToBuffer expects a Document element; BookingSummary returns a Document.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(el as any)
}

export async function uploadBookingPDF(bookingId: string, buffer: Buffer): Promise<string> {
  const supabase = createSupabaseAdmin()
  const path = `bookings/${bookingId}.pdf`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: 'application/pdf', upsert: true })
  if (error) throw new Error(`PDF upload failed: ${error.message}`)
  return path
}

export async function getBookingPDFSignedUrl(
  path: string,
  expiresInSeconds: number = 60 * 60 * 24 * 30
): Promise<string | null> {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresInSeconds)
  if (error || !data) return null
  return data.signedUrl
}
