import { createSupabaseServer } from '@/lib/supabase-server'
import {
  getTimelineItemsAdmin,
  getWaysToPartnerItemsAdmin,
  getPageContentAdmin,
} from '@/lib/data/content-admin'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import ContentDashboard from '@/components/admin/content/ContentDashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Site content — Camp Monroe Admin',
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>
}) {
  const { tab, page } = await searchParams
  const supabase = await createSupabaseServer()

  const [timeline, ways, sitePage, homePage, visitPage, legacy] =
    await Promise.all([
      getTimelineItemsAdmin(),
      getWaysToPartnerItemsAdmin(),
      getPageContentAdmin('site'),
      getPageContentAdmin('home'),
      getPageContentAdmin('visit'),
      supabase.from('site_content').select('*', { count: 'exact', head: true }),
    ])

  return (
    <>
      <PageHeader
        title="Site content"
        subtitle="Edit the copy on the public site. Changes save automatically and appear on the live site within seconds."
      />
      <PageBody>
        <ContentDashboard
          initialTab={tab ?? 'pages'}
          initialPage={page ?? 'site'}
          pageContent={{
            site: sitePage,
            home: homePage,
            visit: visitPage,
          }}
          timeline={timeline}
          ways={ways}
          legacyRowCount={legacy.count ?? 0}
        />
      </PageBody>
    </>
  )
}
