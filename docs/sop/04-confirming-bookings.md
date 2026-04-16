---
title: Confirming a Booking
summary: What happens when you confirm, what the system does automatically, and how to handle edge cases.
category: SOPs
order: 4
---

Confirming a booking is the most significant action in the system. Once confirmed, a booking is created, a PDF is generated and sent, and the dates are physically blocked.

## Step-by-step

1. Open the inquiry detail (from the Inbox or Calendar)
2. Click **Confirm Booking** in the sticky action bar
3. A dialog asks you to confirm:
   - **Start date** / **End date** (defaults to what the prospect requested; adjust if you've negotiated different dates)
   - **Group size** (pre-filled for host inquiries based on their bucket)
   - **Notes** (internal — printed on the PDF)
4. Click **Confirm & send email**

## What happens automatically

All in one atomic operation:

1. **Conflict check (hard-block)** — queries existing bookings, holds, and blackouts. If *anything* overlaps, the action fails with an error listing the conflicts. You'd have to resolve those first (release the conflicting hold, change dates, etc.)
2. **Booking row inserted** — goes into the `bookings` table. The database enforces no-overlap at this layer too.
3. **Inquiry status → Confirmed**, hold timer cleared
4. **PDF generated** — a 1-page summary with Camp Monroe branding, dates, group size, and your notes
5. **PDF uploaded** to secure storage (Supabase Storage, private bucket)
6. **Confirmation email sent** to the prospect via Resend, with a 30-day signed download link to the PDF
7. **Communications row logged** (`confirm_email`) with the Resend message ID for tracking
8. **Public calendar updated** — those dates now render as unavailable

## What the prospect receives

An email from `retreats@monroemaine.com` with subject "Your Camp Monroe dates are confirmed" containing:

- Confirmed date range
- Group size
- Confirmation number (first 8 chars of the booking ID)
- Download link to their PDF summary (valid 30 days)
- A brief "we'll follow up with logistics as the date approaches" note
- Signed by "The Camp Monroe team"

## Built-in constraints

:::info System rules
- **3-night minimum** on all bookings (enforced at the database level — you can't save a 2-night booking even if you tried)
- **Lead time** enforced on the public calendar: host retreats need 14 days out, buyouts need 7 days. You as admin can technically confirm shorter lead times in the dialog, but only if the prospect's request already bypassed the public calendar.
:::

## If confirm fails

You'll see a red error message listing the conflicts. Possible causes:

- Another hold overlaps → open that inquiry and release its hold or decline it
- A confirmed booking overlaps → you can't double-book; choose different dates
- A blackout overlaps → move the blackout or renegotiate the dates
- A date validation error (end before start, too short) → adjust the dialog values

## Canceling a booking

If something falls through after confirmation:

1. Open the inquiry
2. Click **Cancel Booking** in the action bar
3. Confirm the cancellation

What happens:
- Booking row is deleted
- Those dates re-open on the public calendar
- Inquiry reverts to Reviewing status
- **No automatic refund email is sent** — handle that conversation manually
- The original confirmation PDF and email stay on record for your files

:::warning
Cancellations don't generate a new email. You'll want to reach out to the prospect directly with a replacement message.
:::
