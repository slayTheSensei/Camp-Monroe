import { notFound } from 'next/navigation'
import { getExperienceBySlug, getAllExperienceSlugs } from '@/lib/data/experiences'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ExperienceHero from '@/components/experience/ExperienceHero'
import Itinerary from '@/components/experience/Itinerary'
import WhatsIncluded from '@/components/experience/WhatsIncluded'
import PullQuote from '@/components/experience/PullQuote'
import TripDetails from '@/components/experience/TripDetails'
import Testimonials from '@/components/experience/Testimonials'
import FAQ from '@/components/experience/FAQ'
import BookingCTA from '@/components/experience/BookingCTA'
import type { Metadata } from 'next'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

// Generate static paths for all experiences
export async function generateStaticParams() {
  const slugs = await getAllExperienceSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Generate metadata per experience
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const experience = await getExperienceBySlug(slug)
  if (!experience) return {}
  return {
    title: `${experience.title} — Camp Monroe`,
    description: experience.shortDescription,
    openGraph: {
      title: experience.title,
      description: experience.shortDescription,
      images: [{ url: experience.heroImages[0] }],
    },
  }
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params
  const experience = await getExperienceBySlug(slug)

  if (!experience) notFound()

  return (
    <main>
      <Nav />
      <ExperienceHero experience={experience} />
      <PullQuote quote={experience.pullQuote} image={experience.pullQuoteImage} />
      {experience.itinerary.length > 0 && (
        <Itinerary days={experience.itinerary} />
      )}
      <WhatsIncluded included={experience.included} excluded={experience.excluded} />
      <TripDetails details={experience.details} />
      <Testimonials testimonials={experience.testimonials} />
      <FAQ faqs={experience.faqs} />
      <BookingCTA experience={experience} />
      <Footer />
    </main>
  )
}
