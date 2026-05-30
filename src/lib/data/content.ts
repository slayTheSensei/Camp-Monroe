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
  try {
    const supabase = anonClient()
    const { data, error } = await supabase
      .from('page_content')
      .select('block, field, value')
      .eq('page', page)
    if (error) {
      console.error(
        `[content] getPageContent(${page}) failed:`,
        error.message || error.code || 'unknown error',
        '— falling back to hardcoded defaults'
      )
      return {}
    }
    const map: PageContentMap = {}
    for (const row of data ?? []) {
      map[`${row.block}.${row.field}`] = row.value ?? ''
    }
    return map
  } catch (err) {
    // Network-level failures (fetch threw) don't go through .error
    console.error(
      `[content] getPageContent(${page}) network exception:`,
      err instanceof Error ? err.message : err,
      '— falling back to hardcoded defaults'
    )
    return {}
  }
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
  try {
    const supabase = anonClient()
    const { data, error } = await supabase
      .from('timeline_items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
    if (error) {
      console.error(
        '[content] getTimelineItems failed:',
        error.message || error.code || 'unknown error',
        '— falling back to []'
      )
      return []
    }
    return (data ?? []).map(mapTimelineItem)
  } catch (err) {
    console.error(
      '[content] getTimelineItems network exception:',
      err instanceof Error ? err.message : err
    )
    return []
  }
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
  try {
    const supabase = anonClient()
    const { data, error } = await supabase
      .from('ways_to_partner_items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
    if (error) {
      console.error(
        '[content] getWaysToPartnerItems failed:',
        error.message || error.code || 'unknown error',
        '— falling back to []'
      )
      return []
    }
    return (data ?? []).map(mapWayItem)
  } catch (err) {
    console.error(
      '[content] getWaysToPartnerItems network exception:',
      err instanceof Error ? err.message : err
    )
    return []
  }
}
