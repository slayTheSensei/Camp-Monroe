'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Season } from '@/lib/types/retreats'
import {
  createSeason,
  updateSeason,
  deleteSeason,
  type SeasonInput,
} from '@/app/admin/(dashboard)/retreats/actions'

type Props = {
  initial?: Season
  isNew?: boolean
}

export default function SeasonEditor({ initial, isNew }: Props) {
  const router = useRouter()
  const [label, setLabel] = useState(initial?.label ?? '')
  const [startDate, setStartDate] = useState(initial?.startDate ?? '')
  const [endDate, setEndDate] = useState(initial?.endDate ?? '')
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function payload(): SeasonInput {
    return { label, startDate, endDate, isActive }
  }

  function save() {
    setError(null)
    startTransition(async () => {
      const res = isNew
        ? await createSeason(payload())
        : await updateSeason(initial!.id, payload())
      if (res.error) setError(res.error)
      else router.push('/admin/retreats/seasons')
    })
  }

  function handleDelete() {
    if (!initial) return
    if (!confirm('Delete this season? Dates outside any active season become unavailable on the public calendar.')) return
    startTransition(async () => {
      const res = await deleteSeason(initial.id)
      if (res.error) setError(res.error)
      else router.push('/admin/retreats/seasons')
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <Field label="Label">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Main Summer 2026"
          className={inputClass}
        />
      </Field>

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

      <Field label="Active">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Season is live — dates within it appear on public calendar
        </label>
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
            onClick={() => router.push('/admin/retreats/seasons')}
            className="px-3 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={isPending || !label || !startDate || !endDate}
            className="bg-forest text-cream font-semibold px-5 py-2 rounded-md text-sm hover:bg-forest/90 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : isNew ? 'Create season' : 'Save changes'}
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
