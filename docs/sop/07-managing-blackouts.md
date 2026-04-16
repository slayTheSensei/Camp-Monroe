---
title: Managing Blackouts
summary: How to block dates inside a season — for internal events, CGRC member buyouts, or any other reason.
category: SOPs
order: 7
---

A **blackout** is a date range inside an active season that's off-limits. Use it for anything that would otherwise be open but isn't — member buyouts, camp-run events, maintenance windows, family use.

## Viewing blackouts

From the Retreats dashboard, click **Blackouts** in the top-right. You'll see every blackout, sorted by start date. The Retreats dashboard also shows the 5 most recent upcoming blackouts in the "Upcoming Blackouts" panel.

## Creating a blackout

1. Click **+ New Blackout**
2. Fill in:
   - **Start date** / **End date**
   - **Category** — Internal event / Member buyout (CGRC) / Other
   - **Label** — short, used in the admin calendar (e.g. "Johnson family buyout")
   - **Admin notes** — internal, never seen publicly
3. Save

The dates are immediately blocked on the public calendar. Prospects see them as unavailable with no indication of why.

## The three categories

Category is for your records only. Prospects see all blackouts the same way.

### Internal event

Camp-run programming — something Camp Monroe is hosting directly. Family retreats you're organizing, staff trainings, content shoots, maintenance periods.

### Member buyout (CGRC)

Cambridge Gun & Rod Club members invoking their priority access. This is the most common blackout reason during members' historical access window.

### Other

Anything else. Weather buffers, personal use, last-minute holds where you don't want to create a fake inquiry, etc.

## Editing or deleting

Click any blackout in the list. All fields are editable. Delete is available at the bottom-left of the edit form. Deletion immediately reopens those dates on the public calendar.

:::warning
Deleting a blackout is immediate and has no undo. If you deleted by mistake, just create a new one with the same dates.
:::

## Common scenarios

### A CGRC member calls about next weekend

1. Confirm their dates with them on the phone
2. Go to Blackouts → New Blackout
3. Category: **Member buyout**
4. Label: `{Member last name} buyout`
5. Admin notes: "Phone call {date}, contact {their phone}"
6. Save

Dates are blocked within seconds. They get no email — the blackout is invisible to them.

### You want to block a weekend for personal use

Same flow, category **Other**, label something clear like "Closed — owner use". No PII concerns since the label is never shown publicly.

### A confirmed booking ran over

If a booking ran late and a cleanup day is needed:

- Create a blackout for the buffer dates, category **Internal event**
- Label like "Cleanup buffer — {confirmed booking label}"

### Undoing an accidental blackout

Click into it and hit Delete. Dates reopen immediately.

## Can I blackout over a confirmed booking?

No — the system currently allows it at the data level (blackouts and bookings are separate tables), but you'd be publishing contradictory state. If a booking needs to be overridden, cancel the booking first (which reopens the dates), then create the blackout.

:::danger
If you ever need to force-close a date that's already confirmed, talk to the prospect first. Canceling a booking deletes the booking row and reverts the inquiry to Reviewing — no refund email goes out automatically.
:::
