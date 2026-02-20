import { createSupabaseServer } from '@/lib/supabase-server'

export default async function Hero() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('site_content')
    .select('key, value')
    .eq('section', 'hero')

  const rows = data ?? []
  function c(key: string, fallback: string): string {
    return rows.find((r) => r.key === key)?.value || fallback
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${c('bg_image', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1800&q=80')}')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/50 to-forest/80" />

      {/* Content */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center gap-8">

        {/* Location label */}
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
          {c('location_label', 'West Gardiner, Maine')}
        </span>

        {/* Headline */}
        <h1 className="font-display text-[2.8rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] text-cream uppercase leading-none tracking-tight drop-shadow-lg">
          {c('headline_line1', 'Come')}<br />{c('headline_line2', 'Outside.')}
        </h1>

        {/* Subline */}
        <p className="text-cream/75 text-base md:text-xl max-w-md leading-relaxed text-center">
          {c('subheading', 'Guided camping, retreats, and outdoor adventures across Maine — where everyone belongs outside.')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            href="#waitlist"
            className="bg-amber text-forest font-semibold px-8 py-4 rounded-full text-base tracking-wide hover:bg-amber/90 transition-all hover:scale-105"
          >
            {c('cta_primary', 'Join the Waitlist')}
          </a>
          <a
            href="#trips"
            className="border border-cream/40 text-cream px-8 py-4 rounded-full text-base tracking-wide hover:border-cream hover:bg-cream/10 transition-all"
          >
            {c('cta_secondary', 'See the Experiences')}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50">
        <span className="text-xs tracking-[0.3em] uppercase">{c('scroll_label', 'Scroll')}</span>
        <div className="w-px h-10 bg-cream/30 animate-pulse" />
      </div>
    </section>
  )
}
