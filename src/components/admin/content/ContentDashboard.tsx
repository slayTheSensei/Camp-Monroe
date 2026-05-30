'use client'

import Link from 'next/link'
import { useCallback, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type {
  PageContentRow,
  TimelineItem,
  WayToPartnerItem,
} from '@/lib/types/content'
import { savePageContent } from '@/app/admin/(dashboard)/content/pages/actions'
import TimelineAdmin from '@/app/admin/(dashboard)/content/timeline/TimelineAdmin'
import PartnerWaysAdmin from '@/app/admin/(dashboard)/content/partner-ways/PartnerWaysAdmin'
import {
  getPageMeta,
  blockMetaFor,
  fieldMetaFor,
  orderedBlocksFor,
} from './contentMeta'

type Tab = 'site' | 'home' | 'history' | 'partner' | 'visit' | 'legacy'

type Props = {
  initialTab: string
  initialPage: string // legacy param — was used for sub-tabs
  pageContent: Record<'site' | 'home' | 'visit', PageContentRow[]>
  timeline: TimelineItem[]
  ways: WayToPartnerItem[]
  legacyRowCount: number
}

const TABS: { key: Tab; label: string; publicPath: string | null }[] = [
  { key: 'site', label: 'Site-wide', publicPath: '/' },
  { key: 'home', label: 'Home', publicPath: '/' },
  { key: 'history', label: 'History', publicPath: '/history' },
  { key: 'partner', label: 'Partner', publicPath: '/partner' },
  { key: 'visit', label: 'Visit', publicPath: '/visit' },
  { key: 'legacy', label: 'Legacy', publicPath: null },
]

export default function ContentDashboard({
  initialTab,
  initialPage,
  pageContent,
  timeline,
  ways,
  legacyRowCount,
}: Props) {
  // Back-compat: old links used ?tab=pages&page=home → map to ?tab=home
  const resolvedTab: Tab = (() => {
    if (initialTab === 'pages') {
      if (initialPage === 'home' || initialPage === 'visit') return initialPage
      return 'site'
    }
    if (initialTab === 'timeline') return 'history'
    if (initialTab === 'ways') return 'partner'
    if (TABS.find((t) => t.key === initialTab)) return initialTab as Tab
    return 'site'
  })()

  const [tab, setTab] = useState<Tab>(resolvedTab)
  const current = TABS.find((t) => t.key === tab)!

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="border-b border-gray-200 sticky top-0 bg-gray-50 z-10 -mt-1 pt-1">
        <nav className="-mb-px flex gap-5 overflow-x-auto">
          {TABS.map((t) => (
            <TabButton
              key={t.key}
              active={tab === t.key}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              {t.key === 'history' && (
                <Count value={timeline.length} active={tab === t.key} />
              )}
              {t.key === 'partner' && (
                <Count value={ways.length} active={tab === t.key} />
              )}
              {t.key === 'legacy' && (
                <Count value={legacyRowCount} active={tab === t.key} />
              )}
            </TabButton>
          ))}
        </nav>
      </div>

      {/* Tab header — description + view link */}
      <TabHeader
        tab={tab}
        publicPath={current.publicPath}
        timelineCount={timeline.length}
        waysCount={ways.length}
        legacyCount={legacyRowCount}
      />

      {/* Tab body */}
      {tab === 'site' && (
        <PageContentBlocks page="site" rows={pageContent.site} />
      )}
      {tab === 'home' && (
        <PageContentBlocks page="home" rows={pageContent.home} />
      )}
      {tab === 'visit' && (
        <PageContentBlocks page="visit" rows={pageContent.visit} />
      )}

      {tab === 'history' && (
        <BlockCard
          title="Timeline items"
          description="The ordered timeline rendered on /history. Drag-free reorder via the arrows, click Edit to change copy, or hide/show to manage visibility."
        >
          <TimelineAdmin items={timeline} />
        </BlockCard>
      )}

      {tab === 'partner' && (
        <BlockCard
          title="Ways to partner"
          description="The four cards in the Partner page grid. Reorder, edit, or hide."
        >
          <PartnerWaysAdmin items={ways} />
        </BlockCard>
      )}

      {tab === 'legacy' && (
        <BlockCard
          title="Legacy site_content"
          description="Pre-redesign copy data from the old home page (hero, story, mission, footer, nav, waitlist). Not currently rendered on the live site — preserved for reference."
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600">
              <strong>{legacyRowCount}</strong> rows
            </span>
            <Link
              href="/admin/content/legacy"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded text-gray-700 hover:border-amber hover:text-amber transition-colors"
            >
              Open legacy editor →
            </Link>
          </div>
        </BlockCard>
      )}
    </div>
  )
}

// =============================================================================
// Tab UI
// =============================================================================

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap py-2.5 px-0.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
        active
          ? 'border-amber text-amber'
          : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

function Count({ value, active }: { value: number; active: boolean }) {
  return (
    <span
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
        active
          ? 'bg-amber/15 text-amber'
          : 'bg-gray-100 text-gray-500'
      }`}
    >
      {value}
    </span>
  )
}

function TabHeader({
  tab,
  publicPath,
  timelineCount,
  waysCount,
  legacyCount,
}: {
  tab: Tab
  publicPath: string | null
  timelineCount: number
  waysCount: number
  legacyCount: number
}) {
  const meta = getPageMeta(tab)
  let description = ''
  if (meta) description = meta.description
  else if (tab === 'history')
    description = `Editable content on /history. The ${timelineCount}-item timeline is the only editable surface for now — pull quote and W.E.B. Files captions are still hardcoded.`
  else if (tab === 'partner')
    description = `Editable content on /partner. The ${waysCount} "ways to partner" cards are the only editable surface for now — hero, intro, and stats are still hardcoded.`
  else if (tab === 'legacy')
    description = `${legacyCount} rows from the old site_content table, kept for reference but not rendered.`

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4 pt-1">
      <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
        {description}
      </p>
      {publicPath && (
        <a
          href={publicPath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber hover:text-amber/80 font-medium whitespace-nowrap shrink-0"
        >
          View {publicPath} ↗
        </a>
      )}
    </div>
  )
}

// =============================================================================
// Generic block card wrapper
// =============================================================================

function BlockCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/40">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// =============================================================================
// page_content blocks (Site / Home / Visit tabs)
// =============================================================================

function PageContentBlocks({
  page,
  rows,
}: {
  page: 'site' | 'home' | 'visit'
  rows: PageContentRow[]
}) {
  const blocks = useMemo(() => {
    const map = new Map<string, PageContentRow[]>()
    for (const r of rows) {
      if (!map.has(r.block)) map.set(r.block, [])
      map.get(r.block)!.push(r)
    }
    const blockNames = orderedBlocksFor(page, Array.from(map.keys()))
    return blockNames.map((name) => [name, map.get(name) ?? []] as const)
  }, [rows, page])

  if (blocks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-sm text-gray-500">
          No editable fields seeded for this page yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {blocks.map(([blockName, blockRows]) => {
        const meta = blockMetaFor(page, blockName)
        return (
          <BlockCard
            key={blockName}
            title={meta.label}
            description={meta.description}
          >
            <div className="space-y-4">
              {blockRows.map((row) => (
                <FieldEditor key={row.id} row={row} pageKey={page} />
              ))}
            </div>
          </BlockCard>
        )
      })}
    </div>
  )
}

// =============================================================================
// Field editor — vertical (label above input), auto-save on blur
// =============================================================================

type FieldStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

function FieldEditor({
  row,
  pageKey,
}: {
  row: PageContentRow
  pageKey: 'site' | 'home' | 'visit'
}) {
  const router = useRouter()
  const [value, setValue] = useState(row.value)
  const [savedValue, setSavedValue] = useState(row.value)
  const [status, setStatus] = useState<FieldStatus>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dirty = value !== savedValue
  const meta = fieldMetaFor(pageKey, row.block, row.field)

  const handleSave = useCallback(() => {
    if (value === savedValue) return
    setStatus('saving')
    setErrMsg(null)
    startTransition(async () => {
      const res = await savePageContent({
        page: pageKey,
        block: row.block,
        field: row.field,
        value,
        type: row.type,
      })
      if (res.error) {
        setStatus('error')
        setErrMsg(res.error)
        return
      }
      setSavedValue(value)
      setStatus('saved')
      router.refresh()
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        setStatus((s) => (s === 'saved' ? 'idle' : s))
      }, 2000)
    })
  }, [value, savedValue, pageKey, row.block, row.field, row.type, router])

  const isLong = row.type === 'longtext' || savedValue.length > 80

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <label
          htmlFor={row.id}
          className="text-sm font-medium text-gray-800"
        >
          {meta.label}
        </label>
        <StatusBadge status={status} pending={isPending} dirty={dirty} />
      </div>

      {isLong ? (
        <textarea
          id={row.id}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (status === 'saved') setStatus('idle')
          }}
          onBlur={handleSave}
          rows={Math.min(6, Math.max(2, Math.ceil(value.length / 70)))}
          className={`w-full px-3 py-2 text-sm rounded-md border resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60 ${
            dirty
              ? 'border-amber/50 bg-amber/5'
              : 'border-gray-200 bg-white'
          }`}
        />
      ) : (
        <input
          id={row.id}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (status === 'saved') setStatus('idle')
          }}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              ;(e.target as HTMLInputElement).blur()
            }
          }}
          className={`w-full px-3 py-2 text-sm rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60 ${
            dirty
              ? 'border-amber/50 bg-amber/5'
              : 'border-gray-200 bg-white'
          }`}
        />
      )}

      {meta.hint && (
        <p className="text-xs text-gray-500 mt-1 leading-snug">{meta.hint}</p>
      )}
      {errMsg && (
        <p className="text-xs text-red-600 mt-1">{errMsg}</p>
      )}
    </div>
  )
}

function StatusBadge({
  status,
  pending,
  dirty,
}: {
  status: FieldStatus
  pending: boolean
  dirty: boolean
}) {
  if (pending || status === 'saving') {
    return <span className="text-xs text-gray-400">Saving…</span>
  }
  if (status === 'saved') {
    return (
      <span className="text-xs text-green-600 font-medium">✓ Saved</span>
    )
  }
  if (status === 'error') {
    return (
      <span className="text-xs text-red-600 font-medium">Failed</span>
    )
  }
  if (dirty) {
    return <span className="text-xs text-amber font-medium">Unsaved</span>
  }
  return <span aria-hidden="true" className="opacity-0">·</span>
}
