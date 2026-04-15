// R-001 Retreats Pipeline types.
// Mirrors the data model in supabase/migrations/20260415000001_retreats_pipeline.sql.

export type InquiryStatus = 'new' | 'reviewing' | 'hold' | 'confirmed' | 'declined'
export type InquiryType = 'host' | 'str'
export type WindowType = 'host' | 'str' | 'both'

export type AudienceType = 'wellness' | 'creative' | 'corporate' | 'cultural' | 'other'
export type GroupSizeBucket = '8-12' | '12-16' | '16-24'
export type Flexibility = 'fixed' | 'flexible'
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

export type OpenWindow = {
  id: string
  startDate: string // ISO date (YYYY-MM-DD)
  endDate: string
  windowType: WindowType
  label: string
  description: string | null
  isPublic: boolean
  sortOrder: number
  notes: string | null
  createdAt: string
  createdBy: string | null
}

export type DateRange = { start: string; end: string }

export type HostInquiry = {
  id: string
  submittedAt: string
  name: string
  organization: string | null
  email: string
  phone: string | null
  retreatConcept: string
  audienceType: AudienceType | null
  groupSizeBucket: GroupSizeBucket | null
  prefStart1: string
  prefEnd1: string
  prefStart2: string | null
  prefEnd2: string | null
  prefStart3: string | null
  prefEnd3: string | null
  flexibility: Flexibility | null
  supportNeeds: SupportNeed[]
  additionalNotes: string | null
  status: InquiryStatus
  priorityScore: number | null
  assignedOwner: string | null
  adminNotes: string | null
  holdExpiresAt: string | null
  linkedOpenWindowId: string | null
  createdAt: string
}

export type StrInquiry = {
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
  linkedOpenWindowId: string | null
  createdAt: string
}

export type Inquiry = HostInquiry | StrInquiry

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

export type BookedRange = { startDate: string; endDate: string; inquiryType: InquiryType }

export function isHostInquiry(i: Inquiry): i is HostInquiry {
  return 'retreatConcept' in i
}
