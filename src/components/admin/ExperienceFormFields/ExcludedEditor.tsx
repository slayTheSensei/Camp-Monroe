type Props = {
  items: string[]
  onChange: (items: string[]) => void
}

export default function ExcludedEditor({ items, onChange }: Props) {
  function add() {
    onChange([...items, ''])
  }

  function update(index: number, value: string) {
    const updated = [...items]
    updated[index] = value
    onChange(updated)
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            placeholder="e.g. Flights to Maine"
          />
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
