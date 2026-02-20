import { ItineraryDay } from '@/types/experience'

type Props = {
  items: ItineraryDay[]
  onChange: (items: ItineraryDay[]) => void
}

function createEmpty(dayNum: number): ItineraryDay {
  return { day: dayNum, title: '', description: '', image: '', activities: [] }
}

export default function ItineraryEditor({ items, onChange }: Props) {
  function add() {
    onChange([...items, createEmpty(items.length + 1)])
  }

  function remove(index: number) {
    const updated = items.filter((_, i) => i !== index)
    // Re-number days
    onChange(updated.map((item, i) => ({ ...item, day: i + 1 })))
  }

  function update(index: number, field: keyof ItineraryDay, value: string | number | string[]) {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  function addActivity(dayIndex: number) {
    const updated = [...items]
    updated[dayIndex] = { ...updated[dayIndex], activities: [...updated[dayIndex].activities, ''] }
    onChange(updated)
  }

  function updateActivity(dayIndex: number, actIndex: number, value: string) {
    const updated = [...items]
    const acts = [...updated[dayIndex].activities]
    acts[actIndex] = value
    updated[dayIndex] = { ...updated[dayIndex], activities: acts }
    onChange(updated)
  }

  function removeActivity(dayIndex: number, actIndex: number) {
    const updated = [...items]
    updated[dayIndex] = {
      ...updated[dayIndex],
      activities: updated[dayIndex].activities.filter((_, i) => i !== actIndex),
    }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Itinerary</h3>
        <button onClick={add} className="text-xs font-medium text-amber hover:text-amber/80 transition-colors">
          + Add Day
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-gray-400 text-sm py-4 text-center">No itinerary days added.</p>
      )}

      {items.map((day, i) => (
        <div key={i} className="border border-gray-200 rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Day {day.day}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs">
              Remove
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Title</label>
              <input
                type="text"
                value={day.title}
                onChange={(e) => update(i, 'title', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Image URL</label>
              <input
                type="text"
                value={day.image ?? ''}
                onChange={(e) => update(i, 'image', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea
              value={day.description}
              onChange={(e) => update(i, 'description', e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500">Activities</label>
              <button onClick={() => addActivity(i)} className="text-xs text-amber hover:text-amber/80">
                + Activity
              </button>
            </div>
            {day.activities.map((act, ai) => (
              <div key={ai} className="flex gap-2 mb-1.5">
                <input
                  type="text"
                  value={act}
                  onChange={(e) => updateActivity(i, ai, e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                  placeholder="Activity description"
                />
                <button onClick={() => removeActivity(i, ai)} className="text-red-400 hover:text-red-600 text-sm px-2">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
