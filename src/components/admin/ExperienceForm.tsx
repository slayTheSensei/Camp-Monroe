'use client'

import { useState } from 'react'
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

export type ExperienceFormData = Experience

const tabs = [
  'Basics',
  'Pricing',
  'Content',
  'Images',
  'Itinerary',
  'Details',
  'Social Proof',
] as const

type Tab = (typeof tabs)[number]

type Props = {
  initialData?: ExperienceFormData & { id: string }
  isNew?: boolean
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

export default function ExperienceForm({ initialData, isNew }: Props) {
  const [data, setData] = useState<ExperienceFormData>(initialData ?? createEmptyExperience())
  const [activeTab, setActiveTab] = useState<Tab>('Basics')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function update<K extends keyof ExperienceFormData>(key: K, value: ExperienceFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

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
      showToast('success', 'Changes saved')
      router.refresh()
    }
  }

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'Basics' && <BasicInfoFields data={data} update={update} isNew={!!isNew} />}
        {activeTab === 'Pricing' && <PricingFields data={data} update={update} />}
        {activeTab === 'Content' && <ContentFields data={data} update={update} />}
        {activeTab === 'Images' && <ImagesFields data={data} update={update} />}
        {activeTab === 'Itinerary' && (
          <div className="space-y-6">
            <ItineraryEditor items={data.itinerary} onChange={(v) => update('itinerary', v)} />
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
      <div className="flex items-center justify-between mt-6 bg-white rounded-lg border border-gray-200 px-6 py-4">
        <button
          onClick={() => router.push('/admin/experiences')}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to List
        </button>
        <div className="flex items-center gap-3">
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
            {saving ? 'Saving...' : isNew ? 'Create Experience' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
