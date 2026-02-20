import { Experience } from '@/types/experience'
import ExperienceSignup from './ExperienceSignup'

type Props = { experience: Experience }

export default function BookingCTA({ experience }: Props) {
  const isCustom = experience.type === 'Private / Group'
  const isComingSoon = experience.status === 'coming-soon'
  const isSoldOut = experience.status === 'sold-out'

  // Coming-soon experiences get a full inline signup section
  if (isComingSoon) {
    return (
      <section id="book" className="bg-forest py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Left: copy */}
            <div>
              <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
                Coming {experience.dates}
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream uppercase mt-3 mb-6 leading-none">
                Get Early<br />Access
              </h2>
              <p className="text-cream/70 text-base leading-relaxed mb-6">
                {experience.title} is coming in 2026. Spots will be limited.
                Get your name in now and you&apos;ll be the first to know when registration opens —
                and the first to ride.
              </p>
              <div className="space-y-3 text-cream/60 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-amber">✓</span>
                  <span>First access when registration opens</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-amber">✓</span>
                  <span>Event updates and route details as they drop</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-amber">✓</span>
                  <span>No commitment — just your spot in line</span>
                </div>
              </div>
            </div>

            {/* Right: inline signup form */}
            <div className="bg-cream/5 border border-cream/10 rounded-sm p-6 md:p-8">
              <ExperienceSignup experience={experience} />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Standard available / sold-out / custom CTA bar
  return (
    <section id="book" className="bg-amber py-16 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-forest/60 text-xs tracking-widest uppercase font-semibold mb-1">
            {isSoldOut ? 'Sold Out' : 'Ready When You Are'}
          </p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-forest uppercase leading-none">
            {isCustom
              ? 'Build Your Group Experience'
              : `Join Us · ${experience.dates}`}
          </h2>
          {!isCustom && (
            <p className="text-forest/70 text-base mt-2">
              ${experience.price.toLocaleString()} per person
              {experience.depositAmount && ` · $${experience.depositAmount.toLocaleString()} to reserve`}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          {isCustom && (
            <a
              href="mailto:hello@campmonroe.com?subject=Custom Group Experience Inquiry"
              className="bg-forest text-cream font-semibold px-8 py-4 rounded-full tracking-wide hover:bg-forest/80 transition-colors text-center"
            >
              Inquire Now
            </a>
          )}
          {!isCustom && !isSoldOut && (
            <>
              <a
                href="#book"
                className="bg-forest text-cream font-semibold px-8 py-4 rounded-full tracking-wide hover:bg-forest/80 transition-colors text-center"
              >
                Book Now
              </a>
              {experience.depositAmount && (
                <a
                  href="#book"
                  className="border-2 border-forest text-forest font-semibold px-8 py-4 rounded-full tracking-wide hover:bg-forest/10 transition-colors text-center"
                >
                  Reserve with Deposit
                </a>
              )}
            </>
          )}
          {isSoldOut && (
            <span className="bg-forest/30 text-forest/50 font-semibold px-8 py-4 rounded-full tracking-wide text-center cursor-not-allowed">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
