# Tooth Fairy Pediatric Dentistry — sample website

Sample site for Dr. Anusha Killedar's pediatric dental clinic in Pune. Built with Next.js 15, Tailwind CSS 4 and Framer Motion.

## Pages

| Page | What it shows |
| --- | --- |
| `/` | Public site: animated hero, treatments, first visit, doctor, parent app, FAQ, contact |
| `/book` | Four-step appointment booking (child, reason, date and time, parent details) |
| `/login` | Parent and clinic sign in, with "Continue with Google" and the animated tooth |
| `/portal` | Parent app: switch between children, today's doses with "Mark as given", weekly view, next visit, aftercare |
| `/dashboard` | Doctor dashboard: all patients, doses given in the last 7 days, missed-dose alerts, today's visits, booking requests, patient detail with "Add medicine" |

This is a **front-end demo**. Logins accept anything, and data is invented. Doses marked in the parent app and bookings made on `/book` are saved in the browser, so they show up in the dashboard when opened in the same browser. A good way to demo it: tick off Aarav's doses in `/portal`, then open `/dashboard` and his percentage goes up. Book a visit on `/book` and it appears under "Booking requests".

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy to Vercel

Option A, from the command line:

```bash
npm install
npx vercel         # log in, accept the defaults
npx vercel --prod  # production URL to share
```

Option B, through GitHub: push this folder to a new GitHub repository, then on vercel.com choose **Add New → Project → Import** and select the repo. No settings need changing.

## Replace before going live

All in `lib/data.ts` unless noted:

- Address, phone number and email (`CLINIC`), marked `PLACEHOLDER`
- The doctor's credentials line, confirm exact wording with Dr. Anusha
- The doctor's photo (the "AK" block in `app/page.tsx`, doctor section)
- Clinic hours

## Next phase (after approval)

1. Supabase project: Google sign-in for parents, email sign-in for the clinic
2. Tables: `parents`, `children`, `prescriptions`, `dose_logs`, `appointments`, with row-level security so each parent sees only their own children
3. Real booking slots and confirmation
4. Reminders (WhatsApp or push), when the clinic decides
5. Privacy notice and parental consent flow under India's DPDP Act

## Brand files

`brand/` holds the approved logo: a tooth formed by two butterfly wings, with a sparkle between the roots.

| File | Use |
| --- | --- |
| `tooth-fairy-logo.svg` / `.png` | Main logo for white or light backgrounds |
| `tooth-fairy-logo-on-dark.svg` / `.png` | On a deep plum background |
| `tooth-fairy-logo-white.svg` / `.png` | All-white, for photos and coloured backgrounds |
| `tooth-fairy-mark.svg` / `.png` | Symbol only (social media profile, stamp) |
| `tooth-fairy-mark-white.svg` / `.png` | White symbol only |
| `tooth-fairy-app-icon.svg` / `.png` | Rounded square icon (WhatsApp Business, app icon) |

SVG files are vectors with the lettering converted to outlines, so they print sharp at any size and don't need the fonts installed. Send these to printers and signboard makers.

Colours: lavender `#8B6CCF`, deep lavender `#6A4BB8`, plum `#2E2445`, white. Fonts: Fraunces (logo and headings) and Figtree (text and the "Pediatric Dentistry" line), both free from Google Fonts.
