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

type Tab = 'pages' | 'timeline' | 'ways' | 'legacy'
type PageKey = 'site' | 'home' | 'visit'

type Props = {
  initialTab: string
  initialPage: string
  pageContent: Record<PageKey, PageContentRow[]>
  timeline: TimelineItem[]
  ways: WayToPartnerItem[]
  legacyRowCount: number
}

const PAGE_META: Record<
  PageKey,
  { label: string; sub: string; publicPath: string | null }
> = {
  site: {
    label: 'Site-wide',
    sub: 'CTA band + Footer — appears on every page',
    publicPath: '/',
  },
  home: {
    label: 'Home',
    sub: 'Hero, story split, Du Bois pull quote',
    publicPath: '/',
  },
  visit: {
    label: 'Visit',
    sub: 'Mode-specific headlines, leads, and bridge line',
    publicPath: '/visit',
  },
}

export default function ContentDashboard({
  initialTab,
  initialPage,
  pageContent,
  timeline,
  ways,
  legacyRowCount,
}: Props) {
  const validTab: Tab = (['pages', 'timeline', 'ways', 'legacy'] as Tab[]).includes(
    initialTab as Tab
  )
    ? (initialTab as Tab)
    : 'pages'
  const validPage: PageKey = (['site', 'home', 'visit'] as PageKey[]).includes(
    initialPage as PageKey
  )
    ? (initialPage as PageKey)
    : 'site'

  const [tab, setTab] = useState<Tab>(validTab)
  const [page, setPage] = useState<PageKey>(validPage)

  return (
    <div className="space-y-4">
      {/* Primary tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6 overflow-x-auto">
          <TabButton active={tab === 'pages'} onClick={() => setTab('pages')}>
            Pages copy
          </TabButton>
          <TabButton
            active={tab === 'timeline'}
            onClick={() => setTab('timeline')}
          >
            History timeline{' '}
            <span className="text-xs text-gray-400 ml-1">({timeline.length})</span>
          </TabButton>
          <TabButton active={tab === 'ways'} onClick={() => setTab('ways')}>
            Partner ways{' '}
            <span className="text-xs text-gray-400 ml-1">({ways.length})</span>
          </TabButton>
          <TabButton active={tab === 'legacy'} onClick={() => setTab('legacy')}>
            Legacy{' '}
            <span className="text-xs text-gray-400 ml-1">({legacyRowCount})</span>
          </TabButton>
        </nav>
      </div>

      {tab === 'pages' && (
        <PagesEditor
          page={page}
          onPageChange={setPage}
          rows={pageContent[page]}
        />
      )}

      {tab === 'timeline' && (
        <div className="pt-2">
          <p className="text-xs text-gray-500 mb-4">
            Rendered on{' '}
            <Link
              href="/history"
              target="_blank"
              className="text-amber hover:underline"
            >
              /history ↗
            </Link>
          </p>
          <TimelineAdmin items={timeline} />
        </div>
      )}

      {tab === 'ways' && (
        <div className="pt-2">
          <p className="text-xs text-gray-500 mb-4">
            Rendered on{' '}
            <Link
              href="/partner"
              target="_blank"
              className="text-amber hover:underline"
            >
              /partner ↗
            </Link>
          </p>
          <PartnerWaysAdmin items={ways} />
        </div>
      )}

      {tab === 'legacy' && (
        <div className="pt-4">
          <div className="bg-amber/10 border border-amber/20 rounded-md px-4 py-3 mb-4">
            <p className="text-sm text-gray-800">
              <strong>{legacyRowCount} rows</strong> from the pre-redesign{' '}
              <code className="text-xs bg-amber/20 px-1.5 py-0.5 rounded">
                site_content
              </code>{' '}
              table. <em>Not currently rendered on the public site.</em>
            </p>
            <p className="text-xs text-gray-600 mt-1.5">
              Preserved for reference. Open the full editor if you need to look
              up any of the old copy.
            </p>
          </div>
          <Link
            href="/admin/content/legacy"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded text-gray-700 hover:border-amber hover:text-amber transition-colors"
          >
            Open legacy editor →
          </Link>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Tab button
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
      className={`whitespace-nowrap py-2.5 px-1 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-amber text-amber'
          : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

// =============================================================================
// Pages editor — sub-tabs + auto-save block editor
// =============================================================================

function PagesEditor({
  page,
  onPageChange,
  rows,
}: {
  page: PageKey
  onPageChange: (p: PageKey) => void
  rows: PageContentRow[]
}) {
  const meta = PAGE_META[page]

  return (
    <div className="space-y-4">
      {/* Sub-tabs for which page to edit */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {(Object.keys(PAGE_META) as PageKey[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                page === p
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {PAGE_META[p].label}
            </button>
          ))}
        </div>
        {meta.publicPath && (
          <a
            href={meta.publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber hover:text-amber/80 font-medium whitespace-nowrap"
          >
            View {meta.publicPath} ↗
          </a>
        )}
      </div>

      <p className="text-xs text-gray-500">{meta.sub}</p>

      <BlocksList page={page} rows={rows} />
    </div>
  )
}

// =============================================================================
// Blocks list — auto-save, tight, scannable
// =============================================================================

function BlocksList({ page, rows }: { page: PageKey; rows: PageContentRow[] }) {
  // Group by block, preserve insertion order within block
  const blocks = useMemo(() => {
    const map = new Map<string, PageContentRow[]>()
    for (const r of rows) {
      if (!map.has(r.block)) map.set(r.block, [])
      map.get(r.block)!.push(r)
    }
    return Array.from(map.entries())
  }, [rows])

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
    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
      {blocks.map(([blockName, blockRows]) => (
        <BlockGroup
          key={`${page}-${blockName}`}
          name={blockName}
          rows={blockRows}
          pageKey={page}
        />
      ))}
    </div>
  )
}

function BlockGroup({
  name,
  rows,
  pageKey,
}: {
  name: string
  rows: PageContentRow[]
  pageKey: PageKey
}) {
  const title = formatBlockName(name)
  return (
    <div className="px-5 py-4">
      <h3 className="text-xs font-semibold text-amber uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-3">
        {rows.map((row) => (
          <FieldRow key={row.id} row={row} pageKey={pageKey} />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// Field row — auto-save on blur with debounced "Saving…" indicator
// =============================================================================

type FieldStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

function FieldRow({
  row,
  pageKey,
}: {
  row: PageContentRow
  pageKey: PageKey
}) {
  const router = useRouter()
  const [value, setValue] = useState(row.value)
  const [savedValue, setSavedValue] = useState(row.value)
  const [status, setStatus] = useState<FieldStatus>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const savedAt = useRef<number | null>(null)

  const dirty = value !== savedValue

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
      savedAt.current = Date.now()
      setStatus('saved')
      router.refresh()
      // Drop the "saved" indicator after 2 seconds
      setTimeout(() => {
        // Only clear if no new edits happened in the meantime
        setStatus((s) => (s === 'saved' ? 'idle' : s))
      }, 2000)
    })
  }, [value, savedValue, pageKey, row.block, row.field, row.type, router])

  const isLong = row.type === 'longtext' || savedValue.length > 80

  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)_72px] items-start gap-3">
      <label
        htmlFor={row.id}
        className="text-xs font-medium text-gray-600 mt-2 leading-tight"
      >
        {formatFieldName(row.field)}
      </label>

      <div>
        {isLong ? (
          <textarea
            id={row.id}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setStatus('dirty')
            }}
            onBlur={handleSave}
            rows={Math.min(6, Math.max(2, Math.ceil(value.length / 70)))}
            className={`w-full px-2.5 py-1.5 text-sm rounded border resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60 ${
              dirty ? 'border-amber/50 bg-amber/5' : 'border-gray-200 bg-white'
            }`}
          />
        ) : (
          <input
            id={row.id}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setStatus('dirty')
            }}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className={`w-full px-2.5 py-1.5 text-sm rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60 ${
              dirty ? 'border-amber/50 bg-amber/5' : 'border-gray-200 bg-white'
            }`}
          />
        )}
        {errMsg && (
          <p className="text-xs text-red-600 mt-1">{errMsg}</p>
        )}
      </div>

      <StatusIndicator status={status} pending={isPending} dirty={dirty} />
    </div>
  )
}

function StatusIndicator({
  status,
  pending,
  dirty,
}: {
  status: FieldStatus
  pending: boolean
  dirty: boolean
}) {
  if (pending || status === 'saving') {
    return (
      <span className="text-xs text-gray-400 mt-2 leading-tight">
        Saving…
      </span>
    )
  }
  if (status === 'saved') {
    return (
      <span className="text-xs text-green-600 font-medium mt-2 leading-tight">
        ✓ Saved
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="text-xs text-red-600 font-medium mt-2 leading-tight">
        Failed
      </span>
    )
  }
  if (dirty) {
    return (
      <span className="text-xs text-amber mt-2 leading-tight">
        Unsaved
      </span>
    )
  }
  return null
}

// =============================================================================
// Formatters
// =============================================================================

function formatBlockName(s: string): string {
  return s
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function formatFieldName(s: string): string {
  return s
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
