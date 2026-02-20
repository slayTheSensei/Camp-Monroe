import { ExperienceFormData } from '../ExperienceForm'

type Props = {
  data: ExperienceFormData
  update: <K extends keyof ExperienceFormData>(key: K, value: ExperienceFormData[K]) => void
}

export default function ContentFields({ data, update }: Props) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Content</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
        <textarea
          value={data.shortDescription}
          onChange={(e) => update('shortDescription', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          placeholder="One-liner for the trip card"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
        <textarea
          value={data.longDescription}
          onChange={(e) => update('longDescription', e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          placeholder="Full description for the experience page"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pull Quote</label>
        <textarea
          value={data.pullQuote}
          onChange={(e) => update('pullQuote', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          placeholder="A featured quote that appears on the detail page"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pull Quote Image URL</label>
        <input
          type="text"
          value={data.pullQuoteImage}
          onChange={(e) => update('pullQuoteImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          placeholder="https://..."
        />
      </div>
    </div>
  )
}
