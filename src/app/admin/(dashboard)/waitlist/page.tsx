import { createSupabaseServer } from '@/lib/supabase-server'
import WaitlistTable from '@/components/admin/WaitlistTable'
import PageHeader from '@/components/admin/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default async function WaitlistPage() {
  const supabase = await createSupabaseServer()

  const { data, count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  const entries = data ?? []

  return (
    <>
      <PageHeader title="Waitlist" subtitle={`${count ?? 0} total signups`} />
      <WaitlistTable entries={entries} />
    </>
  )
}
