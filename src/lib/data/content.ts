import { createClient } from '@supabase/supabase-js'
import type {
  PageContentMap,
  TimelineItem,
  WayToPartnerItem,
} from '@/lib/types/content'

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Public anon reads only — safe for both server and client bundles
 * (no `next/headers`, no service role, no server-only imports).
 *
 * Admin operations live in @/lib/data/content-admin.ts.
 */

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ============================================================================
// page_content
// ============================================================================

/**
 * Fetch all editable copy for one page and return a flat lookup keyed
 * as "block.field" → value. Public pages call this once at the top.
 *
 * On any error returns an empty map so the page falls back to its
 * hardcoded JSX defaults — never breaks on a content-layer failure.
 */
export async function getPageContent(page: string): Promise<PageContentMap> {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('page_content')
    .select('block, field, value')
    .eq('page', page)
  if (error) {
    console.error(`getPageContent(${page}):`, error)
    return {}
  }
  const map: PageContentMap = {}
  for (const row of data ?? []) {
    map[`${row.block}.${row.field}`] = row.value ?? ''
  }
  return map
}

/**
 * Read a single content value with a fallback. Treats empty strings
 * as missing so an admin clearing a field doesn't blank the page.
 */
export function t(
  map: PageContentMap,
  blockDotField: string,
  fallback: string
): string {
  const v = map[blockDotField]
  return v && v.trim().length > 0 ? v : fallback
}

// ============================================================================
// timeline_items (public read)
// ============================================================================

function mapTimelineItem(row: any): TimelineItem {
  return {
    id: row.id,
    year: row.year,
    head: row.head,
    body: row.body,
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
    updatedAt: row.updated_at,
  }
}

export async function getTimelineItems(): Promise<TimelineItem[]> {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('timeline_items')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('getTimelineItems:', error)
    return []
  }
  return (data ?? []).map(mapTimelineItem)
}

// ============================================================================
// ways_to_partner_items (public read)
// ============================================================================

function mapWayItem(row: any): WayToPartnerItem {
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    description: row.description,
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
    updatedAt: row.updated_at,
  }
}

export async function getWaysToPartnerItems(): Promise<WayToPartnerItem[]> {
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('ways_to_partner_items')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('getWaysToPartnerItems:', error)
    return []
  }
  return (data ?? []).map(mapWayItem)
}
