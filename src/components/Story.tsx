import Image from 'next/image'

export default function Story() {
  return (
    <section id="story" className="bg-cream py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">Est. 2024</span>

        {/* Headline */}
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-forest uppercase mt-3 mb-12 leading-none max-w-3xl">
          Rooted in<br />History
        </h2>

        {/* Full-width image with callout */}
        <div className="relative mb-20 md:mb-16">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <Image
              src="/history.png"
              alt="Cambridge Gun & Rod Club — historic photograph"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
          {/* Callout badge */}
          <div className="absolute bottom-0 left-0 translate-y-1/2 mx-4 md:ml-10 bg-forest text-cream px-4 md:px-6 py-3 md:py-4 max-w-[calc(100%-2rem)] md:max-w-xs shadow-lg">
            <p className="text-amber text-xs tracking-widest uppercase font-medium mb-1">Founded 1893</p>
            <p className="text-xs md:text-sm leading-relaxed text-cream/80">
              The Cambridge Gun &amp; Rod Club — one of the oldest continuously operating Black
              outdoor clubs in America.
            </p>
          </div>
        </div>

        {/* Text + stats below image */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start pt-10">
          <div>
            <p className="text-forest/80 text-lg leading-relaxed mb-6">
              Camp Monroe is built on land with a story. Our home base sits on the grounds of the
              <strong className="text-forest"> Cambridge Gun &amp; Rod Club</strong>—a historic Black
              social and sporting club founded in 1893 by a group of Black Bostonians who refused to
              be excluded from the outdoors.
            </p>
            <p className="text-forest/80 text-lg leading-relaxed">
              Among its early members: <strong className="text-forest">W.E.B. Du Bois</strong>.
              Located in West Gardiner, Maine, the club stood as a quiet act of resistance—proof that
              Black people have always belonged in nature, have always found joy and restoration in
              the wild.
            </p>
          </div>
          <div>
            <p className="text-forest/80 text-lg leading-relaxed mb-10">
              We carry that legacy forward. Every trip we run, every fire we gather around, every
              trail we hike is a continuation of over 130 years of Black outdoor culture.
            </p>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4 border-t border-forest/20 pt-8">
              <div>
                <p className="font-display text-3xl text-forest">130+</p>
                <p className="text-sm text-forest/60 mt-1">Years of history</p>
              </div>
              <div>
                <p className="font-display text-3xl text-forest">ME</p>
                <p className="text-sm text-forest/60 mt-1">West Gardiner, Maine</p>
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
