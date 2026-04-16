// R-001 v2 Retreats Pipeline types.
// Mirrors the schema after 20260416000001_retreats_pipeline_v2_simplified_availability.sql.

export type InquiryStatus = 'new' | 'reviewing' | 'hold' | 'confirmed' | 'declined'
export type InquiryType = 'host' | 'buyout'

export type AudienceType = 'wellness' | 'creative' | 'corporate' | 'cultural' | 'other'
export type SupportNeed = 'lodging' | 'meals' | 'facilitation' | 'full'

export type PartySize = '1-2' | '3-4' | '5+'
export type PurposeOfStay = 'personal' | 'creative' | 'friends' | 'pre-retreat' | 'other'
export type Affiliation = 'existing_member' | 'new_member' | 'prospective' | 'none'

export type CommunicationKind =
  | 'ack_email'
  | 'review_email'
  | 'hold_email'
  | 'confirm_email'
  | 'decline_email'
  | 'manual_note'

export type BlackoutCategory = 'internal_event' | 'member_buyout' | 'other'

// ============================================================================
// Seasons (admin-curated operating periods)
// ============================================================================

export type Season = {
  id: string
  label: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  createdBy: string | null
}

// ============================================================================
// Blackouts (dates inside a season that are off-limits)
// ============================================================================

export type Blackout = {
  id: string
  startDate: string
  endDate: string
  category: BlackoutCategory
  label: string
  adminNotes: string | null
  createdAt: string
  createdBy: string | null
}

// ============================================================================
// Inquiries
// ============================================================================

export type HostInquiry = {
  id: string
  submittedAt: string
  name: string
  organization: string | null
  email: string
  phone: string | null
  retreatConcept: string
  audienceType: AudienceType | null
  groupSize: number | null
  startDate: string
  endDate: string
  supportNeeds: SupportNeed[]
  additionalNotes: string | null
  status: InquiryStatus
  priorityScore: number | null
  assignedOwner: string | null
  adminNotes: string | null
  holdExpiresAt: string | null
  createdAt: string
}

export type BuyoutInquiry = {
  id: string
  submittedAt: string
  name: string
  email: string
  startDate: string
  endDate: string
  partySize: PartySize | null
  purposeOfStay: PurposeOfStay | null
  affiliation: Affiliation | null
  additionalNotes: string | null
  status: InquiryStatus
  adminNotes: string | null
  holdExpiresAt: string | null
  createdAt: string
}

export type Inquiry = HostInquiry | BuyoutInquiry

export function isHostInquiry(i: Inquiry): i is HostInquiry {
  return 'retreatConcept' in i
}

// ============================================================================
// Bookings + communications
// ============================================================================

export type Booking = {
  id: string
  inquiryId: string
  inquiryType: InquiryType
  startDate: string
  endDate: string
  groupSize: number | null
  notes: string | null
  pdfStoragePath: string | null
  confirmedAt: string
  confirmedBy: string | null
  createdAt: string
}

export type Communication = {
  id: string
  inquiryId: string
  inquiryType: InquiryType
  kind: CommunicationKind
  sentAt: string
  sentBy: string | null
  subject: string | null
  bodyPreview: string | null
  resendMessageId: string | null
  createdAt: string
}

export type BookedRange = {
  startDate: string
  endDate: string
  inquiryType: InquiryType
}

// ============================================================================
// Availability (computed — not a DB table)
// ============================================================================

export type DayAvailability = 'available' | 'unavailable' | 'outside_season' | 'lead_time'

export type PublicBlackout = {
  startDate: string
  endDate: string
  label: string
}
