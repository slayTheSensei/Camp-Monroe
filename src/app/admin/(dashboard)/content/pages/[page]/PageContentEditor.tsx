'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/admin/ui/Card'
import Section from '@/components/admin/ui/Section'
import { Button } from '@/components/admin/ui/Button'
import { savePageContent } from '../actions'
import type { PageContentRow } from '@/lib/types/content'

type Props = {
  page: string
  rows: PageContentRow[]
}

/**
 * Editor for one page's page_content rows. Groups rows by block and
 * renders an inline-edit input per (block, field). Save is per-row so
 * each field can be saved independently — keeps the surface small.
 */
export default function PageContentEditor({ page, rows }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const r of rows) initial[r.id] = r.value
    return initial
  })
  const [savedFlash, setSavedFlash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const blocks = useMemo(() => {
    const grouped: Record<string, PageContentRow[]> = {}
    for (const r of rows) {
      if (!grouped[r.block]) grouped[r.block] = []
      grouped[r.block].push(r)
    }
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
  }, [rows])

  const handleSave = (row: PageContentRow) => {
    const value = drafts[row.id] ?? row.value
    if (value === row.value) return
    setError(null)
    startTransition(async () => {
      const res = await savePageContent({
        page,
        block: row.block,
        field: row.field,
        value,
        type: row.type,
      })
      if (res.error) {
        setError(res.error)
        return
      }
      setSavedFlash(row.id)
      setTimeout(() => setSavedFlash(null), 1800)
      router.refresh()
    })
  }

  if (blocks.length === 0) {
    return (
      <Card padding="lg">
        <p className="text-sm text-gray-500 text-center py-6">
          No editable fields seeded for this page yet.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {blocks.map(([blockName, blockRows]) => (
        <Section key={blockName} title={formatBlockName(blockName)}>
          <Card padding="lg">
            <div className="space-y-5">
              {blockRows.map((row) => {
                const draftValue = drafts[row.id] ?? row.value
                const dirty = draftValue !== row.value
                const justSaved = savedFlash === row.id
                return (
                  <div key={row.id} className="space-y-1.5">
                    <div className="flex items-end justify-between gap-2">
                      <label
                        htmlFor={row.id}
                        className="text-xs font-medium text-gray-700 uppercase tracking-wider"
                      >
                        {formatFieldName(row.field)}
                      </label>
                      <div className="flex items-center gap-2">
                        {justSaved && (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ saved
                          </span>
                        )}
                        {dirty && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSave(row)}
                            disabled={isPending}
                          >
                            {isPending ? 'Saving…' : 'Save'}
                          </Button>
                        )}
                      </div>
                    </div>
                    {row.type === 'longtext' || row.value.length > 80 ? (
                      <textarea
                        id={row.id}
                        value={draftValue}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [row.id]: e.target.value,
                          }))
                        }
                        rows={Math.min(8, Math.max(2, Math.ceil(draftValue.length / 60)))}
                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60 resize-y ${
                          dirty ? 'border-amber/40 bg-amber/5' : 'border-gray-200'
                        }`}
                      />
                    ) : (
                      <input
                        id={row.id}
                        type="text"
                        value={draftValue}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [row.id]: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60 ${
                          dirty ? 'border-amber/40 bg-amber/5' : 'border-gray-200'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </Section>
      ))}

      {error && (
        <div className="fixed bottom-6 right-6 px-4 py-2 bg-red-600 text-white text-sm rounded-md shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  )
}

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
