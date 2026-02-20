export type ItineraryDay = {
  day: number
  title: string
  description: string
  image?: string
  activities: string[]
}

export type IncludedItem = {
  icon: string
  label: string
  description: string
}

export type TripDetail = {
  category: 'Accommodations' | 'Guide' | 'Meals' | 'Transportation'
  title: string
  description: string
  image?: string
}

export type Testimonial = {
  quote: string
  name: string
  location?: string
}

export type FAQItem = {
  question: string
  answer: string
}

export type Experience = {
  slug: string
  type: 'Weekend Camping' | 'Retreat' | 'Day Trip' | 'Partner-Hosted Retreat' | 'Bike Ride'
  title: string
  subtitle: string
  location: string
  region: string
  dates: string
  duration: string
  groupSize: number
  price: number
  depositAmount?: number        // optional deposit (e.g. 30%)
  heroImages: string[]          // array of image URLs for gallery
  pullQuote: string
  pullQuoteImage: string
  shortDescription: string
  longDescription: string
  itinerary: ItineraryDay[]
  included: IncludedItem[]
  excluded: string[]
  details: TripDetail[]
  testimonials: Testimonial[]
  faqs: FAQItem[]
  tag?: string
  tagColor?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  status: 'available' | 'coming-soon' | 'sold-out' | 'draft'
}
