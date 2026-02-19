type Props = {
  quote: string
  image: string
}

export default function PullQuote({ quote, image }: Props) {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-forest/75" />

      {/* Quote */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="text-amber text-6xl font-display leading-none mb-4 opacity-60">&ldquo;</div>
        <p className="text-cream text-xl md:text-2xl lg:text-3xl font-light leading-relaxed italic">
          {quote}
        </p>
      </div>
    </section>
  )
}
