import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase-server'
import SiteContentEditor from '@/components/admin/SiteContentEditor'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Legacy site content — Camp Monroe Admin',
}

export default async function LegacyContentPage() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('site_content')
    .select('*')
    .order('sort_order', { ascending: true })

  const rows = data ?? []

  return (
    <>
      <PageHeader
        title="Legacy site content"
        subtitle="Pre-redesign copy editor. Currently not rendered on the public site."
      />
      <PageBody>
        <div className="mb-4 p-3 bg-amber/10 border border-amber/20 rounded text-xs text-gray-700">
          <Link href="/admin/content" className="text-amber font-medium">
            ← Back to content hub
          </Link>
          <p className="mt-1">
            These rows were used by the pre-redesign home page (hero, story, mission, footer, nav, waitlist).
            The new public site does not currently read from this table; edits here do not appear on the live site.
          </p>
        </div>
        <SiteContentEditor initialRows={rows} />
      </PageBody>
    </>
  )
}
