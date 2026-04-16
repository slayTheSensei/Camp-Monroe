'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Season, Blackout, Booking } from '@/lib/types/retreats'

type Props = {
  seasons: Season[]
  blackouts: Blackout[]
  bookings: Booking[]
  holds: { id: string; type: 'host' | 'buyout'; start: string; end: string; label: string }[]
}

type DayMarker = {
  kind: 'blackout' | 'hold' | 'confirmed'
  label: string
  href?: string
}

function ymd(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isWithin(iso: string, startIso: string, endIso: string) {
  return iso >= startIso && iso <= endIso
}

export default function RetreatsCalendar({ seasons, blackouts, bookings, holds }: Props) {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const days = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstWeekday = firstOfMonth.getDay()
    const cells: { date: Date; inMonth: boolean }[] = []
    for (let i = 0; i < firstWeekday; i++) {
      const d = new Date(year, month, 1 - (firstWeekday - i))
      cells.push({ date: d, inMonth: false })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), inMonth: true })
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date
      const d = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1)
      cells.push({ date: d, inMonth: false })
    }
    return cells
  }, [cursor])

  function isInActiveSeason(iso: string) {
    return seasons.some((s) => s.isActive && isWithin(iso, s.startDate, s.endDate))
  }

  function markersFor(iso: string): DayMarker[] {
    const markers: DayMarker[] = []
    for (const b of bookings) {
      if (isWithin(iso, b.startDate, b.endDate)) {
        markers.push({
          kind: 'confirmed',
          label: `Confirmed ${b.inquiryType === 'host' ? 'Retreat' : 'Buyout'}`,
          href: `/admin/retreats/${b.inquiryType}/${b.inquiryId}`,
        })
      }
    }
    for (const h of holds) {
      if (isWithin(iso, h.start, h.end)) {
        markers.push({
          kind: 'hold',
          label: h.label,
          href: `/admin/retreats/${h.type}/${h.id}`,
        })
      }
    }
    for (const bl of blackouts) {
      if (isWithin(iso, bl.startDate, bl.endDate)) {
        markers.push({ kind: 'blackout', label: bl.label })
      }
    }
    return markers
  }

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{monthLabel}</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
          >
            ← Prev
          </button>
          <button
            onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><LegendDot className="bg-green-600" /> Confirmed</span>
        <span className="flex items-center gap-1.5"><LegendDot className="bg-orange-500" /> Hold</span>
        <span className="flex items-center gap-1.5"><LegendDot className="bg-gray-400" /> Blackout</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-2 h-2 rounded-sm bg-gray-100 border border-gray-200" /> Outside season</span>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-t-md overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div
            key={d}
            className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 text-center py-2"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100 border-x border-b border-gray-100 rounded-b-md overflow-hidden">
        {days.map((cell, i) => {
          const iso = ymd(cell.date)
          const markers = markersFor(iso)
          const isToday = iso === ymd(today)
          const outsideSeason = !isInActiveSeason(iso)
          const cellBg = outsideSeason ? 'bg-gray-50' : 'bg-white'
          return (
            <div
              key={i}
              className={`${cellBg} min-h-[84px] p-1.5 flex flex-col ${cell.inMonth ? '' : 'opacity-40'}`}
            >
              <div
                className={`text-xs mb-1 ${
                  isToday
                    ? 'text-amber font-semibold'
                    : outsideSeason
                    ? 'text-gray-400'
                    : cell.inMonth
                    ? 'text-gray-700'
                    : 'text-gray-400'
                }`}
              >
                {cell.date.getDate()}
              </div>
              <div className="flex flex-col gap-0.5">
                {markers.slice(0, 3).map((m, idx) => {
                  const dot =
                    m.kind === 'confirmed'
                      ? 'bg-green-600'
                      : m.kind === 'hold'
                      ? 'bg-orange-500'
                      : 'bg-gray-400'
                  const inner = (
                    <span className="flex items-center gap-1 text-[10px] leading-tight text-gray-700 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                      <span className="truncate">{m.label}</span>
                    </span>
                  )
                  return m.href ? (
                    <Link key={idx} href={m.href} className="hover:underline">
                      {inner}
                    </Link>
                  ) : (
                    <div key={idx}>{inner}</div>
                  )
                })}
                {markers.length > 3 && (
                  <span className="text-[10px] text-gray-400">+{markers.length - 3} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LegendDot({ className }: { className: string }) {
  return <span className={`inline-block w-2 h-2 rounded-full ${className}`} />
}
