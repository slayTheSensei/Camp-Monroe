import type { OpenWindow, BookedRange } from '@/lib/types/retreats'

type Props = {
  windows: OpenWindow[]
  bookedRanges: BookedRange[]
  kind: 'host' | 'str'
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return !(aEnd < bStart || bEnd < aStart)
}

function fmtRange(startIso: string, endIso: string) {
  const s = new Date(startIso + 'T00:00:00')
  const e = new Date(endIso + 'T00:00:00')
  const sm = s.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const em = e.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return `${sm} – ${em}`
}

export default function OpenWindowsList({ windows, bookedRanges, kind }: Props) {
  const visible = windows.filter((w) => {
    // Hide any window completely blocked by a confirmed booking
    const fullyBlocked = bookedRanges.some(
      (b) => b.startDate <= w.startDate && b.endDate >= w.endDate
    )
    return !fullyBlocked
  })

  if (visible.length === 0) {
    return (
      <div className="bg-cream/5 border border-cream/10 rounded-md p-6 text-center">
        <p className="text-cream/70 text-sm">
          No {kind === 'host' ? 'retreat' : 'stay'} windows published at the moment.
          You&apos;re welcome to reach out below and we&apos;ll follow up with what&apos;s possible.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {visible.map((w) => {
        const conflicts = bookedRanges.filter((b) =>
          rangesOverlap(w.startDate, w.endDate, b.startDate, b.endDate)
        )
        const badge =
          w.windowType === 'host'
            ? 'Available for Host Request'
            : w.windowType === 'str'
            ? 'STR Window Open'
            : 'Host or Stay'
        return (
          <li
            key={w.id}
            className="bg-cream/5 border border-cream/10 rounded-md px-5 py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
          >
            <div>
              <p className="text-cream text-base font-medium">{w.label}</p>
              <p className="text-cream/50 text-xs mt-0.5">{fmtRange(w.startDate, w.endDate)}</p>
              {w.description && (
                <p className="text-cream/70 text-sm mt-2 leading-relaxed">{w.description}</p>
              )}
              {conflicts.length > 0 && (
                <p className="text-cream/40 text-xs italic mt-2">
                  Partially booked — some dates within this window are unavailable.
                </p>
              )}
            </div>
            <span className="shrink-0 inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber/20 text-amber border border-amber/30 self-start">
              {badge}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
