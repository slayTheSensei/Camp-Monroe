---
title: What Prospects See
summary: Mental model of the public-facing booking experience so you understand both sides of your admin work.
category: Reference
order: 4
---

It helps to know exactly what prospects experience when they hit the public site — so you know what they're expecting when their inquiry lands in your inbox.

## The two entry points

### /host-a-retreat

For people running events: retreat facilitators, corporate teams, wellness practitioners, creative residencies.

**What they see:**
- Hero with "A quiet lakefront for the work that matters"
- Capacity + support overview (8-24 guests, lodging + meals/catering/facilitation optional)
- An availability calendar
- An inquiry form below the calendar

### /stay-at-camp

For people wanting a private whole-camp buyout — friend groups, family reunions, creative writing retreats.

**What they see:**
- Hero with "A quiet week on the lake"
- Reminder that this is a whole-property buyout, not lodging-only
- The availability calendar
- A simpler inquiry form

## The availability calendar

Two-month view on desktop, one month on mobile. Uses `react-day-picker` underneath with our brand styling.

### What each cell means

- **Pickable / normal background** — date is available
- **Greyed-out with strikethrough** — unavailable (any of: booking, hold, blackout, outside season, or inside the lead-time buffer)
- **Amber pill (solid)** — start/end of their current selection
- **Amber pill (lighter)** — days between start and end in their selection

Prospects never see the reason a date is unavailable.

### Built-in constraints enforced at the calendar

- **3-night minimum** — once they pick a start, dates fewer than 3 nights out are disabled
- **Lead time** — retreats need 14 days from today; buyouts need 7 days
- **No fragmented ranges** — if their selection would span a blocked date, the end is silently clamped to the day before

### Feedback they get

The helper text under the calendar legend updates live:

- Nothing picked: "Select a start date, then an end date. 3-night minimum, 14-day lead time."
- Too short: "2 nights selected — we need 3 or more (1 more to go)."
- Valid: "May 16 – May 23, 2026 · 7 nights"

## The inquiry form

Below the calendar. Collapses if the selection hasn't been made yet. Once dates are picked, prospects see their selection summarized and fill in contact info + concept details.

### Host form fields
Name, organization (optional), email, phone (optional), retreat concept, audience type, group size, support needs (multi-select with descriptions), notes.

### Buyout form fields
Name, email, party size (raw integer), purpose of stay, affiliation (existing member / new / prospective / none), notes.

## After they submit

1. The client-side code generates a UUID for their inquiry, inserts directly to Supabase (anon RLS allows INSERT only)
2. A post-submit API route fires two Resend emails:
   - Acknowledgment to the prospect
   - Alert to `ADMIN_ALERT_RECIPIENTS`
3. The prospect sees a success message: "Thanks — we'll follow up within 48 hours"

## What they don't see

- **Your admin notes** — never exposed
- **Other inquiries** — fully private
- **Hold status reasons** — a held date just looks "unavailable" with no context
- **Pricing** — the v1 Retreats Pipeline doesn't show prices anywhere. Those conversations happen over email.

## Email chain they'll receive

Depending on your actions:

1. **Immediate:** acknowledgment email
2. **If you place a hold:** "We've placed a soft hold on your dates" (with expiry date)
3. **If you confirm:** "Your Camp Monroe dates are confirmed" + PDF link
4. **If you decline:** whatever message you wrote in the decline dialog

All from `retreats@monroemaine.com`. Prospects can reply directly.
