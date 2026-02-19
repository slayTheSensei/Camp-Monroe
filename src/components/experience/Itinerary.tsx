import { ItineraryDay } from '@/types/experience'

type Props = { days: ItineraryDay[] }

export default function Itinerary({ days }: Props) {
  if (!days.length) return null

  return (
    <section className="bg-forest py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
          The Plan
        </span>
        <h2 className="font-display text-5xl md:text-6xl text-cream uppercase mt-3 mb-14 leading-none">
          Your Itinerary
        </h2>

        <div className="flex flex-col gap-0">
          {days.map((day, idx) => (
            <div
              key={day.day}
              className="group grid md:grid-cols-[80px_1fr_1fr] gap-0 border-t border-cream/10 last:border-b"
            >
              {/* Day number */}
              <div className="py-8 md:py-10 pr-6 flex items-start">
                <span className="font-display text-4xl text-amber/30 group-hover:text-amber transition-colors leading-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div className="py-8 md:py-10 md:pr-12">
                <h3 className="font-display text-cream text-2xl uppercase mb-3 leading-tight">
                  {day.title}
                </h3>
                <p className="text-cream/65 text-base leading-relaxed mb-5">
                  {day.description}
                </p>
                <ul className="flex flex-col gap-2">
                  {day.activities.map((activity) => (
                    <li key={activity} className="flex items-center gap-3 text-cream/55 text-sm">
                      <span className="w-1 h-1 rounded-full bg-amber shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image */}
              {day.image && (
                <div
                  className="hidden md:block my-6 bg-cover bg-center aspect-[4/3] opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundImage: `url('${day.image}')` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
