'use client'

import { useState, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import DeleteConfirmDialog from './DeleteConfirmDialog'

type WaitlistEntry = {
  id: string
  name: string | null
  email: string
  trip_interest: string | null
  trip_slug?: string | null
  source: WaitlistSource
  created_at: string
}

type WaitlistSource =
  | 'legacy_trip'
  | 'home_follow_along'
  | 'renovation_reveal'
  | 'womens_chapter'
  | 'other'

const SOURCE_LABELS: Record<WaitlistSource, string> = {
  legacy_trip: 'Legacy trip',
  home_follow_along: 'Follow along',
  renovation_reveal: '2026 reveal',
  womens_chapter: "Women's chapter",
  other: 'Other',
}

type Props = {
  entries: WaitlistEntry[]
}

const PAGE_SIZE = 25

export default function WaitlistTable({ entries: initialEntries }: Props) {
  const [entries, setEntries] = useState<WaitlistEntry[]>(initialEntries)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState<WaitlistSource | ''>('')
  const [page, setPage] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<WaitlistEntry | null>(null)
  const [deleting, setDeleting] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Distinct sources observed in the data set
  const sourceOptions = useMemo(() => {
    const set = new Set<WaitlistSource>()
    entries.forEach((e) => set.add(e.source))
    return Array.from(set).sort()
  }, [entries])

  // Filtered entries
  const filtered = useMemo(() => {
    let result = entries
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          (e.name ?? '').toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q)
      )
    }
    if (sourceFilter) {
      result = result.filter((e) => e.source === sourceFilter)
    }
    return result
  }, [entries, search, sourceFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function exportCSV() {
    const header = 'Name,Email,Source,Trip Interest,Date\n'
    const rows = filtered
      .map(
        (e) =>
          `"${(e.name ?? '').replace(/"/g, '""')}","${e.email}","${SOURCE_LABELS[e.source]}","${(e.trip_interest ?? '').replace(/"/g, '""')}","${new Date(e.created_at).toLocaleDateString()}"`
      )
      .join('\n')

    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `follow-along-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await supabase.from('waitlist').delete().eq('id', deleteTarget.id)
    setEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id))
    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          placeholder="Search by name or email..."
          className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
        />
        <select
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value as WaitlistSource | ''); setPage(0) }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber flex-1 sm:flex-none"
        >
          <option value="">All sources</option>
          {sourceOptions.map((s) => (
            <option key={s} value={s}>
              {SOURCE_LABELS[s]}
            </option>
          ))}
        </select>
        <div className="hidden sm:block flex-1" />
        <span className="text-xs text-gray-400">
          {filtered.length} of {entries.length} entries
        </span>
        <button
          onClick={exportCSV}
          className="px-3 py-2 text-xs font-medium text-forest border border-forest rounded-md hover:bg-forest/5 transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Empty state */}
      {paged.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No entries found.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {entry.name || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{entry.email}</td>
                    <td className="px-4 py-3 text-gray-500">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-amber/10 text-amber-700 border border-amber/20">
                        {SOURCE_LABELS[entry.source]}
                      </span>
                      {entry.trip_interest && (
                        <span className="ml-2 text-xs text-gray-400">
                          {entry.trip_interest}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(entry.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(entry)}
                        className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {paged.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {entry.name || entry.email}
                    </p>
                    {entry.name && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {entry.email}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setDeleteTarget(entry)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-red-400 hover:text-red-600 shrink-0 -mr-2 -mt-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l8 8M11 3L3 11" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber/10 text-amber-700 border border-amber/20">
                    {SOURCE_LABELS[entry.source]}
                  </span>
                  <span className="text-gray-400">
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Delete dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          title="Delete entry"
          message={`Are you sure you want to delete the entry for "${deleteTarget.name ?? deleteTarget.email}" (${deleteTarget.email})? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
