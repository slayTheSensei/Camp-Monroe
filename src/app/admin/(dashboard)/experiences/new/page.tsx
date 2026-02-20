import ExperienceForm from '@/components/admin/ExperienceForm'

export default function NewExperiencePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Experience</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new experience for Camp Monroe</p>
      </div>

      <ExperienceForm isNew />
    </div>
  )
}
