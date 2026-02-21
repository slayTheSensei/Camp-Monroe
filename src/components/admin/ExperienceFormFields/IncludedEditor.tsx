import { IncludedItem } from '@/types/experience'

type Props = {
  items: IncludedItem[]
  onChange: (items: IncludedItem[]) => void
}

export default function IncludedEditor({ items, onChange }: Props) {
  function add() {
    onChange([...items, { icon: '✓', label: '', description: '' }])
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function update(index: number, field: keyof IncludedItem, value: string) {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start border border-gray-200 rounded-md p-3">
          <div className="space-y-2 flex-1">
            <div className="grid grid-cols-[60px_1fr] gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Icon</label>
                <input
                  type="text"
                  value={item.icon}
                  onChange={(e) => update(i, 'icon', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Label</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => update(i, 'label', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => update(i, 'description', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
          </div>
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-sm min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0">
            ×
          </button>
        </div>
      ))}
      <button onClick={add} className="text-xs font-medium text-amber hover:text-amber/80 transition-colors">
        + Add Item
      </button>
    </div>
  )
}
