'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import type { DocTreeGroup } from '@/lib/docs'

type Props = {
  groups: DocTreeGroup[]
}

/**
 * Client-side: docs sidebar with category grouping, active-article highlight,
 * and a local search filter over titles + summaries.
 */
export default function DocsSidebar({ groups }: Props) {
  const pathname = usePathname()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return groups
    return groups
      .map((g) => ({
        ...g,
        articles: g.articles.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            (a.summary?.toLowerCase().includes(q) ?? false)
        ),
      }))
      .filter((g) => g.articles.length > 0)
  }, [groups, query])

  function activeHref(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-6 lg:self-start">
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search docs..."
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No matches.</p>
      ) : (
        <nav className="space-y-6">
          {filtered.map((group) => (
            <div key={group.category}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                {group.category}
              </p>
              <ul className="border-l border-gray-200 space-y-0.5">
                {group.articles.map((a) => {
                  const href = `/admin/help/${a.path}`
                  const active = activeHref(href)
                  return (
                    <li key={a.path}>
                      <Link
                        href={href}
                        className={`block pl-4 py-1.5 -ml-px border-l text-sm transition-colors ${
                          active
                            ? 'border-amber text-amber font-medium bg-amber/5'
                            : 'border-transparent text-gray-700 hover:text-forest hover:border-gray-300'
                        }`}
                      >
                        {a.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      )}
    </aside>
  )
}
