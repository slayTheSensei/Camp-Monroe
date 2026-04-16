import { loadDocsTree } from '@/lib/docs'
import DocsSidebar from '@/components/admin/help/DocsSidebar'

export const dynamic = 'force-dynamic'

/**
 * Help layout: left docs sidebar (categories + articles + search),
 * right column is the article content rendered by the child route.
 */
export default async function HelpLayout({ children }: { children: React.ReactNode }) {
  const groups = await loadDocsTree()
  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      <DocsSidebar groups={groups} />
      <div className="flex-1 min-w-0 w-full">{children}</div>
    </div>
  )
}
