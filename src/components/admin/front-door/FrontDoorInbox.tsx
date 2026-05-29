'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { InquiryStatus } from '@/lib/types/retreats'
import type {
  MembershipRequest,
  PartnerInquiry,
  FrontDoorKind,
} from '@/lib/types/front-door'
import {
  PARTNER_CONTEXT_LABELS,
  MEMBERSHIP_CHAPTER_LABELS,
} from '@/lib/types/front-door'
import StatusPill from '@/components/admin/retreats/StatusPill'
import InquiryTabs from '@/components/admin/retreats/InquiryTabs'
import EmptyState from '@/components/admin/ui/EmptyState'

type Inquiry = MembershipRequest | PartnerInquiry

function isPartner(i: Inquiry): i is PartnerInquiry {
  return 'organization' in i
}

type Props = {
  kind: FrontDoorKind
  inquiries: Inquiry[]
  counts: Record<InquiryStatus, number>
}

const BASE_PATHS: Record<FrontDoorKind, string> = {
  membership: '/admin/membership',
  partner: '/admin/partner-inquiries',
}

export default function FrontDoorInbox({ kind, inquiries, counts }: Props) {
  const [status, setStatus] = useState<InquiryStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const tabCounts = useMemo(
    () => ({
      ...counts,
      all:
        counts.new +
        counts.reviewing +
        counts.hold +
        counts.confirmed +
        counts.declined,
    }),
    [counts]
  )

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return inquiries.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (!s) return true
      const haystack = [
        r.name,
        r.email,
        isPartner(r) ? r.organization ?? '' : (r as MembershipRequest).sponsorName ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(s)
    })
  }, [inquiries, status, search])

  const basePath = BASE_PATHS[kind]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InquiryTabs active={status} counts={tabCounts} onChange={setStatus} />
        <div className="relative">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              kind === 'membership'
                ? 'Search by name, email, sponsor…'
                : 'Search by name, email, organization…'
            }
            className="w-full sm:w-72 px-3 py-2 text-sm border border-gray-200 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          message={
            inquiries.length === 0
              ? kind === 'membership'
                ? 'No membership requests yet.'
                : 'No partner inquiries yet.'
              : 'No inquiries match these filters.'
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
          {/* Desktop table */}
          <table className="hidden md:table w-full text-sm">
            <thead className="bg-gray-50/60">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-2.5 font-medium">Submitted</th>
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">
                  {kind === 'membership' ? 'Chapter / Sponsor' : 'Organization / Context'}
                </th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium text-right">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50/40 transition-colors group"
                >
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    <Link
                      href={`${basePath}/${r.id}`}
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 rounded"
                    >
                      {new Date(r.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`${basePath}/${r.id}`} className="block">
                      <div className="font-medium text-gray-900 group-hover:text-amber transition-colors">
                        {r.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[220px]">
                        {r.email}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {isPartner(r) ? (
                      <div className="space-y-0.5">
                        <div className="truncate max-w-[260px]">
                          {r.organization || <span className="text-gray-400">—</span>}
                        </div>
                        <div className="text-xs text-gray-400">
                          {r.context ? PARTNER_CONTEXT_LABELS[r.context] : '—'}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <div>
                          {r.chapter
                            ? MEMBERSHIP_CHAPTER_LABELS[r.chapter]
                            : <span className="text-gray-400">No preference</span>}
                        </div>
                        <div className="text-xs text-gray-400">
                          {r.hasSponsor
                            ? `Sponsor: ${r.sponsorName ?? '(unnamed)'}`
                            : 'No sponsor yet'}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">
                    {r.assignedOwner || <span className="text-gray-300">unassigned</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="md:hidden divide-y divide-gray-50">
            {filtered.map((r) => (
              <li key={r.id}>
                <Link
                  href={`${basePath}/${r.id}`}
                  className="block px-4 py-3 hover:bg-gray-50/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">
                        {r.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{r.email}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {isPartner(r)
                          ? r.organization ||
                            (r.context ? PARTNER_CONTEXT_LABELS[r.context] : '—')
                          : r.chapter
                            ? MEMBERSHIP_CHAPTER_LABELS[r.chapter]
                            : 'No preference'}
                      </div>
                    </div>
                    <StatusPill status={r.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
