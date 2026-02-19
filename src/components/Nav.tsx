'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // On experience detail pages the background behind the nav is cream (light),
  // so we always need the dark logo there. On the homepage the hero is dark,
  // so we use the light logo until the user scrolls down enough for a solid bg.
  const isDetailPage = pathname.startsWith('/experiences/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Determine which logo to show:
  // - Detail pages: always dark logo (cream bg)
  // - Homepage transparent (top): light logo (dark hero bg)
  // - Homepage scrolled (solid bg): light logo (dark solid bg)
  const logoSrc = isDetailPage ? '/brand/logo-dark.png' : '/brand/logo-light.png'

  // Nav background:
  // - Detail pages scrolled: cream/95
  // - Homepage scrolled: forest/95
  // - Transparent: none
  const navBg = scrolled
    ? isDetailPage
      ? 'bg-cream/95 backdrop-blur-md shadow-sm'
      : 'bg-forest/95 backdrop-blur-md shadow-lg'
    : 'bg-transparent'

  // Link text colour flips on detail pages
  const linkClass = isDetailPage && !scrolled
    ? 'text-forest/70 hover:text-forest'
    : 'text-cream/80 hover:text-cream'

  const hamburgerClass = isDetailPage && !scrolled ? 'text-forest' : 'text-cream'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${navBg}`}>
      <a href="/" aria-label="Camp Monroe home">
        <Image
          src={logoSrc}
          alt="Camp Monroe"
          width={180}
          height={62}
          className="h-14 w-auto drop-shadow-sm"
          priority
        />
      </a>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-8">
        <a href="/#story" className={`text-sm tracking-wide transition-colors ${linkClass}`}>
          Our Story
        </a>
        <a href="/#mission" className={`text-sm tracking-wide transition-colors ${linkClass}`}>
          Mission
        </a>
        <a href="/#trips" className={`text-sm tracking-wide transition-colors ${linkClass}`}>
          Trips
        </a>
        <a
          href="/#waitlist"
          className="bg-amber px-5 py-2 text-forest text-sm font-semibold tracking-wide rounded-full hover:bg-amber/90 transition-colors"
        >
          Join the List
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        className={`md:hidden transition-colors ${hamburgerClass}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu — always dark bg so always light text */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-forest/97 backdrop-blur-sm px-6 py-6 flex flex-col gap-5 md:hidden">
          <a href="/#story" className="text-cream text-base tracking-wide" onClick={() => setOpen(false)}>Our Story</a>
          <a href="/#mission" className="text-cream text-base tracking-wide" onClick={() => setOpen(false)}>Mission</a>
          <a href="/#trips" className="text-cream text-base tracking-wide" onClick={() => setOpen(false)}>Trips</a>
          <a
            href="/#waitlist"
            className="bg-amber text-forest font-semibold px-5 py-3 rounded-full text-center"
            onClick={() => setOpen(false)}
          >
            Join the List
          </a>
        </div>
      )}
    </nav>
  )
}
