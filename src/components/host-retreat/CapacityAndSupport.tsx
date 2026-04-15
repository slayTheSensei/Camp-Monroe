export default function CapacityAndSupport() {
  return (
    <section className="bg-cream text-forest py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-bark mb-3">Capacity</p>
          <p className="font-display text-2xl mb-3">8 – 24 guests</p>
          <p className="text-forest/70 text-sm leading-relaxed">
            Lodging across the main lodge and cabins. Best suited for groups
            seeking privacy, focus, and quiet time on the lake.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-bark mb-3">Included</p>
          <ul className="text-forest/70 text-sm leading-relaxed space-y-1.5">
            <li>Full property use</li>
            <li>Main lodge + cabin lodging</li>
            <li>Private lake frontage</li>
            <li>Common gathering spaces</li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-bark mb-3">Support (optional)</p>
          <ul className="text-forest/70 text-sm leading-relaxed space-y-1.5">
            <li>Meals + catering partners</li>
            <li>Facilitation referrals</li>
            <li>Transport coordination</li>
            <li>Full-service packages</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
