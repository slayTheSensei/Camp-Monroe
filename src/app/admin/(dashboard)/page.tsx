import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import {
  getInquiryCounts,
  getUpcomingBookingsCount,
  getHostInquiries,
  getBuyoutInquiries,
} from '@/lib/data/retreats'

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
    supabase.from('waitlist').select('*', { count: 'exact', head: true })
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

  // Merge + sort recent inquiries (top 5 newest across both kinds)
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

  const stats = [
    { label: 'Total Experiences', value: totalExperiences, href: '/admin/experiences' },
    { label: 'Active (Published)', value: activeExperiences, href: '/admin/experiences' },
    { label: 'Waitlist Signups', value: totalWaitlist, href: '/admin/waitlist' },
    { label: 'Signups This Month', value: monthWaitlist, href: '/admin/waitlist' },
  ]

  const retreatStats = [
    { label: 'New Inquiries', value: inquiryCounts.new, tone: 'text-blue-700' },
    { label: 'Reviewing', value: inquiryCounts.reviewing, tone: 'text-gray-700' },
    { label: 'On Hold', value: inquiryCounts.hold, tone: 'text-orange-700' },
    { label: 'Upcoming (90d)', value: upcomingBookings, tone: 'text-green-700' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your Camp Monroe site</p>
      </div>

      {/* Top-level stat cards (experiences + waitlist) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:border-amber/50 transition-colors"
          >
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Retreats stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Retreats</h2>
          <Link href="/admin/retreats" className="text-xs text-amber hover:text-amber/80 font-medium">
            Open dashboard →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {retreatStats.map((s) => (
            <Link
              key={s.label}
              href="/admin/retreats"
              className="bg-white rounded-lg border border-gray-200 p-5 hover:border-amber/50 transition-colors"
            >
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{s.label}</p>
              <p className={`text-3xl font-bold mt-2 ${s.tone}`}>{s.value}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions + recent activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/experiences/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-amber">+</span> Create Experience
            </Link>
            <Link
              href="/admin/retreats/blackouts/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-amber">+</span> Add Blackout
            </Link>
            <Link
              href="/admin/retreats"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-amber">→</span> Retreats Inbox
            </Link>
            <Link
              href="/admin/waitlist"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-amber">→</span> Waitlist
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-amber">↗</span> View Public Site
            </a>
          </div>
        </div>

        {/* Recent retreat inquiries */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Recent Retreat Inquiries</h2>
            <Link href="/admin/retreats" className="text-xs text-amber hover:text-amber/80 font-medium">View All →</Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No inquiries yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentInquiries.map((r) => (
                <li key={`${r.kind}-${r.id}`}>
                  <Link
                    href={`/admin/retreats/${r.kind}/${r.id}`}
                    className="flex items-start justify-between py-2.5 hover:bg-gray-50/50 transition-colors -mx-2 px-2 rounded"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {r.name}
                        {r.org && <span className="text-gray-500 font-normal"> · {r.org}</span>}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {r.kind === 'host' ? 'Host' : 'Buyout'} · {r.dates}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-xs text-gray-400 capitalize">{r.status}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(r.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent waitlist signups */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Recent Waitlist Signups</h2>
          <Link href="/admin/waitlist" className="text-xs text-amber hover:text-amber/80 font-medium">View All →</Link>
        </div>
        {recentSignups.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No signups yet.</p>
        ) : (
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
                  <tr key={signup.id} className="text-gray-700">
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
        )}
      </div>
    </div>
  )
}
