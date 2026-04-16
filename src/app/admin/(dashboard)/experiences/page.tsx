import { getExperiencesAdmin } from '@/lib/data/experiences'
import ExperienceList from '@/components/admin/ExperienceList'
import PageHeader from '@/components/admin/ui/PageHeader'
import { ButtonLink } from '@/components/admin/ui/Button'

export const dynamic = 'force-dynamic'

export default async function ExperiencesPage() {
  const experiences = await getExperiencesAdmin()

  return (
    <>
      <PageHeader
        title="Experiences"
        subtitle={`${experiences.length} total`}
        actions={<ButtonLink href="/admin/experiences/new">+ New Experience</ButtonLink>}
      />
      <ExperienceList experiences={experiences} />
    </>
  )
}
