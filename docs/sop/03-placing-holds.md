---
title: Placing a Hold
summary: How to place, release, and manage soft holds on dates.
category: SOPs
order: 3
---

A **hold** is a soft 7-day reservation while you finalize details with a prospect. It blocks other people from submitting on the same dates and sends the prospect a "we're holding this for you" email.

## When to place a hold

- Prospect looks like a good fit but you want to confirm details before committing
- You need time to coordinate internally (catering, facilitation referrals, logistics)
- The prospect asked for a hold while they decide internally

## How to place one

1. Open the inquiry detail
2. Click **Place Hold** in the sticky action bar at the bottom
3. The system automatically:
   - Sets inquiry status to Hold
   - Sets a 7-day expiration timer (`hold_expires_at`)
   - Sends the prospect a "soft hold placed on your dates" email
   - **Blocks those dates** on the public availability calendar so no other prospect submits on them
   - Logs the communication in the Communications tab

## What prospects see

On their end, the calendar date they requested goes from "available" to "unavailable" — same greyed-out treatment as confirmed bookings and blackouts. They don't see *why*, just that it's taken.

## Auto-expiration

If you don't confirm or extend within 7 days, the hold **automatically reverts** to Reviewing status at 7am UTC the next day. When that happens:

- Inquiry status flips back to Reviewing
- The `hold_expires_at` timer clears
- Dates re-open on the public calendar
- **No email is sent to the prospect** — they won't know the hold lapsed unless you follow up

:::warning
If you're waiting on a commitment from a prospect, follow up on day 5 or 6. Otherwise the hold will silently expire and you'll get customer-service friction.
:::

## Releasing a hold early

If you decide not to move forward:

1. Open the inquiry
2. Click **Release Hold** in the action bar
3. Status reverts to Reviewing
4. No email is sent to the prospect

You'd usually pair this with a manual email explaining the decision — or with a Decline action (which does send an email).

## Seeing all active holds at a glance

- **Dashboard** shows the "On Hold" count at the top
- **Inbox** has a "Hold" status tab showing just held inquiries
- **Calendar** shows held date ranges as orange dots — click any day to jump to that inquiry

## Can two people be on hold for the same dates?

No. When a hold is active, the system hard-blocks any other inquiry from being confirmed on those dates. The public calendar also greys them out, so prospects can't even submit on them in the first place.
