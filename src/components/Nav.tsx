'use client'

import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      <a href="#" className="text-cream font-display text-xl tracking-widest uppercase font-bold drop-shadow-md">
        Camp Monroe
      </a>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#story" className="text-cream/80 hover:text-cream text-sm tracking-wide transition-colors">
          Our Story
        </a>
        <a href="#mission" className="text-cream/80 hover:text-cream text-sm tracking-wide transition-colors">
          Mission
        </a>
        <a href="#trips" className="text-cream/80 hover:text-cream text-sm tracking-wide transition-colors">
          Trips
        </a>
        <a
          href="#waitlist"
          className="bg-amber px-5 py-2 text-forest text-sm font-semibold tracking-wide rounded-full hover:bg-amber/90 transition-colors"
        >
          Join the List
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-cream"
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

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-forest/95 backdrop-blur-sm px-6 py-6 flex flex-col gap-5 md:hidden">
          <a href="#story" className="text-cream text-base tracking-wide" onClick={() => setOpen(false)}>Our Story</a>
          <a href="#mission" className="text-cream text-base tracking-wide" onClick={() => setOpen(false)}>Mission</a>
          <a href="#trips" className="text-cream text-base tracking-wide" onClick={() => setOpen(false)}>Trips</a>
          <a
            href="#waitlist"
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
