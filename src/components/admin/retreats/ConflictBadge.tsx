type Props = {
  count: number
}

export default function ConflictBadge({ count }: Props) {
  if (count === 0) return null
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200"
      title={`${count} conflicting ${count === 1 ? 'hold or booking' : 'holds or bookings'}`}
    >
      {count} conflict{count === 1 ? '' : 's'}
    </span>
  )
}
