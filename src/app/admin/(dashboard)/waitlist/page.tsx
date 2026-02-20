import { createSupabaseServer } from '@/lib/supabase-server'
import WaitlistTable from '@/components/admin/WaitlistTable'

export default async function WaitlistPage() {
  const supabase = await createSupabaseServer()

  const { data, count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  const entries = data ?? []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Waitlist</h1>
        <p className="text-gray-500 text-sm mt-1">{count ?? 0} total signups</p>
      </div>

      <WaitlistTable entries={entries} />
    </div>
  )
}
