'use client'

import { useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import StorageBrowser from './StorageBrowser'

type ContentRow = {
  id: string
  section: string
  key: string
  label: string
  value: string | null
  type: string
  sort_order: number
}

type Props = {
  initialRows: ContentRow[]
}

const SECTIONS = ['hero', 'story', 'mission', 'footer', 'nav', 'waitlist'] as const
const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  story: 'Story',
  mission: 'Mission',
  footer: 'Footer',
  nav: 'Navigation',
  waitlist: 'Waitlist',
}

export default function SiteContentEditor({ initialRows }: Props) {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [values, setValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    initialRows.forEach((r) => { map[`${r.section}.${r.key}`] = r.value ?? '' })
    return map
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [browseField, setBrowseField] = useState<string | null>(null)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  function updateValue(fieldKey: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldKey]: value }))
  }

  async function handleImageUpload(fieldKey: string, file: File) {
    setUploadingField(fieldKey)
    try {
      const [section, key] = fieldKey.split('.')
      const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, '-').toLowerCase()
      const path = `site/${section}/${key}/${Date.now()}-${safeName}`

      const { error } = await supabase.storage
        .from('experience-images')
        .upload(path, file, { upsert: false })

      if (error) {
        showToast('error', `Upload failed: ${error.message}`)
        return
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/experience-images/${path}`
      updateValue(fieldKey, publicUrl)
    } finally {
      setUploadingField(null)
    }
  }

  async function handleSave() {
    setSaving(true)
    const sectionRows = initialRows.filter((r) => r.section === activeSection)
    const updates = sectionRows.map((r) => ({
      id: r.id,
      section: r.section,
      key: r.key,
      label: r.label,
      type: r.type,
      sort_order: r.sort_order,
      value: values[`${r.section}.${r.key}`] ?? '',
      updated_at: new Date().toISOString(),
    }))
    const { error } = await supabase.from('site_content').upsert(updates)
    setSaving(false)
    if (error) {
      showToast('error', error.message)
    } else {
      showToast('success', `${SECTION_LABELS[activeSection]} content saved`)
    }
  }

  const sectionRows = initialRows
    .filter((r) => r.section === activeSection)
    .sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div>
      {/* Section tabs */}
      <div className="relative mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto scrollbar-hide">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSection === s
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {SECTION_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-100 to-transparent rounded-r-lg pointer-events-none sm:hidden" />
      </div>

      {/* Fields */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-5">
        {sectionRows.map((row) => {
          const fieldKey = `${row.section}.${row.key}`
          const currentValue = values[fieldKey] ?? ''

          if (row.type === 'image') {
            return (
              <div key={row.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{row.label}</label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Preview thumbnail */}
                  <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    {currentValue ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={currentValue} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="3" width="16" height="14" rx="1" />
                          <circle cx="7" cy="8" r="2" />
                          <path d="M2 15l5-5 3 3 3-3 5 5" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="w-full sm:flex-1 space-y-2">
                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => { fileInputRefs.current[fieldKey] = el }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(fieldKey, file)
                          e.target.value = ''
                        }}
                      />
                      <button
                        onClick={() => fileInputRefs.current[fieldKey]?.click()}
                        disabled={uploadingField === fieldKey}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 w-full sm:w-auto"
                      >
                        {uploadingField === fieldKey ? 'Uploading...' : 'Upload'}
                      </button>
                      <button
                        onClick={() => setBrowseField(fieldKey)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors w-full sm:w-auto"
                      >
                        Browse Storage
                      </button>
                    </div>

                    {/* URL input (manual paste fallback) */}
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => updateValue(fieldKey, e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                      placeholder="Image URL (or use buttons above)"
                    />
                  </div>
                </div>
              </div>
            )
          }

          return (
            <div key={row.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{row.label}</label>
              {row.type === 'longtext' ? (
                <textarea
                  rows={3}
                  value={currentValue}
                  onChange={(e) => updateValue(fieldKey, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => updateValue(fieldKey, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-end gap-3 mt-4">
        {toast && (
          <span className={`text-sm ${toast.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {toast.message}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-forest text-cream font-semibold px-6 py-2.5 rounded-md text-sm hover:bg-forest/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : `Save ${SECTION_LABELS[activeSection]}`}
        </button>
      </div>

      {/* Storage Browser modal (shared for all image fields) */}
      <StorageBrowser
        open={browseField !== null}
        onClose={() => setBrowseField(null)}
        onSelect={(url) => {
          if (browseField) {
            updateValue(browseField, url)
          }
          setBrowseField(null)
        }}
      />
    </div>
  )
}
