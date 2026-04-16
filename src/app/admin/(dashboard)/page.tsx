import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import {
  getInquiryCounts,
  getUpcomingBookingsCount,
  getHostInquiries,
  getBuyoutInquiries,
} from '@/lib/data/retreats'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import Section from '@/components/admin/ui/Section'
import StatCard from '@/components/admin/ui/StatCard'
import Card from '@/components/admin/ui/Card'
import EmptyState from '@/components/admin/ui/EmptyState'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer()

  const [
    experiencesRes,
    activeRes,
    waitlistRes,
    recentSignupsRes,
    monthSignupsRes,
    inquiryCounts,
    upcomingBookings,
    recentHost,
    recentBuyout,
  ] = await Promise.all([
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }).neq('status', 'draft'),
    supabase.from('waitlist').select('*', { count: 'exact', head: true }),
    supabase.from('waitlist').select('*').order('created_at', { ascending: false }).limit(5),
    supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    getInquiryCounts(),
    getUpcomingBookingsCount(),
    getHostInquiries(),
    getBuyoutInquiries(),
  ])

  const totalExperiences = experiencesRes.count ?? 0
  const activeExperiences = activeRes.count ?? 0
  const totalWaitlist = waitlistRes.count ?? 0
  const monthWaitlist = monthSignupsRes.count ?? 0
  const recentSignups = recentSignupsRes.data ?? []

  const recentInquiries = [
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
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your Camp Monroe site" />

      <PageBody>
        <Section title="Overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Experiences"
              value={totalExperiences}
              href="/admin/experiences"
            />
            <StatCard
              label="Active (Published)"
              value={activeExperiences}
              href="/admin/experiences"
            />
            <StatCard label="Waitlist Signups" value={totalWaitlist} href="/admin/waitlist" />
            <StatCard
              label="Signups This Month"
              value={monthWaitlist}
              href="/admin/waitlist"
              sub="vs month-to-date"
            />
          </div>
        </Section>

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
              label="New Inquiries"
              value={inquiryCounts.new}
              tone="blue"
              href="/admin/retreats"
            />
            <StatCard
              label="Reviewing"
              value={inquiryCounts.reviewing}
              tone="gray"
              href="/admin/retreats"
            />
            <StatCard
              label="On Hold"
              value={inquiryCounts.hold}
              tone="orange"
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
                Quick Actions
              </h3>
              <div className="space-y-1">
                <QuickAction href="/admin/experiences/new" label="Create Experience" glyph="+" />
                <QuickAction href="/admin/retreats/blackouts/new" label="Add Blackout" glyph="+" />
                <QuickAction href="/admin/retreats" label="Retreats Inbox" glyph="→" />
                <QuickAction href="/admin/waitlist" label="Waitlist" glyph="→" />
                <QuickAction href="/" label="View Public Site" glyph="↗" external />
              </div>
            </Card>

            <Card padding="lg" className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Recent Retreat Inquiries
                </h3>
                <Link
                  href="/admin/retreats"
                  className="text-xs text-amber hover:text-amber/80 font-medium transition-colors"
                >
                  View All →
                </Link>
              </div>
              {recentInquiries.length === 0 ? (
                <EmptyState message="No inquiries yet." />
              ) : (
                <ul className="divide-y divide-gray-50">
                  {recentInquiries.map((r) => (
                    <li key={`${r.kind}-${r.id}`}>
                      <Link
                        href={`/admin/retreats/${r.kind}/${r.id}`}
                        className="flex items-start justify-between py-3 -mx-2 px-2 rounded transition-colors hover:bg-gray-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {r.name}
                            {r.org && (
                              <span className="text-gray-500 font-normal"> · {r.org}</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {r.kind === 'host' ? 'Host' : 'Buyout'} · {r.dates}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className="text-xs text-gray-400 capitalize">{r.status}</span>
                          <span className="text-xs text-gray-400">
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
            </Card>
          </div>
        </Section>

        <Section
          title="Recent Waitlist Signups"
          action={
            <Link
              href="/admin/waitlist"
              className="text-xs text-amber hover:text-amber/80 font-medium transition-colors"
            >
              View All →
            </Link>
          }
        >
          {recentSignups.length === 0 ? (
            <EmptyState message="No signups yet." />
          ) : (
            <Card padding="lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Email</th>
                      <th className="pb-2 font-medium">Interest</th>
                      <th className="pb-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentSignups.map((signup: Record<string, string>) => (
                      <tr key={signup.id} className="text-gray-700 hover:bg-gray-50/50 transition-colors">
                        <td className="py-2.5">{signup.name}</td>
                        <td className="py-2.5 text-gray-500">{signup.email}</td>
                        <td className="py-2.5 text-gray-500">{signup.trip_interest || '—'}</td>
                        <td className="py-2.5 text-gray-400">
                          {new Date(signup.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <span className="text-amber" aria-hidden="true">{glyph}</span>
        {label}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      <span className="text-amber" aria-hidden="true">{glyph}</span>
      {label}
    </Link>
  )
}
