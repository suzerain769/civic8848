# CivicConnect — One-Stop Citizen Service & Complaint Platform

**CivicConnect is a student project prototype and is not an official government service.**

A Class 12 frontend project built with HTML5, CSS3 and vanilla JavaScript only — no frameworks,
no build step, no backend, no API keys.

## How to run

Open `index.html` directly in any modern browser. Nothing to install, no local server required.
(Font Awesome and Google Fonts load from a CDN; without internet the site still works, icons and
the custom font simply fall back.)

## Folder structure

```
civicconnect/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   └── icons/
└── README.md
```

The hero illustration is an inline SVG inside `index.html`, so `assets/images` and `assets/icons`
are kept as empty placeholders for any images a user wants to add later.

## Features

- Single page with sections `#home`, `#services`, `#complaints`, `#track-status`,
  `#announcements`, `#about`, `#contact`, plus `#quick-actions`, `#impact`, `#how-it-works`, `#faq`.
- Sticky, accessible navbar with a keyboard-operable hamburger menu (Escape / outside click /
  link click all close it) and `IntersectionObserver`-driven `aria-current` on the active link.
- 8 service cards; **Report Issue** scrolls to the complaint form, pre-selects the mapped
  category, highlights it with confirmation microcopy and moves focus to the Location field.
  **Learn More** opens the shared modal with real information about that category.
- Complaint form with on-submit and on-blur validation, inline errors associated via
  `aria-describedby`, focus moved to the first invalid field, and no data loss on failure.
- Complaint IDs in the format `CC-2026-#####`, checked for collisions against demo records and
  everything already in LocalStorage.
- Image upload is demo-only: type and 5 MB size checks, filename + thumbnail preview, remove /
  replace. **Only the filename is persisted** — never a base64 blob.
- Tracking with initial / loading / success / not-found / reset states, a status timeline
  (Submitted → Under Review → In Progress → Resolved) and the three demo IDs
  `CC-2026-10001`, `CC-2026-10002`, `CC-2026-10003`, all labelled "DEMO DATA".
- Announcements with All / Infrastructure / Utilities / Community filters (`aria-pressed`), a
  zero-result message, and a details modal.
- Counters animated once via `IntersectionObserver`; instant final values under
  `prefers-reduced-motion`.
- Accessible FAQ accordion, contact form with inline + toast success, and a reusable toast
  system (success / error / warning / information). `alert()`, `confirm()` and `prompt()` are
  never used.

## Intentional design choices

- **FAQ single-open behaviour**: opening one FAQ item closes any other open item. This is applied
  uniformly to all six items so the section length stays predictable on mobile.
- **Status is never colour-only**: every status shows an icon *and* a text label *and* a colour.
- **Map area**: no Google Maps API is used. The map is a styled "coverage area" graphic plus a
  real `<button>` ("Location details") that scrolls to the contact section. It does not pretend to
  be an interactive map.
- **Social links**: all four icons are real `<button>` elements that show a toast explaining that
  social integration is a demo placeholder. No dead `href="#"` anywhere in the project.
- **Anonymous complaints** are not supported in this prototype (see FAQ).

## Privacy

Everything happens in your browser. Submitted demo complaints are stored locally under the
LocalStorage key `civicconnect_complaints` as a JSON array and are **not transmitted anywhere**.
Missing, empty or corrupted storage is handled gracefully; if LocalStorage is unavailable the app
shows a clear message instead of failing. No real government API is called and no claim of
government-grade storage or real complaint processing is made.

## Known limitations

- Complaint statuses never change on their own — new complaints stay "Pending" because there is
  no backend or authority workflow.
- Uploaded images exist only for the current page session (object URL preview); they are gone
  after a reload since binaries are deliberately not stored.
- The contact form and social buttons simulate success; no message is actually sent.
- Demo contact details (`+977-000-0000000`, `hello@civicconnect.demo`) are placeholders wired to
  working `tel:` / `mailto:` links but they do not reach a real office.
