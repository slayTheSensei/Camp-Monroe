'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import StatusBadge from './StatusBadge'
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

export default function ExperienceList({ experiences }: Props) {
  const [filter, setFilter] = useState('All')
  const [deleteTarget, setDeleteTarget] = useState<ExperienceRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const filtered = filter === 'All'
    ? experiences
    : experiences.filter((e) => e.status === statusMap[filter])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await supabase.from('experiences').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    router.refresh()
  }

  async function handleDuplicate(exp: ExperienceRow) {
    const { id, ...rest } = exp

    // Map camelCase back to snake_case for the DB insert
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

    // Suppress unused variable warning — we only care about the side effect
    void id
    void error

    router.refresh()
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
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
                <th className="px-4 py-3 font-medium">Experience</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/experiences/${exp.id}`} className="font-medium text-gray-900 hover:text-amber transition-colors">
                      {exp.title}
                    </Link>
                    <p className="text-gray-400 text-xs mt-0.5">/{exp.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{exp.type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={exp.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    ${exp.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{exp.dates}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <Link
                        href={`/admin/experiences/${exp.id}`}
                        className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDuplicate(exp)}
                        className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => setDeleteTarget(exp)}
                        className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
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
