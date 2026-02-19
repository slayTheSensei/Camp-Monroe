const pillars = [
  {
    number: '01',
    title: 'Reclaim the Wild',
    body: 'Black and brown people have always had a relationship with the natural world. We create space to reconnect—on our terms, in our way.',
  },
  {
    number: '02',
    title: 'Build the Corridor',
    body: 'We are actively partnering with Maine tourism to build a Black Tourism Corridor—bringing a new generation of travelers to the state and creating economic opportunity along the way.',
  },
  {
    number: '03',
    title: 'Expand Who Belongs',
    body: 'Maine\'s outdoor visitor base is overwhelmingly white and over 49. We\'re here to change that demographic—not by asking for permission, but by showing up.',
  },
  {
    number: '04',
    title: 'Community First',
    body: 'These aren\'t just trips. They\'re gatherings. Every experience is designed around food, culture, restoration, and the deep joy of being outside with your people.',
  },
]

export default function Mission() {
  return (
    <section id="mission" className="bg-forest py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">Why We Exist</span>

        {/* Headline */}
        <div className="grid md:grid-cols-2 gap-12 mt-4 mb-16">
          <h2 className="font-display text-5xl md:text-7xl text-cream uppercase leading-none">
            The<br />Mission
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed self-end">
            Maine is stunning. Its forests, lakes, coastlines, and mountains deserve a wider audience.
            Camp Monroe exists to make the outdoors accessible, joyful, and culturally resonant for
            Black and brown explorers—while writing new chapters in a very old story.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid sm:grid-cols-2 gap-px bg-cream/10">
          {pillars.map((p) => (
            <div key={p.number} className="bg-forest p-8 md:p-10 hover:bg-forest-light transition-colors group">
              <span className="text-amber/50 font-display text-4xl group-hover:text-amber transition-colors">
                {p.number}
              </span>
              <h3 className="text-cream font-display text-2xl uppercase mt-4 mb-3">{p.title}</h3>
              <p className="text-cream/60 text-base leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div className="mt-16 border-l-4 border-amber pl-8 max-w-2xl">
          <blockquote className="text-cream/80 text-xl md:text-2xl italic leading-relaxed">
            &ldquo;People need more time outside. We&apos;re here to make sure that invitation
            reaches everyone.&rdquo;
          </blockquote>
          <cite className="text-amber text-sm tracking-widest uppercase mt-4 block not-italic">
            — Camp Monroe
          </cite>
        </div>
      </div>
    </section>
  )
}
