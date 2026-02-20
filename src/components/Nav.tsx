import { createSupabaseServer } from '@/lib/supabase-server'
import NavClient from './NavClient'

export default async function Nav() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('site_content')
    .select('key, value')
    .eq('section', 'nav')

  const rows = data ?? []
  function c(key: string, fallback: string): string {
    return rows.find((r) => r.key === key)?.value || fallback
  }

  return (
    <NavClient
      linkStory={c('link_story', 'Our Story')}
      linkMission={c('link_mission', 'Mission')}
      linkTrips={c('link_trips', 'Trips')}
      ctaLabel={c('cta_label', 'Join the List')}
      logoLightUrl={c('logo_light_url', '/brand/logo-light.png')}
      logoDarkUrl={c('logo_dark_url', '/brand/logo-dark.png')}
    />
  )
}
