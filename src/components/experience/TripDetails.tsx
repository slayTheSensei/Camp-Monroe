import { TripDetail } from '@/types/experience'

type Props = { details: TripDetail[] }

export default function TripDetails({ details }: Props) {
  if (!details.length) return null

  return (
    <section className="bg-cream-dark py-20 md:py-28 px-6" style={{ backgroundColor: '#ede6d8' }}>
      <div className="max-w-6xl mx-auto">
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
          The Details
        </span>
        <h2 className="font-display text-4xl md:text-5xl text-forest uppercase mt-3 mb-14 leading-none">
          What to Expect
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {details.map((detail) => (
            <div key={detail.category} className="flex flex-col">
              {/* Image */}
              {detail.image && (
                <div
                  className="w-full aspect-[4/3] bg-cover bg-center mb-5"
                  style={{ backgroundImage: `url('${detail.image}')` }}
                />
              )}
              {/* Content */}
              <span className="text-amber text-xs tracking-[0.3em] uppercase font-medium mb-2">
                {detail.category}
              </span>
              <h3 className="font-display text-forest text-xl uppercase mb-3 leading-tight">
                {detail.title}
              </h3>
              <p className="text-forest/65 text-sm leading-relaxed flex-1">
                {detail.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
