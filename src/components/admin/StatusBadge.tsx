const statusConfig: Record<string, { label: string; className: string }> = {
  available: {
    label: 'Available',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  'coming-soon': {
    label: 'Coming Soon',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'sold-out': {
    label: 'Sold Out',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  draft: {
    label: 'Draft',
    className: 'bg-gray-50 text-gray-500 border-gray-200',
  },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.draft
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}>
      {config.label}
    </span>
  )
}
