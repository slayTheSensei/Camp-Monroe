'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { OpenWindow, WindowType } from '@/lib/types/retreats'
import {
  createOpenWindow,
  updateOpenWindow,
  deleteOpenWindow,
  type OpenWindowInput,
} from '@/app/admin/(dashboard)/retreats/actions'

type Props = {
  initial?: OpenWindow
  isNew?: boolean
}

export default function OpenWindowEditor({ initial, isNew }: Props) {
  const router = useRouter()
  const [startDate, setStartDate] = useState(initial?.startDate ?? '')
  const [endDate, setEndDate] = useState(initial?.endDate ?? '')
  const [windowType, setWindowType] = useState<WindowType>(initial?.windowType ?? 'host')
  const [label, setLabel] = useState(initial?.label ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? true)
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function payload(): OpenWindowInput {
    return {
      startDate,
      endDate,
      windowType,
      label,
      description: description || null,
      isPublic,
      sortOrder,
      notes: notes || null,
    }
  }

  function save() {
    setError(null)
    startTransition(async () => {
      const res = isNew
        ? await createOpenWindow(payload())
        : await updateOpenWindow(initial!.id, payload())
      if (res.error) setError(res.error)
      else router.push('/admin/retreats/open-windows')
    })
  }

  function handleDelete() {
    if (!initial) return
    if (!confirm('Delete this open window? This cannot be undone.')) return
    startTransition(async () => {
      const res = await deleteOpenWindow(initial.id)
      if (res.error) setError(res.error)
      else router.push('/admin/retreats/open-windows')
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

      <Field label="Window type">
        <select
          value={windowType}
          onChange={(e) => setWindowType(e.target.value as WindowType)}
          className={inputClass}
        >
          <option value="host">Host (retreats)</option>
          <option value="str">STR (short-term rental)</option>
          <option value="both">Both</option>
        </select>
      </Field>

      <Field label="Label">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Early September Weekend"
          className={inputClass}
        />
      </Field>

      <Field label="Description (public)">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Sort order">
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value || '0', 10))}
            className={inputClass}
          />
        </Field>
        <Field label="Public">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Visible on public pages
          </label>
        </Field>
      </div>

      <Field label="Admin notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
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
            onClick={() => router.push('/admin/retreats/open-windows')}
            className="px-3 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={isPending || !startDate || !endDate || !label}
            className="bg-forest text-cream font-semibold px-5 py-2 rounded-md text-sm hover:bg-forest/90 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : isNew ? 'Create window' : 'Save changes'}
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
