'use client'

import { useState } from 'react'
import { getSupabase } from '@/lib/supabase'

const tripOptions = [
  { value: 'weekend_camping', label: 'Weekend Camping Trips' },
  { value: 'retreat', label: 'Camp Retreats' },
  { value: 'day_trip', label: 'Day Trips & Hikes' },
  { value: 'private_group', label: 'Private / Group Events' },
  { value: 'all', label: 'All of the above' },
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function Waitlist() {
  const [form, setForm] = useState({ name: '', email: '', trip_interest: '' })
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.trip_interest) return

    setState('loading')
    setErrorMsg('')

    const { error } = await getSupabase().from('waitlist').insert([
      {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        trip_interest: form.trip_interest,
      },
    ])

    if (error) {
      if (error.code === '23505') {
        // Duplicate email
        setState('error')
        setErrorMsg("You're already on the list! We'll be in touch soon.")
      } else {
        setState('error')
        setErrorMsg('Something went wrong. Please try again.')
      }
    } else {
      setState('success')
      setForm({ name: '', email: '', trip_interest: '' })
    }
  }

  return (
    <section id="waitlist" className="bg-forest py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <span className="text-amber text-xs tracking-[0.4em] uppercase font-medium">
              Be First
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream uppercase mt-3 mb-6 leading-none">
              Join the<br />Waitlist
            </h2>
            <p className="text-cream/70 text-base leading-relaxed mb-8">
              We&apos;re building something intentional—and limited capacity means we fill fast.
              Get on the list to be first to know when trips drop, retreats open, and Camp Monroe
              is ready to welcome you to Maine.
            </p>
            {/* Social proof placeholder */}
            <div className="flex items-center gap-4 text-cream/50 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-amber/20 border-2 border-forest"
                  />
                ))}
              </div>
              <span>Join hundreds of Black &amp; brown outdoor enthusiasts</span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-cream/5 border border-cream/10 rounded-sm p-5 md:p-8">
            {state === 'success' ? (
              <div className="text-center py-8">
                <div className="text-amber text-5xl mb-4">✓</div>
                <h3 className="font-display text-cream text-3xl uppercase mb-3">
                  You&apos;re In.
                </h3>
                <p className="text-cream/70 text-base leading-relaxed">
                  Welcome to the Camp Monroe community. We&apos;ll reach out with early access,
                  trip drops, and everything you need to know before your first adventure.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-cream/60 text-xs tracking-widest uppercase block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-cream/10 border border-cream/20 text-cream placeholder-cream/30 px-4 py-3 rounded-sm text-base focus:outline-none focus:border-amber transition-colors"
                  />
                </div>

                <div>
                  <label className="text-cream/60 text-xs tracking-widest uppercase block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-cream/10 border border-cream/20 text-cream placeholder-cream/30 px-4 py-3 rounded-sm text-base focus:outline-none focus:border-amber transition-colors"
                  />
                </div>

                <div>
                  <label className="text-cream/60 text-xs tracking-widest uppercase block mb-2">
                    I&apos;m Most Interested In
                  </label>
                  <select
                    required
                    value={form.trip_interest}
                    onChange={(e) => setForm({ ...form, trip_interest: e.target.value })}
                    className="w-full bg-cream/10 border border-cream/20 text-cream px-4 py-3 rounded-sm text-base focus:outline-none focus:border-amber transition-colors appearance-none"
                  >
                    <option value="" disabled className="text-forest">
                      Select an experience type
                    </option>
                    {tripOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="text-forest">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {state === 'error' && (
                  <p className="text-red-400 text-sm">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="bg-amber text-forest font-semibold px-6 py-4 rounded-full text-base tracking-wide hover:bg-amber/90 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {state === 'loading' ? 'Signing you up...' : 'Count Me In'}
                </button>

                <p className="text-cream/30 text-xs text-center">
                  No spam. Just camp. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
