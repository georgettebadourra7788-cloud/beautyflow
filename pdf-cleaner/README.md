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
