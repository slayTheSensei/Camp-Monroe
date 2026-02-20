'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: DashboardIcon },
  { label: 'Experiences', href: '/admin/experiences', icon: ExperiencesIcon },
  { label: 'Waitlist', href: '/admin/waitlist', icon: WaitlistIcon },
]

type Props = {
  userEmail: string
}

export default function AdminSidebar({ userEmail }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-forest text-cream flex flex-col min-h-screen shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-cream/10">
        <Link href="/admin" className="block">
          <h1 className="font-display text-xl uppercase italic tracking-wide">Camp Monroe</h1>
          <p className="text-cream/40 text-xs mt-0.5">Admin</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-amber/20 text-amber'
                  : 'text-cream/60 hover:text-cream hover:bg-cream/5'
              }`}
            >
              <item.icon active={active} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-cream/10">
        <p className="text-cream/40 text-xs truncate mb-2">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="text-cream/50 text-xs hover:text-cream transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* View site link */}
      <div className="px-4 pb-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-cream/30 text-xs hover:text-cream/60 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 1H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V7" strokeLinecap="round" />
            <path d="M7 1h4v4M11 1L5.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          View Site
        </a>
      </div>
    </aside>
  )
}

// --- Inline SVG icons ---

function DashboardIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"
      className={active ? 'text-amber' : 'text-cream/40'}>
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="11" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="11" width="6" height="6" rx="1" />
      <rect x="11" y="11" width="6" height="6" rx="1" />
    </svg>
  )
}

function ExperiencesIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"
      className={active ? 'text-amber' : 'text-cream/40'}>
      <path d="M9 1L1 6l8 5 8-5-8-5z" />
      <path d="M1 12l8 5 8-5" />
    </svg>
  )
}

function WaitlistIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"
      className={active ? 'text-amber' : 'text-cream/40'}>
      <path d="M12 5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M2 17c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6" strokeLinecap="round" />
    </svg>
  )
}
