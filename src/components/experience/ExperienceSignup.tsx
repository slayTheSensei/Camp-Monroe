'use client'

import { useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import { Experience } from '@/types/experience'

type Props = { experience: Experience }
type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ExperienceSignup({ experience }: Props) {
  const [form, setForm] = useState({ name: '', email: '' })
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return

    setState('loading')
    setErrorMsg('')

    const { error } = await getSupabase().from('waitlist').insert([
      {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        trip_interest: experience.slug,
        trip_slug: experience.slug,
      },
    ])

    if (error) {
      if (error.code === '23505') {
        setState('error')
        setErrorMsg("You're already on the list for this experience!")
      } else {
        setState('error')
        setErrorMsg('Something went wrong. Please try again.')
      }
    } else {
      setState('success')
      setForm({ name: '', email: '' })
    }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-10">
        <div className="text-amber text-5xl mb-4">✓</div>
        <h3 className="font-display text-cream text-3xl uppercase mb-3">You&apos;re In.</h3>
        <p className="text-cream/70 text-base leading-relaxed max-w-sm mx-auto">
          You&apos;re on the early access list for {experience.title}. We&apos;ll reach out the moment
          spots open up.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

      {state === 'error' && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="bg-amber text-forest font-semibold px-6 py-4 rounded-full text-base tracking-wide hover:bg-amber/90 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {state === 'loading' ? 'Signing you up...' : `Get Early Access · ${experience.title}`}
      </button>

      <p className="text-cream/30 text-xs text-center">
        No spam. Just camp. Unsubscribe anytime.
      </p>
    </form>
  )
}
