import { getExperiences } from '@/lib/data/experiences'
import Link from 'next/link'

export default async function Trips() {
  const experiences = await getExperiences()

  return (
    <section id="trips" className="bg-cream py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">What We Offer</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-forest uppercase mt-2 leading-none">
              The Experiences
            </h2>
          </div>
          <p className="text-forest/60 text-sm md:text-base max-w-sm leading-relaxed">
            From day hikes to multi-night retreats, every Camp Monroe experience is curated, guided,
            and built around community.
          </p>
        </div>

        {/* Trip cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {experiences.map((trip) => (
            <Link
              key={trip.slug}
              href={`/experiences/${trip.slug}`}
              className="group bg-forest rounded-sm cursor-pointer block overflow-hidden"
            >
              {/* Image container — relative so tag/arrow badges are scoped to it */}
              <div className="relative overflow-hidden">
                <div
                  className="w-full h-56 md:h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${trip.heroImages[0]}')` }}
                />
                {/* Subtle gradient over image only */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent" />

                {/* Tag badge */}
                {trip.tag && (
                  <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full ${trip.tagColor}`}>
                    {trip.tag}
                  </div>
                )}

                {/* Arrow hint */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/0 border border-cream/0 flex items-center justify-center text-cream/0 group-hover:bg-cream/10 group-hover:border-cream/30 group-hover:text-cream transition-all duration-300">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 10L10 2M10 2H4M10 2V8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Content — sits below image, never overlaps */}
              <div className="p-5 md:p-6">
                <span className="text-amber text-xs tracking-[0.3em] uppercase">{trip.type}</span>
                <h3 className="font-display text-cream text-xl md:text-2xl uppercase mt-1 mb-2">{trip.title}</h3>
                <div className="flex gap-4 text-cream/50 text-xs mb-3">
                  <span>{trip.location}</span>
                  <span>·</span>
                  <span>{trip.duration}</span>
                </div>
                <p className="text-cream/70 text-sm leading-relaxed">{trip.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="#waitlist"
            className="inline-block bg-forest text-cream font-semibold px-10 py-4 rounded-full tracking-wide hover:bg-forest/80 transition-colors"
          >
            Get Early Access to All Trips
          </a>
        </div>
      </div>
    </section>
  )
}
