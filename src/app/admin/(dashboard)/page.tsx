import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer()

  // Fetch stats in parallel
  const [experiencesRes, activeRes, waitlistRes, recentSignupsRes, monthSignupsRes] = await Promise.all([
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }).neq('status', 'draft'),
    supabase.from('waitlist').select('*', { count: 'exact', head: true }),
    supabase.from('waitlist').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('waitlist').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ])

  const totalExperiences = experiencesRes.count ?? 0
  const activeExperiences = activeRes.count ?? 0
  const totalWaitlist = waitlistRes.count ?? 0
  const monthWaitlist = monthSignupsRes.count ?? 0
  const recentSignups = recentSignupsRes.data ?? []

  const stats = [
    { label: 'Total Experiences', value: totalExperiences, href: '/admin/experiences' },
    { label: 'Active (Published)', value: activeExperiences, href: '/admin/experiences' },
    { label: 'Waitlist Signups', value: totalWaitlist, href: '/admin/waitlist' },
    { label: 'Signups This Month', value: monthWaitlist, href: '/admin/waitlist' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your Camp Monroe site</p>
      </div>

      {/* Stat cards */}
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

      {/* Quick actions + Recent signups */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/experiences/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-amber">+</span>
              Create Experience
            </Link>
            <Link
              href="/admin/waitlist"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-amber">→</span>
              View Waitlist
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-amber">↗</span>
              View Public Site
            </a>
          </div>
        </div>

        {/* Recent waitlist signups */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Recent Signups</h2>
            <Link href="/admin/waitlist" className="text-xs text-amber hover:text-amber/80 font-medium">
              View All →
            </Link>
          </div>

          {recentSignups.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No signups yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
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
    </div>
  )
}
