'use client'

import { useState } from 'react'
import { FAQItem } from '@/types/experience'

type Props = { faqs: FAQItem[] }

export default function FAQ({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  if (!faqs.length) return null

  return (
    <section className="bg-cream py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
          Good Questions
        </span>
        <h2 className="font-display text-4xl md:text-5xl text-forest uppercase mt-3 mb-12 leading-none">
          FAQ
        </h2>

        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <div key={i} className="border-t border-forest/15 last:border-b">
              <button
                className="w-full flex items-center justify-between py-5 text-left gap-6 group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="text-forest font-medium text-base leading-snug group-hover:text-forest/70 transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`shrink-0 w-6 h-6 rounded-full border border-forest/20 flex items-center justify-center text-forest/50 transition-transform duration-200 ${
                    open === i ? 'rotate-45' : ''
                  }`}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <rect x="4" y="0" width="2" height="10" />
                    <rect x="0" y="4" width="10" height="2" />
                  </svg>
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === i ? 'max-h-96 pb-5' : 'max-h-0'
                }`}
              >
                <p className="text-forest/65 text-base leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
