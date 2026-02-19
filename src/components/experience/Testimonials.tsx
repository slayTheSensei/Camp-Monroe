'use client'

import { useState } from 'react'
import { Testimonial } from '@/types/experience'

type Props = { testimonials: Testimonial[] }

export default function Testimonials({ testimonials }: Props) {
  const [active, setActive] = useState(0)

  if (!testimonials.length) return null

  return (
    <section className="bg-forest py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
          Heard From the Trail
        </span>
        <h2 className="font-display text-4xl md:text-5xl text-cream uppercase mt-3 mb-14 leading-none">
          What People Say
        </h2>

        {/* Active quote */}
        <div className="min-h-[160px] flex flex-col items-center justify-center mb-10 px-4">
          <blockquote className="text-cream/85 text-lg md:text-xl italic leading-relaxed max-w-2xl">
            &ldquo;{testimonials[active].quote}&rdquo;
          </blockquote>
          <div className="mt-6">
            <p className="text-amber font-medium text-sm">{testimonials[active].name}</p>
            {testimonials[active].location && (
              <p className="text-cream/40 text-xs mt-1">{testimonials[active].location}</p>
            )}
          </div>
        </div>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === active
                    ? 'w-6 h-2 bg-amber'
                    : 'w-2 h-2 bg-cream/25 hover:bg-cream/50'
                }`}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
