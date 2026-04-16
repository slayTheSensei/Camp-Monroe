---
title: Retreats Concepts
summary: The four things you need to know before operating the Retreats module — Seasons, Blackouts, Inquiries, Bookings.
category: SOPs
order: 1
---

Before you start triaging, it helps to have the four core concepts crisp in your head. Everything in Retreats is some combination of these.

## Season

A **season** is a period when Camp Monroe is open at all. "Main Summer 2026: May 1 – Oct 31" is a season.

- Dates outside any active season are unavailable to the public
- You can have multiple seasons (e.g. a summer plus a winter pilot)
- Seasons can be toggled active/inactive without being deleted

## Blackout

A **blackout** is a date range *inside* a season that's off-limits. Categories:

- **Internal event** — camp-run programs, maintenance, family use
- **Member buyout** — Cambridge Gun & Rod Club members taking their priority access
- **Other** — anything else you want to block

Blackouts appear as unavailable on the public calendar. Prospects can't request those dates.

## Inquiry

An **inquiry** is a request someone submitted from the public site:

- **Host inquiry** — they want to run a retreat at the camp (`/host-a-retreat`)
- **Buyout inquiry** — they want to privately rent the whole camp for a stay (`/stay-at-camp`)

Every inquiry starts as **New** and moves through statuses: New → Reviewing → Hold → Confirmed (or Declined at any point).

## Booking

A **booking** is a confirmed inquiry. When you confirm:

- A booking row is created in the database
- A PDF summary is generated
- A confirmation email is sent to the prospect
- Those dates are physically blocked on the public calendar

:::tip Critical guarantee
The database itself refuses to accept two overlapping bookings. Even if the app had a bug, you could never double-book a date.
:::

## How they relate

| | Admin creates | Public sees |
|---|---|---|
| Season | ✓ | Dates inside look available |
| Blackout | ✓ | Dates look unavailable (no reason given) |
| Inquiry (hold) | Admin *promotes* an inquiry to hold | Held dates look unavailable |
| Inquiry (confirmed) | Admin *confirms* → creates a booking | Dates look unavailable |
