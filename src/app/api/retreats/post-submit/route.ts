import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { sendAck, sendAdminAlert } from '@/lib/email/send'
import type { HostInquiry, StrInquiry, InquiryType } from '@/lib/types/retreats'

// NOTE: this route runs with the service role key. It is intentionally
// idempotent-ish (safe to hit twice; worst case you send a duplicate email
// within ~a minute). The client fires this after insert so emails never
// depend on client trust.

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { type: InquiryType; id: string }
    if (!body.id || (body.type !== 'host' && body.type !== 'str')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const supabase = createSupabaseAdmin()
    const table = body.type === 'host' ? 'host_inquiries' : 'str_inquiries'
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
      : mapStr(row)) as HostInquiry | StrInquiry

    // Fan out: acknowledgment + admin alert. Errors surface but don't block each other.
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

function mapStr(row: any): StrInquiry {
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
