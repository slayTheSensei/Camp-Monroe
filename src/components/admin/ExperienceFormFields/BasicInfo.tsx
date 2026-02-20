import { ExperienceFormData } from '../ExperienceForm'

type Props = {
  data: ExperienceFormData
  update: <K extends keyof ExperienceFormData>(key: K, value: ExperienceFormData[K]) => void
  isNew: boolean
}

const typeOptions = ['Weekend Camping', 'Retreat', 'Day Trip', 'Partner-Hosted Retreat', 'Bike Ride'] as const
const statusOptions = ['draft', 'available', 'coming-soon', 'sold-out'] as const
const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'] as const

const tagColorPresets = [
  { label: 'Amber', classes: 'bg-amber text-forest' },
  { label: 'Forest', classes: 'bg-forest text-cream' },
  { label: 'Cream', classes: 'bg-cream text-forest' },
  { label: 'Red', classes: 'bg-red-500 text-white' },
  { label: 'Sky', classes: 'bg-sky-500 text-white' },
  { label: 'Violet', classes: 'bg-violet-500 text-white' },
  { label: 'None', classes: '' },
] as const

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function BasicInfoFields({ data, update, isNew }: Props) {
  const selectedPreset = tagColorPresets.find((p) => p.classes === (data.tagColor ?? ''))

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Information</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => {
              update('title', e.target.value)
              if (isNew) update('slug', slugify(e.target.value))
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            placeholder="Experience title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={data.slug}
            onChange={(e) => update('slug', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            placeholder="url-slug"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <input
          type="text"
          value={data.subtitle}
          onChange={(e) => update('subtitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          placeholder="A short tagline"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={data.type}
            onChange={(e) => update('type', e.target.value as ExperienceFormData['type'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          >
            {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={data.status}
            onChange={(e) => update('status', e.target.value as ExperienceFormData['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === 'draft' ? 'Draft' : s === 'available' ? 'Available' : s === 'coming-soon' ? 'Coming Soon' : 'Sold Out'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            value={data.difficulty ?? ''}
            onChange={(e) => update('difficulty', (e.target.value || undefined) as ExperienceFormData['difficulty'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          >
            <option value="">None</option>
            {difficultyOptions.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => update('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            placeholder="e.g. Western Maine"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <input
            type="text"
            value={data.region}
            onChange={(e) => update('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            placeholder="e.g. Maine"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
          <input
            type="text"
            value={data.dates}
            onChange={(e) => update('dates', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            placeholder="e.g. Aug 15–17, 2026"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            value={data.duration}
            onChange={(e) => update('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            placeholder="e.g. 3 Days / 2 Nights"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag Label</label>
          <input
            type="text"
            value={data.tag ?? ''}
            onChange={(e) => update('tag', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            placeholder="e.g. New, Popular, Coming Soon"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag Color</label>
          <div className="flex items-center gap-2 flex-wrap">
            {tagColorPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                title={preset.label}
                onClick={() => update('tagColor', preset.classes || undefined)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  preset.classes
                    ? preset.classes.split(' ')[0] // bg-* class for swatch color
                    : 'bg-white border-gray-300'
                } ${
                  (data.tagColor ?? '') === preset.classes
                    ? 'ring-2 ring-offset-1 ring-gray-600 border-transparent'
                    : 'border-transparent hover:scale-110'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              {selectedPreset?.label ?? 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
