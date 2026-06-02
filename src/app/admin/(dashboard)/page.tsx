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
} from '@/lib/data/inquiries'
import EmptyState from '@/components/admin/ui/EmptyState'

export const dynamic = 'force-dynamic'

type InquiryRow = {
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

  const recentInquiries: InquiryRow[] = [
    ...recentMembership.map((m) => ({
      id: m.id,
      kind: 'membership' as const,
      name: m.name,
      secondary: m.chapter
        ? m.chapter === 'mens'
          ? "Men's chapter"
          : "Women's chapter"
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
    .slice(0, 6)

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
    .slice(0, 6)

  return (
    <div className="space-y-4">
      {/* Header — compact */}
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            The front door, in one view.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber hover:text-amber/80 font-medium whitespace-nowrap"
        >
          View public site ↗
        </a>
      </header>

      {/* All stats in one tight 8-tile band */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {/* Row 1: Public form submissions */}
          <StatTile
            label="New membership requests"
            value={membershipCounts.new}
            tone="blue"
            href="/admin/membership"
            sub="from /request"
          />
          <StatTile
            label="New partner inquiries"
            value={partnerCounts.new}
            tone="blue"
            href="/admin/partner-inquiries"
            sub="from /partner"
          />
          <StatTile
            label="Follow-along signups"
            value={totalWaitlist}
            sub={
              monthWaitlist
                ? `+${monthWaitlist} this month`
                : 'no new signups this month'
            }
            href="/admin/waitlist"
          />
          <StatTile
            label="Reviewing across inquiries"
            value={
              membershipCounts.reviewing +
              partnerCounts.reviewing +
              inquiryCounts.reviewing
            }
            tone="gray"
            sub="all inquiry types"
          />
          {/* Row 2: Retreats pipeline */}
          <StatTile
            label="New retreat inquiries"
            value={inquiryCounts.new}
            tone="blue"
            href="/admin/retreats"
            sub="host + buyout"
          />
          <StatTile
            label="Retreats on hold"
            value={inquiryCounts.hold}
            tone="orange"
            href="/admin/retreats"
          />
          <StatTile
            label="Retreats confirmed"
            value={inquiryCounts.confirmed}
            tone="green"
            href="/admin/retreats"
          />
          <StatTile
            label="Upcoming bookings"
            value={upcomingBookings}
            tone="green"
            sub="next 90 days"
            href="/admin/retreats"
          />
        </div>
      </section>

      {/* Quick actions strip */}
      <section>
        <div className="flex flex-wrap gap-1.5">
          <QuickAction href="/admin/membership" label="Membership inbox" />
          <QuickAction href="/admin/partner-inquiries" label="Partner inbox" />
          <QuickAction href="/admin/retreats" label="Retreats inbox" />
          <QuickAction href="/admin/retreats/blackouts/new" label="+ Add blackout" />
          <QuickAction href="/admin/content" label="Edit site content" />
          <QuickAction href="/admin/waitlist" label="Export follow-along CSV" />
        </div>
      </section>

      {/* Recent activity — two columns */}
      <section className="grid gap-3 lg:grid-cols-2">
        <FeedCard
          title="Recent inquiries"
          links={[
            { href: '/admin/membership', label: 'Membership' },
            { href: '/admin/partner-inquiries', label: 'Partner' },
          ]}
        >
          {recentInquiries.length === 0 ? (
            <EmptyState message="No inquiries yet." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentInquiries.map((r) => (
                <li key={`${r.kind}-${r.id}`}>
                  <Link
                    href={
                      r.kind === 'membership'
                        ? `/admin/membership/${r.id}`
                        : `/admin/partner-inquiries/${r.id}`
                    }
                    className="flex items-center justify-between gap-2 px-2 py-1.5 -mx-2 rounded transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 truncate">
                        <span className="font-medium">{r.name}</span>
                        {r.secondary && (
                          <span className="text-gray-400 font-normal">
                            {' · '}
                            {r.secondary}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <KindBadge kind={r.kind} />
                      <StatusDot status={r.status} />
                      <span className="text-[11px] text-gray-400 tabular-nums w-12 text-right">
                        {new Date(r.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </FeedCard>

        <FeedCard
          title="Recent retreat inquiries"
          links={[{ href: '/admin/retreats', label: 'All' }]}
        >
          {recentRetreats.length === 0 ? (
            <EmptyState message="No retreat inquiries yet." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentRetreats.map((r) => (
                <li key={`${r.kind}-${r.id}`}>
                  <Link
                    href={`/admin/retreats/${r.kind}/${r.id}`}
                    className="flex items-center justify-between gap-2 px-2 py-1.5 -mx-2 rounded transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 truncate">
                        <span className="font-medium">{r.name}</span>
                        {r.org && (
                          <span className="text-gray-400 font-normal">
                            {' · '}
                            {r.org}
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {r.dates}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <KindBadge kind={r.kind} />
                      <StatusDot status={r.status} />
                      <span className="text-[11px] text-gray-400 tabular-nums w-12 text-right">
                        {new Date(r.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </FeedCard>
      </section>
    </div>
  )
}

// =============================================================================
// Components
// =============================================================================

function StatTile({
  label,
  value,
  sub,
  tone = 'default',
  href,
}: {
  label: string
  value: React.ReactNode
  sub?: string
  tone?: 'default' | 'blue' | 'orange' | 'green' | 'gray' | 'amber'
  href?: string
}) {
  const toneClass: Record<typeof tone, string> = {
    default: 'text-gray-900',
    blue: 'text-blue-700',
    orange: 'text-orange-700',
    green: 'text-green-700',
    gray: 'text-gray-700',
    amber: 'text-amber',
  }

  const inner = (
    <>
      <p className="text-[11px] text-gray-600 font-medium leading-snug min-h-[2em]">
        {label}
      </p>
      <p
        className={`text-2xl font-bold leading-none mt-2 tabular-nums ${toneClass[tone]}`}
      >
        {value}
      </p>
      <p className="text-[10px] text-gray-400 mt-1 min-h-[1em] leading-snug">
        {sub ?? ' '}
      </p>
    </>
  )

  const base =
    'block bg-white p-3.5 transition-colors duration-150'
  if (href) {
    return (
      <Link
        href={href}
        className={`${base} hover:bg-amber/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:relative focus-visible:z-10`}
      >
        {inner}
      </Link>
    )
  }
  return <div className={base}>{inner}</div>
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded transition-colors hover:border-amber hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
    >
      {label}
    </Link>
  )
}

function FeedCard({
  title,
  links,
  children,
}: {
  title: string
  links: { href: string; label: string }[]
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50/40">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          {title}
        </h3>
        <div className="flex items-center gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] text-amber hover:text-amber/80 font-medium"
            >
              {l.label} →
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">{children}</div>
    </div>
  )
}

function KindBadge({ kind }: { kind: string }) {
  const labels: Record<string, string> = {
    membership: 'M',
    partner: 'P',
    host: 'H',
    buyout: 'B',
  }
  const tones: Record<string, string> = {
    membership: 'bg-blue-50 text-blue-700 border-blue-100',
    partner: 'bg-purple-50 text-purple-700 border-purple-100',
    host: 'bg-amber/10 text-amber border-amber/20',
    buyout: 'bg-green-50 text-green-700 border-green-100',
  }
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded border ${
        tones[kind] ?? 'bg-gray-50 text-gray-600 border-gray-100'
      }`}
      title={kind}
    >
      {labels[kind] ?? '?'}
    </span>
  )
}

function StatusDot({ status }: { status: string }) {
  const tones: Record<string, string> = {
    new: 'bg-blue-500',
    reviewing: 'bg-gray-400',
    hold: 'bg-orange-500',
    confirmed: 'bg-green-500',
    declined: 'bg-red-400',
  }
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ${tones[status] ?? 'bg-gray-300'}`}
      title={status}
    />
  )
}
