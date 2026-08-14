# Stitch export → React mapping

Source: Google Stitch export "BeautyFlow — Premium Salon Dashboard"
(design system: `haute_modern_professional/DESIGN.md`).

| Stitch screen                | React route                  | Component                                          |
| ----------------------------- | ----------------------------- | --------------------------------------------------- |
| `beautyflow_dashboard`        | `/dashboard`                  | `src/screens/Dashboard.jsx`                          |
| `beautyflow_leads`            | `/leads`                      | `src/screens/Leads.jsx`                              |
| `beautyflow_conversations`    | `/conversations`              | `src/screens/Conversations.jsx`                      |
| `beautyflow_opportunities`    | `/opportunities`              | `src/screens/Opportunities.jsx`                      |
| `set_up_your_salon` (step 1)  | `/onboarding/salon-info`      | `src/screens/onboarding/StepSalonInfo.jsx`           |
| `onboarding_step_5_connected` | `/onboarding/connect`         | `src/screens/onboarding/StepConnectChannels.jsx`     |
| `onboarding_complete`         | `/onboarding/complete`        | `src/screens/onboarding/OnboardingComplete.jsx`      |

The exported onboarding flow only included step 1 (Salon Information) and
step 5 (Connect Your Channels) of its 5-step progress bar, plus the final
success screen. Steps 2–4 (Services, Opening Hours, Notifications) were not
included in the export — they're implemented here using the same design
tokens and card/list patterns as the surrounding steps so the 5-step flow is
fully navigable:

- `/onboarding/services` — `StepServices.jsx`
- `/onboarding/hours` — `StepHours.jsx`
- `/onboarding/notifications` — `StepNotifications.jsx`

The bottom nav / side nav "More" tab (present in every exported screen's
nav bar, but with no corresponding screen in the export) links to a minimal
placeholder screen (`src/screens/More.jsx`) so the nav has no dead links.

Design tokens (colors, type scale, spacing, radius) were copied verbatim
from the export's Tailwind config into `src/index.css` as Tailwind v4
`@theme` variables, so utility classes like `bg-primary-container` or
`text-headline-lg` match the export exactly.
