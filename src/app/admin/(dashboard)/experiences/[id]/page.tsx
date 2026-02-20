import { notFound } from 'next/navigation'
import { getExperienceById } from '@/lib/data/experiences'
import ExperienceForm from '@/components/admin/ExperienceForm'
import StatusBadge from '@/components/admin/StatusBadge'

type Props = { params: Promise<{ id: string }> }

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params
  const experience = await getExperienceById(id)

  if (!experience) notFound()

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{experience.title}</h1>
          <p className="text-gray-500 text-sm mt-1">/{experience.slug}</p>
        </div>
        <StatusBadge status={experience.status} />
      </div>

      <ExperienceForm initialData={experience} slug={experience.slug} />
    </div>
  )
}
