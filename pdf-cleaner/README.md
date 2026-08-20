# PDF Cleaner

A standalone app: drop a text-based PDF or article, get back clean, readable
text — no repeated headers/footers, no page numbers, no broken mid-word line
wraps.

Drop PDF → Clean → Preview → Copy / Download.

Everything runs client-side in the browser (PDF parsing via `pdf.js`); no
backend, no upload, no server costs.

## What it cleans

- Repeated headers and footers
- Page numbers
- Hard-wrapped line breaks within paragraphs
- Words split across lines with a hyphen (e.g. `exam-` / `ple` → `example`)
- Unnecessary whitespace
- Obviously duplicated titles

It does not touch PDF metadata, compress files, or remove blank pages —
this is purely a text-extraction cleaner, not a general PDF utility.

**No PDF you drop ever leaves your browser.** Extraction and cleaning run
entirely client-side (via `pdf.js`); nothing is uploaded anywhere, to
Firebase or otherwise.

## Firebase (optional, for future features)

Firebase is wired up but **not required** to run the app today — the PDF
cleaning flow works fully offline. It's prepared for later, not-yet-built
features:

- Firebase Authentication — user accounts
- Cloud Firestore — payment/entitlement and lifetime-purchase status

There is no Cloud Storage usage and no Cloud Functions — nothing backend
beyond Auth and Firestore, and neither is used by any screen yet.

To set it up (optional):

1. Create a project at [the Firebase console](https://console.firebase.google.com).
2. Add a Web app to the project (Project Settings -> General -> Your apps),
   and copy the config values it gives you.
3. Copy `.env.example` to `.env.local` and fill in the `VITE_FIREBASE_*`
   values.
4. Restart `npm run dev`.

Firebase config values (API key, project ID, etc.) are safe to expose in
frontend code the same way a Firebase web app config always is — access is
enforced by Firestore/Auth security rules, not by keeping these secret.

### Deploying to Firebase Hosting

This repo includes a minimal `firebase.json` (serves `dist/` as a static
SPA) and a placeholder `.firebaserc` — replace `your-firebase-project-id`
with your real project ID before deploying:

```bash
npm run build
npx firebase-tools deploy --only hosting
```

Any other static host (Vercel, Netlify, GitHub Pages, ...) works just as
well; Firebase Hosting isn't required.

## Running it locally

```bash
cd pdf-cleaner
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
```

Outputs a static site in `dist/`, deployable to any static host (e.g.
Vercel, Netlify, GitHub Pages) — no environment variables or server needed.
