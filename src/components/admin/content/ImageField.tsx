'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase-browser'
import { savePageContent } from '@/app/admin/(dashboard)/content/pages/actions'

/**
 * Single-image editor for a page_content row of type 'image_url'.
 *
 * Three ways to set an image:
 *   1. Upload a file → goes to Supabase Storage at experience-images/site-content/<page>/<block>/<file>
 *   2. Paste a URL — saved verbatim
 *   3. Use a /assets/photos/* path (the bundled photo library)
 *
 * Saves to page_content via savePageContent server action which also
 * revalidates the affected public pages.
 */

type FieldStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

type Props = {
  page: string
  block: string
  field: string
  rowId: string
  initialValue: string
  label: string
  hint?: string
}

const BUCKET = 'experience-images'

export default function ImageField({
  page,
  block,
  field,
  initialValue,
  label,
  hint,
}: Props) {
  const router = useRouter()
  const [value, setValue] = useState(initialValue)
  const [savedValue, setSavedValue] = useState(initialValue)
  const [status, setStatus] = useState<FieldStatus>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [urlMode, setUrlMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const supabase = getBrowserSupabase()
  const dirty = value !== savedValue
  const isStorageUrl = value.includes(`/storage/v1/object/public/${BUCKET}/`)
  const isLocalAsset = value.startsWith('/assets/')

  const saveValue = (next: string) => {
    setValue(next)
    setStatus('saving')
    setErrMsg(null)
    startTransition(async () => {
      const res = await savePageContent({
        page,
        block,
        field,
        value: next,
        type: 'image_url',
      })
      if (res.error) {
        setStatus('error')
        setErrMsg(res.error)
        return
      }
      setSavedValue(next)
      setStatus('saved')
      router.refresh()
      setTimeout(() => {
        setStatus((s) => (s === 'saved' ? 'idle' : s))
      }, 2000)
    })
  }

  const handleFile = async (file: File) => {
    setErrMsg(null)
    setUploading(true)
    try {
      const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, '-').toLowerCase()
      const path = `site-content/${page}/${block}/${Date.now()}-${safeName}`

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false })

      if (error) {
        setErrMsg(error.message || 'Upload failed')
        return
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
      saveValue(publicUrl)
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => saveValue('')

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <label className="text-sm font-medium text-gray-800">{label}</label>
        <StatusBadge status={status} pending={isPending} dirty={dirty} />
      </div>

      <div className="border border-gray-200 rounded-md bg-white">
        <div className="flex items-stretch">
          {/* Thumbnail */}
          <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-l-md overflow-hidden flex items-center justify-center border-r border-gray-100">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gray-300"
              >
                <rect x="2" y="3" width="16" height="14" rx="1" />
                <circle cx="7" cy="8" r="1.5" />
                <path d="M2 14l5-5 3 3 4-4 4 4" />
              </svg>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0 p-2.5 flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 text-xs text-gray-500 break-all">
                {value ? (
                  <>
                    {isStorageUrl && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 mr-1.5 bg-sky-50 text-sky-700 text-[10px] font-medium rounded">
                        Storage
                      </span>
                    )}
                    {isLocalAsset && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 mr-1.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
                        Bundled
                      </span>
                    )}
                    {!isStorageUrl && !isLocalAsset && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 mr-1.5 bg-amber/15 text-amber text-[10px] font-medium rounded">
                        External
                      </span>
                    )}
                    <span className="text-gray-600">{shortenUrl(value)}</span>
                  </>
                ) : (
                  <span className="text-gray-400 italic">No image set</span>
                )}
              </div>
              {value && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isPending}
                  className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                  title="Remove image"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 3l8 8M11 3L3 11" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || isPending}
                className="px-2.5 py-1 text-[11px] font-medium text-amber bg-amber/10 border border-amber/30 rounded hover:bg-amber/15 transition-colors disabled:opacity-50"
              >
                {value ? 'Replace…' : 'Upload…'}
              </button>
              <button
                type="button"
                onClick={() => setUrlMode((v) => !v)}
                className="px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors"
              >
                {urlMode ? 'Cancel URL' : 'Use URL'}
              </button>
            </div>

            {urlMode && (
              <input
                type="text"
                defaultValue={value}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    saveValue((e.target as HTMLInputElement).value.trim())
                    setUrlMode(false)
                  }
                }}
                onBlur={(e) => {
                  const v = e.target.value.trim()
                  if (v !== savedValue) saveValue(v)
                  setUrlMode(false)
                }}
                placeholder="https://… or /assets/photos/…"
                autoFocus
                className="w-full mt-1 px-2 py-1 text-xs border border-amber/40 bg-amber/5 rounded focus:outline-none focus:ring-2 focus:ring-amber/40"
              />
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
        />
      </div>

      {hint && (
        <p className="text-xs text-gray-500 mt-1 leading-snug">{hint}</p>
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
    return <span className="text-xs text-green-600 font-medium">✓ Saved</span>
  }
  if (status === 'error') {
    return <span className="text-xs text-red-600 font-medium">Failed</span>
  }
  if (dirty) {
    return <span className="text-xs text-amber font-medium">Unsaved</span>
  }
  return <span aria-hidden="true" className="opacity-0">·</span>
}

function shortenUrl(url: string): string {
  if (url.length <= 60) return url
  // Show start and end with ellipsis in the middle
  return url.slice(0, 35) + '…' + url.slice(-22)
}
