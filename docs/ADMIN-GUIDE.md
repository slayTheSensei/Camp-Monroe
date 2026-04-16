# Camp Monroe Admin — Team Onboarding Guide

Welcome to the Camp Monroe admin dashboard. This guide walks you through everything you'll do day-to-day: reviewing inquiries, confirming bookings, managing dates, and keeping the public site accurate.

**Who this is for:** Kyle and the operating team. No technical background needed.

---

## What the dashboard does

The admin at **monroemaine.com/admin** is the single place you manage:

1. **Retreats** — inquiries from people who want to host retreats or book the whole camp for private stays, plus the dates you publish as available
2. **Experiences** — the public-facing experience listings (day trips, camping trips, etc.) that appear on the website
3. **Site Content** — the editable copy on the public homepage, hero, footer, etc.
4. **Team Members** — who else has admin access
5. **Waitlist** — visitors who signed up for general interest

Everything you do here is reflected on the public site at monroemaine.com within seconds.

---

## Getting started

### Logging in

1. Go to **monroemaine.com/admin** (or click "Login" in the top-right of the public site)
2. Enter your admin email + password
3. If you don't have an account yet, ask Kyle to invite you from the Users page — you'll get an email with a setup link

### The sidebar

Once logged in, the left sidebar shows every section you can work in:

- **Dashboard** — quick summary of everything
- **Experiences** — manage trip listings
- **Retreats** — the biggest section; inquiries, seasons, blackouts, calendar
- **Waitlist** — people who signed up for general interest
- **Content** — editable copy on the public site
- **Users** — team members with admin access

The sidebar stays visible at all times. Only the main content area scrolls.

Your email and a **Sign Out** link are always at the bottom of the sidebar.

---

## Your typical workflow

Most days, here's the rhythm:

1. **Open the Dashboard.** It shows how many new retreat inquiries need attention, how many are on hold, and upcoming confirmed bookings.
2. **Click into Retreats → Inbox.** Triage anything in "New" — decide whether to place a hold, confirm right away, or decline.
3. **Check the Calendar.** Make sure what's on the calendar matches what you expect.
4. **Respond to any communications** prospects sent you (reply directly to the emails they get).

If you're not in triage mode, you might be:
- Adding a new season or a blackout for a private member buyout
- Creating or editing a public experience
- Inviting a new team member

---

# The Retreats Module

This is the heart of the system. Let's go through the concepts, then the day-to-day tasks.

## Four concepts you need to know

### 1. Season

A **season** is a period when Camp Monroe is open at all. "Main Summer 2026: May 1 – Oct 31" is a season. Dates outside an active season are unavailable to the public.

You can have multiple seasons (e.g. a summer and a winter pilot). Seasons can be toggled active/inactive without deleting them.

### 2. Blackout

A **blackout** is a date range *inside* a season that's off-limits. Used for:
- **Internal events** (camp-run programs, private family use)
- **Member buyouts** (Cambridge Gun & Rod Club members take priority)
- **Other** (anything else you need to block)

Blackouts are shown as unavailable on the public calendar, so prospects can't request those dates.

### 3. Inquiry

An **inquiry** is a request someone submitted from the public site — either a **host inquiry** (they want to run a retreat) or a **buyout inquiry** (they want to privately rent the whole camp for a stay).

Every inquiry starts as **New** and moves through statuses as you triage it: New → Reviewing → Hold → Confirmed (or Declined at any point).

### 4. Booking

A **booking** is a *confirmed* inquiry. Once you confirm, a booking row is created, a PDF is generated, a confirmation email is sent, and those dates are blocked on the public calendar.

**Critical guarantee:** The database physically prevents two overlapping bookings. Even if something went wrong in the app, you can never double-book.

---

## The Inbox

At **/admin/retreats**, the inbox is the top of your day. What you see:

- **Stat cards at top:** New / On Hold / Upcoming Bookings / Active Blackouts
- **Calendar preview:** month view with colored dots showing what's happening when
- **Upcoming Blackouts:** the next 5 blackouts coming up
- **Inbox table:** all inquiries, filterable by status and type (Host / Buyout)

### Filter + search

At the top of the inbox table:
- **Status tabs:** All / New / Reviewing / Hold / Confirmed / Declined
- **Type filter:** All / Host / Buyout
- **Search:** find by name, email, or organization

---

## Triaging an inquiry

Click any row in the inbox to open the inquiry detail. You'll see several tabs on the page: **Contact, Request, Dates, Triage, Communications**.

### Tabs explained

**Contact** — name, email, phone (if given), organization. Copy-to-clipboard buttons next to email and phone for fast reply.

**Request** — the prospect's concept for the retreat (or stay), audience type, group size, support needs, and any additional notes they wrote.

**Dates** — the requested dates. Shows you any **conflicts** — overlapping holds, bookings, or blackouts. If there are conflicts, you can't confirm this inquiry until you resolve them (release the other hold, pick different dates, etc.).

**Triage** — where you set:
- **Status** (change it as the inquiry moves through the pipeline)
- **Priority** (1–5 stars, host inquiries only — your judgement on fit)
- **Assigned owner** (for host inquiries, which admin is driving the conversation)
- **Admin notes** (internal scratchpad, never shown to the prospect)

**Communications** — every email the system has sent (acknowledgment, hold notice, confirmation, decline) and any manual notes you've logged. You can compose a manual email here that will be sent through Resend and logged automatically.

### Action bar at the bottom

The sticky bar at the bottom of the page shows context-appropriate actions:

- **New / Reviewing:** Place Hold, Confirm Booking, Decline
- **Hold:** Confirm Booking, Release Hold, Decline
- **Confirmed:** Cancel Booking
- **Declined:** Reopen

---

## Placing a hold

A **hold** is a soft 7-day reservation while you finalize details with a prospect.

1. Open the inquiry
2. Click **Place Hold** in the action bar
3. The system automatically:
   - Sets the status to Hold
   - Sets `hold_expires_at` to 7 days from now
   - Sends the prospect a "soft hold placed on your dates" email
   - Blocks those dates from being confirmed by anyone else
   - Greys out those dates on the public calendar (so no other prospect submits on them)

### Holds auto-expire

If you don't confirm (or extend) within 7 days, the hold automatically reverts to **Reviewing** at 7am UTC the next day. The prospect is not emailed about the expiry — you can follow up manually if you want.

### Releasing a hold early

If you decide not to move forward, open the inquiry and click **Release Hold**. Status reverts to Reviewing, dates unblock, no email sent.

---

## Confirming a booking

When a prospect is ready to commit:

1. Open the inquiry
2. Click **Confirm Booking**
3. A dialog asks you to confirm the final dates, group size, and any notes. Start/end dates default to what was requested; adjust if needed.
4. Click **Confirm & send email**

The system then:
- Checks for any conflicts (bookings, holds, blackouts) one last time — hard-blocks if any exist
- Creates a booking row in the database
- Generates a PDF summary
- Uploads the PDF to secure storage
- Sends the prospect a confirmation email with a 30-day signed link to the PDF
- Blocks those dates on the public calendar
- Logs the communication
- Updates the calendar color to green

### Minimum stay + lead time

Built into the system:
- **3-night minimum** on all bookings (enforced in the database)
- **Lead time**: host retreats 14 days out, buyouts 7 days out (enforced on the public calendar)

You as admin can override lead time if you want to confirm something last-minute — the 3-night minimum is the only hard constraint.

### Canceling a booking

If something falls through after confirmation, open the inquiry and click **Cancel Booking**. The booking row is deleted, those dates reopen, and the inquiry goes back to Reviewing. No automatic refund email — you'd handle that conversation manually.

---

## Declining an inquiry

Sometimes you'll pass on a request. In the action bar, click **Decline**, write the message to send, and click Send.

The system:
- Sends the decline email to the prospect
- Moves the status to Declined
- Logs the communication

Declined inquiries can always be reopened from the detail view if something changes.

---

## Managing blackouts

Blackouts are how you block dates from public availability without creating a fake inquiry.

### Adding a blackout

1. From the Retreats dashboard, click **Blackouts** (top right)
2. Click **+ New Blackout**
3. Fill in:
   - **Start date** and **End date**
   - **Category**: Internal event / Member buyout (CGRC) / Other
   - **Label**: something short that'll show in the admin calendar (e.g. "Johnson family buyout")
   - **Admin notes**: freeform, never shown publicly
4. Save

The dates are immediately blocked on the public calendar. Prospects will see them as unavailable but won't see why.

### Editing or deleting a blackout

From the Blackouts list, click any blackout to edit. The Delete button is at the bottom-left of the edit form.

### When to use each category

- **Internal event** — camp-run programming you're hosting directly
- **Member buyout** — CGRC members using their priority access
- **Other** — maintenance days, family use, weather buffers, anything else

Category is for your records; prospects only see the dates as unavailable.

---

## Managing seasons

You rarely touch seasons — typically once or twice a year.

### Adding a season

1. From the Retreats dashboard, click **Seasons** (top right)
2. Click **+ New Season**
3. Set:
   - **Label** — e.g. "Main Summer 2027"
   - **Start date** / **End date**
   - **Active** — toggle on to make dates within it available to prospects
4. Save

Dates *outside* any active season are greyed out on the public calendar and can't be requested.

### Turning a season on/off

Instead of deleting, untoggle **Active**. This lets you pause a season (e.g. you don't want to book anything new while you review operations) without losing the record.

### Multiple seasons

You can run several at once — e.g. "Main Summer 2026" and "Winter Pilot 2026–27" can both be active simultaneously.

---

## Reading the calendar

Click **Full Calendar** or view the calendar preview on the Retreats dashboard. Each day cell shows dots:

- **Green dot** = Confirmed booking
- **Orange dot** = Hold
- **Grey dot** = Blackout
- **No dot, pale background** = Outside any active season (unavailable to prospects)
- **No dot, normal background** = Available

Click any day that has a hold or confirmed booking to jump to that inquiry's detail page.

Use **Prev / Today / Next** to navigate between months. The calendar shows up to 6 months at a time on the full view.

---

# Experiences

The "Experiences" section of the public site lists camping trips, day hikes, and retreat offerings. You control everything from **/admin/experiences**.

## Creating an experience

1. Click **+ New Experience**
2. Fill in the tabs: Basics, Pricing, Content, Images, Itinerary, Logistics, Details, Social Proof
3. **Status** controls visibility:
   - **Draft** = not shown on public site
   - **Active** = live
   - **Sold-out** = shown with a "sold out" badge and a "notify me" form

Save as you go — the editor autosaves is not enabled, so remember to click Save.

## Editing an experience

Click any experience in the list to edit. Same tabbed editor. Use the "View on site" link (appears when status is not Draft) to see the published version.

## Images

In the Images tab you can:
- Upload new images (drag-and-drop or click)
- Browse images previously uploaded to storage
- Drag to reorder the gallery

---

# Site Content

The **Content** section lets you edit copy on the public homepage, navigation, hero, mission, story, footer, and waitlist section — no code changes needed.

Each editable section is grouped. Find the field you want to change, edit the value, and click Save. Changes are live within seconds.

## What's editable

Currently: Nav links, Hero copy, Mission copy, Story copy, Trips intro, Footer (including the contact email), Waitlist section copy.

If you need to change something not in this list, ask Kyle — it can probably be added.

---

# Team / Users

Manage who has admin access at **/admin/users**.

## Inviting a new admin

1. Click **Invite New Admin**
2. Enter their email
3. Supabase sends an invite email with a setup link
4. They click the link, set a password, and land in the admin

Until they accept the invite, their status shows as "Invite Pending." Once they sign in, it switches to "Active."

## Removing admin access

Use the actions menu on their row. Removes their ability to log in immediately.

---

# Waitlist

General-interest signups from the public site appear at **/admin/waitlist**. You can:

- Search by name or email
- Filter by trip interest
- Delete entries
- **Export to CSV** for email campaigns or record-keeping

---

# What prospects see (public site)

Helpful to understand so you know what experience people are getting on the other side of your admin work.

## Two public booking pages

- **/host-a-retreat** — for people running events/retreats
- **/stay-at-camp** — for people wanting a private whole-camp buyout

Each has a hero, brief info about what's included, and an **availability calendar** + inquiry form below.

## The availability calendar

Prospects see:
- Dates available for selection (in light background, pickable)
- Dates unavailable (grey, strikethrough) — covers anything: confirmed bookings, active holds, blackouts, outside-season
- Their current selection (amber-filled pills)

When they pick a date range, the form below shows a summary: **"May 6 – May 13, 2026 · 7 nights"**.

If they pick fewer than 3 nights, the legend prompts them to extend. If they pick past a blocked day, the selection silently clamps to the valid range before the block.

## Emails prospects get automatically

On the various triggers in the admin, these emails go out automatically:

| Trigger | Email to prospect |
|---------|-------------------|
| Inquiry submitted | "Thanks — we'll respond within 48 hours" |
| You place a hold | "We've placed a soft hold on your dates" |
| You confirm | "Your dates are confirmed" + PDF link |
| You decline | "We can't accommodate this — [your message]" |
| Hold expires | (nothing — silent) |

All emails come from **retreats@monroemaine.com** and prospects can reply directly to them.

---

# Common questions

## "I don't see a new inquiry in the inbox"

- Check the status filter at the top — you might be filtered to "Confirmed" or "Declined"
- Check the Host/Buyout filter — you might be filtered to the wrong type
- Hard-refresh (⌘⇧R on Mac, Ctrl+F5 on Windows) — the inbox is server-rendered on each load, but browser cache occasionally holds

## "The calendar shows a date as unavailable but I don't know why"

Open the Full Calendar view. Click the day — if it's a hold or confirmed booking, you'll jump to that inquiry. If it's a blackout or outside-season, the Dashboard's "Upcoming Blackouts" section or the Seasons list will tell you.

## "I confirmed a booking and nothing happened"

- Check the inquiry's Communications tab — the confirmation email should be logged. If not, something's wrong with Resend; contact Kyle.
- Check Supabase directly (Kyle has access) to see if the booking row was created.
- If the button gave you a "conflicts exist" error, you need to resolve the overlap first (usually by releasing a hold that's blocking).

## "A prospect says they never got the confirmation email"

- Check their spam folder first
- In the inquiry's Communications tab, verify the email was sent (you'll see the kind "confirm_email" and a Resend message ID). If the entry is there, the email was delivered to Resend.
- Check the Resend dashboard (ask Kyle) for bounce/spam reports

## "I need to reissue a confirmation PDF"

Not a button yet. For now: Cancel the booking, then Confirm again. That regenerates the PDF and sends a fresh email. Ping Kyle if you need this often — we can add a dedicated "resend confirmation" action.

## "A member needs the whole camp for a weekend on short notice"

Add a Blackout with category **Member buyout**. You can add it even on dates that are currently in the past-7-days lead window — prospects can't book those dates anyway. If there's already a confirmed booking on those dates, you'll need to talk to the prospect first; you can't just blackout over a confirmed booking.

---

# Getting help

- **Something looks broken**: slack/text Kyle with a screenshot and the URL
- **You need a new feature**: add it to the conversation — these get tracked in the vault roadmap
- **You locked yourself out**: someone else with admin access can invite you back in at **/admin/users**

---

*Last updated: 2026-04-16. If something in this guide is wrong or outdated, edit `docs/ADMIN-GUIDE.md` in the repo or ask Kyle.*
