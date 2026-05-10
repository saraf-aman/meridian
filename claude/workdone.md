# Meridian — Work Done & Next Steps

Last updated: 2026-05-07 (all work committed and live on GitHub Pages)

This file is the single source of truth for any new chat picking up this project.
Read this file, then read `website_plan.md` for the full architecture spec, then proceed with the next step listed at the bottom of this file.

---

## What This Project Is

A personal health planning website called **Meridian**. Pure HTML/CSS/JS — no build tool, no framework. Covers 10 health modules: Workout, Nutrition, Hydration, Sleep, Habits, Supplements, Cardio, Back Management, Picky Eating, Progress.

Currently only the **Workout** module has content. All other modules are stubs (not yet built).

---

## Current File Structure

```
meridian/
├── index.html                        ✅ Homepage (complete)
├── manifest.json                     ✅ PWA manifest (start_url fixed to "./")
├── sw.js                             ✅ Service worker — network-first HTML/CSS/JS; c.navigate() removed (iOS Safari fix)
├── bust.py                           ✅ Cache-buster — appends ?v=<md5> to CSS/JS refs in all HTML
├── css/
│   ├── base.css                      ✅ Design tokens + reset
│   ├── layout.css                    ✅ Nav, workout-header, phase-bar, page shell, footer; auth chip styles
│   ├── components.css                ✅ All workout UI components
│   ├── home.css                      ✅ Homepage-specific styles
│   └── calendar.css                  ✅ Gym calendar page + entry card styles
├── js/
│   ├── app.js                        ✅ Detects current page, injects nav + footer; calendar page detection
│   ├── nav.js                        ✅ injectNav(activePage, basePath); #nav-auth slot; Calendar nav link
│   ├── footer.js                     ✅ injectFooter()
│   ├── firebase-config.js            ✅ Firebase init; exports db (Firestore) + auth; persistentLocalCache w/ fallback
│   ├── auth.js                       ✅ Google Sign-In; onAuthStateChanged; window.meridianAuth; updates nav chip
│   ├── calendar.js                   ✅ Gym calendar UI + Firestore sync (optimistic toggle, streak, monthly stats)
│   ├── workout.js                    ✅ Full workout interactivity
│   ├── workout-data.js               ✅ Exercise form library (27 exercises)
│   └── workout-render.js             ✅ Renders PHASE_CONFIG → DOM
├── pages/
│   └── workout/
│       ├── index.html                ✅ Workout landing — phase cards + Calendar entry card + quick access
│       ├── calendar.html             ✅ Gym calendar page
│       ├── phase-1.html              ✅ Foundation Building (Weeks 1–4)
│       ├── phase-2.html              ✅ Load & Intensity (Weeks 5–10)
│       └── phase-3.html              ✅ Advanced Strength (Weeks 11+)
└── claude/
    ├── health_planning_index.md      ✅ User profile, goals, all 10 module specs
    ├── comprehensive_workout_plan.md ✅ Full workout content (source of truth)
    ├── website_plan.md               ✅ Full architecture and implementation plan
    ├── firebase-sync.md              ✅ Firebase feature plan — Stages 1–2 done, Stages 3–4 next
    └── workdone.md                   ✅ This file
```

---

## Design System (do not change these)

**Theme:** Light, warm off-white backgrounds. Dark warm text. Teal accent.

| Token | Value |
|-------|-------|
| `--bg` | `#faf8f5` |
| `--surface-1` | `#f3f0ea` |
| `--surface-2` | `#eceae2` |
| `--surface-3` | `#e3dfd6` |
| `--surface-4` | `#d7d2c8` |
| `--text-1` | `#1c1a16` |
| `--text-2` | `#5e5448` |
| `--text-3` | `#9a8f82` |
| `--accent` | `#1a6b72` (deep teal) |
| `--accent-hover` | `#155960` |
| `--accent-dim` | `rgba(26,107,114,0.10)` |
| `--border` | `rgba(28,22,14,0.10)` |
| `--green` | `#2e7d52` |
| `--orange` | `#b85c2a` |
| `--red` | `#b83232` |
| `--amber` | `#9a7018` |
| Font | Inter (Google Fonts, non-blocking) |
| Nav height | `62px` (`--nav-h`) |
| Max width | `1080px` (`--max-w`) |

---

## Component Injection System

Nav and footer are injected by JS on every page. Never hardcode `<nav>` or `<footer>` in HTML.

- `js/nav.js` → `window.injectNav(activePage, basePath)`
- `js/footer.js` → `window.injectFooter()`
- `js/app.js` → detects current page path, calls both on `DOMContentLoaded`

**basePath convention:**
- `index.html` at root → `basePath = ''`
- `pages/workout/*.html` → `basePath = '../../'`
- `pages/*.html` (future stubs) → `basePath = '../'`

`app.js` detects workout pages with `path.indexOf('/pages/workout')` (no trailing slash required — this was a bug that was fixed).

---

## Workout Architecture

### Data-render separation pattern

```
PHASE_CONFIG (inline in each phase HTML)
    ↓
workout-data.js  (WD.EX — exercise form library)
    ↓
workout-render.js  (WorkoutRender.buildPhase → fills #page-root)
    ↓
workout.js  (DOMContentLoaded → binds all event listeners)
```

### Each phase HTML is a thin shell containing:
- Head with CSS links (`?v=` hashes managed by `bust.py`)
- `<main class="page" id="page-root"></main>`
- Inline `PHASE_CONFIG` object with: `num`, `title`, `subtitle`, `tagline`, `goal`, `sessions` (per-day data), `checklist`
- Inline auto-day script (scrolls day strip + activates today's tab without scrolling the page)
- Script tags: `workout-data.js`, `workout-render.js`, then `WorkoutRender.buildPhase(PHASE_CONFIG)`, then `nav.js`, `footer.js`, `app.js`, `workout.js`, SW registration

### What `workout-render.js` currently renders (in order):
1. `.workout-header` — phase title + subtitle/tagline
2. `.phase-bar` (sticky) — day selector tabs (Mon–Sun)
3. `.container` containing:
   - `.day-panels-wrap` — the active day's session content
   - `.phase-refs` — back safety accordion, warmup guide, transition checklist

### What was removed from rendering (dead code already deleted):
- Phase nav pills (Phase 1 / Phase 2 / Phase 3 breadcrumb) — user didn't want it
- Phase overview card (weekly schedule table) — user didn't want it

---

## Service Worker & Cache Busting

- SW is at repo root (`sw.js`), registered as `../../sw.js` from phase pages
- **HTML**: network-first (fresh online, cache fallback offline). SW only caches responses where `res.ok` is true.
- **CSS/JS/JSON**: cache-first. The `?v=<hash>` suffix on script/link tags acts as the bust signal — but note the SW's `cacheKey()` strips query strings, so the cache is actually invalidated by the CACHE name rotating on commit (via `.githooks/pre-commit`).
- **bust.py**: run after any CSS/JS change. Now correctly resolves relative paths (`../../js/app.js`) from HTML files in subdirectories. Run from repo root: `python3 bust.py`
- **Pre-commit hook**: updates `const CACHE = 'app-<hash>'` in `sw.js` and runs `bust.py`. Activate with: `git config core.hooksPath .githooks && chmod +x .githooks/pre-commit`

**Important**: while developing locally without committing, the SW will serve stale JS/CSS. Workaround: hard refresh (Cmd+Shift+R) or unregister the SW in DevTools → Application → Service Workers.

---

## Known Issues / Minor Remaining Cleanup

- The `goal` field in each `PHASE_CONFIG` is no longer rendered anywhere (it was used by `phaseOverview` which was deleted). It can be removed from `phase-1/2/3.html` in a future cleanup pass.
- `manifest.json` is missing a `scope` field. It defaults correctly to the manifest's directory (`/meridian/`) but adding `"scope": "./"` explicitly would be cleaner.

---

## What Has Been Built — Session 2 (2026-05-07)

### Workout UI refinements and bug fixes

**Layout & UX fixes on phase pages:**
- Removed phase overview card (weekly schedule table) from each phase page — user wanted workout content to be higher on the page
- Removed phase nav pills (Phase 1/2/3 breadcrumb tabs) from each phase page
- Fixed `.day-panels-wrap` border-radius: was flat on top (`0 0 r r`) because it was designed to attach to the day selector bar; now fully rounded with top border restored. Added `margin-top: 20px`.
- Reduced `.workout-header` padding from `40px/32px` → `24px/20px` desktop, `28px/24px` → `18px/16px` mobile
- Fixed page auto-scroll on load: replaced `btn.scrollIntoView({ inline: 'center' })` with manual `sel.scrollLeft` adjustment using `getBoundingClientRect()` — this horizontally centres the active day tab without scrolling the page vertically

**Day tab colour fix:**
- `cardio-day` (green) and `rest-day` (grey) colour classes were bleeding from the (now-removed) schedule table onto the day buttons, with `!important` overriding even the active accent state. Fixed by removing type classes from day button HTML entirely, and scoping the colour rules to `.schedule-table .cardio-day` etc.

**Workout index 404 fix:**
- Phase card links used relative `href="phase-1.html"` which broke when the browser URL was `/pages/workout` (no trailing slash) — the browser resolved it to `/pages/phase-1.html`. Fixed with an inline script that computes the correct absolute base URL handling all three URL forms: `.../workout`, `.../workout/`, `.../workout/index.html`.
- `app.js` basePath detection also fixed: `indexOf('/pages/workout/')` → `indexOf('/pages/workout')` (no trailing slash required).
- `manifest.json` `start_url` fixed from `"/index.html"` (broke GitHub Pages sub-path deployment) to `"./"`.
- SW now guards against caching error responses: `if (res.ok)` before `cache.put()`.

**bust.py fix:**
- Now resolves relative asset paths (`../../js/app.js`) against the HTML file's directory before looking up in the hash map. Previously, all HTML files in subdirectories were silently skipped.

**Dead code removed:**
| Removed | Location |
|---|---|
| `phaseOverview()` function | `workout-render.js` |
| `phaseNav()` function | `workout-render.js` |
| `initPhaseTabs()` call + function | `workout.js` |
| `.phase-panel`, `.phase-overview`, `.phase-badge`, `.schedule-table` CSS | `components.css` |
| `.day-tabs-wrap` CSS | `components.css` |
| `.phase-nav-links` / `.phase-nav-link` CSS | `components.css` |
| `.phase-btn` CSS | `layout.css` |
| `schedule:` data arrays | `phase-1/2/3.html` |

---

## Active Feature In Progress

**Firebase Sync (cross-device persistence)** — see `claude/firebase-sync.md` for the full plan, data schema, file list, and per-stage status.

- ✅ Stage 1 — Firebase Auth (Google Sign-In, nav chip, persists across sessions)
- ✅ Stage 2 — Gym Calendar (Firestore-backed calendar page, streak + monthly stats, nav link)
- ⬜ Stage 3 — Weight Progression to Firestore (`firestore-sync.js`, replace localStorage weight tracker)
- ⬜ Stage 4 — PR Tracking + Session History (auto-detect PRs, Epley 1RM estimate, per-exercise history)

---

## Immediate Next Steps

### 1. Build stub pages for the 9 remaining modules
Each page lives at `pages/<module>.html`. Structure for each:
- Standard head (viewport, fonts, base/layout/components CSS with `?v=` hashes, manifest, theme-color)
- `<main class="page">` with a page header + "In Development" badge + brief content preview
- Nav/footer injection via `nav.js`, `footer.js`, `app.js` with `basePath = '../'`
- SW registration script
- Add path to `PRECACHE` in `sw.js`

Modules: `nutrition.html`, `hydration.html`, `sleep.html`, `habits.html`, `cardio.html`, `back-care.html`, `supplements.html`, `picky-eating.html`, `progress.html`

Content previews should come from `claude/health_planning_index.md`.

### 3. Extract workout CSS (optional cleanup)
`components.css` currently holds all workout-specific UI styles mixed with general component styles. The original plan called for extracting workout styles to `css/workout.css`. Low priority — do this when starting a non-workout module that needs a clean `components.css`.
