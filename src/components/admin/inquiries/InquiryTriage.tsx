'use client'

import { useCallback, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { InquiryStatus } from '@/lib/types/retreats'
import type {
  MembershipRequest,
  PartnerInquiry,
  InquiryKind,
} from '@/lib/types/inquiries'
import {
  PARTNER_CONTEXT_LABELS,
  MEMBERSHIP_CHAPTER_LABELS,
} from '@/lib/types/inquiries'
import StatusPill from '@/components/admin/retreats/StatusPill'
import Section from '@/components/admin/ui/Section'
import Card from '@/components/admin/ui/Card'
import { Button } from '@/components/admin/ui/Button'
import { saveMembershipUpdate } from '@/app/admin/(dashboard)/membership/actions'
import { savePartnerUpdate } from '@/app/admin/(dashboard)/partner-inquiries/actions'
import type { InquiryUpdate } from '@/lib/data/inquiries'

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'hold', label: 'Hold' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'declined', label: 'Declined' },
]

type Props =
  | { kind: 'membership'; inquiry: MembershipRequest }
  | { kind: 'partner'; inquiry: PartnerInquiry }

const BACK_PATHS: Record<InquiryKind, string> = {
  membership: '/admin/membership',
  partner: '/admin/partner-inquiries',
}

const BACK_LABELS: Record<InquiryKind, string> = {
  membership: 'Membership requests',
  partner: 'Partner inquiries',
}

const CONFIRMED_LABELS: Record<InquiryKind, string> = {
  membership: 'Admitted',
  partner: 'Engagement formalized',
}

export default function InquiryTriage(props: Props) {
  const { kind, inquiry } = props
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const [status, setStatus] = useState<InquiryStatus>(inquiry.status)
  const [owner, setOwner] = useState<string>(inquiry.assignedOwner ?? '')
  const [adminNotes, setAdminNotes] = useState<string>(
    inquiry.adminNotes ?? ''
  )

  const dirty =
    status !== inquiry.status ||
    (owner || null) !== (inquiry.assignedOwner ?? null) ||
    (adminNotes || null) !== (inquiry.adminNotes ?? null)

  const save = useCallback(
    (update: InquiryUpdate, successMsg: string) => {
      setError(null)
      startTransition(async () => {
        const res =
          kind === 'membership'
            ? await saveMembershipUpdate(inquiry.id, update)
            : await savePartnerUpdate(inquiry.id, update)
        if (res.error) {
          setError(res.error)
          return
        }
        setToast(successMsg)
        setTimeout(() => setToast(null), 2500)
        router.refresh()
      })
    },
    [kind, inquiry.id, router]
  )

  const handleSave = () => {
    save(
      {
        status,
        assignedOwner: owner.trim() || null,
        adminNotes: adminNotes.trim() || null,
      },
      'Saved'
    )
  }

  const quickStatus = (next: InquiryStatus, label: string) => {
    setStatus(next)
    save({ status: next }, label)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href={BACK_PATHS[kind]}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-amber transition-colors"
          >
            <span aria-hidden="true">←</span>
            {BACK_LABELS[kind]}
          </Link>
          <h1 className="font-display text-2xl text-gray-900 mt-1.5 truncate">
            {inquiry.name}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {kind === 'membership'
              ? 'Membership request'
              : 'Partner inquiry'}
            {' · '}
            Submitted{' '}
            {new Date(inquiry.submittedAt).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={inquiry.status} />
        </div>
      </div>

      {/* Quick status actions */}
      <Section title="Quick actions">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={isPending || inquiry.status === 'reviewing'}
            onClick={() => quickStatus('reviewing', 'Moved to reviewing')}
          >
            Mark reviewing
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={isPending || inquiry.status === 'hold'}
            onClick={() => quickStatus('hold', 'Placed on hold')}
          >
            Hold
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={isPending || inquiry.status === 'confirmed'}
            onClick={() => quickStatus('confirmed', CONFIRMED_LABELS[kind])}
          >
            {CONFIRMED_LABELS[kind]}
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={isPending || inquiry.status === 'declined'}
            onClick={() => quickStatus('declined', 'Marked declined')}
          >
            Decline
          </Button>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — contact + details */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Contact">
            <Card padding="lg">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <Field label="Name" value={inquiry.name} />
                <Field
                  label="Email"
                  value={
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="text-amber hover:underline"
                    >
                      {inquiry.email}
                    </a>
                  }
                />
                {kind === 'partner' && (
                  <>
                    <Field
                      label="Organization"
                      value={
                        (inquiry as PartnerInquiry).organization ?? '—'
                      }
                    />
                    <Field
                      label="Partnership context"
                      value={
                        (inquiry as PartnerInquiry).context
                          ? PARTNER_CONTEXT_LABELS[
                              (inquiry as PartnerInquiry).context!
                            ]
                          : '—'
                      }
                    />
                  </>
                )}
                {kind === 'membership' && (
                  <>
                    <Field
                      label="Chapter"
                      value={
                        (inquiry as MembershipRequest).chapter
                          ? MEMBERSHIP_CHAPTER_LABELS[
                              (inquiry as MembershipRequest).chapter!
                            ]
                          : 'No preference'
                      }
                    />
                    <Field
                      label="Sponsorship"
                      value={
                        (inquiry as MembershipRequest).hasSponsor
                          ? `Yes — ${
                              (inquiry as MembershipRequest).sponsorName ??
                              '(unnamed)'
                            }`
                          : 'Not yet'
                      }
                    />
                  </>
                )}
              </dl>
            </Card>
          </Section>

          <Section
            title={kind === 'membership' ? 'Their note' : 'Their message'}
          >
            <Card padding="lg">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {kind === 'membership'
                  ? (inquiry as MembershipRequest).note ||
                    '(no note submitted)'
                  : (inquiry as PartnerInquiry).message ||
                    '(no message submitted)'}
              </p>
            </Card>
          </Section>
        </div>

        {/* Right column — triage */}
        <div className="space-y-6">
          <Section title="Triage">
            <Card padding="lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as InquiryStatus)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.value === 'confirmed'
                          ? CONFIRMED_LABELS[kind]
                          : s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="owner"
                    className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5"
                  >
                    Assigned to
                  </label>
                  <input
                    id="owner"
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="email or name"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5"
                  >
                    Admin notes
                  </label>
                  <textarea
                    id="notes"
                    rows={5}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal triage notes — not visible to the submitter."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60 resize-y"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1.5">
                    {error}
                  </p>
                )}

                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={!dirty || isPending}
                  className="w-full"
                >
                  {isPending ? 'Saving…' : dirty ? 'Save changes' : 'No changes'}
                </Button>

                {toast && (
                  <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5 text-center">
                    {toast}
                  </p>
                )}
              </div>
            </Card>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-0.5 text-gray-900">{value}</dd>
    </div>
  )
}
