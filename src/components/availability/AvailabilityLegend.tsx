type Props = {
  selectedLabel?: string | null
}

export default function AvailabilityLegend({ selectedLabel }: Props) {
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
      <p className={`text-sm ${selectedLabel ? 'text-amber' : 'text-cream/40'}`}>
        {selectedLabel ?? 'Select a start date, then an end date (3-night minimum).'}
      </p>
    </div>
  )
}
