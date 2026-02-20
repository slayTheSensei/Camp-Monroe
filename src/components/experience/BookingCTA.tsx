import { Experience } from '@/types/experience'

type Props = { experience: Experience }

export default function BookingCTA({ experience }: Props) {
  const isCustom = experience.type === 'Private / Group'
  const isComingSoon = experience.status === 'coming-soon'
  const isSoldOut = experience.status === 'sold-out'

  return (
    <section id="book" className="bg-amber py-16 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-forest/60 text-xs tracking-widest uppercase font-semibold mb-1">
            {isComingSoon ? 'Coming Soon' : isSoldOut ? 'Sold Out' : "Ready When You Are"}
          </p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-forest uppercase leading-none">
            {isCustom
              ? 'Build Your Group Experience'
              : isComingSoon
              ? 'Get Early Access'
              : `Join Us · ${experience.dates}`}
          </h2>
          {!isCustom && !isComingSoon && (
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
          {isComingSoon && (
            <a
              href="/#waitlist"
              className="bg-forest text-cream font-semibold px-8 py-4 rounded-full tracking-wide hover:bg-forest/80 transition-colors text-center"
            >
              Join the Waitlist
            </a>
          )}
          {!isCustom && !isComingSoon && !isSoldOut && (
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
