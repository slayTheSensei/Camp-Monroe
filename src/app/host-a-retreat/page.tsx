import type { Metadata } from 'next'
import { getActiveSeasons, getPublicBlackouts, getBookedRanges } from '@/lib/data/retreats'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HostRetreatHero from '@/components/host-retreat/HostRetreatHero'
import CapacityAndSupport from '@/components/host-retreat/CapacityAndSupport'
import HostRetreatBookingSection from '@/components/host-retreat/HostRetreatBookingSection'

export const metadata: Metadata = {
  title: 'Host a Retreat — Camp Monroe',
  description:
    'Request dates to host your retreat, residency, or offsite at Camp Monroe — a historic Maine lakefront property on Lake Cobbosseecontee.',
}

export const dynamic = 'force-dynamic'

export default async function HostARetreatPage() {
  const [seasons, blackouts, bookedRanges] = await Promise.all([
    getActiveSeasons(),
    getPublicBlackouts(),
    getBookedRanges(),
  ])

  return (
    <main className="bg-forest text-cream min-h-screen">
      <Nav />
      <HostRetreatHero />
      <CapacityAndSupport />

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
              Grayed-out dates are outside our season or already taken. Select an available start date, then an end date — 3-night minimum, 14 days lead time.
            </p>
          </div>

          <HostRetreatBookingSection
            seasons={seasons}
            blackouts={blackouts}
            bookedRanges={bookedRanges}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
