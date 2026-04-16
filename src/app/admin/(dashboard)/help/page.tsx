import fs from 'node:fs/promises'
import path from 'node:path'
import PageHeader from '@/components/admin/ui/PageHeader'
import MarkdownBody from '@/components/admin/help/MarkdownBody'
import TableOfContents from '@/components/admin/help/TableOfContents'
import { extractToc } from '@/components/admin/help/extractToc'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Guide — Camp Monroe',
}

export default async function HelpPage() {
  const filePath = path.join(process.cwd(), 'docs/ADMIN-GUIDE.md')
  const raw = await fs.readFile(filePath, 'utf-8')

  // Strip the first h1 (the guide starts with "# Camp Monroe Admin — Team Onboarding Guide")
  // — we already show the page title via PageHeader.
  const { title, body } = splitFirstHeading(raw)
  const toc = extractToc(body)

  return (
    <>
      <PageHeader
        title={title ?? 'Admin Guide'}
        subtitle="Team onboarding reference — everything you need to operate the admin."
      />
      <div className="flex flex-col-reverse lg:flex-row gap-10 items-start">
        <TableOfContents nodes={toc} />
        <div className="flex-1 min-w-0">
          <MarkdownBody content={body} />
        </div>
      </div>
    </>
  )
}

function splitFirstHeading(md: string): { title: string | null; body: string } {
  const m = md.match(/^#\s+(.+?)\s*$/m)
  if (!m) return { title: null, body: md }
  const idx = md.indexOf(m[0])
  const body = (md.slice(0, idx) + md.slice(idx + m[0].length)).trimStart()
  return { title: m[1], body }
}
