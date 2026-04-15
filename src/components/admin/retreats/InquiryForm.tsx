'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type {
  HostInquiry,
  StrInquiry,
  Communication,
  InquiryType,
  Booking,
} from '@/lib/types/retreats'
import type { Conflict } from '@/lib/pipeline/conflicts'
import { formatHoldRelative } from '@/lib/pipeline/holds'
import StatusPill from './StatusPill'
import ContactInfo from './InquiryFormFields/ContactInfo'
import RequestDetails from './InquiryFormFields/RequestDetails'
import DatePreferences from './InquiryFormFields/DatePreferences'
import TriagePanel from './InquiryFormFields/TriagePanel'
import CommunicationsLog from './InquiryFormFields/CommunicationsLog'
import {
  placeHold,
  releaseHold,
  confirmBooking,
  declineInquiry,
  reopenInquiry,
  cancelBooking,
} from '@/app/admin/(dashboard)/retreats/actions'

const tabs = ['Contact', 'Request', 'Dates', 'Triage', 'Communications'] as const
type Tab = (typeof tabs)[number]

type Props = {
  type: InquiryType
  inquiry: HostInquiry | StrInquiry
  conflictsByRange: Conflict[][]
  communications: Communication[]
  existingBooking: Booking | null
  admins: { id: string; email: string }[]
}

export default function InquiryForm({
  type,
  inquiry,
  conflictsByRange,
  communications,
  existingBooking,
  admins,
}: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('Contact')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [declineOpen, setDeclineOpen] = useState(false)
  const [declineReason, setDeclineReason] = useState(
    "Thanks again for reaching out. We're not able to accommodate this request, but appreciate you considering Camp Monroe."
  )

  const startDefault =
    type === 'host' ? (inquiry as HostInquiry).prefStart1 : (inquiry as StrInquiry).startDate
  const endDefault =
    type === 'host' ? (inquiry as HostInquiry).prefEnd1 : (inquiry as StrInquiry).endDate
  const groupDefault =
    type === 'host'
      ? parseInt((inquiry as HostInquiry).groupSizeBucket?.split('-')[1] ?? '12', 10) || null
      : null

  const [confirmStart, setConfirmStart] = useState(startDefault)
  const [confirmEnd, setConfirmEnd] = useState(endDefault)
  const [confirmGroup, setConfirmGroup] = useState<number | null>(groupDefault)
  const [confirmNotes, setConfirmNotes] = useState('')

  function handle(fn: () => Promise<{ error?: string }>, successMsg?: string) {
    setError(null)
    startTransition(async () => {
      const r = await fn()
      if (r.error) setError(r.error)
      else {
        if (successMsg) flashToast(successMsg)
        router.refresh()
      }
    })
  }

  function flashToast(msg: string) {
    setError(null)
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }
  const [toast, setToast] = useState<string | null>(null)

  return (
    <div>
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${
                  type === 'host'
                    ? 'bg-amber/10 text-amber border-amber/30'
                    : 'bg-forest/10 text-forest border-forest/20'
                }`}
              >
                {type === 'host' ? 'Host inquiry' : 'STR request'}
              </span>
              <StatusPill status={inquiry.status} />
              {inquiry.status === 'hold' && inquiry.holdExpiresAt && (
                <span className="text-xs text-orange-600">
                  {formatHoldRelative(inquiry.holdExpiresAt)}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{inquiry.name}</h1>
            {type === 'host' && (inquiry as HostInquiry).organization && (
              <p className="text-sm text-gray-500">
                {(inquiry as HostInquiry).organization}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto scrollbar-hide mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        {tab === 'Contact' && <ContactInfo inquiry={inquiry} type={type} />}
        {tab === 'Request' && <RequestDetails inquiry={inquiry} type={type} />}
        {tab === 'Dates' && (
          <DatePreferences
            inquiry={inquiry}
            type={type}
            conflictsByRange={conflictsByRange}
          />
        )}
        {tab === 'Triage' && <TriagePanel inquiry={inquiry} type={type} admins={admins} />}
        {tab === 'Communications' && (
          <CommunicationsLog
            type={type}
            inquiryId={inquiry.id}
            communications={communications}
          />
        )}
      </div>

      {/* Sticky action bar */}
      <div className="bg-white border border-gray-200 rounded-lg px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky bottom-4 shadow-sm">
        <button
          onClick={() => router.push('/admin/retreats')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to inbox
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {toast && <span className="text-sm text-green-600">{toast}</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}

          {(inquiry.status === 'new' || inquiry.status === 'reviewing') && (
            <>
              <button
                disabled={isPending}
                onClick={() => handle(() => placeHold(type, inquiry.id, 7), 'Hold placed')}
                className="px-3 py-2 text-xs font-medium text-orange-700 border border-orange-300 rounded-md hover:bg-orange-50"
              >
                Place Hold
              </button>
              <button
                disabled={isPending}
                onClick={() => setConfirmOpen(true)}
                className="px-3 py-2 text-xs font-medium text-cream bg-forest rounded-md hover:bg-forest/90"
              >
                Confirm Booking
              </button>
              <button
                disabled={isPending}
                onClick={() => setDeclineOpen(true)}
                className="px-3 py-2 text-xs font-medium text-red-700 border border-red-200 rounded-md hover:bg-red-50"
              >
                Decline
              </button>
            </>
          )}

          {inquiry.status === 'hold' && (
            <>
              <button
                disabled={isPending}
                onClick={() => handle(() => releaseHold(type, inquiry.id), 'Hold released')}
                className="px-3 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Release Hold
              </button>
              <button
                disabled={isPending}
                onClick={() => setConfirmOpen(true)}
                className="px-3 py-2 text-xs font-medium text-cream bg-forest rounded-md hover:bg-forest/90"
              >
                Confirm Booking
              </button>
              <button
                disabled={isPending}
                onClick={() => setDeclineOpen(true)}
                className="px-3 py-2 text-xs font-medium text-red-700 border border-red-200 rounded-md hover:bg-red-50"
              >
                Decline
              </button>
            </>
          )}

          {inquiry.status === 'confirmed' && existingBooking && (
            <button
              disabled={isPending}
              onClick={() => {
                if (confirm('Cancel this confirmed booking? The PDF and email stay on record; the calendar block is removed.')) {
                  handle(() => cancelBooking(type, inquiry.id), 'Booking cancelled')
                }
              }}
              className="px-3 py-2 text-xs font-medium text-red-700 border border-red-200 rounded-md hover:bg-red-50"
            >
              Cancel Booking
            </button>
          )}

          {inquiry.status === 'declined' && (
            <button
              disabled={isPending}
              onClick={() => handle(() => reopenInquiry(type, inquiry.id), 'Reopened')}
              className="px-3 py-2 text-xs font-medium text-cream bg-forest rounded-md hover:bg-forest/90"
            >
              Reopen
            </button>
          )}
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmOpen && (
        <Dialog onClose={() => setConfirmOpen(false)} title="Confirm booking">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">Start</label>
                <input
                  type="date"
                  value={confirmStart}
                  onChange={(e) => setConfirmStart(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">End</label>
                <input
                  type="date"
                  value={confirmEnd}
                  onChange={(e) => setConfirmEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">Group size</label>
              <input
                type="number"
                value={confirmGroup ?? ''}
                onChange={(e) => setConfirmGroup(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">Notes</label>
              <textarea
                value={confirmNotes}
                onChange={(e) => setConfirmNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              />
            </div>
            <button
              disabled={isPending || !confirmStart || !confirmEnd}
              onClick={() => {
                setConfirmOpen(false)
                handle(
                  () =>
                    confirmBooking(type, inquiry.id, {
                      startDate: confirmStart,
                      endDate: confirmEnd,
                      groupSize: confirmGroup,
                      notes: confirmNotes || null,
                    }),
                  'Booking confirmed'
                )
              }}
              className="w-full bg-forest text-cream font-semibold px-4 py-2.5 rounded-md text-sm hover:bg-forest/90 disabled:opacity-50"
            >
              {isPending ? 'Confirming...' : 'Confirm & send email'}
            </button>
          </div>
        </Dialog>
      )}

      {/* Decline dialog */}
      {declineOpen && (
        <Dialog onClose={() => setDeclineOpen(false)} title="Decline inquiry">
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">
                Message to send
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              />
            </div>
            <button
              disabled={isPending || !declineReason}
              onClick={() => {
                setDeclineOpen(false)
                handle(() => declineInquiry(type, inquiry.id, declineReason), 'Declined')
              }}
              className="w-full bg-red-600 text-white font-semibold px-4 py-2.5 rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? 'Sending...' : 'Decline & send email'}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}

function Dialog({
  onClose,
  title,
  children,
}: {
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
