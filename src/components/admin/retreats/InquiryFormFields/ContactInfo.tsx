'use client'

import type { HostInquiry, BuyoutInquiry } from '@/lib/types/retreats'

type Props = {
  inquiry: HostInquiry | BuyoutInquiry
  type: 'host' | 'buyout'
}

function CopyButton({ value }: { value: string }) {
  return (
    <button
      onClick={() => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(value)
        }
      }}
      className="text-xs text-amber hover:text-amber/80 transition-colors"
      title="Copy to clipboard"
    >
      Copy
    </button>
  )
}

export default function ContactInfo({ inquiry, type }: Props) {
  const host = type === 'host' ? (inquiry as HostInquiry) : null
  return (
    <div className="space-y-4">
      <Field label="Name" value={inquiry.name} />
      {host?.organization && <Field label="Organization" value={host.organization} />}
      <Field label="Email" value={inquiry.email} copy />
      {host?.phone && <Field label="Phone" value={host.phone} copy />}
      <Field
        label="Submitted"
        value={new Date(inquiry.submittedAt).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      />
    </div>
  )
}

function Field({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs tracking-wider uppercase text-gray-500">{label}</p>
        {copy && <CopyButton value={value} />}
      </div>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  )
}
