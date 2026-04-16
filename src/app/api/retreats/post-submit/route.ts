import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { sendAck, sendAdminAlert } from '@/lib/email/send'
import type { HostInquiry, BuyoutInquiry, InquiryType } from '@/lib/types/retreats'

// NOTE: runs with service role. Client fires after insert so emails never
// depend on client trust. Idempotent-ish (safe to hit twice).

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { type: InquiryType; id: string }
    if (!body.id || (body.type !== 'host' && body.type !== 'buyout')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const supabase = createSupabaseAdmin()
    const table = body.type === 'host' ? 'host_inquiries' : 'buyout_inquiries'
    const { data: row, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', body.id)
      .single()
    if (error || !row) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    const inquiry = (body.type === 'host'
      ? mapHost(row)
      : mapBuyout(row)) as HostInquiry | BuyoutInquiry

    const results = await Promise.allSettled([
      sendAck(body.type, inquiry),
      sendAdminAlert(body.type, inquiry),
    ])
    const errors = results
      .map((r, i) => (r.status === 'rejected' ? { i, reason: String(r.reason) } : null))
      .filter(Boolean)
    if (errors.length > 0) console.error('post-submit partial failure:', errors)

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'unknown error' },
      { status: 500 }
    )
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapHost(row: any): HostInquiry {
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

function mapBuyout(row: any): BuyoutInquiry {
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
