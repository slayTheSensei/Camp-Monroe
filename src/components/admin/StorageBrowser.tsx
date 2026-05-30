'use client'

import { useState, useEffect, useCallback } from 'react'
import { getBrowserSupabase } from '@/lib/supabase-browser'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

type StorageItem = {
  name: string
  isFolder: boolean
  url?: string
}

export default function StorageBrowser({ open, onClose, onSelect }: Props) {
  const [path, setPath] = useState('')
  const [items, setItems] = useState<StorageItem[]>([])
  const [loading, setLoading] = useState(false)

  const supabase = getBrowserSupabase()

  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/experience-images`

  const listPath = useCallback(async (folderPath: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.storage
        .from('experience-images')
        .list(folderPath || '', { limit: 200, sortBy: { column: 'name', order: 'asc' } })

      if (error) {
        console.error('Storage list error:', error.message)
        setItems([])
        return
      }

      const mapped: StorageItem[] = (data ?? [])
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .map((f) => {
          const isFolder = !f.metadata || f.metadata.mimetype === undefined
          const fullPath = folderPath ? `${folderPath}/${f.name}` : f.name
          return {
            name: f.name,
            isFolder,
            url: isFolder ? undefined : `${baseUrl}/${fullPath}`,
          }
        })

      setItems(mapped)
    } finally {
      setLoading(false)
    }
  }, [supabase.storage, baseUrl])

  useEffect(() => {
    if (open) {
      setPath('')
      listPath('')
    }
  }, [open, listPath])

  function navigateToFolder(folderName: string) {
    const next = path ? `${path}/${folderName}` : folderName
    setPath(next)
    listPath(next)
  }

  function navigateUp() {
    const parts = path.split('/')
    parts.pop()
    const next = parts.join('/')
    setPath(next)
    listPath(next)
  }

  function handleSelect(url: string) {
    onSelect(url)
    onClose()
  }

  if (!open) return null

  const folders = items.filter((i) => i.isFolder)
  const images = items.filter((i) => !i.isFolder)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white shadow-xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[80vh] sm:rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Browse Storage</h3>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              /{path || '(root)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Breadcrumb / back */}
        {path && (
          <div className="px-5 py-2 border-b border-gray-100">
            <button
              onClick={navigateUp}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 3L5 7l4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">No files found in this folder.</p>
          ) : (
            <div className="space-y-4">
              {/* Folders */}
              {folders.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Folders</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {folders.map((folder) => (
                      <button
                        key={folder.name}
                        onClick={() => navigateToFolder(folder.name)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber shrink-0">
                          <path d="M2 4v8a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1H8L6.5 3H3a1 1 0 00-1 1z" />
                        </svg>
                        <span className="text-sm text-gray-700 truncate">{folder.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Images grid */}
              {images.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Images ({images.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((img) => (
                      <button
                        key={img.name}
                        onClick={() => handleSelect(img.url!)}
                        className="group relative aspect-square rounded-md overflow-hidden bg-gray-100 hover:ring-2 hover:ring-amber transition-all"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-[10px] truncate">{img.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
