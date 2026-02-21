'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { inviteAdmin } from './actions'

export default function InviteForm() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleOpen() {
    setOpen(true)
    setEmail('')
    setResult(null)
  }

  function handleClose() {
    setOpen(false)
    setEmail('')
    setResult(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    startTransition(async () => {
      const { error } = await inviteAdmin(email.trim())
      if (error) {
        setResult({ type: 'error', message: error })
      } else {
        setResult({ type: 'success', message: `Invite sent to ${email.trim()}` })
        setEmail('')
        // Refresh the page to show the new pending user
        router.refresh()
      }
    })
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-forest text-cream font-semibold px-4 py-2 rounded-md text-sm hover:bg-forest/90 transition-colors flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 1v12M1 7h12" strokeLinecap="round" />
        </svg>
        Invite Admin
      </button>

      {/* Invite modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Invite Admin</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  They'll receive an email to set up their account.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors -mt-1 -mr-1 p-1"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l10 10M14 4L4 14" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="newadmin@campmonroe.com"
                  required
                  autoFocus
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                />
              </div>

              {result && (
                <div
                  className={`text-sm px-3 py-2 rounded-md ${
                    result.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {result.message}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !email.trim()}
                  className="bg-forest text-cream font-semibold px-5 py-2 rounded-md text-sm hover:bg-forest/90 transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
