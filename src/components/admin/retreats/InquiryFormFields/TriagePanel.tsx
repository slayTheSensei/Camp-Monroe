'use client'

import { useState, useTransition } from 'react'
import type { HostInquiry, StrInquiry, InquiryStatus } from '@/lib/types/retreats'
import { updateInquiryField } from '@/app/admin/(dashboard)/retreats/actions'

type Props = {
  inquiry: HostInquiry | StrInquiry
  type: 'host' | 'str'
  admins: { id: string; email: string }[]
}

export default function TriagePanel({ inquiry, type, admins }: Props) {
  const host = type === 'host' ? (inquiry as HostInquiry) : null
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status)
  const [priority, setPriority] = useState<number | null>(host?.priorityScore ?? null)
  const [owner, setOwner] = useState<string>(host?.assignedOwner ?? '')
  const [notes, setNotes] = useState<string>(inquiry.adminNotes ?? '')
  const [, startTransition] = useTransition()
  const [saved, setSaved] = useState<string | null>(null)

  function flash(msg: string) {
    setSaved(msg)
    setTimeout(() => setSaved(null), 1500)
  }

  async function persist(field: string, value: unknown, label: string) {
    startTransition(async () => {
      const r = await updateInquiryField(type, inquiry.id, field, value)
      if (!r.error) flash(`${label} saved`)
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => {
            const v = e.target.value as InquiryStatus
            setStatus(v)
            persist('status', v, 'Status')
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
        >
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="hold">Hold</option>
          <option value="confirmed">Confirmed</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {type === 'host' && (
        <div>
          <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">Priority</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => {
                  const next = priority === n ? null : n
                  setPriority(next)
                  persist('priority_score', next, 'Priority')
                }}
                className={`w-8 h-8 text-lg ${
                  priority && n <= priority ? 'text-amber' : 'text-gray-300'
                } hover:text-amber transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      )}

      {type === 'host' && admins.length > 0 && (
        <div>
          <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">
            Assigned owner
          </label>
          <select
            value={owner}
            onChange={(e) => {
              const v = e.target.value
              setOwner(v)
              persist('assigned_owner', v || null, 'Owner')
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          >
            <option value="">Unassigned</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>
                {a.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">
          Admin notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => persist('admin_notes', notes, 'Notes')}
          rows={5}
          placeholder="Internal notes..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
        />
      </div>

      {saved && <p className="text-xs text-green-600">{saved}</p>}
    </div>
  )
}
