'use client'

import type { InquiryStatus } from '@/lib/types/retreats'

const tabs: { key: InquiryStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'reviewing', label: 'Reviewing' },
  { key: 'hold', label: 'Hold' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'declined', label: 'Declined' },
]

type Props = {
  active: InquiryStatus | 'all'
  counts: Record<InquiryStatus, number> & { all: number }
  onChange: (key: InquiryStatus | 'all') => void
}

export default function InquiryTabs({ active, counts, onChange }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-gray-100 p-1 rounded-lg">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            active === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>{t.label}</span>
          <span
            className={`ml-1.5 ${active === t.key ? 'text-gray-500' : 'text-gray-400'}`}
          >
            {counts[t.key]}
          </span>
        </button>
      ))}
    </div>
  )
}
