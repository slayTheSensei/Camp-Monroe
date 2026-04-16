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
import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import Section from '@/components/admin/ui/Section'
import StatCard from '@/components/admin/ui/StatCard'
import EmptyState from '@/components/admin/ui/EmptyState'
import { ButtonLink } from '@/components/admin/ui/Button'

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

  return (
    <>
      <PageHeader
        title="Retreats"
        subtitle="Dashboard for inquiries, bookings, seasons, and blackouts."
        actions={
          <>
            <ButtonLink href="/admin/retreats/calendar" variant="primary" size="md">
              Full Calendar
            </ButtonLink>
            <ButtonLink href="/admin/retreats/seasons" variant="primary" size="md">
              Seasons
            </ButtonLink>
            <ButtonLink href="/admin/retreats/blackouts" variant="primary" size="md">
              Blackouts
            </ButtonLink>
          </>
        }
      />

      <PageBody>
        <Section title="At a glance">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="New" value={counts.new} tone="blue" />
            <StatCard label="On Hold" value={counts.hold} tone="orange" />
            <StatCard
              label="Upcoming Bookings"
              value={upcomingBookings}
              tone="green"
              sub="next 90 days"
            />
            <StatCard label="Active Blackouts" value={activeBlackouts} tone="gray" />
          </div>
        </Section>

        <Section
          title="Calendar"
          action={
            <Link
              href="/admin/retreats/calendar"
              className="text-xs text-amber hover:text-amber/80 font-medium transition-colors"
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

        <Section
          title="Upcoming Blackouts"
          action={
            <Link
              href="/admin/retreats/blackouts"
              className="text-xs text-amber hover:text-amber/80 font-medium transition-colors"
            >
              Manage →
            </Link>
          }
        >
          <UpcomingBlackouts blackouts={blackouts} />
        </Section>

        <Section title="Inbox">
          <InquiryInbox hostInquiries={hostInquiries} buyoutInquiries={buyoutInquiries} />
        </Section>
      </PageBody>
    </>
  )
}

function UpcomingBlackouts({ blackouts }: { blackouts: Awaited<ReturnType<typeof getBlackouts>> }) {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = blackouts.filter((b) => b.endDate >= today).slice(0, 5)

  if (upcoming.length === 0) {
    return <EmptyState message="No upcoming blackouts." />
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
          className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-inset"
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
