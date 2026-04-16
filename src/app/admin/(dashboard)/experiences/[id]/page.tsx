import { notFound } from 'next/navigation'
import { getExperienceById } from '@/lib/data/experiences'
import ExperienceForm from '@/components/admin/ExperienceForm'
import StatusBadge from '@/components/admin/StatusBadge'
import PageHeader from '@/components/admin/ui/PageHeader'

type Props = { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic'

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params
  const experience = await getExperienceById(id)

  if (!experience) notFound()

  return (
    <>
      <PageHeader
        title={experience.title}
        subtitle={
          <span className="inline-flex items-center gap-3">
            <span>/{experience.slug}</span>
            <StatusBadge status={experience.status} />
          </span>
        }
        back={{ href: '/admin/experiences', label: 'Back to Experiences' }}
      />
      <ExperienceForm initialData={experience} slug={experience.slug} />
    </>
  )
}
