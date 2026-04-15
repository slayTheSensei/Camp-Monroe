'use client'

import { useState, useTransition } from 'react'
import type { Communication, CommunicationKind, InquiryType } from '@/lib/types/retreats'
import { sendCommunication } from '@/app/admin/(dashboard)/retreats/actions'

type Props = {
  type: InquiryType
  inquiryId: string
  communications: Communication[]
}

const kindLabels: Record<CommunicationKind, string> = {
  ack_email: 'Acknowledgment',
  review_email: 'Review',
  hold_email: 'Hold notice',
  confirm_email: 'Confirmation',
  decline_email: 'Decline',
  manual_note: 'Manual note',
}

export default function CommunicationsLog({ type, inquiryId, communications }: Props) {
  const [composeOpen, setComposeOpen] = useState(false)
  const [kind, setKind] = useState<CommunicationKind>('review_email')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [log, setLog] = useState(communications)

  function handleSend() {
    setError(null)
    startTransition(async () => {
      const res = await sendCommunication(type, inquiryId, kind, subject, body)
      if (res.error) {
        setError(res.error)
      } else {
        setComposeOpen(false)
        setSubject('')
        setBody('')
        // Optimistic: prepend a placeholder; the next server render fills it in.
        setLog((prev) => [
          {
            id: `temp-${Date.now()}`,
            inquiryId,
            inquiryType: type,
            kind,
            sentAt: new Date().toISOString(),
            sentBy: null,
            subject,
            bodyPreview: body.slice(0, 500),
            resendMessageId: res.messageId ?? null,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ])
      }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Communications</h3>
        <button
          onClick={() => setComposeOpen(!composeOpen)}
          className="text-xs text-amber hover:text-amber/80 transition-colors"
        >
          {composeOpen ? 'Cancel' : '+ Compose'}
        </button>
      </div>

      {composeOpen && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-3 mb-4">
          <div>
            <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">Kind</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as CommunicationKind)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
            >
              <option value="review_email">Review email</option>
              <option value="manual_note">Manual note (no email)</option>
            </select>
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            onClick={handleSend}
            disabled={!subject || !body}
            className="bg-forest text-cream text-sm font-medium px-4 py-2 rounded-md hover:bg-forest/90 disabled:opacity-50"
          >
            {kind === 'manual_note' ? 'Log note' : 'Send email'}
          </button>
        </div>
      )}

      {log.length === 0 ? (
        <p className="text-xs text-gray-400 italic">No communications yet.</p>
      ) : (
        <ul className="space-y-2">
          {log.map((c) => (
            <li key={c.id} className="border border-gray-200 rounded-md p-3 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{kindLabels[c.kind]}</span>
                <span className="text-xs text-gray-400">
                  {new Date(c.sentAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              {c.subject && <p className="text-sm text-gray-900 font-medium">{c.subject}</p>}
              {c.bodyPreview && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-3">{c.bodyPreview}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
