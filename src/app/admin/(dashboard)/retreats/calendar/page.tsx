import {
  getSeasons,
  getBlackouts,
  getBookings,
  getHostInquiries,
  getBuyoutInquiries,
} from '@/lib/data/retreats'
import RetreatsCalendar from '@/components/admin/retreats/RetreatsCalendar'

export const dynamic = 'force-dynamic'

export default async function RetreatsCalendarPage() {
  const [seasons, blackouts, bookings, hostHolds, buyoutHolds] = await Promise.all([
    getSeasons(),
    getBlackouts(),
    getBookings(),
    getHostInquiries({ status: 'hold' }),
    getBuyoutInquiries({ status: 'hold' }),
  ])

  const holds = [
    ...hostHolds.map((h) => ({
      id: h.id,
      type: 'host' as const,
      start: h.startDate,
      end: h.endDate,
      label: `Hold — ${h.organization || h.name}`,
    })),
    ...buyoutHolds.map((b) => ({
      id: b.id,
      type: 'buyout' as const,
      start: b.startDate,
      end: b.endDate,
      label: `Buyout hold — ${b.name}`,
    })),
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Retreats Calendar</h1>
        <p className="text-gray-500 text-sm mt-1">
          Month view of seasons, blackouts, holds, and confirmed bookings.
        </p>
      </div>
      <RetreatsCalendar
        seasons={seasons}
        blackouts={blackouts}
        bookings={bookings}
        holds={holds}
      />
    </div>
  )
}
