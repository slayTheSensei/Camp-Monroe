import { createSupabaseServer } from '@/lib/supabase-server'

export default async function Mission() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('site_content')
    .select('key, value')
    .eq('section', 'mission')

  const rows = data ?? []
  function c(key: string, fallback: string): string {
    return rows.find((r) => r.key === key)?.value || fallback
  }

  const pillars = [
    {
      number: '01',
      title: c('pillar_1_title', 'The Outdoors Is for Everyone'),
      body: c('pillar_1_body', "Always has been. We exist to make that real — for Black, Latino, Indigenous, and all communities who've been made to feel otherwise. Show up. The door is open."),
    },
    {
      number: '02',
      title: c('pillar_2_title', 'Come for the Weekend. Stay for Life.'),
      body: c('pillar_2_body', "We're building a new relationship between communities of color and the state of Maine. Tourism is just the beginning. Every mile ridden and fire gathered around moves us toward a Maine that reflects all of us."),
    },
    {
      number: '03',
      title: c('pillar_3_title', 'The Legacy Is Real'),
      body: c('pillar_3_body', "W.E.B. Du Bois rode these roads. Major Taylor proved what's possible. The Cambridge Gun & Rod Club has stood on this land since 1893. We didn't start this — we're just the next chapter."),
    },
    {
      number: '04',
      title: c('pillar_4_title', 'Community First'),
      body: c('pillar_4_body', "These aren't just trips. They're gatherings. Every experience is built around great food, real culture, and the deep joy of being outside with people who get it."),
    },
  ]

  return (
    <section id="mission" className="bg-forest py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">{c('section_label', 'Why We Exist')}</span>

        {/* Headline */}
        <div className="grid md:grid-cols-2 gap-12 mt-4 mb-16">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-cream uppercase leading-none">
            {c('headline', 'The Mission')}
          </h2>
          <p className="text-cream/70 text-base md:text-lg leading-relaxed self-end">
            {c('description', 'Maine is stunning — its forests, lakes, coastlines, and mountains deserve a wider audience. Camp Monroe exists to make sure that invitation reaches everyone, while honoring 130 years of Black outdoor culture on this land.')}
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid sm:grid-cols-2 gap-px bg-cream/10">
          {pillars.map((p) => (
            <div key={p.number} className="bg-forest p-6 md:p-10 hover:bg-forest-light transition-colors group">
              <span className="text-amber/50 font-display text-3xl md:text-4xl group-hover:text-amber transition-colors">
                {p.number}
              </span>
              <h3 className="text-cream font-display text-xl md:text-2xl uppercase mt-4 mb-3">{p.title}</h3>
              <p className="text-cream/60 text-base leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div className="mt-16 border-l-4 border-amber pl-8 max-w-2xl">
          <blockquote className="text-cream/80 text-lg md:text-2xl italic leading-relaxed">
            &ldquo;{c('quote', "If you weren't welcome at their table, we built a better one. That's been true since 1893. It's still true now.")}&rdquo;
          </blockquote>
          <cite className="text-amber text-sm tracking-widest uppercase mt-4 block not-italic">
            {c('quote_attribution', '— Camp Monroe')}
          </cite>
        </div>
      </div>
    </section>
  )
}
