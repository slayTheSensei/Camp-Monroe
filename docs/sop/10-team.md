---
title: Team Members
summary: Invite, manage, and remove admin accounts.
category: SOPs
order: 10
---

The **Users** section at `/admin/users` is where you manage who has admin access.

## Who should have admin access

Only people who operate Camp Monroe day-to-day — typically:

- Kyle (owner)
- Operating partner
- Anyone helping with triage or bookings

Don't give admin access to prospects, contractors, or one-off collaborators. Admin access means the ability to confirm bookings, send emails as Camp Monroe, and see all inquiry data.

## Inviting someone

1. Go to `/admin/users`
2. Click **Invite New Admin** in the top-right
3. Enter their email
4. Click Send

Supabase sends them an email with a setup link. Their status shows as "Invite Pending" until they click the link, set a password, and sign in — then it flips to "Active."

:::tip
If the invite email doesn't arrive within a few minutes, check the recipient's spam folder. Invites are sent from Supabase's default sender unless the domain has custom SMTP configured.
:::

## The Users list

Each row shows:

- **Email**
- **Status** — Active / Invite Pending
- **Last Login** — relative time (Today / Yesterday / "3 days ago")
- **Invited** — when the account was first created
- **Actions menu** — manage invite / remove access

## Managing an invite

For users who haven't accepted yet (status = Invite Pending):

- **Resend invite** — sends a fresh email with a new setup link
- **Revoke invite** — cancels the pending invite; they can't sign up with that link

## Removing access

For active users:

- **Remove access** in the actions menu
- They're signed out of any active sessions and can't sign back in

:::warning
Removing a user doesn't delete their activity history. Any inquiries they confirmed, emails they sent, etc. stay in the logs. This is intentional — you need an audit trail.
:::

## Updating your own password

1. Sign out
2. Click "Forgot password" on the login page
3. Supabase emails a reset link
4. Set a new password

There's no in-app "change password" flow right now. Ask Kyle if this becomes painful — we can add one.
