'use client'

import { useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = getBrowserSupabase()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-forest uppercase italic">Camp Monroe</h1>
        <p className="text-gray-500 text-sm mt-2">Set your password to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm
                         focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm
                         focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
              placeholder="Repeat your password"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-forest text-cream font-semibold py-2.5 rounded-md
                     hover:bg-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? 'Saving...' : 'Set Password & Continue'}
        </button>
      </form>
    </div>
  )
}
