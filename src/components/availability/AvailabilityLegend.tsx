type Props = {
  selectedLabel?: string | null
  /** Number of nights currently selected (0 when nothing picked). */
  selectedNights?: number
  /** Minimum nights required by the booking policy. */
  minNights?: number
  /** Lead-time days (for the helper hint). */
  leadDays?: number
}

export default function AvailabilityLegend({
  selectedLabel,
  selectedNights = 0,
  minNights = 3,
  leadDays,
}: Props) {
  // Dynamic helper line:
  //   - Nothing picked:       "Select a start date, then an end date. 3-night minimum."
  //   - Start picked only:    "Now pick an end date — at least N more nights."
  //   - Range shorter than min: "N nights — need at least M."
  //   - Valid range:          shows summary in amber
  let helper: { text: string; tone: 'muted' | 'amber' | 'warn' } = {
    text: `Select a start date, then an end date. ${minNights}-night minimum${
      leadDays ? `, ${leadDays}-day lead time` : ''
    }.`,
    tone: 'muted',
  }

  if (selectedLabel) {
    helper = { text: selectedLabel, tone: 'amber' }
  } else if (selectedNights > 0 && selectedNights < minNights) {
    const needed = minNights - selectedNights
    helper = {
      text: `${selectedNights} night${selectedNights === 1 ? '' : 's'} selected — we need ${minNights} or more (${needed} more to go).`,
      tone: 'warn',
    }
  }

  const toneClass =
    helper.tone === 'amber'
      ? 'text-amber'
      : helper.tone === 'warn'
      ? 'text-amber'
      : 'text-cream/50'

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex flex-wrap items-center gap-4 text-xs text-cream/60">
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-cream/30 border border-cream/40" />
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-cream/10 border border-cream/20 relative overflow-hidden">
            <span className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(245,240,232,0.3)_2px,rgba(245,240,232,0.3)_3px)]" />
          </span>
          Unavailable
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-amber" />
          Your selection
        </span>
      </div>
      <p className={`text-sm ${toneClass}`}>{helper.text}</p>
    </div>
  )
}
