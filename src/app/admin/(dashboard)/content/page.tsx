import { createSupabaseServer } from '@/lib/supabase-server'
import {
  getTimelineItemsAdmin,
  getWaysToPartnerItemsAdmin,
  getPageContentAdmin,
} from '@/lib/data/content-admin'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import ContentDashboard from '@/components/admin/content/ContentDashboard'
import type { PageContentRow } from '@/lib/types/content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Site content — Camp Monroe Admin',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapPageContent(row: any): PageContentRow {
  return {
    id: row.id,
    page: row.page,
    block: row.block,
    field: row.field,
    value: row.value ?? '',
    type: row.type,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by ?? null,
  }
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>
}) {
  const { tab, page } = await searchParams
  const supabase = await createSupabaseServer()

  const [timeline, ways, sitePage, homePage, visitPage, legacy, allImages] =
    await Promise.all([
      getTimelineItemsAdmin(),
      getWaysToPartnerItemsAdmin(),
      getPageContentAdmin('site'),
      getPageContentAdmin('home'),
      getPageContentAdmin('visit'),
      supabase.from('site_content').select('*', { count: 'exact', head: true }),
      // Every image_url row across every page — drives the Photos tab
      supabase
        .from('page_content')
        .select('*')
        .eq('type', 'image_url')
        .order('page')
        .order('block')
        .order('field'),
    ])

  const allImageRows: PageContentRow[] = (allImages.data ?? []).map(mapPageContent)

  return (
    <>
      <PageHeader
        title="Site content"
        subtitle="Edit the copy and photos on the public site. Changes save automatically and appear on the live site within seconds."
      />
      <PageBody>
        <ContentDashboard
          initialTab={tab ?? 'photos'}
          initialPage={page ?? 'site'}
          pageContent={{
            site: sitePage,
            home: homePage,
            visit: visitPage,
          }}
          timeline={timeline}
          ways={ways}
          legacyRowCount={legacy.count ?? 0}
          allImageRows={allImageRows}
        />
      </PageBody>
    </>
  )
}
