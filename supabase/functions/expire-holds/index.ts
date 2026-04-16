// Supabase Edge Function: expire-holds
//
// Invoked daily (pg_cron or Supabase scheduled invocation). Moves any inquiry
// in `hold` status whose hold_expires_at has passed back to `reviewing` and
// clears hold_expires_at.
//
// Does NOT email the prospect (that's R-004 in the roadmap).
//
// Deployment (one-time by admin):
//   supabase functions deploy expire-holds --no-verify-jwt
//   -- Schedule via pg_cron (07:00 UTC daily):
//   select cron.schedule(
//     'expire-holds-daily',
//     '0 7 * * *',
//     $$ select net.http_post(
//       url := 'https://<project-ref>.supabase.co/functions/v1/expire-holds',
//       headers := jsonb_build_object('Authorization', 'Bearer <service-role-jwt>')
//     ) $$
//   );
//
// Alternative: invoke from a Vercel Cron hitting this function's public URL.
//
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck -- Deno runtime, not Node; types resolved by Supabase CLI.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Deno globals
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ADMIN_ALERTS = (Deno.env.get('ADMIN_ALERT_RECIPIENTS') ?? '')
  .split(',')
  .map((s: string) => s.trim())
  .filter(Boolean)
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const RESEND_FROM = Deno.env.get('RESEND_FROM_ADDRESS') ?? 'Camp Monroe <retreats@monroemaine.com>'

Deno.serve(async (_req: Request) => {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const nowIso = new Date().toISOString()

  const host = await supabase
    .from('host_inquiries')
    .update({ status: 'reviewing', hold_expires_at: null })
    .eq('status', 'hold')
    .lt('hold_expires_at', nowIso)
    .select('id, name, organization, email')

  const buyout = await supabase
    .from('buyout_inquiries')
    .update({ status: 'reviewing', hold_expires_at: null })
    .eq('status', 'hold')
    .lt('hold_expires_at', nowIso)
    .select('id, name, email')

  const expiredHost = host.data?.length ?? 0
  const expiredBuyout = buyout.data?.length ?? 0
  const total = expiredHost + expiredBuyout

  if (total > 0 && ADMIN_ALERTS.length > 0 && RESEND_API_KEY) {
    try {
      const lines: string[] = []
      for (const h of host.data ?? []) {
        lines.push(`- Host: ${h.organization || h.name} (${h.email})`)
      }
      for (const b of buyout.data ?? []) {
        lines.push(`- Buyout: ${b.name} (${b.email})`)
      }
      const html = `<p>${total} hold${total === 1 ? '' : 's'} expired and moved back to <em>reviewing</em>:</p><ul>${lines.map((l) => `<li>${l}</li>`).join('')}</ul>`
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: ADMIN_ALERTS,
          subject: `[Retreats] ${total} hold${total === 1 ? '' : 's'} expired`,
          html,
        }),
      })
    } catch (e) {
      console.error('expire-holds admin email failed:', e)
    }
  }

  return new Response(
    JSON.stringify({ expiredCount: total, host: expiredHost, buyout: expiredBuyout }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
