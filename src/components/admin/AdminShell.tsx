'use client'

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'

type Props = {
  userEmail: string
  children: React.ReactNode
}

/**
 * Top-level admin scaffold. Owns the layout rules that every admin page
 * depends on:
 *   1. Viewport is 100vh, fixed. No body-level scroll.
 *   2. Sidebar column is h-screen. Never scrolls at the outer level.
 *   3. Main column is h-screen and contains the ONLY scroll region
 *      (<main overflow-y-auto>), which provides consistent page padding.
 *
 * Pages render their own content inside; they should not re-implement
 * height / overflow / padding. Use PageHeader + PageBody + Section from
 * src/components/admin/ui/ for consistent structure.
 */
export default function AdminShell({ userEmail, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar — pinned, md+ */}
      <div className="hidden md:flex shrink-0 h-screen">
        <AdminSidebar userEmail={userEmail} />
      </div>

      {/* Mobile sidebar drawer overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-200"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 h-full animate-in slide-in-from-left duration-200">
            <AdminSidebar userEmail={userEmail} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Mobile top bar (fixed height at top of main column) */}
        <div className="md:hidden shrink-0 flex items-center gap-3 px-4 py-3 bg-forest text-cream border-b border-cream/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1.5 rounded-md hover:bg-cream/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60"
            aria-label="Open menu"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display text-base uppercase italic tracking-wide">Camp Monroe</span>
        </div>

        {/* Single scroll region — all page content goes here */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
