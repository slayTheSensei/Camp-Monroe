import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import PageContentEditor from './PageContentEditor'
import { getPageContentAdmin } from '@/lib/data/content-admin'

export const dynamic = 'force-dynamic'

const PAGE_LABELS: Record<string, { label: string; publicPath: string | null }> = {
  site: { label: 'Site-wide (CTA + Footer)', publicPath: '/' },
  home: { label: 'Home page', publicPath: '/' },
  visit: { label: 'Visit page', publicPath: '/visit' },
}

const VALID_PAGES = new Set(Object.keys(PAGE_LABELS))

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params
  const def = PAGE_LABELS[page]
  return {
    title: def
      ? `${def.label} — Camp Monroe Admin`
      : 'Page content — Camp Monroe Admin',
  }
}

export default async function PageEditorPage({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params
  if (!VALID_PAGES.has(page)) notFound()

  const def = PAGE_LABELS[page]
  const rows = await getPageContentAdmin(page)

  return (
    <>
      <PageHeader
        title={def.label}
        subtitle={
          def.publicPath
            ? `Editable copy on ${def.publicPath} — save publishes immediately to the public site.`
            : 'Editable copy fields'
        }
      />
      <PageBody>
        <div className="flex items-center justify-between text-xs mb-4">
          <Link href="/admin/content/pages" className="text-amber font-medium">
            ← All pages
          </Link>
          {def.publicPath && (
            <a
              href={def.publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber font-medium"
            >
              View {def.publicPath} ↗
            </a>
          )}
        </div>
        <PageContentEditor page={page} rows={rows} />
      </PageBody>
    </>
  )
}
