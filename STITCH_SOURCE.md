# Stitch export → React mapping

Source: Google Stitch export "BeautyFlow — Premium Salon Dashboard"
(design system: `haute_modern_professional/DESIGN.md`).

| Stitch screen                | React route                  | Component                                          |
| ----------------------------- | ----------------------------- | --------------------------------------------------- |
| `beautyflow_dashboard`        | `/dashboard`                  | `src/screens/Dashboard.jsx`                          |
| `beautyflow_leads`            | `/leads`                      | `src/screens/Leads.jsx`                              |
| `beautyflow_conversations`    | `/conversations/:leadId`      | `src/screens/Conversations.jsx`                      |
| `beautyflow_opportunities`    | `/opportunities`              | `src/screens/Opportunities.jsx`                      |
| `set_up_your_salon` (step 1)  | `/onboarding/salon-info`      | `src/screens/onboarding/StepSalonInfo.jsx`           |
| `onboarding_step_5_connected` | `/onboarding/connect`         | `src/screens/onboarding/StepConnectChannels.jsx`     |
| `onboarding_complete`         | `/onboarding/complete`        | `src/screens/onboarding/OnboardingComplete.jsx`      |

The exported onboarding flow only included step 1 (Salon Information) and
step 5 (Connect Your Channels) of its 5-step progress bar, plus the final
success screen. Steps 2–4 (Services, Opening Hours, Notifications) were not
included in the export — they were originally filled in using the same
design tokens and card/list patterns as the surrounding steps:

- `/onboarding/services` — `StepServices.jsx`
- `/onboarding/hours` — `StepHours.jsx`
- `/onboarding/notifications` — `StepNotifications.jsx`

**Since the Supabase stage**, the mandatory first-run sequence is
Sign Up → Create salon → Add services → Set business info → Dashboard,
matching the `salons`/`salon_services` schema:

- `/onboarding/salon-info` (step 1 of 3) — creates the `salons` row
- `/onboarding/services` (step 2 of 3) — creates `salon_services` rows
- `/onboarding/business-info` (step 3 of 3, new — `StepBusinessInfo.jsx`) —
  sets `salons.address`/`phone`; replaces "Opening Hours" in the mandatory
  chain since the schema doesn't model business hours

`StepHours.jsx`, `StepNotifications.jsx`, and `StepConnectChannels.jsx`
are unchanged and still reachable at their original routes — they just
aren't part of the mandatory chain anymore (Connect Channels covers
Instagram/WhatsApp, which is explicitly a later stage; Hours/Notifications
have no backing table yet).

Two screens exist only in the app, not the Stitch export, because the
schema/nav require them and no export screen covers them:

- `src/screens/ConversationsList.jsx` (`/conversations`) — the export's
  "Conversations" screen was a single hardcoded thread with no way to pick
  a lead; this picks one, reusing the Leads card style.
- The bottom nav / side nav "More" tab links to a minimal placeholder
  screen (`src/screens/More.jsx`) so the nav has no dead links (now also
  hosts Log Out).

Design tokens (colors, type scale, spacing, radius) were copied verbatim
from the export's Tailwind config into `src/index.css` as Tailwind v4
`@theme` variables, so utility classes like `bg-primary-container` or
`text-headline-lg` match the export exactly.
