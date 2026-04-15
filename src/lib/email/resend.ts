import { Resend } from 'resend'

let _resend: Resend | null = null

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY
    if (!key) {
      throw new Error(
        'RESEND_API_KEY is not set. Add it to .env.local and to Vercel project environment variables.'
      )
    }
    _resend = new Resend(key)
  }
  return _resend
}

export function getFromAddress(): string {
  return process.env.RESEND_FROM_ADDRESS || 'Camp Monroe <retreats@monroemaine.com>'
}

export function getAdminRecipients(): string[] {
  const raw = process.env.ADMIN_ALERT_RECIPIENTS || ''
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.monroemaine.com'
}
