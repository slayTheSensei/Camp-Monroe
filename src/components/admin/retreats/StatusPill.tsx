import type { InquiryStatus } from '@/lib/types/retreats'

const styles: Record<InquiryStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  reviewing: 'bg-gray-50 text-gray-700 border-gray-200',
  hold: 'bg-orange-50 text-orange-700 border-orange-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
}

const labels: Record<InquiryStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  hold: 'Hold',
  confirmed: 'Confirmed',
  declined: 'Declined',
}

export default function StatusPill({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}
