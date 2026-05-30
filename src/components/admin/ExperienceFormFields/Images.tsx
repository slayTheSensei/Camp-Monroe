'use client'

import { useRef, useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase-browser'
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
import StorageBrowser from '../StorageBrowser'
import { ExperienceFormData } from '../ExperienceForm'

type Props = {
  data: ExperienceFormData
  update: <K extends keyof ExperienceFormData>(key: K, value: ExperienceFormData[K]) => void
  slug: string
}

function isStorageUrl(url: string): boolean {
  return url.includes('/storage/v1/object/public/experience-images/')
}

function extractFilename(url: string): string {
  try {
    const parts = url.split('/')
    const raw = decodeURIComponent(parts[parts.length - 1])
    // Remove timestamp prefix like "1234567890-"
    return raw.replace(/^\d+-/, '') || raw
  } catch {
    return 'Image'
  }
}

export default function ImagesFields({ data, update, slug }: Props) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [browseOpen, setBrowseOpen] = useState(false)
  const topFileInputRef = useRef<HTMLInputElement | null>(null)

  const supabase = getBrowserSupabase()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = imageIds.indexOf(active.id as string)
    const newIndex = imageIds.indexOf(over.id as string)
    if (oldIndex === -1 || newIndex === -1) return

    update('heroImages', arrayMove(data.heroImages, oldIndex, newIndex))
  }

  function updateImage(index: number, value: string) {
    const updated = [...data.heroImages]
    updated[index] = value
    update('heroImages', updated)
  }

  function removeImage(index: number) {
    update('heroImages', data.heroImages.filter((_, i) => i !== index))
  }

  async function handleFileUpload(file: File) {
    const newImages = [...data.heroImages, '']
    const targetIndex = newImages.length - 1
    update('heroImages', newImages)
    setUploadingIndex(targetIndex)

    try {
      const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, '-').toLowerCase()
      const path = `experiences/${slug || 'unsorted'}/${Date.now()}-${safeName}`

      const { error } = await supabase.storage
        .from('experience-images')
        .upload(path, file, { upsert: false })

      if (error) {
        console.error('Upload error:', error.message)
        // Remove the placeholder on failure
        update('heroImages', data.heroImages)
        return
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/experience-images/${path}`
      const arr = [...data.heroImages, publicUrl]
      update('heroImages', arr)
    } finally {
      setUploadingIndex(null)
    }
  }

  function handleBrowseSelect(url: string) {
    update('heroImages', [...data.heroImages, url])
  }

  function addUrlSlot() {
    update('heroImages', [...data.heroImages, ''])
    setShowAddMenu(false)
  }

  // Stable IDs for sortable — use URL + index to handle empty or duplicate URLs
  const imageIds = data.heroImages.map((url, i) => `${i}::${url}`)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Hero Images</h3>

        {/* Add Image dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="text-xs font-medium text-amber hover:text-amber/80 transition-colors flex items-center gap-1"
          >
            + Add Image
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"
              className={`transition-transform ${showAddMenu ? 'rotate-180' : ''}`}>
              <path d="M2 4l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {showAddMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowAddMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48 max-w-[calc(100vw-2rem)]">
                <button
                  onClick={() => {
                    setShowAddMenu(false)
                    topFileInputRef.current?.click()
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                  </svg>
                  Upload from Computer
                </button>
                <button
                  onClick={() => {
                    setShowAddMenu(false)
                    setBrowseOpen(true)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <path d="M2 4v8a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1H8L6.5 3H3a1 1 0 00-1 1z" />
                  </svg>
                  Browse Storage
                </button>
                <button
                  onClick={addUrlSlot}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <path d="M6.5 5.5a2 2 0 012.8 0l1.2 1.2a2 2 0 010 2.8l-1.2 1.2" strokeLinecap="round" />
                    <path d="M9.5 10.5a2 2 0 01-2.8 0L5.5 9.3a2 2 0 010-2.8l1.2-1.2" strokeLinecap="round" />
                  </svg>
                  Enter URL
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hidden file input for top-level upload */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={topFileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
          e.target.value = ''
        }}
      />

      {data.heroImages.length === 0 && (
        <p className="text-gray-400 text-sm py-4 text-center">No images added yet.</p>
      )}

      {/* Draggable image list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={imageIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {data.heroImages.map((url, i) => (
              <SortableImageCard
                key={imageIds[i]}
                id={imageIds[i]}
                url={url}
                index={i}
                isUploading={uploadingIndex === i}
                onUpdate={(val) => updateImage(i, val)}
                onRemove={() => removeImage(i)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Storage Browser modal */}
      <StorageBrowser
        open={browseOpen}
        onClose={() => setBrowseOpen(false)}
        onSelect={handleBrowseSelect}
      />
    </div>
  )
}

// --- Sortable image card ---

type SortableCardProps = {
  id: string
  url: string
  index: number
  isUploading: boolean
  onUpdate: (value: string) => void
  onRemove: () => void
}

function SortableImageCard({ id, url, index, isUploading, onUpdate, onRemove }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.5 : 1,
  }

  const isStorage = isStorageUrl(url)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex gap-3 items-center p-3 rounded-lg border ${
        isDragging ? 'border-amber bg-amber/5' : 'border-gray-200 bg-white'
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 touch-none"
        tabIndex={-1}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <circle cx="4" cy="3" r="1.2" />
          <circle cx="10" cy="3" r="1.2" />
          <circle cx="4" cy="7" r="1.2" />
          <circle cx="10" cy="7" r="1.2" />
          <circle cx="4" cy="11" r="1.2" />
          <circle cx="10" cy="11" r="1.2" />
        </svg>
      </button>

      {/* Index */}
      <span className="text-xs text-gray-300 font-mono w-4 shrink-0 text-center">{index + 1}</span>

      {/* Thumbnail */}
      <div className={`${isStorage ? 'w-20 h-20' : 'w-12 h-12'} rounded bg-gray-100 overflow-hidden shrink-0`}>
        {isUploading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        ) : url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="2" width="14" height="12" rx="1" />
              <circle cx="5" cy="6" r="1.5" />
              <path d="M1 12l4-4 2 2 3-3 5 5" />
            </svg>
          </div>
        )}
      </div>

      {/* Content — different for storage vs external */}
      <div className="flex-1 min-w-0">
        {isStorage ? (
          /* Storage image: filename + badge, no URL input */
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 truncate">{extractFilename(url)}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-medium rounded-full shrink-0">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 6.5a3 3 0 015.5-1.6A2 2 0 118 8H2.5" strokeLinecap="round" />
              </svg>
              Cloud Storage
            </span>
          </div>
        ) : (
          /* External URL: editable text input */
          <input
            type="text"
            value={url}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            placeholder="https://... image URL"
          />
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
        title="Remove image"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4l8 8M12 4L4 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
