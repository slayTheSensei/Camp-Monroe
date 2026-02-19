'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Handles scroll behaviour globally:
 *
 * 1. On cross-page navigation — scroll instantly to the top (no animation).
 * 2. On same-page anchor (#) clicks — enable smooth scroll for that
 *    click only, then immediately remove it so future navigations stay instant.
 */
export default function SmoothAnchor() {
  const pathname = usePathname()

  // Whenever the route changes, make sure we are at the top instantly
  useEffect(() => {
    // Remove the smooth class before the browser tries to animate
    document.documentElement.classList.remove('smooth-scroll')
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  // Intercept anchor clicks and add smooth scroll only for that moment
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      // Only intercept same-page hash links (e.g. #waitlist, #story)
      if (!href || !href.startsWith('#')) return

      // Briefly enable smooth scroll, then remove it after the scroll completes
      document.documentElement.classList.add('smooth-scroll')
      setTimeout(() => {
        document.documentElement.classList.remove('smooth-scroll')
      }, 800)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
