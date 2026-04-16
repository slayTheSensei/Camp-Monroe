import {
  getSeasons,
  getBlackouts,
  getBookings,
  getHostInquiries,
  getBuyoutInquiries,
} from '@/lib/data/retreats'
import RetreatsCalendar from '@/components/admin/retreats/RetreatsCalendar'
import PageHeader from '@/components/admin/ui/PageHeader'

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
    <>
      <PageHeader
        title="Calendar"
        subtitle="Full month view of seasons, blackouts, holds, and confirmed bookings."
        back={{ href: '/admin/retreats', label: 'Back to Retreats' }}
      />
      <RetreatsCalendar
        seasons={seasons}
        blackouts={blackouts}
        bookings={bookings}
        holds={holds}
      />
    </>
  )
}
