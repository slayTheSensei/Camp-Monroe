import Link from 'next/link'
import PageHeader from '@/components/admin/ui/PageHeader'
import { loadDocsTree } from '@/lib/docs'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Guide — Camp Monroe',
}

export default async function HelpLandingPage() {
  const groups = await loadDocsTree()
  return (
    <>
      <PageHeader
        title="Admin Guide"
        subtitle="Operating manual for the Camp Monroe admin. Browse by category or search in the sidebar."
      />
      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              {group.category}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {group.articles.map((a) => (
                <Link
                  key={a.path}
                  href={`/admin/help/${a.path}`}
                  className="group block rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-amber/50"
                >
                  <p className="text-base font-semibold text-gray-900 group-hover:text-amber">
                    {a.title}
                  </p>
                  {a.summary && (
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{a.summary}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
