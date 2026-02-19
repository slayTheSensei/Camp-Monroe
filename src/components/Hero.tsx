export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1800&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/50 to-forest/80" />

      {/* Content */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Wordmark */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
            West Starks, Maine
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-cream uppercase tracking-tight leading-none">
            Camp<br />Monroe
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-cream/90 text-xl md:text-2xl font-light max-w-xl leading-relaxed">
          The outdoors has always been ours.
          <br />
          <span className="text-amber font-medium">We&apos;re just reclaiming it.</span>
        </p>

        <p className="text-cream/70 text-base md:text-lg max-w-lg leading-relaxed">
          Guided camping trips, immersive retreats, and outdoor adventures across Maine—
          built by and for Black and brown explorers.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            href="#waitlist"
            className="bg-amber text-forest font-semibold px-8 py-4 rounded-full text-base tracking-wide hover:bg-amber/90 transition-all hover:scale-105"
          >
            Join the Waitlist
          </a>
          <a
            href="#trips"
            className="border border-cream/40 text-cream px-8 py-4 rounded-full text-base tracking-wide hover:border-cream hover:bg-cream/10 transition-all"
          >
            See the Experiences
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50">
        <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-cream/30 animate-pulse" />
      </div>
    </section>
  )
}
