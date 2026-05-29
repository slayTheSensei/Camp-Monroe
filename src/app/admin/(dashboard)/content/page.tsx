import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase-server'
import {
  getTimelineItemsAdmin,
  getWaysToPartnerItemsAdmin,
} from '@/lib/data/content-admin'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import Section from '@/components/admin/ui/Section'
import Card from '@/components/admin/ui/Card'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Site content — Camp Monroe Admin',
}

export default async function ContentHubPage() {
  const supabase = await createSupabaseServer()

  const [timeline, ways, legacy] = await Promise.all([
    getTimelineItemsAdmin(),
    getWaysToPartnerItemsAdmin(),
    supabase
      .from('site_content')
      .select('*', { count: 'exact', head: true }),
  ])

  return (
    <>
      <PageHeader
        title="Site content"
        subtitle="Editable copy and structured content blocks on the public site."
      />
      <PageBody>
        <Section title="Pages copy">
          <div className="grid gap-4">
            <ContentCard
              href="/admin/content/pages"
              title="Edit page copy"
              subtitle="CTA band · Footer · Home hero · Visit headlines"
              description="Singular copy fields across the public site — hero text, CTAs, footer brand block, the Du Bois pull quote. Edits revalidate the affected public page automatically."
            />
          </div>
        </Section>

        <Section title="Structured content">
          <div className="grid gap-4 md:grid-cols-2">
            <ContentCard
              href="/admin/content/timeline"
              title="History timeline"
              subtitle={`${timeline.length} item${timeline.length === 1 ? '' : 's'} · /history`}
              description="The ordered timeline of years and milestones rendered on /history. Reorder, edit copy, hide, or add items."
            />
            <ContentCard
              href="/admin/content/partner-ways"
              title="Ways to partner"
              subtitle={`${ways.length} item${ways.length === 1 ? '' : 's'} · /partner`}
              description="The four cards shown on /partner. Reorder, edit copy, hide, or add new ways to partner."
            />
          </div>
        </Section>

        <Section title="Legacy site content">
          <Card padding="lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Pre-redesign copy ({legacy.count ?? 0} rows)
                </h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  The old site_content table held home page copy (hero, story,
                  mission, footer, nav, waitlist) for the pre-redesign site.
                  None of this is currently rendered on the new public site.
                  Preserved here in case any of it is worth migrating.
                </p>
              </div>
              <Link
                href="/admin/content/legacy"
                className="text-xs text-amber hover:text-amber/80 font-medium transition-colors whitespace-nowrap"
              >
                Open legacy editor →
              </Link>
            </div>
          </Card>
        </Section>
      </PageBody>
    </>
  )
}

function ContentCard({
  href,
  title,
  subtitle,
  description,
}: {
  href: string
  title: string
  subtitle: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 rounded-lg"
    >
      <Card padding="lg" className="h-full transition-colors group-hover:border-amber/40">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-amber transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">
          {subtitle}
        </p>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          {description}
        </p>
        <p className="text-xs text-amber mt-4 font-medium">Open editor →</p>
      </Card>
    </Link>
  )
}
