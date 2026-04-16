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

const supportOptions: { value: SupportNeed; label: string; description: string }[] = [
  {
    value: 'lodging',
    label: 'Lodging only',
    description: "Just the venue — beds, kitchens, common spaces. You handle the rest.",
  },
  {
    value: 'meals',
    label: 'Meals / catering',
    description: "We connect you with local catering partners and coordinate meal service.",
  },
  {
    value: 'facilitation',
    label: 'Facilitation',
    description: "We introduce you to trusted facilitators and wellness practitioners in our network.",
  },
  {
    value: 'full',
    label: 'Full-service package',
    description: "Lodging, meals, facilitation support, and logistics coordination end-to-end.",
  },
]

type Props = {
  selectedRange: { start: string; end: string; nights: number } | null
  onClearRange: () => void
}

export default function HostInquiryForm({ selectedRange, onClearRange }: Props) {
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [retreatConcept, setRetreatConcept] = useState('')
  const [audience, setAudience] = useState('')
  const [groupSize, setGroupSize] = useState('')
  const [support, setSupport] = useState<SupportNeed[]>([])
  const [additionalNotes, setAdditionalNotes] = useState('')

  function toggleSupport(v: SupportNeed) {
    setSupport((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedRange) {
      setError('Please select dates on the calendar above.')
      setState('error')
      return
    }
    setState('loading')
    setError('')
    const row = {
      name: name.trim(),
      organization: organization.trim() || null,
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      retreat_concept: retreatConcept.trim(),
      audience_type: audience || null,
      group_size: groupSize ? parseInt(groupSize, 10) : null,
      start_date: selectedRange.start,
      end_date: selectedRange.end,
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
      <h3 className="font-display text-cream text-2xl uppercase mb-2">Your details</h3>

      {/* Selected range summary */}
      {selectedRange ? (
        <div className="flex items-center justify-between bg-amber/10 border border-amber/30 rounded-sm px-4 py-3">
          <div>
            <p className="text-cream/50 text-xs tracking-widest uppercase mb-0.5">Selected dates</p>
            <p className="text-cream text-sm font-medium">
              {selectedRange.start} → {selectedRange.end} · {selectedRange.nights} night
              {selectedRange.nights === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClearRange}
            className="text-xs text-cream/60 hover:text-cream underline"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="bg-cream/5 border border-cream/20 border-dashed rounded-sm px-4 py-3">
          <p className="text-cream/50 text-sm">
            Select dates on the calendar above — 3-night minimum, 14-day lead time.
          </p>
        </div>
      )}

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
        <TextInput
          label="Group size"
          type="number"
          value={groupSize}
          onChange={setGroupSize}
          placeholder="e.g. 12"
        />
      </div>

      <div>
        <p className="text-cream/60 text-xs tracking-widest uppercase mb-3">Support needs</p>
        <div className="divide-y divide-cream/10">
          {supportOptions.map((o) => {
            const active = support.includes(o.value)
            return (
              <label
                key={o.value}
                className="flex items-start gap-3 py-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleSupport(o.value)}
                  className="sr-only peer"
                />
                <span
                  className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                    active ? 'bg-amber border-amber' : 'border-cream/30 group-hover:border-cream/50'
                  }`}
                  aria-hidden="true"
                >
                  {active && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#1a2e1a" strokeWidth="2.5">
                      <path d="M1 5l2.5 2.5L9 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="flex-1">
                  <span className={`block text-sm font-medium ${active ? 'text-cream' : 'text-cream/80'}`}>
                    {o.label}
                  </span>
                  <span className="block text-xs text-cream/45 mt-0.5 leading-snug">
                    {o.description}
                  </span>
                </span>
              </label>
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
        disabled={state === 'loading' || !name || !email || !retreatConcept || !selectedRange}
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
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
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
