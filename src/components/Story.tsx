import Image from 'next/image'
import { createSupabaseServer } from '@/lib/supabase-server'

export default async function Story() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('site_content')
    .select('key, value')
    .eq('section', 'story')

  const rows = data ?? []
  function c(key: string, fallback: string): string {
    return rows.find((r) => r.key === key)?.value || fallback
  }

  return (
    <section id="story" className="bg-cream py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">{c('label', 'Est. 2024')}</span>

        {/* Headline */}
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-forest uppercase mt-3 mb-12 leading-none max-w-3xl">
          {c('headline', 'Rooted in History')}
        </h2>

        {/* Full-width image with callout */}
        <div className="relative mb-20 md:mb-16">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <Image
              src={c('image_url', '/history.png')}
              alt="Cambridge Gun & Rod Club — historic photograph"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
          {/* Callout badge */}
          <div className="absolute bottom-0 left-0 translate-y-1/2 mx-4 md:ml-10 bg-forest text-cream px-4 md:px-6 py-3 md:py-4 max-w-[calc(100%-2rem)] md:max-w-xs shadow-lg">
            <p className="text-amber text-xs tracking-widest uppercase font-medium mb-1">{c('callout_badge', 'Founded 1893')}</p>
            <p className="text-xs md:text-sm leading-relaxed text-cream/80">
              {c('callout_body', 'The Cambridge Gun & Rod Club — one of the oldest continuously operating Black outdoor clubs in America.')}
            </p>
          </div>
        </div>

        {/* Text + stats below image */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start pt-10">
          <div>
            <p className="text-forest/80 text-lg leading-relaxed mb-6">
              {c('body_1', 'The Cambridge Gun & Rod Club was founded in 1893 as a coalition of the excluded — Black men and their families who were turned away from white hunting and fishing clubs across New England. They built their own. On land they owned. In Maine.')}
            </p>
            <p className="text-forest/80 text-lg leading-relaxed">
              {c('body_2', "For over 130 years, this land has been a place of refuge, recreation, and community for people who were told the outdoors wasn't for them. Camp Monroe is the next chapter of that legacy.")}
            </p>
          </div>
          <div>
            <p className="text-forest/80 text-lg leading-relaxed mb-6">
              {c('body_3', "We're not a nostalgia project. We're a living community — using this historic land to create new memories, new traditions, and new reasons for Black and brown people to fall in love with the outdoors.")}
            </p>
            <p className="text-forest/80 text-lg leading-relaxed mb-10">
              {c('body_4', 'The history is real. The land is real. And the invitation is open.')}
            </p>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4 border-t border-forest/20 pt-8">
              <div>
                <p className="font-display text-3xl text-forest">{c('stat_1_value', '130+')}</p>
                <p className="text-sm text-forest/60 mt-1">{c('stat_1_label', 'Years of history')}</p>
              </div>
              <div>
                <p className="font-display text-3xl text-forest">{c('stat_2_value', '1893')}</p>
                <p className="text-sm text-forest/60 mt-1">{c('stat_2_label', 'Founded, West Gardiner ME')}</p>
              </div>
              <div>
                <p className="font-display text-3xl text-forest">{c('stat_3_value', '∞')}</p>
                <p className="text-sm text-forest/60 mt-1">{c('stat_3_label', 'Acres of wild')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
