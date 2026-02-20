'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import { Experience } from '@/types/experience'

type ExperienceRow = Experience & { id: string }

type Props = {
  experiences: ExperienceRow[]
}

const statusFilters = ['All', 'Available', 'Coming Soon', 'Draft', 'Sold Out'] as const
const statusMap: Record<string, string> = {
  'All': '',
  'Available': 'available',
  'Coming Soon': 'coming-soon',
  'Draft': 'draft',
  'Sold Out': 'sold-out',
}

const statusConfig: Record<string, { label: string; selectClass: string }> = {
  available: {
    label: 'Available',
    selectClass: 'bg-green-50 text-green-700 border-green-200',
  },
  'coming-soon': {
    label: 'Coming Soon',
    selectClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'sold-out': {
    label: 'Sold Out',
    selectClass: 'bg-red-50 text-red-700 border-red-200',
  },
  draft: {
    label: 'Draft',
    selectClass: 'bg-gray-50 text-gray-500 border-gray-200',
  },
}

// SortableRow sub-component
type SortableRowProps = {
  exp: ExperienceRow
  dragDisabled: boolean
  onStatusChange: (id: string, status: string) => void
  statusSaved: Record<string, boolean>
  onDuplicate: (exp: ExperienceRow) => void
  duplicatingId: string | null
  duplicatedId: string | null
  onDelete: (exp: ExperienceRow) => void
}

function SortableRow({
  exp,
  dragDisabled,
  onStatusChange,
  statusSaved,
  onDuplicate,
  duplicatingId,
  duplicatedId,
  onDelete,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exp.id, disabled: dragDisabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const currentStatus = exp.status ?? 'draft'
  const cfg = statusConfig[currentStatus] ?? statusConfig.draft

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="hover:bg-gray-50/50 transition-colors group"
    >
      {/* Drag handle column */}
      <td className="px-2 py-3 w-8">
        {dragDisabled ? (
          <span
            title="Remove filter to reorder"
            className="text-gray-200 cursor-not-allowed select-none text-lg leading-none"
          >
            ⠿
          </span>
        ) : (
          <span
            {...attributes}
            {...listeners}
            className="text-gray-300 group-hover:text-gray-400 cursor-grab active:cursor-grabbing select-none text-lg leading-none"
          >
            ⠿
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        <Link href={`/admin/experiences/${exp.id}`} className="font-medium text-gray-900 hover:text-amber transition-colors">
          {exp.title}
        </Link>
        <p className="text-gray-400 text-xs mt-0.5">/{exp.slug}</p>
      </td>
      <td className="px-4 py-3 text-gray-600">{exp.type}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <select
            value={currentStatus}
            onChange={(e) => onStatusChange(exp.id, e.target.value)}
            className={`text-xs font-medium rounded-full border px-2 py-0.5 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-offset-1 ${cfg.selectClass}`}
          >
            <option value="draft">Draft</option>
            <option value="available">Available</option>
            <option value="coming-soon">Coming Soon</option>
            <option value="sold-out">Sold Out</option>
          </select>
          {statusSaved[exp.id] && (
            <span className="text-green-600 text-xs font-medium">✓</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-gray-600">
        ${exp.price.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-gray-500">{exp.dates}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-end items-center">
          <Link
            href={`/admin/experiences/${exp.id}`}
            className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => onDuplicate(exp)}
            disabled={duplicatingId === exp.id}
            className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {duplicatingId === exp.id
              ? 'Duplicating...'
              : duplicatedId === exp.id
              ? '✓ Duplicated'
              : 'Duplicate'}
          </button>
          <button
            onClick={() => onDelete(exp)}
            className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function ExperienceList({ experiences: initialExperiences }: Props) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [experiences, setExperiences] = useState<ExperienceRow[]>(initialExperiences)
  const [deleteTarget, setDeleteTarget] = useState<ExperienceRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)
  const [duplicatedId, setDuplicatedId] = useState<string | null>(null)
  const [statusSaved, setStatusSaved] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleFilterChange(s: string) {
    setFilter(s)
    setSearch('')
  }

  const filtered = experiences.filter((e) => {
    const matchesStatus = filter === 'All' || e.status === statusMap[filter]
    const q = search.toLowerCase()
    const matchesSearch = !search || e.title.toLowerCase().includes(q) || e.slug.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await supabase.from('experiences').delete().eq('id', deleteTarget.id)
    setExperiences((prev) => prev.filter((e) => e.id !== deleteTarget.id))
    setDeleting(false)
    setDeleteTarget(null)
    router.refresh()
  }

  async function handleDuplicate(exp: ExperienceRow) {
    setDuplicatingId(exp.id)
    const { id, ...rest } = exp

    const { error } = await supabase.from('experiences').insert({
      slug: rest.slug + '-copy',
      type: rest.type,
      title: rest.title + ' (Copy)',
      subtitle: rest.subtitle,
      location: rest.location,
      region: rest.region,
      dates: rest.dates,
      duration: rest.duration,
      group_size: rest.groupSize,
      price: rest.price,
      deposit_amount: rest.depositAmount ?? null,
      hero_images: rest.heroImages,
      pull_quote: rest.pullQuote,
      pull_quote_image: rest.pullQuoteImage,
      short_description: rest.shortDescription,
      long_description: rest.longDescription,
      itinerary: rest.itinerary,
      included: rest.included,
      excluded: rest.excluded,
      details: rest.details,
      testimonials: rest.testimonials,
      faqs: rest.faqs,
      tag: rest.tag ?? null,
      tag_color: rest.tagColor ?? null,
      difficulty: rest.difficulty ?? null,
      status: 'draft',
      sort_order: 99,
    })

    void id
    void error

    setDuplicatingId(null)
    setDuplicatedId(exp.id)
    setTimeout(() => setDuplicatedId(null), 2000)
    router.refresh()
  }

  const handleStatusChange = useCallback(
    async (id: string, newStatus: string) => {
      // Optimistic update
      setExperiences((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus as ExperienceRow['status'] } : e))
      )
      await supabase.from('experiences').update({ status: newStatus }).eq('id', id)
      setStatusSaved((prev) => ({ ...prev, [id]: true }))
      setTimeout(() => setStatusSaved((prev) => ({ ...prev, [id]: false })), 2000)
    },
    [supabase]
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = experiences.findIndex((e) => e.id === active.id)
    const newIndex = experiences.findIndex((e) => e.id === over.id)
    const reordered = arrayMove(experiences, oldIndex, newIndex)

    // Optimistic update
    setExperiences(reordered)

    // Batch update sort_order
    const updates = reordered.map((exp, idx) =>
      supabase.from('experiences').update({ sort_order: idx }).eq('id', exp.id)
    )
    await Promise.all(updates)
  }

  const dragDisabled = filter !== 'All'

  return (
    <div>
      {/* Search + filter row */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or slug..."
          className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 w-60 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
        />
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === s
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No experiences match this filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                <th className="px-2 py-3 w-8" />
                <th className="px-4 py-3 font-medium">Experience</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filtered.map((e) => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((exp) => (
                    <SortableRow
                      key={exp.id}
                      exp={exp}
                      dragDisabled={dragDisabled}
                      onStatusChange={handleStatusChange}
                      statusSaved={statusSaved}
                      onDuplicate={handleDuplicate}
                      duplicatingId={duplicatingId}
                      duplicatedId={duplicatedId}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>
      )}

      {/* Delete dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          title="Delete Experience"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
