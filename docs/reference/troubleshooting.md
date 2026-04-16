---
title: Troubleshooting
summary: Common issues and how to resolve them.
category: Reference
order: 3
---

Things that go sideways occasionally. Here's a first-pass response for each.

## "I don't see a new inquiry in the inbox"

:::note First checks
1. **Status filter** — the tabs at the top of the inbox default to showing all statuses, but if you clicked "Confirmed" or "Declined" recently you might be filtered.
2. **Type filter** — the Host / Buyout / All pill filter might be set narrower than you expect.
3. **Hard refresh** — ⌘⇧R on Mac, Ctrl+F5 on Windows. The inbox is server-rendered on each load, but occasionally the browser caches aggressively.
:::

If it's still missing, check Supabase directly (Kyle has access) — the inquiry row should be in `host_inquiries` or `buyout_inquiries`.

## "The calendar shows a date as unavailable but I don't know why"

Open the **Full Calendar** view. Click the specific day:

- If there's an orange dot → it's a hold; click to jump to the inquiry
- If green → it's a confirmed booking
- If grey → it's a blackout; check the Blackouts list
- If the background is light gray and there's no dot → it's outside any active season; check Seasons

## "I confirmed a booking and nothing seemed to happen"

Three things to check:

1. **Did you see an error flash?** The Communications tab will show whether the confirmation email was logged. If the booking was created but no email entry exists, Resend may have failed — check the Resend dashboard.
2. **Is the booking row there?** Open the Retreats Calendar — if it shows a green dot on those dates, the booking exists.
3. **If you got a "conflicts exist" red message** — something overlapped. Check the Dates tab of the inquiry for the specific conflicts. Resolve those first.

## "A prospect says they never got the confirmation email"

1. **Ask them to check spam** — the most common cause.
2. **Check the Communications tab** on the inquiry — if a `confirm_email` entry exists with a Resend message ID, the email was successfully handed off to Resend. Ask Kyle to check the Resend dashboard for bounce/spam reports.
3. **If Communications shows no `confirm_email` entry**, the email never sent. Cancel the booking and re-confirm, which regenerates the PDF and re-sends.

## "I need to reissue a confirmation PDF"

No dedicated button for this yet. Workaround: **Cancel the booking**, then **Confirm again**. That regenerates the PDF and sends a fresh email.

If this happens more than occasionally, ask Kyle — we can add a "resend confirmation" action.

## "A member needs a buyout on short notice"

Go to **Blackouts → New Blackout**:

- Category: **Member buyout**
- Label: member's last name + "buyout"
- Admin notes: context (phone call date, their contact info)

Save. Dates are blocked immediately. No email is sent.

:::warning
If someone has already submitted an inquiry for overlapping dates, creating the blackout doesn't cancel their inquiry — it just means you can't confirm them. Decline the inquiry with a polite note ("dates are no longer available") before creating the blackout.
:::

## "A confirmed booking overlaps with a member buyout request"

The database prevents this in the first place (bookings can't overlap other bookings), but blackouts and bookings are independent. If you're trying to blackout dates that have a confirmed booking:

1. Call the prospect first
2. Cancel the booking through the inquiry detail's Cancel Booking action
3. Handle the conversation about refund / make-good manually
4. Create the blackout

## "The public calendar shows wrong availability"

Most common causes:

- **Stale browser cache** — hard refresh
- **Wrong season** — check Seasons; make sure the current date is inside an active season
- **Old blackout still in place** — check Blackouts; delete if it shouldn't be there
- **A pending inquiry is on hold** — check the Hold tab in the inbox; release if appropriate

## Still stuck

Text Kyle with a screenshot and the URL you were on. If the issue touches billing (Resend, Supabase, Vercel), those services have their own dashboards — ask for access if you don't have it yet.
