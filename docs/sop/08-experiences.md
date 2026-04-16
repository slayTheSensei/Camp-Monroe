---
title: Managing Experiences
summary: Create, edit, publish, and unpublish public experience listings — day trips, camping, retreats.
category: SOPs
order: 8
---

"Experiences" are the public-facing listings shown on **monroemaine.com** for day trips, camping trips, and smaller-group retreats (separate from the whole-camp Retreats module). You control them entirely from `/admin/experiences`.

## Viewing the list

The admin Experiences page shows every experience with its status:

- **Draft** — not visible on the public site
- **Active** — live
- **Sold out** — shown with a "sold out" badge + a "notify me" form

Click any experience to edit, or click **+ New Experience** to create one.

## Creating or editing

The editor has 8 tabs — work through them top-to-bottom, saving as you go. The editor does **not autosave** — always click Save before leaving.

### Basics
Title, slug (URL fragment), type, subtitle, location, dates text, duration.

### Pricing
Price, optional deposit, whether the price includes meals/lodging/etc.

### Content
Short description (shown on cards), long description (shown on the detail page), pull-quote (optional).

### Images
- Drag-and-drop or click to upload images
- Browse images already in storage (useful for reusing hero photos across experiences)
- Drag images to reorder — first image is the hero

### Itinerary
Day-by-day schedule. Add items, drag to reorder.

### Logistics
"What's included" and "What's not included" lists.

### Details
Structured fields — group size cap, skill level, season, anything else relevant.

### Social Proof
Testimonials and FAQs. Both are optional.

## Status transitions

- **Draft → Active**: once you've got basics, content, and at least one image, change status and save.
- **Active → Sold out**: when a trip fills. Visitors can still see it but instead of "book now" they see a "notify me" email form (signups go into the Waitlist).
- **Sold out → Active**: if spots open back up.
- **Active/Sold out → Draft**: hides from the public site without deleting. Useful when you're between seasons and don't want old listings showing.

## Viewing on the public site

When an experience is active (or sold-out), a **"View on site ↗"** link appears in the save bar. Opens the live URL in a new tab.

## Images — practical notes

- Upload at least 1200px wide for hero images. The public site crops but doesn't upscale.
- File size matters — images are served through Supabase Storage, so smaller files = faster public page loads.
- JPG is fine for photos; PNG for anything with transparency (logos, illustrations).
