# Camp Monroe

Marketing and booking website for Camp Monroe, built with Next.js 15 and Supabase.

**Live site:** [www.monroemaine.com](https://www.monroemaine.com)
**Admin dashboard:** [www.monroemaine.com/admin](https://www.monroemaine.com/admin)

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database & Auth:** Supabase (Postgres + Auth)
- **Storage:** Supabase Storage
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — found in Supabase Dashboard → Project Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — found in Supabase Dashboard → Project Settings → API (the long JWT, **never expose this client-side**)
- `NEXT_PUBLIC_SITE_URL` — set to your production domain in Vercel (e.g. `https://www.monroemaine.com`)

### 3. Run the dev server

```bash
npm run dev -- --port 3001
```

Open [http://localhost:3001](http://localhost:3001) to view the public site.
Open [http://localhost:3001/admin](http://localhost:3001/admin) to access the admin dashboard.

---

## Admin Dashboard

Located at `/admin`. Requires an authenticated admin account.

**Team onboarding guide:** [`docs/ADMIN-GUIDE.md`](docs/ADMIN-GUIDE.md) — a task-oriented walkthrough of every admin section (retreats triage, seasons, blackouts, experiences, content, users, waitlist) for non-technical team members.

### Logging In

Navigate to `/admin/login` and sign in with your admin email and password.

### Sections

#### Experiences
Manage camp trip listings shown on the public site.

- **Create / edit** trips — title, slug, description, price, dates, tags, status
- **Images** — upload hero images and gallery photos to Supabase Storage; drag to reorder
- **Itinerary** — add day-by-day schedule entries
- **Included / Excluded** — bullet lists of what's covered
- **Details** — structured trip info (group size, skill level, etc.)
- **Testimonials & FAQs** — manage social proof and common questions
- **Status** — `draft` (hidden from public), `active`, or `sold-out`
- **Sold-out notify-me** — when a trip is sold-out, visitors can submit their email to be notified

#### Retreats
Pre-launch booking pipeline for host retreats and short-term stays (R-001).

- **Inbox** — tabbed inquiry queue (New / Reviewing / Hold / Confirmed / Declined), host/STR filter, search
- **Inquiry detail** — tabbed editor (Contact / Request / Dates / Triage / Communications) with conflict detection across preferred date ranges and sticky action bar
- **Place Hold** — 7-day soft hold; auto-sends hold-notice email; `expire-holds` edge function returns expired holds to `reviewing` daily
- **Confirm Booking** — creates `bookings` row, renders a PDF summary (uploaded to `booking-pdfs` Storage bucket), sends confirmation email with 30-day signed URL, blocks public calendar
- **Calendar** — month-grid view of open windows (amber), holds (orange), confirmed (green) with navigation
- **Open Windows editor** — admin-curated date blocks surfaced on the two public pages (`/host-a-retreat`, `/stay-at-camp`)
- **Communications log** — every email or manual note is recorded against the inquiry

Requires env vars: `RESEND_API_KEY`, `RESEND_FROM_ADDRESS`, `ADMIN_ALERT_RECIPIENTS`. See `.env.example`.

#### Waitlist
View and manage visitors who have joined the general interest waitlist.

- Search by name or email
- Filter by trip interest
- Remove entries

#### Content
Edit copy and images for public-facing site sections without touching code.

Editable sections: **Nav**, **Hero**, **Mission**, **Story**, **Footer**, **Waitlist**

Each section supports text fields and image fields (upload or browse from Storage).

#### Users
Manage admin accounts.

- View all admins and their status (Active / Invite Pending)
- **Invite new admin** — enter an email address; Supabase sends an invite email with a setup link
- Invited users click the link, land on `/admin/update-password`, set their password, and are redirected to the dashboard

---

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── (auth)/          # Login, update-password (centered layout)
│   │   └── (dashboard)/     # All protected admin pages
│   ├── experiences/[slug]/  # Public trip detail pages
│   └── page.tsx             # Public home page
├── components/
│   ├── admin/               # Admin UI components
│   └── ...                  # Public site components
└── lib/
    ├── data/                # Supabase data-fetching functions
    ├── supabase-*.ts        # Supabase client helpers
    └── types.ts             # Shared TypeScript types
```

---

## Deployment

The site deploys automatically to Vercel on every push to `main`.

### Required Vercel Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_SITE_URL` | Production URL — `https://www.monroemaine.com` |

Set these under **Vercel → Project → Settings → Environment Variables**, then redeploy.
