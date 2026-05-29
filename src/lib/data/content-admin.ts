import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseServer } from '@/lib/supabase-server'
import type {
  PageContentRow,
  TimelineItem,
  WayToPartnerItem,
} from '@/lib/types/content'

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Server-only / admin operations. Uses the service role for writes and
 * the cookie-aware server client for authenticated reads. Never import
 * this from a client component or from a server component used inside
 * a client tree — the imports here drag in `next/headers`.
 */

// ============================================================================
// page_content
// ============================================================================

function mapPageContent(row: any): PageContentRow {
  return {
    id: row.id,
    page: row.page,
    block: row.block,
    field: row.field,
    value: row.value ?? '',
    type: row.type,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by ?? null,
  }
}

export async function getPageContentAdmin(
  page: string
): Promise<PageContentRow[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', page)
    .order('block')
    .order('field')
  if (error) {
    console.error(`getPageContentAdmin(${page}):`, error)
    return []
  }
  return (data ?? []).map(mapPageContent)
}

export async function upsertPageContent(input: {
  page: string
  block: string
  field: string
  value: string
  type?: PageContentRow['type']
}): Promise<{ error?: string }> {
  const supabase = createSupabaseAdmin()
  const { error } = await supabase.from('page_content').upsert(
    {
      page: input.page,
      block: input.block,
      field: input.field,
      value: input.value,
      type: input.type ?? 'text',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'page,block,field' }
  )
  if (error) {
    console.error('upsertPageContent:', error)
    return { error: 'Failed to save.' }
  }
  return {}
}

// ============================================================================
// timeline_items
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

export async function getTimelineItemsAdmin(): Promise<TimelineItem[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('timeline_items')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('getTimelineItemsAdmin:', error)
    return []
  }
  return (data ?? []).map(mapTimelineItem)
}

export async function insertTimelineItem(input: {
  year: string
  head: string
  body: string
  sortOrder?: number
}): Promise<{ id: string } | { error: string }> {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('timeline_items')
    .insert({
      year: input.year,
      head: input.head,
      body: input.body,
      sort_order: input.sortOrder ?? 9999,
    })
    .select('id')
    .maybeSingle()
  if (error || !data) {
    console.error('insertTimelineItem:', error)
    return { error: 'Failed to add.' }
  }
  return { id: data.id }
}

export async function updateTimelineItem(
  id: string,
  update: Partial<{
    year: string
    head: string
    body: string
    sortOrder: number
    isVisible: boolean
  }>
): Promise<{ error?: string }> {
  const supabase = createSupabaseAdmin()
  const dbUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (update.year !== undefined) dbUpdate.year = update.year
  if (update.head !== undefined) dbUpdate.head = update.head
  if (update.body !== undefined) dbUpdate.body = update.body
  if (update.sortOrder !== undefined) dbUpdate.sort_order = update.sortOrder
  if (update.isVisible !== undefined) dbUpdate.is_visible = update.isVisible

  const { error } = await supabase
    .from('timeline_items')
    .update(dbUpdate)
    .eq('id', id)
  if (error) {
    console.error('updateTimelineItem:', error)
    return { error: 'Failed to save.' }
  }
  return {}
}

export async function deleteTimelineItem(id: string): Promise<{ error?: string }> {
  const supabase = createSupabaseAdmin()
  const { error } = await supabase.from('timeline_items').delete().eq('id', id)
  if (error) {
    console.error('deleteTimelineItem:', error)
    return { error: 'Failed to delete.' }
  }
  return {}
}

// ============================================================================
// ways_to_partner_items
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

export async function getWaysToPartnerItemsAdmin(): Promise<WayToPartnerItem[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('ways_to_partner_items')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('getWaysToPartnerItemsAdmin:', error)
    return []
  }
  return (data ?? []).map(mapWayItem)
}

export async function insertWayItem(input: {
  number: string
  title: string
  description: string
  sortOrder?: number
}): Promise<{ id: string } | { error: string }> {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('ways_to_partner_items')
    .insert({
      number: input.number,
      title: input.title,
      description: input.description,
      sort_order: input.sortOrder ?? 9999,
    })
    .select('id')
    .maybeSingle()
  if (error || !data) {
    console.error('insertWayItem:', error)
    return { error: 'Failed to add.' }
  }
  return { id: data.id }
}

export async function updateWayItem(
  id: string,
  update: Partial<{
    number: string
    title: string
    description: string
    sortOrder: number
    isVisible: boolean
  }>
): Promise<{ error?: string }> {
  const supabase = createSupabaseAdmin()
  const dbUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (update.number !== undefined) dbUpdate.number = update.number
  if (update.title !== undefined) dbUpdate.title = update.title
  if (update.description !== undefined) dbUpdate.description = update.description
  if (update.sortOrder !== undefined) dbUpdate.sort_order = update.sortOrder
  if (update.isVisible !== undefined) dbUpdate.is_visible = update.isVisible

  const { error } = await supabase
    .from('ways_to_partner_items')
    .update(dbUpdate)
    .eq('id', id)
  if (error) {
    console.error('updateWayItem:', error)
    return { error: 'Failed to save.' }
  }
  return {}
}

export async function deleteWayItem(id: string): Promise<{ error?: string }> {
  const supabase = createSupabaseAdmin()
  const { error } = await supabase.from('ways_to_partner_items').delete().eq('id', id)
  if (error) {
    console.error('deleteWayItem:', error)
    return { error: 'Failed to delete.' }
  }
  return {}
}
