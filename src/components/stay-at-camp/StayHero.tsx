export default function StayHero() {
  return (
    <section className="relative bg-forest text-cream pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
          Stay at Camp
        </span>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl uppercase mt-3 mb-6 leading-[1.05]">
          A quiet week
          <br />
          on the lake
        </h1>
        <p className="text-cream/70 text-base md:text-lg leading-relaxed max-w-2xl">
          Between retreats, Camp Monroe opens select windows for short-term
          stays — personal getaways, friend groups, creative work. Request the
          dates you have in mind and we&apos;ll confirm what&apos;s possible.
        </p>
        <a
          href="#request"
          className="inline-block mt-8 bg-amber text-forest font-semibold px-6 py-3 rounded-full text-sm tracking-wide hover:bg-amber/90 transition-colors"
        >
          Request a stay →
        </a>
      </div>
    </section>
  )
}
