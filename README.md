# BeautyFlow

BeautyFlow by Isabelle Labs helps beauty salons recover missed customer
inquiries and turn them into bookings.

This app is a frontend port of the Google Stitch design export
("Haute-Modern Professional") into a real, navigable React application. The
visual design (colors, typography, spacing, shadows) is preserved exactly as
exported — see `STITCH_SOURCE.md` for where each screen and design token
came from.

## Screens

- **Onboarding** — 5-step salon setup wizard (Salon Info, Services, Hours,
  Notifications, Connect Channels) ending in a completion screen.
- **Dashboard** — KPIs and today's follow-ups.
- **Leads** — filterable list of incoming leads.
- **Conversations** — a lead's message thread with an AI-suggested follow-up.
- **Opportunities** — recoverable revenue and top opportunities.

## Tech stack

- React 19 + Vite
- Tailwind CSS v4 (CSS-first `@theme` config, tokens ported from the Stitch
  `DESIGN.md`)
- React Router for navigation between screens
- Google Fonts: Playfair Display (headings), Inter (UI/body), Material
  Symbols Outlined (icons)

No backend, authentication, payments, or third-party integrations
(Instagram/WhatsApp) are wired up yet — all data on screen is static mock
data matching the original Stitch mockups.

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
host.
