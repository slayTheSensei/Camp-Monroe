import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase-server'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageBody from '@/components/admin/ui/PageBody'
import Card from '@/components/admin/ui/Card'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Pages content — Camp Monroe Admin',
}

const PAGES: { key: string; label: string; href: string; description: string }[] = [
  {
    key: 'site',
    label: 'Site-wide (CTA + Footer)',
    href: '/admin/content/pages/site',
    description: 'The amber CTA band + footer brand block + contact lines that appear on every page.',
  },
  {
    key: 'home',
    label: 'Home page',
    href: '/admin/content/pages/home',
    description: 'Hero copy, story split, and the Du Bois pull quote.',
  },
  {
    key: 'visit',
    label: 'Visit page',
    href: '/admin/content/pages/visit',
    description: 'Hero headlines + lead copy per mode (Host / Buyout), plus the bridge line.',
  },
]

export default async function PagesContentHub() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.from('page_content').select('page')
  const counts: Record<string, number> = {}
  for (const row of data ?? []) counts[row.page] = (counts[row.page] ?? 0) + 1

  return (
    <>
      <PageHeader
        title="Pages content"
        subtitle="Editable copy across the public site. Edits go live on the next page load — public pages revalidate automatically when you save."
      />
      <PageBody>
        <div className="grid gap-4 md:grid-cols-3">
          {PAGES.map((p) => (
            <Link
              key={p.key}
              href={p.href}
              className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 rounded-lg"
            >
              <Card
                padding="lg"
                className="h-full transition-colors group-hover:border-amber/40"
              >
                <p className="text-xs text-amber uppercase tracking-wider font-medium">
                  {p.key}
                </p>
                <h3 className="text-base font-semibold text-gray-900 mt-1 group-hover:text-amber transition-colors">
                  {p.label}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {counts[p.key] ?? 0} field{counts[p.key] === 1 ? '' : 's'}
                </p>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {p.description}
                </p>
                <p className="text-xs text-amber mt-4 font-medium">Open editor →</p>
              </Card>
            </Link>
          ))}
        </div>
      </PageBody>
    </>
  )
}
