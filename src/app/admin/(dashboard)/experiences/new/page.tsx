import ExperienceForm from '@/components/admin/ExperienceForm'
import PageHeader from '@/components/admin/ui/PageHeader'

export default function NewExperiencePage() {
  return (
    <>
      <PageHeader
        title="New Experience"
        subtitle="Create a new experience for Camp Monroe"
        back={{ href: '/admin/experiences', label: 'Back to Experiences' }}
      />
      <ExperienceForm isNew />
    </>
  )
}
