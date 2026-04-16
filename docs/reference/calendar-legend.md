---
title: Calendar Color Legend
summary: What each color, dot, and background state on the admin calendar means.
category: Reference
order: 1
---

The admin calendar at `/admin/retreats/calendar` (and the preview on the Retreats dashboard) uses a consistent color system. Here's the full legend.

## Day-level indicators (dots inside a cell)

| Visual | Meaning |
|--------|---------|
| **Green dot** + label | Confirmed booking. Click the dot/label to jump to the inquiry. |
| **Orange dot** + label | Active hold. Click to jump to the inquiry. |
| **Grey dot** + label | Blackout (internal event, member buyout, or other). |

Multiple states can stack on the same day (e.g. a booking + a blackout if they overlap — though the system prevents new bookings from overlapping blackouts).

If more than 3 items fall on one day, the cell shows `+N more` at the bottom.

## Cell-level states (background shade)

| Visual | Meaning |
|--------|---------|
| **White background** | Inside an active season — this date is generally open for bookings |
| **Light gray background** | Outside any active season — unavailable to prospects |

## Number styling

- **Today** — amber number, semibold
- **In-month day** — dark gray number
- **Out-of-month day** (filler at the top/bottom of the grid) — light gray, lower opacity

## Navigation

Top of the calendar:

- **← Prev** — previous month
- **Today** — jump to current month
- **Next →** — next month

Month label is centered above the grid.

## Legend bar

At the top of every calendar view:

| Dot | Label |
|-----|-------|
| Green | Confirmed |
| Orange | Hold |
| Grey | Blackout |
| Light square | Outside season |

## Public calendar (prospect-facing) — different rules

The public calendar at `/host-a-retreat` and `/stay-at-camp` shows only two states: **available** and **unavailable**. It intentionally does NOT distinguish between bookings, holds, and blackouts — prospects just see "unavailable." This preserves privacy (they can't tell who's on hold vs. booked) while still preventing double-submissions.
