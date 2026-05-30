'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase-browser'
import type { EmailOtpType } from '@supabase/supabase-js'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      const supabase = getBrowserSupabase()

      // --- Hash fragment flow (implicit — Supabase uses this for invites) ---
      const hash = window.location.hash.slice(1) // strip leading #
      if (hash) {
        const params = new URLSearchParams(hash)
        const error = params.get('error')

        if (error) {
          router.replace('/admin/login')
          return
        }

        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            router.replace('/admin/login')
            return
          }

          if (type === 'invite' || type === 'recovery') {
            router.replace('/admin/update-password')
          } else {
            router.replace('/admin')
          }
          return
        }
      }

      // --- Query param flow (PKCE / token_hash fallback) ---
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type') as string | null

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          router.replace('/admin/login')
          return
        }
        if (type === 'invite' || type === 'recovery') {
          router.replace('/admin/update-password')
        } else {
          router.replace('/admin')
        }
        return
      }

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as EmailOtpType,
        })
        if (error) {
          router.replace('/admin/login')
          return
        }
        if (type === 'invite' || type === 'recovery') {
          router.replace('/admin/update-password')
        } else {
          router.replace('/admin')
        }
        return
      }

      // Nothing to process
      router.replace('/admin/login')
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <p className="text-sm text-gray-500">Signing you in…</p>
    </div>
  )
}
