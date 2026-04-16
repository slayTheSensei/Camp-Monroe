import type { Metadata } from 'next'
import { getActiveSeasons, getPublicBlackouts, getBookedRanges, getHeldRanges } from '@/lib/data/retreats'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import StayHero from '@/components/stay-at-camp/StayHero'
import BuyoutBookingSection from '@/components/stay-at-camp/BuyoutBookingSection'

export const metadata: Metadata = {
  title: 'Stay at Camp — Camp Monroe',
  description:
    'Camp Monroe opens select windows for whole-property buyouts between retreats. Pick your dates and request a private stay on the lake.',
}

export const dynamic = 'force-dynamic'

export default async function StayAtCampPage() {
  const [seasons, blackouts, bookedRanges, heldRanges] = await Promise.all([
    getActiveSeasons(),
    getPublicBlackouts(),
    getBookedRanges(),
    getHeldRanges(),
  ])
  // Merge held dates into the "unavailable" set. Privacy preserved —
  // heldRanges only contains start/end dates, no PII.
  const unavailableRanges = [...bookedRanges, ...heldRanges]

  return (
    <main className="bg-forest text-cream min-h-screen">
      <Nav />
      <StayHero />

      <section className="bg-forest text-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-amber text-xs tracking-[0.4em] uppercase font-medium mb-3">
              Check availability
            </p>
            <h2 className="font-display text-3xl md:text-4xl uppercase mb-4">
              Pick your dates
            </h2>
            <p className="text-cream/70 text-base leading-relaxed max-w-2xl">
              Stay at Camp Monroe is a private, whole-property buyout. Grayed-out dates are outside our season or already taken. Select an available start date, then an end date — 3-night minimum, 7 days lead time.
            </p>
          </div>

          <BuyoutBookingSection
            seasons={seasons}
            blackouts={blackouts}
            bookedRanges={unavailableRanges}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
