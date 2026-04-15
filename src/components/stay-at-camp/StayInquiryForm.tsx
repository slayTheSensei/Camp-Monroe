'use client'

import { useState } from 'react'
import { getSupabase } from '@/lib/supabase'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function StayInquiryForm() {
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [partySize, setPartySize] = useState('')
  const [purpose, setPurpose] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setError('')
    const row = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      start_date: startDate,
      end_date: endDate,
      party_size: partySize || null,
      purpose_of_stay: purpose || null,
      affiliation: affiliation || null,
      additional_notes: additionalNotes.trim() || null,
    }
    const { data, error: insertError } = await getSupabase()
      .from('str_inquiries')
      .insert(row)
      .select('id')
      .single()
    if (insertError || !data) {
      setState('error')
      setError(insertError?.message ?? 'Something went wrong. Please try again.')
      return
    }
    fetch('/api/retreats/post-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'str', id: data.id }),
    }).catch(() => {})
    setState('success')
  }

  if (state === 'success') {
    return (
      <div id="request" className="bg-cream/5 border border-cream/10 rounded-md p-8 text-center">
        <p className="text-amber text-5xl mb-4">✓</p>
        <h3 className="font-display text-cream text-2xl uppercase mb-3">Thank you</h3>
        <p className="text-cream/70 text-base leading-relaxed">
          We&apos;ve received your stay request and will follow up within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <form
      id="request"
      onSubmit={handleSubmit}
      className="bg-cream/5 border border-cream/10 rounded-md p-5 md:p-8 space-y-5"
    >
      <h3 className="font-display text-cream text-2xl uppercase mb-2">Request a stay</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <TextInput label="Your name" value={name} onChange={setName} required />
        <TextInput label="Email" type="email" value={email} onChange={setEmail} required />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Arrive</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Depart</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Party size"
          value={partySize}
          onChange={setPartySize}
          options={[
            { value: '', label: 'Select…' },
            { value: '1-2', label: '1 – 2 people' },
            { value: '3-4', label: '3 – 4 people' },
            { value: '5+', label: '5 or more' },
          ]}
        />
        <Select
          label="Purpose of stay"
          value={purpose}
          onChange={setPurpose}
          options={[
            { value: '', label: 'Select…' },
            { value: 'personal', label: 'Personal getaway' },
            { value: 'creative', label: 'Creative / writing' },
            { value: 'friends', label: 'Friends / family group' },
            { value: 'pre-retreat', label: 'Pre- or post-retreat' },
            { value: 'other', label: 'Other' },
          ]}
        />
      </div>

      <Select
        label="Are you connected to Camp Monroe?"
        value={affiliation}
        onChange={setAffiliation}
        options={[
          { value: '', label: 'Select…' },
          { value: 'existing_member', label: 'Existing member / past guest' },
          { value: 'new_member', label: 'New member / recently joined' },
          { value: 'prospective', label: 'Prospective member' },
          { value: 'none', label: 'Just curious' },
        ]}
      />

      <TextArea
        label="Anything else?"
        value={additionalNotes}
        onChange={setAdditionalNotes}
        rows={3}
      />

      {state === 'error' && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={state === 'loading' || !name || !email || !startDate || !endDate}
        className="bg-amber text-forest font-semibold px-6 py-4 rounded-full text-base tracking-wide hover:bg-amber/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === 'loading' ? 'Submitting...' : 'Send request'}
      </button>
    </form>
  )
}

const inputClass =
  'w-full bg-cream/10 border border-cream/20 text-cream placeholder-cream/30 px-4 py-3 rounded-sm text-base focus:outline-none focus:border-amber transition-colors'
const labelClass = 'text-cream/60 text-xs tracking-widest uppercase block mb-2'

function TextInput({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={inputClass}
      />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={inputClass}
      />
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-forest">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
