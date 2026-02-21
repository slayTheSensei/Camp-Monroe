'use server'

import { createClient } from '@supabase/supabase-js'
import { createSupabaseAdmin } from '@/lib/supabase-admin'
import { createSupabaseServer } from '@/lib/supabase-server'

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
    redirectTo: `${siteUrl}/admin/auth/callback`,
  })

  return { error: error?.message ?? null }
}

export async function resendInvite(email: string): Promise<{ error: string | null }> {
  const admin = createSupabaseAdmin()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/admin/auth/callback`,
  })

  return { error: error?.message ?? null }
}

export async function resetAdminPassword(email: string): Promise<{ error: string | null }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

  // Use the standard anon client — resetPasswordForEmail is a public API
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/admin/auth/callback`,
  })

  return { error: error?.message ?? null }
}

export async function removeAdmin(userId: string): Promise<{ error: string | null }> {
  // Guard: prevent self-removal
  const supabase = await createSupabaseServer()
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  if (currentUser?.id === userId) {
    return { error: 'You cannot remove your own account.' }
  }

  const admin = createSupabaseAdmin()
  const { error } = await admin.auth.admin.deleteUser(userId)

  return { error: error?.message ?? null }
}
