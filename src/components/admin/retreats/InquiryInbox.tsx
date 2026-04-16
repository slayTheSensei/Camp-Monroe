'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { HostInquiry, BuyoutInquiry, InquiryStatus } from '@/lib/types/retreats'
import StatusPill from './StatusPill'
import InquiryTabs from './InquiryTabs'

type Row = {
  id: string
  kind: 'host' | 'buyout'
  submittedAt: string
  name: string
  organization: string | null
  email: string
  startDate: string
  endDate: string
  groupOrParty: string
  status: InquiryStatus
  priority: number | null
}

type Props = {
  hostInquiries: HostInquiry[]
  buyoutInquiries: BuyoutInquiry[]
}

export default function InquiryInbox({ hostInquiries, buyoutInquiries }: Props) {
  const [status, setStatus] = useState<InquiryStatus | 'all'>('all')
  const [kindFilter, setKindFilter] = useState<'all' | 'host' | 'buyout'>('all')
  const [search, setSearch] = useState('')

  const allRows: Row[] = useMemo(() => {
    const hostRows: Row[] = hostInquiries.map((h) => ({
      id: h.id,
      kind: 'host',
      submittedAt: h.submittedAt,
      name: h.name,
      organization: h.organization,
      email: h.email,
      startDate: h.startDate,
      endDate: h.endDate,
      groupOrParty: h.groupSize?.toString() ?? '—',
      status: h.status,
      priority: h.priorityScore,
    }))
    const buyoutRows: Row[] = buyoutInquiries.map((b) => ({
      id: b.id,
      kind: 'buyout',
      submittedAt: b.submittedAt,
      name: b.name,
      organization: null,
      email: b.email,
      startDate: b.startDate,
      endDate: b.endDate,
      groupOrParty: b.partySize ?? '—',
      status: b.status,
      priority: null,
    }))
    return [...hostRows, ...buyoutRows].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
  }, [hostInquiries, buyoutInquiries])

  const counts = useMemo(() => {
    const c: Record<InquiryStatus, number> & { all: number } = {
      all: allRows.length,
      new: 0,
      reviewing: 0,
      hold: 0,
      confirmed: 0,
      declined: 0,
    }
    for (const r of allRows) c[r.status]++
    return c
  }, [allRows])

  const filtered = useMemo(() => {
    let r = allRows
    if (status !== 'all') r = r.filter((x) => x.status === status)
    if (kindFilter !== 'all') r = r.filter((x) => x.kind === kindFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          x.email.toLowerCase().includes(q) ||
          (x.organization ?? '').toLowerCase().includes(q)
      )
    }
    return r
  }, [allRows, status, kindFilter, search])

  return (
    <div>
      <InquiryTabs active={status} counts={counts} onChange={setStatus} />

      <div className="flex flex-wrap gap-3 mt-4 mb-4 items-center">
        <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded-md p-1">
          {(['all', 'host', 'buyout'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKindFilter(k)}
              className={`px-3 py-1 text-xs font-medium rounded ${
                kindFilter === k ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              {k === 'all' ? 'All' : k === 'host' ? 'Host' : 'Buyout'}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, organization..."
          className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
        />
        <span className="text-xs text-gray-400">
          {filtered.length} of {allRows.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No inquiries match.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Name / Org</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Requested</th>
                  <th className="px-4 py-3 font-medium">Group</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <tr key={`${r.kind}-${r.id}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(r.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/retreats/${r.kind}/${r.id}`}
                        className="text-gray-900 font-medium hover:text-amber"
                      >
                        {r.name}
                      </Link>
                      {r.organization && <div className="text-xs text-gray-500">{r.organization}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${
                          r.kind === 'host'
                            ? 'bg-amber/10 text-amber border-amber/30'
                            : 'bg-forest/10 text-forest border-forest/20'
                        }`}
                      >
                        {r.kind === 'host' ? 'Host' : 'Buyout'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {r.startDate} → {r.endDate}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.groupOrParty}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {r.priority ? '★'.repeat(r.priority) + '☆'.repeat(5 - r.priority) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-2">
            {filtered.map((r) => (
              <Link
                key={`${r.kind}-${r.id}`}
                href={`/admin/retreats/${r.kind}/${r.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                    {r.organization && <p className="text-xs text-gray-500 truncate">{r.organization}</p>}
                  </div>
                  <StatusPill status={r.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className={r.kind === 'host' ? 'text-amber' : 'text-forest'}>
                    {r.kind === 'host' ? 'Host' : 'Buyout'}
                  </span>
                  <span>·</span>
                  <span>{r.startDate} → {r.endDate}</span>
                  <span>·</span>
                  <span>{r.groupOrParty}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
