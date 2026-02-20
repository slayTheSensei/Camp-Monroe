'use client'

import { useState } from 'react'
import { Experience } from '@/types/experience'

type Props = { experience: Experience }

export default function ExperienceHero({ experience }: Props) {
  const [activeImg, setActiveImg] = useState(0)
  const isCustom = experience.type === 'Private / Group'

  return (
    <section className="bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-forest/50 mb-6 tracking-wide uppercase">
          <a href="/" className="hover:text-forest transition-colors">Home</a>
          <span>/</span>
          <a href="/#trips" className="hover:text-forest transition-colors">Experiences</a>
          <span>/</span>
          <span className="text-forest/80">{experience.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">
          {/* ── Left: Gallery ── */}
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="relative overflow-hidden aspect-[16/10] bg-forest">
              {experience.heroImages.map((src, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                    i === activeImg ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundImage: `url('${src}')` }}
                />
              ))}
              {/* Tag badge */}
              {experience.tag && (
                <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full ${experience.tagColor}`}>
                  {experience.tag}
                </div>
              )}
              {/* Difficulty badge */}
              {experience.difficulty && (
                <div className="absolute bottom-4 left-4 bg-forest/80 backdrop-blur-sm text-cream px-3 py-1 text-xs tracking-widest uppercase rounded-full">
                  {experience.difficulty}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {experience.heroImages.length > 1 && (
              <div className="flex gap-2">
                {experience.heroImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-1 aspect-[4/3] bg-cover bg-center transition-all duration-200 ${
                      i === activeImg
                        ? 'opacity-100 ring-2 ring-amber ring-offset-2'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                    style={{ backgroundImage: `url('${src}')` }}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Booking card ── */}
          <div className="lg:sticky lg:top-24">
            {/* Type label */}
            <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
              {experience.type}
            </span>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-forest uppercase leading-none mt-2 mb-1">
              {experience.title}
            </h1>
            <p className="text-forest/60 text-base mb-6">{experience.subtitle}</p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-px bg-forest/10 mb-6">
              {[
                { label: 'Location', value: experience.location },
                { label: 'Dates', value: experience.dates },
                { label: 'Duration', value: experience.duration },
                { label: 'Group Size', value: `Up to ${experience.groupSize} guests` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-cream px-4 py-3">
                  <p className="text-xs text-forest/40 tracking-widest uppercase mb-0.5">{label}</p>
                  <p className="text-sm text-forest font-medium">{value}</p>
                </div>
              ))}
            </div>

            {/* Price */}
            {!isCustom ? (
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl md:text-4xl text-forest">
                    ${experience.price.toLocaleString()}
                  </span>
                  <span className="text-forest/50 text-sm">per person</span>
                </div>
                {experience.depositAmount && (
                  <p className="text-forest/60 text-sm mt-1">
                    or reserve with a{' '}
                    <strong className="text-forest">
                      ${experience.depositAmount.toLocaleString()} deposit
                    </strong>
                    {' '}({Math.round((experience.depositAmount / experience.price) * 100)}%)
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-forest/60 text-sm">
                  Pricing is custom-quoted based on group size, duration, and activity selection.
                </p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              {experience.status === 'available' && !isCustom && (
                <>
                  <a
                    href="#book"
                    className="w-full bg-forest text-cream font-semibold py-4 rounded-full text-center tracking-wide hover:bg-forest/80 transition-colors"
                  >
                    Book Now — ${experience.price.toLocaleString()}
                  </a>
                  {experience.depositAmount && (
                    <a
                      href="#book"
                      className="w-full border-2 border-forest text-forest font-semibold py-4 rounded-full text-center tracking-wide hover:bg-forest/5 transition-colors"
                    >
                      Reserve with ${experience.depositAmount.toLocaleString()} Deposit
                    </a>
                  )}
                </>
              )}
              {experience.status === 'coming-soon' && (
                <a
                  href="#book"
                  className="w-full bg-amber text-forest font-semibold py-4 rounded-full text-center tracking-wide hover:bg-amber/90 transition-colors"
                >
                  Get Early Access
                </a>
              )}
              {isCustom && (
                <a
                  href="mailto:hello@campmonroe.com?subject=Custom Group Experience Inquiry"
                  className="w-full bg-forest text-cream font-semibold py-4 rounded-full text-center tracking-wide hover:bg-forest/80 transition-colors"
                >
                  Inquire About Your Group
                </a>
              )}
              {experience.status === 'sold-out' && (
                <button
                  disabled
                  className="w-full bg-forest/30 text-forest/50 font-semibold py-4 rounded-full text-center tracking-wide cursor-not-allowed"
                >
                  Sold Out
                </button>
              )}
            </div>

            {/* Short description */}
            <p className="text-forest/65 text-sm leading-relaxed mt-6 border-t border-forest/10 pt-6">
              {experience.shortDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
