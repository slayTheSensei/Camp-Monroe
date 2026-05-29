/**
 * Front-door inquiry types — the redesign's two non-retreat inquiry surfaces.
 * Modeled on retreats.ts so the existing StatusPill + triage UX reuses cleanly.
 */

import type { InquiryStatus } from './retreats'

export type MembershipChapter = 'mens' | 'womens'

export type MembershipRequest = {
  id: string
  submittedAt: string
  name: string
  email: string
  chapter: MembershipChapter | null
  hasSponsor: boolean
  sponsorName: string | null
  note: string | null
  status: InquiryStatus
  priorityScore: number | null
  assignedOwner: string | null
  adminNotes: string | null
  holdExpiresAt: string | null
  createdAt: string
}

export type PartnerContext =
  | 'capital'
  | 'heritage'
  | 'press'
  | 'community'
  | 'other'

export type PartnerInquiry = {
  id: string
  submittedAt: string
  name: string
  organization: string | null
  email: string
  context: PartnerContext | null
  message: string | null
  status: InquiryStatus
  priorityScore: number | null
  assignedOwner: string | null
  adminNotes: string | null
  holdExpiresAt: string | null
  createdAt: string
}

export type FrontDoorKind = 'membership' | 'partner'

/** Labels for admin UI — context enum doesn't read well as a raw key. */
export const PARTNER_CONTEXT_LABELS: Record<PartnerContext, string> = {
  capital: 'Capital & investment',
  heritage: 'Heritage & preservation',
  press: 'Press & storytelling',
  community: 'Community & corporate',
  other: 'Something else',
}

export const MEMBERSHIP_CHAPTER_LABELS: Record<MembershipChapter, string> = {
  mens: "Men's chapter (est. 1893)",
  womens: "Women's chapter (2026)",
}
