'use client'

import { useState, useMemo } from 'react'

type WaitlistEntry = {
  id: string
  name: string
  email: string
  trip_interest: string
  trip_slug?: string
  created_at: string
}

type Props = {
  entries: WaitlistEntry[]
}

const PAGE_SIZE = 25

export default function WaitlistTable({ entries }: Props) {
  const [search, setSearch] = useState('')
  const [tripFilter, setTripFilter] = useState('')
  const [page, setPage] = useState(0)

  // Unique trip interests for filter dropdown
  const tripOptions = useMemo(() => {
    const set = new Set<string>()
    entries.forEach((e) => {
      if (e.trip_interest) set.add(e.trip_interest)
    })
    return Array.from(set).sort()
  }, [entries])

  // Filtered entries
  const filtered = useMemo(() => {
    let result = entries
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      )
    }
    if (tripFilter) {
      result = result.filter((e) => e.trip_interest === tripFilter)
    }
    return result
  }, [entries, search, tripFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function exportCSV() {
    const header = 'Name,Email,Trip Interest,Date\n'
    const rows = filtered.map((e) =>
      `"${e.name}","${e.email}","${e.trip_interest}","${new Date(e.created_at).toLocaleDateString()}"`
    ).join('\n')

    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
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
          className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 w-64 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
        />
        <select
          value={tripFilter}
          onChange={(e) => { setTripFilter(e.target.value); setPage(0) }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
        >
          <option value="">All Experiences</option>
          {tripOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex-1" />
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

      {/* Table */}
      {paged.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No entries found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Trip Interest</th>
                <th className="px-4 py-3 font-medium">Signup Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium">{entry.name}</td>
                  <td className="px-4 py-3 text-gray-500">{entry.email}</td>
                  <td className="px-4 py-3 text-gray-500">{entry.trip_interest || '—'}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  )
}
