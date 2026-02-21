'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Experience } from '@/types/experience'
import BasicInfoFields from './ExperienceFormFields/BasicInfo'
import PricingFields from './ExperienceFormFields/Pricing'
import ContentFields from './ExperienceFormFields/Content'
import ImagesFields from './ExperienceFormFields/Images'
import ItineraryEditor from './ExperienceFormFields/ItineraryEditor'
import IncludedEditor from './ExperienceFormFields/IncludedEditor'
import ExcludedEditor from './ExperienceFormFields/ExcludedEditor'
import DetailsEditor from './ExperienceFormFields/DetailsEditor'
import TestimonialsEditor from './ExperienceFormFields/TestimonialsEditor'
import FaqEditor from './ExperienceFormFields/FaqEditor'
import DeleteConfirmDialog from './DeleteConfirmDialog'

export type ExperienceFormData = Experience

const tabs = [
  'Basics',
  'Pricing',
  'Content',
  'Images',
  'Itinerary',
  'Logistics',
  'Details',
  'Social Proof',
] as const

type Tab = (typeof tabs)[number]

type Props = {
  initialData?: ExperienceFormData & { id: string }
  isNew?: boolean
  slug?: string
}

function createEmptyExperience(): ExperienceFormData {
  return {
    slug: '',
    type: 'Weekend Camping',
    title: '',
    subtitle: '',
    location: '',
    region: '',
    dates: '',
    duration: '',
    groupSize: 12,
    price: 0,
    depositAmount: undefined,
    heroImages: [],
    pullQuote: '',
    pullQuoteImage: '',
    shortDescription: '',
    longDescription: '',
    itinerary: [],
    included: [],
    excluded: [],
    details: [],
    testimonials: [],
    faqs: [],
    tag: undefined,
    tagColor: undefined,
    difficulty: undefined,
    status: 'draft',
  }
}

function hasContent(tab: Tab, data: ExperienceFormData): boolean {
  switch (tab) {
    case 'Basics':
      return !!data.title
    case 'Pricing':
      return data.price > 0
    case 'Content':
      return !!data.shortDescription
    case 'Images':
      return data.heroImages.length > 0
    case 'Itinerary':
      return data.itinerary.length > 0
    case 'Logistics':
      return data.included.length > 0 || data.excluded.length > 0
    case 'Details':
      return data.details.length > 0
    case 'Social Proof':
      return data.testimonials.length > 0 || data.faqs.length > 0
  }
}

function formatLastSaved(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)

  if (diffSec < 10) return 'Saved just now'
  if (diffSec < 60) return `Saved ${diffSec} sec ago`
  if (diffMin < 60) return `Saved ${diffMin} min ago`
  return `Saved at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

export default function ExperienceForm({ initialData, isNew, slug }: Props) {
  const [data, setData] = useState<ExperienceFormData>(initialData ?? createEmptyExperience())
  const [activeTab, setActiveTab] = useState<Tab>('Basics')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [, setTick] = useState(0)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Tick every minute so relative time updates
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  // Warn on tab close when dirty
  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const update = useCallback(<K extends keyof ExperienceFormData>(key: K, value: ExperienceFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }, [])

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleSave() {
    setSaving(true)

    const row = {
      slug: data.slug,
      type: data.type,
      title: data.title,
      subtitle: data.subtitle,
      location: data.location,
      region: data.region,
      dates: data.dates,
      duration: data.duration,
      group_size: data.groupSize,
      price: data.price,
      deposit_amount: data.depositAmount ?? null,
      hero_images: data.heroImages,
      pull_quote: data.pullQuote,
      pull_quote_image: data.pullQuoteImage,
      short_description: data.shortDescription,
      long_description: data.longDescription,
      itinerary: data.itinerary,
      included: data.included,
      excluded: data.excluded,
      details: data.details,
      testimonials: data.testimonials,
      faqs: data.faqs,
      tag: data.tag ?? null,
      tag_color: data.tagColor ?? null,
      difficulty: data.difficulty ?? null,
      status: data.status,
    }

    let error
    if (isNew) {
      const res = await supabase.from('experiences').insert(row).select('id').single()
      error = res.error
      if (!error && res.data) {
        setIsDirty(false)
        setLastSaved(new Date())
        router.push(`/admin/experiences/${res.data.id}`)
        router.refresh()
        showToast('success', 'Experience created')
        setSaving(false)
        return
      }
    } else if (initialData?.id) {
      const res = await supabase.from('experiences').update(row).eq('id', initialData.id)
      error = res.error
    }

    setSaving(false)

    if (error) {
      showToast('error', error.message)
    } else {
      setIsDirty(false)
      setLastSaved(new Date())
      showToast('success', 'Changes saved')
      router.refresh()
    }
  }

  function handleBackToList() {
    if (isDirty) {
      setShowDiscardDialog(true)
    } else {
      router.push('/admin/experiences')
    }
  }

  const activeSlug = slug ?? data.slug
  const showViewOnSite = !!activeSlug && data.status !== 'draft'

  return (
    <div>
      {/* Tab navigation */}
      <div className="relative mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const filled = hasContent(tab, data)
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex flex-col items-center gap-0.5 ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    filled ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                />
              </button>
            )
          })}
        </div>
        {/* Scroll fade hint on right edge (mobile) */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-100 to-transparent rounded-r-lg pointer-events-none sm:hidden" />
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        {activeTab === 'Basics' && <BasicInfoFields data={data} update={update} isNew={!!isNew} />}
        {activeTab === 'Pricing' && <PricingFields data={data} update={update} />}
        {activeTab === 'Content' && <ContentFields data={data} update={update} />}
        {activeTab === 'Images' && <ImagesFields data={data} update={update} slug={activeSlug} />}
        {activeTab === 'Itinerary' && (
          <ItineraryEditor items={data.itinerary} onChange={(v) => update('itinerary', v)} />
        )}
        {activeTab === 'Logistics' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">What&apos;s Included</h3>
              <IncludedEditor items={data.included} onChange={(v) => update('included', v)} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">What&apos;s Not Included</h3>
              <ExcludedEditor items={data.excluded} onChange={(v) => update('excluded', v)} />
            </div>
          </div>
        )}
        {activeTab === 'Details' && <DetailsEditor items={data.details} onChange={(v) => update('details', v)} />}
        {activeTab === 'Social Proof' && (
          <div className="space-y-6">
            <TestimonialsEditor items={data.testimonials} onChange={(v) => update('testimonials', v)} />
            <FaqEditor items={data.faqs} onChange={(v) => update('faqs', v)} />
          </div>
        )}
      </div>

      {/* Save bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 bg-white rounded-lg border border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to List
          </button>
          {showViewOnSite && (
            <a
              href={`/experiences/${activeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber hover:text-amber/80 flex items-center gap-1 transition-colors"
            >
              View on site ↗
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs text-amber/70 font-medium">Unsaved changes</span>
          )}
          {lastSaved && !isDirty && (
            <span className="text-xs text-gray-400">{formatLastSaved(lastSaved)}</span>
          )}
          {toast && (
            <span className={`text-sm ${toast.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {toast.message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-forest text-cream font-semibold px-6 py-2.5 rounded-md text-sm hover:bg-forest/90 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {saving ? 'Saving...' : isNew ? 'Create Experience' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Discard changes dialog */}
      {showDiscardDialog && (
        <DeleteConfirmDialog
          title="Discard changes?"
          message="You have unsaved changes. Are you sure you want to leave?"
          onConfirm={() => {
            setShowDiscardDialog(false)
            setIsDirty(false)
            router.push('/admin/experiences')
          }}
          onCancel={() => setShowDiscardDialog(false)}
        />
      )}
    </div>
  )
}
