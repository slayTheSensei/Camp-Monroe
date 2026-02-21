import { listAdmins, AdminUser } from './actions'
import InviteForm from './InviteForm'

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">Manage who has admin access to Camp Monroe</p>
        </div>
        <InviteForm />
      </div>

      {/* User list */}
      {users.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No users found.</p>
        </div>
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
    </div>
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
    </tr>
  )
}

function UserCard({ user }: { user: AdminUser }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
        {statusBadge(user)}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
        <span>Last login: {formatDate(user.last_sign_in_at)}</span>
        <span>·</span>
        <span>Invited: {formatDate(user.created_at)}</span>
      </div>
    </div>
  )
}
