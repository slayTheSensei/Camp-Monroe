import { getExperiencesAdmin } from '@/lib/data/experiences'
import ExperienceList from '@/components/admin/ExperienceList'
import Link from 'next/link'

export default async function ExperiencesPage() {
  const experiences = await getExperiencesAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experiences</h1>
          <p className="text-gray-500 text-sm mt-1">{experiences.length} total</p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="bg-forest text-cream font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-forest/90 transition-colors"
        >
          + New Experience
        </Link>
      </div>

      <ExperienceList experiences={experiences} />
    </div>
  )
}
