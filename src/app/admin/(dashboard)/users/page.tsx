import { listAdmins, AdminUser } from './actions'
import InviteForm from './InviteForm'
import UserActionsMenu from './UserActionsMenu'
import PageHeader from '@/components/admin/ui/PageHeader'
import EmptyState from '@/components/admin/ui/EmptyState'

export const dynamic = 'force-dynamic'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function UsersPage() {
  const users = await listAdmins()

  return (
    <>
      <PageHeader
        title="Team Members"
        subtitle="Manage who has admin access to Camp Monroe"
        actions={<InviteForm />}
      />

      {/* User list */}
      {users.length === 0 ? (
        <EmptyState message="No users found." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Login</th>
                  <th className="px-4 py-3 font-medium">Invited</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </>
      )}
    </>
  )
}

function statusBadge(user: AdminUser) {
  if (!user.email_confirmed_at) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber/10 text-amber">
        Invite Pending
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-600">
      Active
    </span>
  )
}

function UserRow({ user }: { user: AdminUser }) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-3 text-gray-900 font-medium">{user.email}</td>
      <td className="px-4 py-3">{statusBadge(user)}</td>
      <td className="px-4 py-3 text-gray-500">{formatDate(user.last_sign_in_at)}</td>
      <td className="px-4 py-3 text-gray-400">{formatDate(user.created_at)}</td>
      <td className="px-4 py-3 text-right">
        <UserActionsMenu user={user} />
      </td>
    </tr>
  )
}

function UserCard({ user }: { user: AdminUser }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
        <div className="flex items-center gap-2 shrink-0">
          {statusBadge(user)}
          <UserActionsMenu user={user} />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
        <span>Last login: {formatDate(user.last_sign_in_at)}</span>
        <span>·</span>
        <span>Invited: {formatDate(user.created_at)}</span>
      </div>
    </div>
  )
}
