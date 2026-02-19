export default function Story() {
  return (
    <section id="story" className="bg-cream py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">Est. 2024</span>

        {/* Headline */}
        <h2 className="font-display text-5xl md:text-7xl text-forest uppercase mt-3 mb-12 leading-none max-w-3xl">
          Rooted in<br />History
        </h2>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left: Image block */}
          <div className="relative">
            <div
              className="w-full aspect-[4/5] bg-cover bg-center rounded-sm"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=900&q=80')`,
              }}
            />
            {/* Historical note callout */}
            <div className="absolute -bottom-6 -right-4 md:-right-8 bg-forest text-cream px-6 py-4 max-w-xs">
              <p className="text-amber text-xs tracking-widest uppercase font-medium mb-1">Founded 1893</p>
              <p className="text-sm leading-relaxed text-cream/80">
                The Cambridge Gun &amp; Rod Club—one of the oldest continuously operating Black
                outdoor clubs in America.
              </p>
            </div>
          </div>

          {/* Right: Text */}
          <div className="pt-0 md:pt-8">
            <p className="text-forest/80 text-lg leading-relaxed mb-6">
              Camp Monroe is built on land with a story. Our home base sits on the grounds of the
              <strong className="text-forest"> Cambridge Gun &amp; Rod Club</strong>—a historic Black
              social and sporting club founded in 1893 by a group of Black Bostonians who refused to
              be excluded from the outdoors.
            </p>
            <p className="text-forest/80 text-lg leading-relaxed mb-6">
              Among its early members: <strong className="text-forest">W.E.B. Du Bois</strong>.
              Located in West Starks, Maine, the club stood as a quiet act of resistance—proof that
              Black people have always belonged in nature, have always found joy and restoration in
              the wild.
            </p>
            <p className="text-forest/80 text-lg leading-relaxed mb-10">
              We carry that legacy forward. Every trip we run, every fire we gather around, every
              trail we hike is a continuation of over 130 years of Black outdoor culture.
            </p>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-6 border-t border-forest/20 pt-8">
              <div>
                <p className="font-display text-3xl text-forest">130+</p>
                <p className="text-sm text-forest/60 mt-1">Years of history</p>
              </div>
              <div>
                <p className="font-display text-3xl text-forest">ME</p>
                <p className="text-sm text-forest/60 mt-1">West Starks, Maine</p>
              </div>
              <div>
                <p className="font-display text-3xl text-forest">∞</p>
                <p className="text-sm text-forest/60 mt-1">Acres of wild</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
