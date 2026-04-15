import type { Metadata } from 'next'
import { getPublicOpenWindows, getBookedRanges } from '@/lib/data/retreats'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import StayHero from '@/components/stay-at-camp/StayHero'
import StayInquiryForm from '@/components/stay-at-camp/StayInquiryForm'
import OpenWindowsList from '@/components/host-retreat/OpenWindowsList'

export const metadata: Metadata = {
  title: 'Stay at Camp — Camp Monroe',
  description:
    'Short-term stays at Camp Monroe, a historic Maine lakefront property. Request dates between retreats for personal, creative, or group stays.',
}

export const dynamic = 'force-dynamic'

export default async function StayAtCampPage() {
  const [windows, bookedRanges] = await Promise.all([
    getPublicOpenWindows('str'),
    getBookedRanges(),
  ])

  return (
    <main className="bg-forest text-cream min-h-screen">
      <Nav />
      <StayHero />

      <section className="bg-forest text-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-amber text-xs tracking-[0.4em] uppercase font-medium mb-3">
              Current windows
            </p>
            <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">
              Open for stays
            </h2>
            <p className="text-cream/70 text-base leading-relaxed max-w-2xl mb-8">
              These are the windows between retreats when Camp Monroe is open
              for short-term stays. Request the dates you have in mind and we&apos;ll
              follow up.
            </p>
            <OpenWindowsList windows={windows} bookedRanges={bookedRanges} kind="str" />
          </div>

          <StayInquiryForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
