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

`brand/` has the logo (a tooth with fairy wings and sparkles) as SVG and PNG: the mark on its own, the horizontal lockup, and a version for dark backgrounds. Colours: lavender `#8B6CCF`, deep lavender `#6A4BB8`, wing lavender `#DDD0F6`, plum ink `#2E2445`, white. Fonts: Young Serif (headings) and Figtree (text), both free.
