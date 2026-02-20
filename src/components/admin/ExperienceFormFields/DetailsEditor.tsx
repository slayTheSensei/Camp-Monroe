import { TripDetail } from '@/types/experience'

type Props = {
  items: TripDetail[]
  onChange: (items: TripDetail[]) => void
}

const categories: TripDetail['category'][] = ['Accommodations', 'Guide', 'Meals', 'Transportation']

export default function DetailsEditor({ items, onChange }: Props) {
  function add() {
    onChange([...items, { category: 'Accommodations', title: '', description: '', image: '' }])
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function update(index: number, field: keyof TripDetail, value: string) {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Trip Details</h3>
        <button onClick={add} className="text-xs font-medium text-amber hover:text-amber/80 transition-colors">
          + Add Detail
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-gray-400 text-sm py-4 text-center">No trip details added.</p>
      )}

      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Detail {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs">
              Remove
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <select
                value={item.category}
                onChange={(e) => update(i, 'category', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Title</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => update(i, 'title', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea
              value={item.description}
              onChange={(e) => update(i, 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Image URL (optional)</label>
            <input
              type="text"
              value={item.image ?? ''}
              onChange={(e) => update(i, 'image', e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
