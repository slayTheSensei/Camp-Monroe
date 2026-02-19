import { IncludedItem } from '@/types/experience'

type Props = {
  included: IncludedItem[]
  excluded: string[]
}

export default function WhatsIncluded({ included, excluded }: Props) {
  if (!included.length) return null

  return (
    <section className="bg-cream py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* What's included */}
          <div>
            <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
              All In
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-forest uppercase mt-3 mb-10 leading-none">
              What&apos;s<br />Included
            </h2>
            <div className="flex flex-col gap-5">
              {included.map((item) => (
                <div key={item.label} className="flex gap-4 items-start group">
                  <span className="text-2xl leading-none mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-forest text-sm tracking-wide uppercase mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-forest/60 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's not included + note */}
          <div>
            {excluded.length > 0 && (
              <>
                <span className="text-forest/40 text-xs tracking-[0.4em] uppercase font-medium">
                  Not Covered
                </span>
                <h3 className="font-display text-3xl text-forest uppercase mt-3 mb-8 leading-none">
                  Not<br />Included
                </h3>
                <ul className="flex flex-col gap-3 mb-12">
                  {excluded.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-forest/60 text-sm">
                      <span className="w-4 h-px bg-forest/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Reassurance note */}
            <div className="bg-forest p-8">
              <p className="text-amber text-xs tracking-widest uppercase font-medium mb-3">
                Our Promise
              </p>
              <p className="text-cream/80 text-base leading-relaxed">
                We handle the logistics so you don&apos;t have to. From gear to groceries to
                permits, the heavy lifting is on us. You just need to show up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
