'use server'

import { revalidatePath } from 'next/cache'
import { upsertPageContent } from '@/lib/data/content-admin'
import type { PageContentType } from '@/lib/types/content'

/** Public URL each `page` value maps to, for revalidation. */
const PAGE_PUBLIC_PATHS: Record<string, string[]> = {
  // 'site' affects components used on every public page
  site: ['/', '/the-camp', '/renovation', '/membership', '/locations', '/history', '/partner', '/visit', '/request'],
  home: ['/'],
  the_camp: ['/the-camp'],
  renovation: ['/renovation'],
  membership: ['/membership'],
  locations: ['/locations'],
  history: ['/history'],
  partner: ['/partner'],
  visit: ['/visit'],
}

export async function savePageContent(input: {
  page: string
  block: string
  field: string
  value: string
  type?: PageContentType
}): Promise<{ error?: string }> {
  const res = await upsertPageContent(input)
  if (res.error) return res

  // Revalidate the public page(s) so the edit appears on next visit
  const paths = PAGE_PUBLIC_PATHS[input.page] ?? []
  for (const p of paths) revalidatePath(p)
  revalidatePath('/admin/content')
  revalidatePath(`/admin/content/pages/${input.page}`)
  return {}
}
