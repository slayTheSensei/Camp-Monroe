// Hold expiration logic.

import { createSupabaseAdmin } from '@/lib/supabase-admin'

/** Returns an ISO timestamp N days in the future. */
export function computeHoldExpiry(days: number = 7): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

/**
 * Moves any inquiry (host or str) in `hold` status whose hold_expires_at
 * has passed back to `reviewing`, and clears hold_expires_at.
 *
 * Returns the count that were expired for each type.
 * Invoked by the scheduled edge function `expire-holds`.
 */
export async function expireStaleHolds(): Promise<{ host: number; str: number }> {
  const supabase = createSupabaseAdmin()
  const now = new Date().toISOString()

  const host = await supabase
    .from('host_inquiries')
    .update({ status: 'reviewing', hold_expires_at: null })
    .eq('status', 'hold')
    .lt('hold_expires_at', now)
    .select('id')

  const str = await supabase
    .from('str_inquiries')
    .update({ status: 'reviewing', hold_expires_at: null })
    .eq('status', 'hold')
    .lt('hold_expires_at', now)
    .select('id')

  return {
    host: host.data?.length ?? 0,
    str: str.data?.length ?? 0,
  }
}

/** Human-readable "Expires in 3 days" / "Expired" label. */
export function formatHoldRelative(holdExpiresAt: string | null): string {
  if (!holdExpiresAt) return ''
  const expiry = new Date(holdExpiresAt).getTime()
  const now = Date.now()
  const diffMs = expiry - now
  if (diffMs <= 0) return 'Expired'
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffDays >= 1) return `Expires in ${diffDays} day${diffDays === 1 ? '' : 's'}`
  if (diffHrs >= 1) return `Expires in ${diffHrs} hour${diffHrs === 1 ? '' : 's'}`
  return 'Expires soon'
}
