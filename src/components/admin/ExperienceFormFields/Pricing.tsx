import { ExperienceFormData } from '../ExperienceForm'

type Props = {
  data: ExperienceFormData
  update: <K extends keyof ExperienceFormData>(key: K, value: ExperienceFormData[K]) => void
}

export default function PricingFields({ data, update }: Props) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Pricing & Capacity</h3>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input
            type="number"
            value={data.price}
            onChange={(e) => update('price', Number(e.target.value))}
            min={0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount ($)</label>
          <input
            type="number"
            value={data.depositAmount ?? ''}
            onChange={(e) => update('depositAmount', e.target.value ? Number(e.target.value) : undefined)}
            min={0}
            placeholder="Optional"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
          <input
            type="number"
            value={data.groupSize}
            onChange={(e) => update('groupSize', Number(e.target.value))}
            min={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
          />
        </div>
      </div>
    </div>
  )
}
