---
title: Email Triggers
summary: Every automatic email the system sends — what triggers it, who gets it, what it contains.
category: Reference
order: 2
---

Every email sent from Camp Monroe goes through Resend and is logged in the Communications tab of the relevant inquiry. Here's the full catalog.

## Emails to prospects

### Acknowledgment

- **Trigger:** Prospect submits an inquiry from `/host-a-retreat` or `/stay-at-camp`
- **Subject:** "We received your retreat inquiry — Camp Monroe" *(host)* or "Thanks for your camp buyout request — Camp Monroe" *(buyout)*
- **Body:** "Thanks for reaching out. We'll follow up within 48 hours."
- **From:** `retreats@monroemaine.com`

### Hold notice

- **Trigger:** Admin clicks "Place Hold" on an inquiry
- **Subject:** "Soft hold placed on your Camp Monroe dates"
- **Body:** "We've placed a soft hold on [dates] while we finalize. Expect to hear from us by [expiry date]."

### Confirmation

- **Trigger:** Admin confirms a booking
- **Subject:** "Your Camp Monroe dates are confirmed"
- **Body:** Confirmed dates, group size, confirmation ID, download link to PDF summary (30-day signed URL), "we'll follow up with logistics" note.

### Decline

- **Trigger:** Admin clicks "Decline" on an inquiry
- **Subject:** "A note on your Camp Monroe inquiry"
- **Body:** The message the admin wrote in the decline dialog.

### Manual emails

- **Trigger:** Admin uses the Communications tab's "+ Compose" to send a manual email
- **Subject / body:** whatever the admin typed
- **Kind:** `review_email` (default) — logged in the communications log

## Emails to admins

### New inquiry alert

- **Trigger:** Prospect submits an inquiry
- **Recipients:** everyone listed in the `ADMIN_ALERT_RECIPIENTS` environment variable (comma-separated)
- **Subject:** "[Retreats] New host inquiry — [Org or Name]" or "[Retreats] New buyout request — [Name]"
- **Body:** Contact info + requested-dates summary + retreat concept (for host) or party size/purpose (for buyout), with a direct link to the admin inquiry detail page.

### Hold expiration summary

- **Trigger:** The daily `expire-holds` edge function runs (currently scheduled for 07:00 UTC). Only sends if holds actually expired that day.
- **Recipients:** `ADMIN_ALERT_RECIPIENTS`
- **Subject:** "[Retreats] N hold(s) expired"
- **Body:** List of expired holds with name + email.

## Emails that do NOT fire automatically

- **When a hold expires, the prospect is not notified** — they'd just see the calendar re-open those dates. Follow up manually if you want.
- **When a booking is canceled**, no email goes out. Reach out to the prospect directly.
- **When an inquiry is "Reopened" from Declined**, no email. Follow up manually.

## Configuration

If emails aren't arriving, check:

- **Resend dashboard** — any bounces, rate limits, or DNS issues
- **Environment variables** — `RESEND_API_KEY`, `RESEND_FROM_ADDRESS`, `ADMIN_ALERT_RECIPIENTS` all need to be set in Vercel
- **DNS for the `monroemaine.com` domain** — SPF + DKIM records must be verified in Resend for the from-address to deliver reliably
