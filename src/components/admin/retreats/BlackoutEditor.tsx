'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Blackout, BlackoutCategory } from '@/lib/types/retreats'
import {
  createBlackout,
  updateBlackout,
  deleteBlackout,
  type BlackoutInput,
} from '@/app/admin/(dashboard)/retreats/actions'

type Props = {
  initial?: Blackout
  isNew?: boolean
}

export default function BlackoutEditor({ initial, isNew }: Props) {
  const router = useRouter()
  const [startDate, setStartDate] = useState(initial?.startDate ?? '')
  const [endDate, setEndDate] = useState(initial?.endDate ?? '')
  const [category, setCategory] = useState<BlackoutCategory>(initial?.category ?? 'internal_event')
  const [label, setLabel] = useState(initial?.label ?? '')
  const [adminNotes, setAdminNotes] = useState(initial?.adminNotes ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function payload(): BlackoutInput {
    return {
      startDate,
      endDate,
      category,
      label,
      adminNotes: adminNotes || null,
    }
  }

  function save() {
    setError(null)
    startTransition(async () => {
      const res = isNew
        ? await createBlackout(payload())
        : await updateBlackout(initial!.id, payload())
      if (res.error) setError(res.error)
      else router.push('/admin/retreats/blackouts')
    })
  }

  function handleDelete() {
    if (!initial) return
    if (!confirm('Delete this blackout? The blocked dates will become available on the public calendar.')) return
    startTransition(async () => {
      const res = await deleteBlackout(initial.id)
      if (res.error) setError(res.error)
      else router.push('/admin/retreats/blackouts')
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="End date">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Category">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as BlackoutCategory)}
          className={inputClass}
        >
          <option value="internal_event">Internal event</option>
          <option value="member_buyout">Member buyout (CGRC)</option>
          <option value="other">Other</option>
        </select>
      </Field>

      <Field label="Label">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Johnson family buyout"
          className={inputClass}
        />
      </Field>

      <Field label="Admin notes (internal only)">
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          {!isNew && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/admin/retreats/blackouts')}
            className="px-3 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={isPending || !startDate || !endDate || !label}
            className="bg-forest text-cream font-semibold px-5 py-2 rounded-md text-sm hover:bg-forest/90 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : isNew ? 'Create blackout' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs tracking-wider uppercase text-gray-500 block mb-1">{label}</label>
      {children}
    </div>
  )
}
