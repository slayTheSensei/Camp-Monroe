'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Singleton Supabase browser client.
 *
 * `createBrowserClient` from `@supabase/ssr` registers an
 * exclusive LockManager lock on `lock:sb-<project>-auth-token` to
 * keep the auth session in sync across tabs. If multiple components
 * each instantiate their own client, they fight for that lock and
 * one or more eventually time out with:
 *
 *   "Acquiring an exclusive Navigator LockManager lock ... timed out
 *    waiting 10000ms"
 *
 * Always go through this helper so every consumer in the admin shares
 * one client.
 */

let cached: SupabaseClient | null = null

export function getBrowserSupabase(): SupabaseClient {
  if (cached) return cached
  cached = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return cached
}
