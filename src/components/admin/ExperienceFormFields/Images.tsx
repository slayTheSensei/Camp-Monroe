import { ExperienceFormData } from '../ExperienceForm'

type Props = {
  data: ExperienceFormData
  update: <K extends keyof ExperienceFormData>(key: K, value: ExperienceFormData[K]) => void
}

export default function ImagesFields({ data, update }: Props) {
  function addImage() {
    update('heroImages', [...data.heroImages, ''])
  }

  function updateImage(index: number, value: string) {
    const updated = [...data.heroImages]
    updated[index] = value
    update('heroImages', updated)
  }

  function removeImage(index: number) {
    update('heroImages', data.heroImages.filter((_, i) => i !== index))
  }

  function moveImage(index: number, direction: 'up' | 'down') {
    const arr = [...data.heroImages]
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= arr.length) return
    ;[arr[index], arr[target]] = [arr[target], arr[index]]
    update('heroImages', arr)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Hero Images</h3>
        <button
          onClick={addImage}
          className="text-xs font-medium text-amber hover:text-amber/80 transition-colors"
        >
          + Add Image
        </button>
      </div>

      {data.heroImages.length === 0 && (
        <p className="text-gray-400 text-sm py-4 text-center">No images added yet.</p>
      )}

      <div className="space-y-3">
        {data.heroImages.map((url, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveImage(i, 'up')}
                disabled={i === 0}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-20 text-xs"
              >
                ↑
              </button>
              <button
                onClick={() => moveImage(i, 'down')}
                disabled={i === data.heroImages.length - 1}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-20 text-xs"
              >
                ↓
              </button>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => updateImage(i, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              placeholder="https://... image URL"
            />
            {url && (
              <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <button
              onClick={() => removeImage(i)}
              className="text-red-400 hover:text-red-600 text-sm px-2 py-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
