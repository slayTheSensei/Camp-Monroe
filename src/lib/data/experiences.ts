import { createSupabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { Experience } from '@/types/experience'

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Maps a Supabase row (snake_case) to the Experience type (camelCase) */
function mapRow(row: any): Experience {
  return {
    slug: row.slug,
    type: row.type,
    title: row.title,
    subtitle: row.subtitle,
    location: row.location,
    region: row.region,
    dates: row.dates,
    duration: row.duration,
    groupSize: row.group_size,
    price: row.price,
    depositAmount: row.deposit_amount ?? undefined,
    heroImages: row.hero_images ?? [],
    pullQuote: row.pull_quote,
    pullQuoteImage: row.pull_quote_image,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    itinerary: row.itinerary ?? [],
    included: row.included ?? [],
    excluded: row.excluded ?? [],
    details: row.details ?? [],
    testimonials: row.testimonials ?? [],
    faqs: row.faqs ?? [],
    tag: row.tag ?? undefined,
    tagColor: row.tag_color ?? undefined,
    difficulty: row.difficulty ?? undefined,
    status: row.status,
  }
}

/** Fetch all published (non-draft) experiences, ordered by sort_order */
export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .neq('status', 'draft')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch experiences:', error)
    return []
  }

  return (data ?? []).map(mapRow)
}

/** Fetch a single experience by slug (excludes drafts for public site) */
export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('slug', slug)
    .neq('status', 'draft')
    .maybeSingle()

  if (error || !data) return null
  return mapRow(data)
}

/** Fetch all experience slugs for generateStaticParams (no cookies needed at build time) */
export async function getAllExperienceSlugs(): Promise<string[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase
    .from('experiences')
    .select('slug')
    .neq('status', 'draft')

  if (error || !data) return []
  return data.map((row: any) => row.slug)
}

/** Fetch ALL experiences including drafts (for admin) */
export async function getExperiencesAdmin(): Promise<(Experience & { id: string })[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch experiences (admin):', error)
    return []
  }

  return (data ?? []).map((row: any) => ({ ...mapRow(row), id: row.id }))
}

/** Fetch a single experience by ID including drafts (for admin edit) */
export async function getExperienceById(id: string): Promise<(Experience & { id: string }) | null> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return { ...mapRow(data), id: data.id }
}
