'use client'

import { useCallback, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/admin/ui/Card'
import { Button } from '@/components/admin/ui/Button'

export type EditableField = {
  key: string
  label: string
  type: 'text' | 'longtext'
  placeholder?: string
  short?: boolean
}

export type EditableItem = {
  id: string
  sortOrder: number
  isVisible: boolean
} & Record<string, string | number | boolean>

type Props<T extends EditableItem> = {
  items: T[]
  fields: EditableField[]
  /** What an empty new item looks like. */
  emptyTemplate: Omit<T, 'id'>
  /** Server actions. */
  onCreate: (input: Omit<T, 'id' | 'isVisible'>) => Promise<{ error?: string } | { id: string }>
  onSave: (id: string, update: Partial<T>) => Promise<{ error?: string }>
  onDelete: (id: string) => Promise<{ error?: string }>
  /** Human label e.g. "timeline item" / "way to partner". */
  noun: string
}

export default function OrderedItemsEditor<T extends EditableItem>({
  items: initialItems,
  fields,
  emptyTemplate,
  onCreate,
  onSave,
  onDelete,
  noun,
}: Props<T>) {
  const router = useRouter()
  const [items, setItems] = useState<T[]>(initialItems)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Partial<T>>({})
  const [creating, setCreating] = useState(false)
  const [newDraft, setNewDraft] = useState<Partial<T>>({})
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const beginEdit = (item: T) => {
    setEditingId(item.id)
    setDraft({ ...item })
    setError(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft({})
  }

  const handleSave = useCallback(
    (item: T) => {
      const update: Partial<T> = {}
      let changed = false
      for (const f of fields) {
        const next = (draft as Record<string, unknown>)[f.key]
        if (next !== undefined && next !== item[f.key]) {
          ;(update as Record<string, unknown>)[f.key] = next
          changed = true
        }
      }
      if (!changed) {
        cancelEdit()
        return
      }
      setError(null)
      startTransition(async () => {
        const res = await onSave(item.id, update)
        if (res.error) {
          setError(res.error)
          return
        }
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? ({ ...i, ...update } as T) : i))
        )
        cancelEdit()
        flash('Saved')
        router.refresh()
      })
    },
    [draft, fields, onSave, router]
  )

  const handleToggleVisible = useCallback(
    (item: T) => {
      const next = !item.isVisible
      startTransition(async () => {
        const res = await onSave(item.id, { isVisible: next } as Partial<T>)
        if (res.error) {
          setError(res.error)
          return
        }
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? ({ ...i, isVisible: next } as T) : i
          )
        )
        flash(next ? 'Visible' : 'Hidden')
        router.refresh()
      })
    },
    [onSave, router]
  )

  const handleMove = useCallback(
    (item: T, direction: -1 | 1) => {
      const idx = items.findIndex((i) => i.id === item.id)
      const swapIdx = idx + direction
      if (swapIdx < 0 || swapIdx >= items.length) return
      const swap = items[swapIdx]
      const myOrder = item.sortOrder
      const otherOrder = swap.sortOrder
      startTransition(async () => {
        const [a, b] = await Promise.all([
          onSave(item.id, { sortOrder: otherOrder } as Partial<T>),
          onSave(swap.id, { sortOrder: myOrder } as Partial<T>),
        ])
        if (a.error || b.error) {
          setError(a.error || b.error || 'Failed to reorder')
          return
        }
        setItems((prev) => {
          const next = [...prev]
          ;[next[idx], next[swapIdx]] = [
            { ...next[swapIdx], sortOrder: myOrder } as T,
            { ...next[idx], sortOrder: otherOrder } as T,
          ]
          return next.sort((x, y) => x.sortOrder - y.sortOrder)
        })
        router.refresh()
      })
    },
    [items, onSave, router]
  )

  const handleDelete = useCallback(
    (item: T) => {
      if (
        !confirm(
          `Delete this ${noun}? This cannot be undone.`
        )
      )
        return
      startTransition(async () => {
        const res = await onDelete(item.id)
        if (res.error) {
          setError(res.error)
          return
        }
        setItems((prev) => prev.filter((i) => i.id !== item.id))
        flash('Deleted')
        router.refresh()
      })
    },
    [noun, onDelete, router]
  )

  const handleCreate = useCallback(() => {
    const input = { ...emptyTemplate, ...newDraft } as Omit<T, 'id' | 'isVisible'>
    setError(null)
    startTransition(async () => {
      const res = await onCreate(input)
      if ('error' in res && res.error) {
        setError(res.error)
        return
      }
      const newId = (res as { id: string }).id
      setItems((prev) =>
        [
          ...prev,
          {
            ...emptyTemplate,
            ...newDraft,
            id: newId,
            isVisible: true,
          } as T,
        ].sort((x, y) => x.sortOrder - y.sortOrder)
      )
      setCreating(false)
      setNewDraft({})
      flash('Added')
      router.refresh()
    })
  }, [emptyTemplate, newDraft, onCreate, router])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {items.length} {noun}
          {items.length === 1 ? '' : 's'} · drag-free reordering via the
          arrows
        </p>
        {!creating && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setCreating(true)
              setNewDraft({})
              setError(null)
            }}
          >
            + Add {noun}
          </Button>
        )}
      </div>

      {creating && (
        <Card padding="lg" className="border-2 border-amber/40">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            New {noun}
          </h3>
          <div className="space-y-3">
            {fields.map((f) => (
              <FieldEditor
                key={f.key}
                field={f}
                value={String(newDraft[f.key] ?? '')}
                onChange={(v) =>
                  setNewDraft((d) => ({ ...d, [f.key]: v }) as Partial<T>)
                }
              />
            ))}
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1.5 mt-3">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCreating(false)
                setNewDraft({})
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreate}
              disabled={isPending}
            >
              {isPending ? 'Adding…' : 'Add'}
            </Button>
          </div>
        </Card>
      )}

      {items.length === 0 && !creating ? (
        <Card padding="lg">
          <p className="text-sm text-gray-500 text-center py-6">
            No {noun}s yet. Click "Add {noun}" to create the first one.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((item, idx) => {
            const isEditing = editingId === item.id
            return (
              <li key={item.id}>
                <Card
                  padding="lg"
                  className={`${
                    !item.isVisible ? 'opacity-60' : ''
                  } ${isEditing ? 'border-2 border-amber/40' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Reorder arrows */}
                    <div className="flex flex-col gap-0.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleMove(item, -1)}
                        disabled={idx === 0 || isPending}
                        aria-label="Move up"
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-amber disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(item, 1)}
                        disabled={idx === items.length - 1 || isPending}
                        aria-label="Move down"
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-amber disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        ▼
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-3">
                          {fields.map((f) => (
                            <FieldEditor
                              key={f.key}
                              field={f}
                              value={String(draft[f.key] ?? item[f.key] ?? '')}
                              onChange={(v) =>
                                setDraft((d) => ({ ...d, [f.key]: v }) as Partial<T>)
                              }
                            />
                          ))}
                          {error && (
                            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1.5">
                              {error}
                            </p>
                          )}
                          <div className="flex justify-end gap-2 pt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEdit}
                              disabled={isPending}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSave(item)}
                              disabled={isPending}
                            >
                              {isPending ? 'Saving…' : 'Save'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {fields.map((f, fi) => {
                            const val = String(item[f.key] ?? '')
                            if (!val) return null
                            return (
                              <div
                                key={f.key}
                                className={
                                  fi === 0
                                    ? 'text-xs font-medium text-amber uppercase tracking-wider'
                                    : fi === 1
                                      ? 'text-base font-semibold text-gray-900'
                                      : 'text-sm text-gray-600 leading-relaxed'
                                }
                              >
                                {val}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleVisible(item)}
                          disabled={isPending}
                          aria-label={item.isVisible ? 'Hide' : 'Show'}
                          className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-amber border border-transparent hover:border-amber/30 rounded transition-colors"
                        >
                          {item.isVisible ? 'Hide' : 'Show'}
                        </button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => beginEdit(item)}
                          disabled={isPending}
                        >
                          Edit
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={isPending}
                          aria-label="Delete"
                          className="px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-2 bg-green-700 text-white text-sm rounded-md shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: EditableField
  value: string
  onChange: (v: string) => void
}) {
  if (field.type === 'longtext') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">
          {field.label}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={field.placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60 resize-y"
        />
      </div>
    )
  }
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">
        {field.label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={`${
          field.short ? 'w-32' : 'w-full'
        } px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber/60`}
      />
    </div>
  )
}
