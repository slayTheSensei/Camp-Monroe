'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type {
  OpenWindow,
  Booking,
  HostInquiry,
  StrInquiry,
} from '@/lib/types/retreats'

type Props = {
  openWindows: OpenWindow[]
  bookings: Booking[]
  holds: { id: string; type: 'host' | 'str'; start: string; end: string; label: string }[]
  /** Raw lists are only used for linking day clicks to inquiries. */
  hostInquiries?: HostInquiry[]
  strInquiries?: StrInquiry[]
}

type DayMarker = {
  kind: 'open' | 'hold' | 'confirmed' | 'blocked'
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

export default function RetreatsCalendar({ openWindows, bookings, holds }: Props) {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const days = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    // Start grid on Sunday
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

  function markersFor(iso: string): DayMarker[] {
    const markers: DayMarker[] = []
    for (const b of bookings) {
      if (isWithin(iso, b.startDate, b.endDate)) {
        markers.push({
          kind: 'confirmed',
          label: `Confirmed ${b.inquiryType === 'host' ? 'Retreat' : 'STR'}`,
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
    for (const w of openWindows) {
      if (w.isPublic && isWithin(iso, w.startDate, w.endDate)) {
        markers.push({ kind: 'open', label: w.label })
      }
    }
    return markers
  }

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      {/* Header */}
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

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500">
        <LegendDot className="bg-amber" /> Open window
        <LegendDot className="bg-orange-500" /> Hold
        <LegendDot className="bg-green-600" /> Confirmed
      </div>

      {/* Weekday header */}
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

      {/* Cells */}
      <div className="grid grid-cols-7 gap-px bg-gray-100 border-x border-b border-gray-100 rounded-b-md overflow-hidden">
        {days.map((cell, i) => {
          const iso = ymd(cell.date)
          const markers = markersFor(iso)
          const isToday = iso === ymd(today)
          return (
            <div
              key={i}
              className={`bg-white min-h-[84px] p-1.5 flex flex-col ${
                cell.inMonth ? '' : 'opacity-40'
              }`}
            >
              <div
                className={`text-xs mb-1 ${
                  isToday
                    ? 'text-amber font-semibold'
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
                      : m.kind === 'open'
                      ? 'bg-amber'
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
