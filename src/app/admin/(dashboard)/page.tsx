import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import {
  getInquiryCounts,
  getUpcomingBookingsCount,
  getHostInquiries,
  getBuyoutInquiries,
} from '@/lib/data/retreats'
import {
  getMembershipRequestCounts,
  getPartnerInquiryCounts,
  getMembershipRequests,
  getPartnerInquiries,
} from '@/lib/data/front-door'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import Section from '@/components/admin/ui/Section'
import StatCard from '@/components/admin/ui/StatCard'
import Card from '@/components/admin/ui/Card'
import EmptyState from '@/components/admin/ui/EmptyState'

export const dynamic = 'force-dynamic'

type FrontDoorRow = {
  id: string
  kind: 'membership' | 'partner'
  name: string
  secondary: string | null
  status: string
  submittedAt: string
}

type RetreatRow = {
  id: string
  kind: 'host' | 'buyout'
  name: string
  org: string | null
  dates: string
  status: string
  submittedAt: string
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer()

  const [
    waitlistRes,
    monthSignupsRes,
    membershipCounts,
    partnerCounts,
    inquiryCounts,
    upcomingBookings,
    recentHost,
    recentBuyout,
    recentMembership,
    recentPartner,
  ] = await Promise.all([
    supabase.from('waitlist').select('*', { count: 'exact', head: true }),
    supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte(
        'created_at',
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toISOString()
      ),
    getMembershipRequestCounts(),
    getPartnerInquiryCounts(),
    getInquiryCounts(),
    getUpcomingBookingsCount(),
    getHostInquiries(),
    getBuyoutInquiries(),
    getMembershipRequests(),
    getPartnerInquiries(),
  ])

  const totalWaitlist = waitlistRes.count ?? 0
  const monthWaitlist = monthSignupsRes.count ?? 0

  // Front-door inbox (membership + partner, most recent 5)
  const recentFrontDoor: FrontDoorRow[] = [
    ...recentMembership.map((m) => ({
      id: m.id,
      kind: 'membership' as const,
      name: m.name,
      secondary: m.chapter
        ? `${m.chapter === 'mens' ? "Men's chapter" : "Women's chapter"}`
        : 'No preference',
      status: m.status,
      submittedAt: m.submittedAt,
    })),
    ...recentPartner.map((p) => ({
      id: p.id,
      kind: 'partner' as const,
      name: p.name,
      secondary: p.organization ?? null,
      status: p.status,
      submittedAt: p.submittedAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 5)

  // Retreat inbox (host + buyout, most recent 5)
  const recentRetreats: RetreatRow[] = [
    ...recentHost.map((h) => ({
      id: h.id,
      kind: 'host' as const,
      name: h.name,
      org: h.organization,
      dates: `${h.startDate} → ${h.endDate}`,
      status: h.status,
      submittedAt: h.submittedAt,
    })),
    ...recentBuyout.map((b) => ({
      id: b.id,
      kind: 'buyout' as const,
      name: b.name,
      org: null as string | null,
      dates: `${b.startDate} → ${b.endDate}`,
      status: b.status,
      submittedAt: b.submittedAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 5)

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="The front door, in one view."
      />

      <PageBody>
        {/* FRONT DOOR */}
        <Section
          title="Front door"
          action={
            <Link
              href="/admin/membership"
              className="text-xs text-amber hover:text-amber/80 font-medium transition-colors"
            >
              Open inbox →
            </Link>
          }
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Membership · new"
              value={membershipCounts.new}
              tone="blue"
              href="/admin/membership"
            />
            <StatCard
              label="Partner · new"
              value={partnerCounts.new}
              tone="blue"
              href="/admin/partner-inquiries"
            />
            <StatCard
              label="Follow along"
              value={totalWaitlist}
              href="/admin/waitlist"
              sub={
                monthWaitlist
                  ? `+${monthWaitlist} this month`
                  : 'no signups this month'
              }
            />
            <StatCard
              label="Reviewing total"
              value={
                membershipCounts.reviewing +
                partnerCounts.reviewing +
                inquiryCounts.reviewing
              }
              tone="gray"
            />
          </div>
        </Section>

        {/* RETREATS */}
        <Section
          title="Retreats"
          action={
            <Link
              href="/admin/retreats"
              className="text-xs text-amber hover:text-amber/80 font-medium transition-colors"
            >
              Open retreats dashboard →
            </Link>
          }
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="New inquiries"
              value={inquiryCounts.new}
              tone="blue"
              href="/admin/retreats"
            />
            <StatCard
              label="On hold"
              value={inquiryCounts.hold}
              tone="orange"
              href="/admin/retreats"
            />
            <StatCard
              label="Confirmed"
              value={inquiryCounts.confirmed}
              tone="green"
              href="/admin/retreats"
            />
            <StatCard
              label="Upcoming"
              value={upcomingBookings}
              tone="green"
              sub="next 90 days"
              href="/admin/retreats"
            />
          </div>
        </Section>

        <Section title="Activity">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Quick actions
              </h3>
              <div className="space-y-1">
                <QuickAction
                  href="/admin/membership"
                  label="Membership inbox"
                  glyph="→"
                />
                <QuickAction
                  href="/admin/partner-inquiries"
                  label="Partner inbox"
                  glyph="→"
                />
                <QuickAction
                  href="/admin/retreats"
                  label="Retreats inbox"
                  glyph="→"
                />
                <QuickAction
                  href="/admin/retreats/blackouts/new"
                  label="Add blackout"
                  glyph="+"
                />
                <QuickAction
                  href="/admin/content"
                  label="Edit site content"
                  glyph="→"
                />
                <QuickAction
                  href="/"
                  label="View public site"
                  glyph="↗"
                  external
                />
              </div>
            </Card>

            <Card padding="lg" className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Recent front-door submissions
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <Link
                    href="/admin/membership"
                    className="text-amber hover:text-amber/80 font-medium"
                  >
                    Membership →
                  </Link>
                  <Link
                    href="/admin/partner-inquiries"
                    className="text-amber hover:text-amber/80 font-medium"
                  >
                    Partner →
                  </Link>
                </div>
              </div>
              {recentFrontDoor.length === 0 ? (
                <EmptyState message="No front-door submissions yet." />
              ) : (
                <ul className="divide-y divide-gray-50">
                  {recentFrontDoor.map((r) => (
                    <li key={`${r.kind}-${r.id}`}>
                      <Link
                        href={
                          r.kind === 'membership'
                            ? `/admin/membership/${r.id}`
                            : `/admin/partner-inquiries/${r.id}`
                        }
                        className="flex items-start justify-between py-3 -mx-2 px-2 rounded transition-colors hover:bg-gray-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {r.name}
                            {r.secondary && (
                              <span className="text-gray-500 font-normal">
                                {' '}· {r.secondary}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {r.kind === 'membership'
                              ? 'Membership request'
                              : 'Partner inquiry'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className="text-xs text-gray-400 capitalize">
                            {r.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(r.submittedAt).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' }
                            )}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </Section>

        <Section
          title="Recent retreat inquiries"
          action={
            <Link
              href="/admin/retreats"
              className="text-xs text-amber hover:text-amber/80 font-medium transition-colors"
            >
              View all →
            </Link>
          }
        >
          {recentRetreats.length === 0 ? (
            <EmptyState message="No retreat inquiries yet." />
          ) : (
            <Card padding="lg">
              <ul className="divide-y divide-gray-50">
                {recentRetreats.map((r) => (
                  <li key={`${r.kind}-${r.id}`}>
                    <Link
                      href={`/admin/retreats/${r.kind}/${r.id}`}
                      className="flex items-start justify-between py-3 -mx-2 px-2 rounded transition-colors hover:bg-gray-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {r.name}
                          {r.org && (
                            <span className="text-gray-500 font-normal">
                              {' '}· {r.org}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {r.kind === 'host' ? 'Host' : 'Buyout'} · {r.dates}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-xs text-gray-400 capitalize">
                          {r.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(r.submittedAt).toLocaleDateString(
                            'en-US',
                            { month: 'short', day: 'numeric' }
                          )}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </Section>
      </PageBody>
    </>
  )
}

function QuickAction({
  href,
  label,
  glyph,
  external,
}: {
  href: string
  label: string
  glyph: string
  external?: boolean
}) {
  const className =
    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60'
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <span className="text-amber" aria-hidden="true">
          {glyph}
        </span>
        {label}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      <span className="text-amber" aria-hidden="true">
        {glyph}
      </span>
      {label}
    </Link>
  )
}
