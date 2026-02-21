'use server'

import { createSupabaseAdmin } from '@/lib/supabase-admin'

export type AdminUser = {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
}

export async function listAdmins(): Promise<AdminUser[]> {
  const admin = createSupabaseAdmin()
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 })

  if (error || !data) return []

  return data.users
    .map((u) => ({
      id: u.id,
      email: u.email ?? '(no email)',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      email_confirmed_at: u.email_confirmed_at ?? null,
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function inviteAdmin(email: string): Promise<{ error: string | null }> {
  const admin = createSupabaseAdmin()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/admin/auth/callback?next=/admin/update-password`,
  })

  return { error: error?.message ?? null }
}
