import { createSupabaseServer } from '@/lib/supabase-server'
import SiteContentEditor from '@/components/admin/SiteContentEditor'
import PageHeader from '@/components/admin/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('site_content')
    .select('*')
    .order('sort_order', { ascending: true })

  const rows = data ?? []

  return (
    <>
      <PageHeader
        title="Site Content"
        subtitle="Edit the copy displayed on the public website"
      />
      <SiteContentEditor initialRows={rows} />
    </>
  )
}
