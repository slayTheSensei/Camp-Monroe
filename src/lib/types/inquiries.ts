/**
 * Public inquiry types — membership requests and partner inquiries.
 *
 * Naming scope: in this module, "inquiry" means one of the two public-form
 * channels that are NOT retreats (membership, partner). Retreat inquiries
 * (host_inquiries, buyout_inquiries) live in ./retreats.ts with their own
 * `InquiryType = 'host' | 'buyout'` discriminator and their own status /
 * lifecycle handling. The two modules are intentionally separate because
 * they have different processing pipelines (server action vs API route,
 * plain text vs React Email templates, no communications log vs full
 * communications log).
 *
 * The shared `InquiryStatus` enum below is imported from ./retreats so the
 * StatusPill + triage UX renders the same way across all four channels.
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
  organization: string | null
  submittedAt: string
  name: string
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

export type InquiryKind = 'membership' | 'partner'

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
