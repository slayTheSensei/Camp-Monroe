import type { Metadata } from 'next'
import { getPublicOpenWindows, getBookedRanges } from '@/lib/data/retreats'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HostRetreatHero from '@/components/host-retreat/HostRetreatHero'
import CapacityAndSupport from '@/components/host-retreat/CapacityAndSupport'
import OpenWindowsList from '@/components/host-retreat/OpenWindowsList'
import HostInquiryForm from '@/components/host-retreat/HostInquiryForm'

export const metadata: Metadata = {
  title: 'Host a Retreat — Camp Monroe',
  description:
    'Request dates to host your retreat, residency, or offsite at Camp Monroe — a historic Maine lakefront property on Lake Cobbosseecontee.',
}

export const dynamic = 'force-dynamic'

export default async function HostARetreatPage() {
  const [windows, bookedRanges] = await Promise.all([
    getPublicOpenWindows('host'),
    getBookedRanges(),
  ])

  return (
    <main className="bg-forest text-cream min-h-screen">
      <Nav />
      <HostRetreatHero />
      <CapacityAndSupport />

      <section className="bg-forest text-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-amber text-xs tracking-[0.4em] uppercase font-medium mb-3">
              Current windows
            </p>
            <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">
              Open for host requests
            </h2>
            <p className="text-cream/70 text-base leading-relaxed max-w-2xl mb-8">
              These are the date blocks currently open for retreat inquiries. Pick one,
              propose another — the form below takes up to three preferences.
            </p>
            <OpenWindowsList windows={windows} bookedRanges={bookedRanges} kind="host" />
          </div>

          <HostInquiryForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
