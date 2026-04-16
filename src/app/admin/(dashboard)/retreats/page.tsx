import Link from 'next/link'
import {
  getHostInquiries,
  getBuyoutInquiries,
  getInquiryCounts,
  getSeasons,
  getBlackouts,
  getBookings,
  getUpcomingBookingsCount,
  getActiveBlackoutsCount,
} from '@/lib/data/retreats'
import InquiryInbox from '@/components/admin/retreats/InquiryInbox'
import RetreatsCalendar from '@/components/admin/retreats/RetreatsCalendar'

export const dynamic = 'force-dynamic'

export default async function RetreatsDashboardPage() {
  const [
    hostInquiries,
    buyoutInquiries,
    counts,
    seasons,
    blackouts,
    bookings,
    upcomingBookings,
    activeBlackouts,
    hostHolds,
    buyoutHolds,
  ] = await Promise.all([
    getHostInquiries(),
    getBuyoutInquiries(),
    getInquiryCounts(),
    getSeasons(),
    getBlackouts(),
    getBookings(),
    getUpcomingBookingsCount(),
    getActiveBlackoutsCount(),
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

  const stats = [
    { label: 'New', value: counts.new, tone: 'blue' as const },
    { label: 'On Hold', value: counts.hold, tone: 'orange' as const },
    { label: 'Upcoming', value: upcomingBookings, tone: 'green' as const, sub: 'next 90 days' },
    { label: 'Active Blackouts', value: activeBlackouts, tone: 'gray' as const },
  ]

  const toneClass: Record<'blue' | 'orange' | 'green' | 'gray', string> = {
    blue: 'text-blue-700',
    orange: 'text-orange-700',
    green: 'text-green-700',
    gray: 'text-gray-700',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retreats</h1>
          <p className="text-gray-500 text-sm mt-1">
            Dashboard for inquiries, bookings, seasons, and blackouts.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/retreats/calendar"
            className="px-3 py-2 text-xs font-medium text-forest border border-forest/30 rounded-md hover:bg-forest/5 transition-colors"
          >
            Full Calendar
          </Link>
          <Link
            href="/admin/retreats/seasons"
            className="px-3 py-2 text-xs font-medium text-forest border border-forest/30 rounded-md hover:bg-forest/5 transition-colors"
          >
            Seasons
          </Link>
          <Link
            href="/admin/retreats/blackouts"
            className="px-3 py-2 text-xs font-medium text-forest border border-forest/30 rounded-md hover:bg-forest/5 transition-colors"
          >
            Blackouts
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {s.label}
            </p>
            <p className={`text-3xl font-bold mt-1 ${toneClass[s.tone]}`}>{s.value}</p>
            {s.sub && <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Calendar preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Calendar
          </h2>
          <Link
            href="/admin/retreats/calendar"
            className="text-xs text-amber hover:text-amber/80 font-medium"
          >
            Open full calendar →
          </Link>
        </div>
        <RetreatsCalendar
          seasons={seasons}
          blackouts={blackouts}
          bookings={bookings}
          holds={holds}
        />
      </div>

      {/* Blackouts peek */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Upcoming Blackouts
          </h2>
          <Link
            href="/admin/retreats/blackouts"
            className="text-xs text-amber hover:text-amber/80 font-medium"
          >
            Manage →
          </Link>
        </div>
        <UpcomingBlackouts blackouts={blackouts} />
      </div>

      {/* Inbox */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Inbox
          </h2>
        </div>
        <InquiryInbox hostInquiries={hostInquiries} buyoutInquiries={buyoutInquiries} />
      </div>
    </div>
  )
}

function UpcomingBlackouts({ blackouts }: { blackouts: Awaited<ReturnType<typeof getBlackouts>> }) {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = blackouts
    .filter((b) => b.endDate >= today)
    .slice(0, 5)

  if (upcoming.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-400">
        No upcoming blackouts.
      </div>
    )
  }

  const categoryLabels: Record<string, string> = {
    internal_event: 'Internal event',
    member_buyout: 'Member buyout',
    other: 'Other',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-50">
      {upcoming.map((b) => (
        <Link
          key={b.id}
          href={`/admin/retreats/blackouts/${b.id}`}
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{b.label}</p>
            <p className="text-xs text-gray-500">
              {b.startDate} → {b.endDate} · {categoryLabels[b.category] ?? b.category}
            </p>
          </div>
          <span className="text-gray-300">→</span>
        </Link>
      ))}
    </div>
  )
}
