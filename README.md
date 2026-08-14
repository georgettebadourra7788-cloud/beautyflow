# BeautyFlow

BeautyFlow by Isabelle Labs helps beauty salons recover missed customer
inquiries and turn them into bookings.

This app is a frontend port of the Google Stitch design export
("Haute-Modern Professional") into a real, navigable React application. The
visual design (colors, typography, spacing, shadows) is preserved exactly as
exported — see `STITCH_SOURCE.md` for where each screen and design token
came from.

## Screens

- **Log In / Sign Up** — email + password auth.
- **Onboarding** — Sign up → Create salon → Add services → Set business
  info → Dashboard. (The original Stitch "Opening Hours", "Notifications",
  and "Connect Channels" steps still exist and are reachable, but aren't
  part of the mandatory first-run sequence — see `STITCH_SOURCE.md`.)
- **Dashboard** — KPIs and today's follow-ups, computed from your leads.
- **Leads** — filterable, database-backed list of incoming leads; add leads manually.
- **Conversations** — a list of leads with threads, each with a message
  composer and an editable AI-style suggested follow-up.
- **Opportunities** — recoverable revenue and top opportunities, computed
  from your leads.

Every list shows a realistic empty state ("No leads yet…") for a brand-new
salon instead of placeholder data.

## Tech stack

- React 19 + Vite
- Tailwind CSS v4 (CSS-first `@theme` config, tokens ported from the Stitch
  `DESIGN.md`)
- React Router for navigation and protected routes
- Supabase (Auth + Postgres with Row Level Security) for accounts and data
- Google Fonts (self-hosted via npm): Playfair Display (headings), Inter
  (UI/body), Material Symbols Outlined (icons)

Payments, AI automation, and Instagram/WhatsApp integration are not wired up
yet — `leads.source` and `conversations.channel` already model those
channels in the schema, ready for a later stage to populate them for real.

## Setting up Supabase (required — manual, one-time)

The app will run without this, but every screen behind login will be stuck
loading/disabled until it's done.

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, go to **SQL Editor → New query**, paste the
   contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it.
   This creates all 6 tables (`profiles`, `salons`, `salon_services`,
   `leads`, `conversations`, `follow_ups`), a trigger that creates a
   `profiles` row on signup, and Row Level Security policies scoping every
   table to salons owned by the logged-in user.
3. Go to **Project Settings → API** and copy the **Project URL** and the
   **anon public** key.
4. Copy `.env.example` to `.env.local` and fill in both values:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Restart `npm run dev`. The "Supabase isn't configured yet" banner on the
   Log In / Sign Up screens disappears once these are set.

By default, new Supabase projects require email confirmation before a
session is created. Sign Up handles both cases: if email confirmation is
on, you'll see a "check your email" screen; if it's off (or once you
confirm), you're taken straight into onboarding. To skip email confirmation
during development, turn it off in **Authentication → Providers → Email**.

The anon key is safe to expose in frontend code — it only grants what Row
Level Security allows. The **service role key** is never used or referenced
anywhere in this app; do not add it to frontend code or commit it.

## Running it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
npm run preview
```

`npm run build` outputs a static site in `dist/`, deployable to any static
host. Remember to set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as
environment variables in your host's dashboard.
