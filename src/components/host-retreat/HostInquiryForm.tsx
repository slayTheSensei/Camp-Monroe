'use client'

import { useState } from 'react'
import { getSupabase } from '@/lib/supabase'

type FormState = 'idle' | 'loading' | 'success' | 'error'

type SupportNeed = 'lodging' | 'meals' | 'facilitation' | 'full'

const audienceOptions = [
  { value: 'wellness', label: 'Wellness' },
  { value: 'creative', label: 'Creative / residency' },
  { value: 'corporate', label: 'Corporate / team offsite' },
  { value: 'cultural', label: 'Cultural / community' },
  { value: 'other', label: 'Other' },
]

const supportOptions: { value: SupportNeed; label: string }[] = [
  { value: 'lodging', label: 'Lodging only' },
  { value: 'meals', label: 'Meals / catering' },
  { value: 'facilitation', label: 'Facilitation' },
  { value: 'full', label: 'Full-service package' },
]

export default function HostInquiryForm() {
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [retreatConcept, setRetreatConcept] = useState('')
  const [audience, setAudience] = useState('')
  const [groupSize, setGroupSize] = useState('')
  const [prefStart1, setPrefStart1] = useState('')
  const [prefEnd1, setPrefEnd1] = useState('')
  const [prefStart2, setPrefStart2] = useState('')
  const [prefEnd2, setPrefEnd2] = useState('')
  const [prefStart3, setPrefStart3] = useState('')
  const [prefEnd3, setPrefEnd3] = useState('')
  const [flexibility, setFlexibility] = useState('flexible')
  const [support, setSupport] = useState<SupportNeed[]>([])
  const [additionalNotes, setAdditionalNotes] = useState('')

  function toggleSupport(v: SupportNeed) {
    setSupport((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setError('')
    const row = {
      name: name.trim(),
      organization: organization.trim() || null,
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      retreat_concept: retreatConcept.trim(),
      audience_type: audience || null,
      group_size_bucket: groupSize || null,
      pref_start_1: prefStart1,
      pref_end_1: prefEnd1,
      pref_start_2: prefStart2 || null,
      pref_end_2: prefEnd2 || null,
      pref_start_3: prefStart3 || null,
      pref_end_3: prefEnd3 || null,
      flexibility: flexibility || null,
      support_needs: support,
      additional_notes: additionalNotes.trim() || null,
    }
    const { data, error: insertError } = await getSupabase()
      .from('host_inquiries')
      .insert(row)
      .select('id')
      .single()
    if (insertError || !data) {
      setState('error')
      setError(insertError?.message ?? 'Something went wrong. Please try again.')
      return
    }
    // Fire post-submit API; don't block the success state on it
    fetch('/api/retreats/post-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'host', id: data.id }),
    }).catch(() => {})
    setState('success')
  }

  if (state === 'success') {
    return (
      <div id="inquire" className="bg-cream/5 border border-cream/10 rounded-md p-8 text-center">
        <p className="text-amber text-5xl mb-4">✓</p>
        <h3 className="font-display text-cream text-2xl uppercase mb-3">Thank you</h3>
        <p className="text-cream/70 text-base leading-relaxed">
          We&apos;ve received your inquiry and will follow up within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <form
      id="inquire"
      onSubmit={handleSubmit}
      className="bg-cream/5 border border-cream/10 rounded-md p-5 md:p-8 space-y-5"
    >
      <h3 className="font-display text-cream text-2xl uppercase mb-2">Request dates</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <TextInput label="Your name" value={name} onChange={setName} required />
        <TextInput label="Organization (optional)" value={organization} onChange={setOrganization} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <TextInput label="Email" type="email" value={email} onChange={setEmail} required />
        <TextInput label="Phone (optional)" value={phone} onChange={setPhone} />
      </div>

      <TextArea
        label="Retreat concept"
        value={retreatConcept}
        onChange={setRetreatConcept}
        rows={4}
        required
        placeholder="A few sentences on the nature of the gathering, who it's for, and what you hope it feels like."
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Audience"
          value={audience}
          onChange={setAudience}
          options={[{ value: '', label: 'Select…' }, ...audienceOptions]}
        />
        <Select
          label="Group size"
          value={groupSize}
          onChange={setGroupSize}
          options={[
            { value: '', label: 'Select…' },
            { value: '8-12', label: '8 – 12' },
            { value: '12-16', label: '12 – 16' },
            { value: '16-24', label: '16 – 24' },
          ]}
        />
      </div>

      <div>
        <p className="text-cream/60 text-xs tracking-widest uppercase mb-2">Preferred dates</p>
        <div className="space-y-2">
          <DatePair label="First choice" start={prefStart1} end={prefEnd1} onStart={setPrefStart1} onEnd={setPrefEnd1} required />
          <DatePair label="Second choice (optional)" start={prefStart2} end={prefEnd2} onStart={setPrefStart2} onEnd={setPrefEnd2} />
          <DatePair label="Third choice (optional)" start={prefStart3} end={prefEnd3} onStart={setPrefStart3} onEnd={setPrefEnd3} />
        </div>
      </div>

      <Select
        label="Flexibility"
        value={flexibility}
        onChange={setFlexibility}
        options={[
          { value: 'flexible', label: 'Flexible — other dates welcome' },
          { value: 'fixed', label: 'Fixed — only these dates work' },
        ]}
      />

      <div>
        <p className="text-cream/60 text-xs tracking-widest uppercase mb-2">Support needs</p>
        <div className="flex flex-wrap gap-2">
          {supportOptions.map((o) => {
            const active = support.includes(o.value)
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => toggleSupport(o.value)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  active
                    ? 'bg-amber text-forest border-amber'
                    : 'border-cream/20 text-cream/70 hover:border-cream/40'
                }`}
              >
                {o.label}
              </button>
            )
          })}
        </div>
      </div>

      <TextArea
        label="Anything else?"
        value={additionalNotes}
        onChange={setAdditionalNotes}
        rows={3}
      />

      {state === 'error' && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={state === 'loading' || !name || !email || !retreatConcept || !prefStart1 || !prefEnd1}
        className="bg-amber text-forest font-semibold px-6 py-4 rounded-full text-base tracking-wide hover:bg-amber/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === 'loading' ? 'Submitting...' : 'Send inquiry'}
      </button>
      <p className="text-cream/30 text-xs">
        We review every inquiry personally and respond within 48 hours.
      </p>
    </form>
  )
}

// ----- input helpers -----

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
  required,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
        placeholder={placeholder}
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

function DatePair({
  label,
  start,
  end,
  onStart,
  onEnd,
  required,
}: {
  label: string
  start: string
  end: string
  onStart: (v: string) => void
  onEnd: (v: string) => void
  required?: boolean
}) {
  return (
    <div>
      <p className="text-cream/40 text-xs mb-1">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={start}
          onChange={(e) => onStart(e.target.value)}
          required={required}
          className={inputClass}
        />
        <input
          type="date"
          value={end}
          onChange={(e) => onEnd(e.target.value)}
          required={required}
          className={inputClass}
        />
      </div>
    </div>
  )
}
