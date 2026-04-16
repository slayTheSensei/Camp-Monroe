import { notFound } from 'next/navigation'
import PageHeader from '@/components/admin/ui/PageHeader'
import MarkdownBody from '@/components/admin/help/MarkdownBody'
import TableOfContents from '@/components/admin/help/TableOfContents'
import PrevNext from '@/components/admin/help/PrevNext'
import { extractToc } from '@/components/admin/help/extractToc'
import { loadArticleBySlug, loadAllArticlesFlat } from '@/lib/docs'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string[] }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const article = await loadArticleBySlug(slug)
  return {
    title: article ? `${article.title} — Admin Guide` : 'Admin Guide',
  }
}

export default async function HelpArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await loadArticleBySlug(slug)
  if (!article) notFound()

  const flat = await loadAllArticlesFlat()
  const idx = flat.findIndex((a) => a.path === article.path)
  const prev = idx > 0 ? flat[idx - 1] : null
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null

  const toc = extractToc(article.content)

  return (
    <>
      <PageHeader
        title={article.title}
        subtitle={article.summary}
        back={{ href: '/admin/help', label: 'Admin Guide' }}
      />
      <div className="flex flex-col-reverse lg:flex-row gap-10 items-start">
        <TableOfContents nodes={toc} />
        <div className="flex-1 min-w-0 w-full">
          <MarkdownBody content={article.content} />
          <PrevNext prev={prev} next={next} />
        </div>
      </div>
    </>
  )
}
