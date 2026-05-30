'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Singleton Supabase browser client.
 *
 * Two problems this fixes:
 *
 * 1. `createBrowserClient` registers an exclusive Navigator LockManager
 *    lock on `lock:sb-<project>-auth-token` to coordinate auth refreshes
 *    across tabs. If multiple components each instantiate their own
 *    client, they fight for that lock and time out with:
 *      "Acquiring an exclusive Navigator LockManager lock ... timed out
 *       waiting 10000ms"
 *    Singleton pattern + module-level cache solves the duplicate-client
 *    case.
 *
 * 2. Even with a singleton, in Next.js dev with HMR the module can be
 *    reloaded and a stale client instance left behind. The stale client
 *    still holds the lock while the new client tries to acquire it →
 *    same timeout. Also: navigating from an authed admin page to a
 *    public page leaves the auth-refresh timer running on a client that
 *    nothing is using.
 *
 *    Fix: replace the default Web Locks-based lock with a no-op that
 *    just runs the function. Auth refreshes still happen, but they
 *    don't try to coordinate across tabs via the lock manager. The
 *    cross-tab coordination is nice-to-have for sites with many
 *    concurrent tabs; for an admin dashboard used by 1-2 people it's
 *    pure overhead.
 *
 * Always go through this helper so every consumer in the admin shares
 * one client.
 */

/**
 * No-op lock — runs the function immediately without coordinating
 * across tabs. Replaces the default Web Locks-based `processLock`.
 */
const passthroughLock = async <R>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>
): Promise<R> => {
  return fn()
}

let cached: SupabaseClient | null = null

export function getBrowserSupabase(): SupabaseClient {
  if (cached) return cached
  cached = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Skip cross-tab lock coordination entirely. Eliminates the
        // 10-second timeout when HMR creates a second client instance,
        // and when the auth refresh timer keeps running after navigation.
        lock: passthroughLock,
      },
    }
  )
  return cached
}
