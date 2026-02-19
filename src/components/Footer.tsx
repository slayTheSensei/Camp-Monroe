import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-forest border-t border-cream/10 px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-14">
          {/* Brand */}
          <div>
            <Image
              src="/brand/monogram-light.png"
              alt="Camp Monroe"
              width={80}
              height={80}
              className="h-16 w-auto mb-4"
            />
            <p className="text-cream/50 text-sm leading-relaxed max-w-xs">
              Guided outdoor experiences in Maine, rooted in the legacy of Black outdoor culture
              since 1893.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-amber text-xs tracking-[0.3em] uppercase mb-5">Explore</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Our Story', href: '#story' },
                { label: 'Mission', href: '#mission' },
                { label: 'Trips & Retreats', href: '#trips' },
                { label: 'Join the Waitlist', href: '#waitlist' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream/60 text-sm hover:text-cream transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-amber text-xs tracking-[0.3em] uppercase mb-5">Get in Touch</h4>
            <p className="text-cream/60 text-sm leading-relaxed">
              Questions, partnerships, or press inquiries—we&apos;d love to hear from you.
            </p>
            <a
              href="mailto:hello@campmonroe.com"
              className="text-cream text-sm hover:text-amber transition-colors block mt-3"
            >
              hello@campmonroe.com
            </a>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              {[
                { label: 'IG', href: '#' },
                { label: 'TK', href: '#' },
                { label: 'FB', href: '#' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 border border-cream/20 rounded-full flex items-center justify-center text-cream/50 text-xs hover:border-amber hover:text-amber transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/30 text-xs">
            © {new Date().getFullYear()} Camp Monroe. All rights reserved.
          </p>
          <p className="text-cream/30 text-xs">
            Built on the grounds of the Cambridge Gun &amp; Rod Club, West Gardiner, ME — est. 1893
          </p>
        </div>
      </div>
    </footer>
  )
}
