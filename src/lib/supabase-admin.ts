import { createClient } from '@supabase/supabase-js'

/**
 * Server-only admin client using the service role key.
 * Never import this in client components — it bypasses Row Level Security.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */
export function createSupabaseAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local from your Supabase project settings.'
    )
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
