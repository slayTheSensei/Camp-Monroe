import { Testimonial } from '@/types/experience'

type Props = {
  items: Testimonial[]
  onChange: (items: Testimonial[]) => void
}

export default function TestimonialsEditor({ items, onChange }: Props) {
  function add() {
    onChange([...items, { quote: '', name: '', location: '' }])
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function update(index: number, field: keyof Testimonial, value: string) {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Testimonials</h3>
        <button onClick={add} className="text-xs font-medium text-amber hover:text-amber/80 transition-colors">
          + Add Testimonial
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-gray-400 text-sm py-4 text-center">No testimonials added.</p>
      )}

      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Testimonial {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs">
              Remove
            </button>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Quote</label>
            <textarea
              value={item.quote}
              onChange={(e) => update(i, 'quote', e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => update(i, 'name', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Location (optional)</label>
              <input
                type="text"
                value={item.location ?? ''}
                onChange={(e) => update(i, 'location', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
