'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: DashboardIcon },
  { label: 'Membership', href: '/admin/membership', icon: MembershipIcon },
  { label: 'Partner inquiries', href: '/admin/partner-inquiries', icon: PartnerIcon },
  { label: 'Retreats', href: '/admin/retreats', icon: RetreatsIcon },
  { label: 'Follow along', href: '/admin/waitlist', icon: WaitlistIcon },
  { label: 'Experiences', href: '/admin/experiences', icon: ExperiencesIcon },
  { label: 'Content', href: '/admin/content', icon: ContentIcon },
  { label: 'Users', href: '/admin/users', icon: UsersIcon },
]

type Props = {
  userEmail: string
  onClose?: () => void
}

export default function AdminSidebar({ userEmail, onClose }: Props) {
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
    <aside className="w-64 bg-forest text-cream flex flex-col h-full shrink-0">
      {/* Logo + mobile close */}
      <div className="shrink-0 px-6 py-6 border-b border-cream/10 flex items-start justify-between">
        <Link href="/admin" onClick={onClose} className="block">
          <h1 className="font-display text-xl uppercase italic tracking-wide">Camp Monroe</h1>
          <p className="text-cream/40 text-xs mt-0.5">Admin</p>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-cream/50 hover:text-cream transition-colors -mr-2 -mt-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation (scrolls internally if items overflow) */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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

      {/* Help link (pinned above the email footer, subtle separator above) */}
      <div className="shrink-0 px-3 pt-3 pb-2 border-t border-cream/10">
        <Link
          href="/admin/help"
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/admin/help')
              ? 'bg-amber/20 text-amber'
              : 'text-cream/60 hover:text-cream hover:bg-cream/5'
          }`}
        >
          <HelpIcon active={isActive('/admin/help')} />
          Admin Guide
        </Link>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-4 py-3 border-t border-cream/10">
        <p className="text-cream/40 text-xs truncate mb-2">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="text-cream/50 text-xs hover:text-cream transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* View site link */}
      <div className="shrink-0 px-4 pb-4">
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

function RetreatsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"
      className={active ? 'text-amber' : 'text-cream/40'}>
      <rect x="2" y="3" width="14" height="13" rx="1.5" />
      <path d="M2 7h14" strokeLinecap="round" />
      <path d="M6 1v4M12 1v4" strokeLinecap="round" />
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

function ContentIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"
      className={active ? 'text-amber' : 'text-cream/40'}>
      <path d="M3 4h12M3 8h8M3 12h10M3 16h6" strokeLinecap="round" />
    </svg>
  )
}

function HelpIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"
      className={active ? 'text-amber' : 'text-cream/40'}>
      <circle cx="9" cy="9" r="7" />
      <path d="M6.5 6.5a2.5 2.5 0 114.5 1.5c-.5.5-1.5 1-1.5 2" strokeLinecap="round" />
      <circle cx="9" cy="13" r="0.5" fill="currentColor" />
    </svg>
  )
}

function MembershipIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"
      className={active ? 'text-amber' : 'text-cream/40'}>
      <path d="M2 5h14v9a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" />
      <path d="M2 5l7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PartnerIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"
      className={active ? 'text-amber' : 'text-cream/40'}>
      <path d="M2 10l3.5-3.5L9 10l3.5-3.5L16 10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 10v5" strokeLinecap="round" />
      <circle cx="9" cy="3" r="1.5" />
    </svg>
  )
}

function UsersIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"
      className={active ? 'text-amber' : 'text-cream/40'}>
      <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M1 17c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" strokeLinecap="round" />
      <path d="M14 8a2.5 2.5 0 100-5" strokeLinecap="round" />
      <path d="M17 17c0-2.5-1.5-4.5-3-5" strokeLinecap="round" />
    </svg>
  )
}
