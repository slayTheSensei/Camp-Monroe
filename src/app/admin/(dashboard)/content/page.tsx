import { createSupabaseServer } from '@/lib/supabase-server'
import SiteContentEditor from '@/components/admin/SiteContentEditor'

export default async function ContentPage() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('site_content')
    .select('*')
    .order('sort_order', { ascending: true })

  const rows = data ?? []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the copy displayed on the public website</p>
      </div>
      <SiteContentEditor initialRows={rows} />
    </div>
  )
}
