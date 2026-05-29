import { createSupabaseServer } from '@/lib/supabase-server'
import WaitlistTable from '@/components/admin/WaitlistTable'
import PageHeader from '@/components/admin/ui/PageHeader'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Follow along — Camp Monroe Admin',
}

export default async function WaitlistPage() {
  const supabase = await createSupabaseServer()

  const { data, count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  const entries = data ?? []

  const followAlongCount = entries.filter(
    (e) => e.source === 'home_follow_along'
  ).length
  const legacyCount = entries.filter((e) => e.source === 'legacy_trip').length

  return (
    <>
      <PageHeader
        title="Follow along"
        subtitle={`${count ?? 0} total signups · ${followAlongCount} follow-along · ${legacyCount} legacy trip waitlist`}
      />
      <WaitlistTable entries={entries} />
    </>
  )
}
