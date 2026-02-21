'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import { resendInvite, resetAdminPassword, removeAdmin } from './actions'
import type { AdminUser } from './actions'

type Feedback = { type: 'success' | 'error'; message: string }

export default function UserActionsMenu({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const isPendingInvite = !user.email_confirmed_at

  function closeMenu() {
    setOpen(false)
    setFeedback(null)
  }

  function handleAction(action: () => Promise<{ error: string | null }>, successMsg: string) {
    setOpen(false)
    startTransition(async () => {
      const { error } = await action()
      setFeedback(
        error
          ? { type: 'error', message: error }
          : { type: 'success', message: successMsg }
      )
      if (!error) router.refresh()
    })
  }

  function handleRemoveConfirm() {
    setShowConfirm(false)
    startTransition(async () => {
      const { error } = await removeAdmin(user.id)
      if (error) {
        setFeedback({ type: 'error', message: error })
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className="relative inline-block">
      {/* Feedback toast — shown outside menu */}
      {feedback && !open && (
        <div
          className={`absolute right-8 top-0 z-20 whitespace-nowrap text-xs px-3 py-1.5 rounded-md shadow-sm border ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {feedback.message}
          <button
            onClick={() => setFeedback(null)}
            className="ml-2 opacity-60 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      {/* Three-dot button */}
      <button
        onClick={() => { setOpen((v) => !v); setFeedback(null) }}
        disabled={isPending}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-40"
        aria-label="User actions"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-10" onClick={closeMenu} />
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-44">
          {isPendingInvite && (
            <button
              onClick={() =>
                handleAction(
                  () => resendInvite(user.email),
                  'Invite resent.'
                )
              }
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Resend Invite
            </button>
          )}
          <button
            onClick={() =>
              handleAction(
                () => resetAdminPassword(user.email),
                'Password reset email sent.'
              )
            }
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset Password
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            onClick={() => { setOpen(false); setShowConfirm(true) }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Confirm remove dialog */}
      {showConfirm && (
        <DeleteConfirmDialog
          title="Remove admin"
          message={`Remove ${user.email} from the team? They will lose all access immediately.`}
          onConfirm={handleRemoveConfirm}
          onCancel={() => setShowConfirm(false)}
          loading={isPending}
        />
      )}
    </div>
  )
}
