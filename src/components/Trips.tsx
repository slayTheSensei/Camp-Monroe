const trips = [
  {
    type: 'Weekend Camping',
    title: 'Acadia Base Camp',
    location: 'Acadia National Park, ME',
    duration: '3 Days / 2 Nights',
    description: 'Sleep under Maine skies with Acadia as your backyard. Morning hikes, evening fires, and food that hits different in the wild.',
    image: 'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800&q=80',
    tag: 'Coming 2025',
    tagColor: 'bg-amber text-forest',
  },
  {
    type: 'Retreat',
    title: 'Cambridge Grounds Retreat',
    location: 'West Starks, Maine',
    duration: '3 Days / 2 Nights',
    description: 'Our signature retreat on the historic Cambridge Gun & Rod Club property. Wellness, community, and outdoor skill-building on hallowed ground.',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    tag: 'Flagship',
    tagColor: 'bg-forest text-cream border border-amber',
  },
  {
    type: 'Day Trip',
    title: 'Baxter Peak Day Hike',
    location: 'Baxter State Park, ME',
    duration: '1 Day',
    description: 'Guided summit hike of Katahdin with a crew that looks like you. Gear provided. No experience needed. Just show up ready.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    tag: 'Coming 2025',
    tagColor: 'bg-amber text-forest',
  },
  {
    type: 'Private / Group',
    title: 'Custom Group Experience',
    location: 'Statewide, Maine',
    duration: 'Your Schedule',
    description: 'Companies, friend groups, sororities, fraternities—we build tailored outdoor experiences for your people. All skill levels welcome.',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80',
    tag: 'Book Now',
    tagColor: 'bg-amber text-forest',
  },
]

export default function Trips() {
  return (
    <section id="trips" className="bg-cream py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">What We Offer</span>
            <h2 className="font-display text-5xl md:text-6xl text-forest uppercase mt-2 leading-none">
              The Experiences
            </h2>
          </div>
          <p className="text-forest/60 text-base max-w-sm leading-relaxed">
            From day hikes to multi-night retreats, every Camp Monroe experience is curated, guided,
            and built around community.
          </p>
        </div>

        {/* Trip cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.title}
              className="group relative overflow-hidden bg-forest rounded-sm cursor-pointer"
            >
              {/* Image */}
              <div
                className="w-full h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${trip.image}')` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent" />

              {/* Tag */}
              <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full ${trip.tagColor}`}>
                {trip.tag}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-amber text-xs tracking-[0.3em] uppercase">{trip.type}</span>
                <h3 className="font-display text-cream text-2xl uppercase mt-1 mb-2">{trip.title}</h3>
                <div className="flex gap-4 text-cream/50 text-xs mb-3">
                  <span>{trip.location}</span>
                  <span>·</span>
                  <span>{trip.duration}</span>
                </div>
                <p className="text-cream/70 text-sm leading-relaxed">{trip.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="#waitlist"
            className="inline-block bg-forest text-cream font-semibold px-10 py-4 rounded-full tracking-wide hover:bg-forest/80 transition-colors"
          >
            Get Early Access to All Trips
          </a>
        </div>
      </div>
    </section>
  )
}
