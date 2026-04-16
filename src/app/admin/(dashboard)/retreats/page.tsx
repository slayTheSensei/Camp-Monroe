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
    { label: 'New', value: counts.new, tone: 'text-blue-700' },
    { label: 'On Hold', value: counts.hold, tone: 'text-orange-700' },
    { label: 'Upcoming Bookings', value: upcomingBookings, tone: 'text-green-700', sub: 'next 90 days' },
    { label: 'Active Blackouts', value: activeBlackouts, tone: 'text-gray-700' },
  ]

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retreats</h1>
          <p className="text-gray-500 text-sm mt-1">
            Dashboard for inquiries, bookings, seasons, and blackouts.
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          <HeaderLink href="/admin/retreats/calendar">Full Calendar</HeaderLink>
          <HeaderLink href="/admin/retreats/seasons">Seasons</HeaderLink>
          <HeaderLink href="/admin/retreats/blackouts">Blackouts</HeaderLink>
        </nav>
      </header>

      {/* Stats */}
      <Section title="At a glance">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-lg border border-gray-200 p-5"
            >
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {s.label}
              </p>
              <p className={`text-3xl font-bold mt-3 ${s.tone}`}>{s.value}</p>
              {s.sub && <p className="text-xs text-gray-400 mt-1">{s.sub}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* Calendar */}
      <Section
        title="Calendar"
        action={
          <Link
            href="/admin/retreats/calendar"
            className="text-xs text-amber hover:text-amber/80 font-medium"
          >
            Open full calendar →
          </Link>
        }
      >
        <RetreatsCalendar
          seasons={seasons}
          blackouts={blackouts}
          bookings={bookings}
          holds={holds}
        />
      </Section>

      {/* Upcoming blackouts */}
      <Section
        title="Upcoming Blackouts"
        action={
          <Link
            href="/admin/retreats/blackouts"
            className="text-xs text-amber hover:text-amber/80 font-medium"
          >
            Manage →
          </Link>
        }
      >
        <UpcomingBlackouts blackouts={blackouts} />
      </Section>

      {/* Inbox */}
      <Section title="Inbox">
        <InquiryInbox hostInquiries={hostInquiries} buyoutInquiries={buyoutInquiries} />
      </Section>
    </div>
  )
}

// ============================================================================
// Local helpers
// ============================================================================

function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-xs font-medium text-forest border border-forest/30 rounded-md hover:bg-forest/5 transition-colors"
    >
      {children}
    </Link>
  )
}

function UpcomingBlackouts({ blackouts }: { blackouts: Awaited<ReturnType<typeof getBlackouts>> }) {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = blackouts.filter((b) => b.endDate >= today).slice(0, 5)

  if (upcoming.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-sm text-gray-400">No upcoming blackouts.</p>
      </div>
    )
  }

  const categoryLabels: Record<string, string> = {
    internal_event: 'Internal event',
    member_buyout: 'Member buyout',
    other: 'Other',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
      {upcoming.map((b) => (
        <Link
          key={b.id}
          href={`/admin/retreats/blackouts/${b.id}`}
          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{b.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {b.startDate} → {b.endDate} · {categoryLabels[b.category] ?? b.category}
            </p>
          </div>
          <span className="text-gray-300 shrink-0 ml-4" aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  )
}
