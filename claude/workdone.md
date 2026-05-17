# Meridian — Project State

Last updated: 2026-05-14

> Single source of truth for all Claude sessions. Read this first, every time.

---

## What This Is

A personal health planning website called **Meridian**. Pure HTML/CSS/JS — no build tool, no framework. Covers 10 health modules: Workout, Nutrition, Hydration, Sleep, Habits, Supplements, Cardio, Back Management, Picky Eating, Progress. Currently only **Workout** is fully built.

---

## Current File Structure

```
meridian/
├── index.html                          ✅ Homepage (hero + active module card + roadmap grid)
├── manifest.json                       ✅ PWA manifest (start_url: "./")
├── sw.js                               ✅ Service worker — network-first all assets
├── bust.py                             ✅ Cache-buster — appends ?v=<md5> to CSS/JS refs
├── css/
│   ├── base.css                        ✅ Design tokens + reset + typography
│   ├── layout.css                      ✅ Nav, page shell, footer, auth chip
│   ├── components.css                  ✅ All workout UI components + shared components
│   ├── home.css                        ✅ Homepage-specific styles
│   └── calendar.css                    ✅ Gym calendar page + entry card styles
├── js/
│   ├── app.js                          ✅ Detects current page path, injects nav + footer
│   ├── nav.js                          ✅ injectNav(activePage, basePath) + hamburger menu
│   ├── footer.js                       ✅ injectFooter()
│   ├── firebase-config.js              ✅ Firebase init; exports db (Firestore) + auth
│   ├── auth.js                         ✅ Google Sign-In popup; onAuthStateChanged; nav chip
│   ├── calendar.js                     ✅ Gym calendar UI + Firestore sync; streak + stats
│   ├── firestore-sync.js               ✅ Weight sync + PR detection + exercise history
│   ├── workout.js                      ✅ Full workout interactivity
│   ├── workout-data.js                 ✅ Exercise form library (27 exercises)
│   └── workout-render.js               ✅ Renders PHASE_CONFIG → DOM
├── pages/workout/
│   ├── index.html                      ✅ Workout landing — phase cards + calendar entry + quick links
│   ├── calendar.html                   ✅ Gym calendar page
│   ├── phase-1.html                    ✅ Foundation Building (Weeks 1–4)
│   ├── phase-2.html                    ✅ Load & Intensity (Weeks 5–10)
│   └── phase-3.html                    ✅ Advanced Strength (Weeks 11+)
└── claude/
    ├── workdone.md                     ✅ This file
    ├── section-patterns.md             ✅ UI/UX patterns from completed sections
    ├── health_planning_index.md        ✅ User profile, goals, all 10 module specs
    ├── comprehensive_workout_plan.md   ✅ Full workout content (source of truth)
    ├── comprehensive_nutrition_plan.md ✅ Full nutrition content (source of truth)
    └── website_plan.md                 ⚠️ Historical planning doc — see banner in file
```

---

## Design System

**Theme:** Light, warm off-white backgrounds. Dark warm text. Teal accent.

| Token | Value |
|-------|-------|
| `--bg` | `#faf8f5` |
| `--surface-1` | `#f3f0ea` |
| `--surface-2` | `#eceae2` |
| `--surface-3` | `#e3dfd6` |
| `--surface-4` | `#d7d2c8` |
| `--border` | `rgba(28,22,14,0.10)` |
| `--border-hover` | `rgba(28,22,14,0.20)` |
| `--text-1` | `#1c1a16` |
| `--text-2` | `#5e5448` |
| `--text-3` | `#9a8f82` |
| `--accent` | `#1a6b72` |
| `--accent-hover` | `#155960` |
| `--accent-dim` | `rgba(26,107,114,0.10)` |
| `--accent-dim-2` | `rgba(26,107,114,0.18)` |
| `--green` | `#2e7d52` |
| `--green-dim` | `rgba(46,125,82,0.10)` |
| `--orange` | `#b85c2a` |
| `--orange-dim` | `rgba(184,92,42,0.10)` |
| `--red` | `#b83232` |
| `--red-dim` | `rgba(184,50,50,0.10)` |
| `--amber` | `#9a7018` |
| `--amber-dim` | `rgba(154,112,24,0.10)` |
| `--r-sm / md / lg / xl / full` | `6px / 10px / 14px / 20px / 9999px` |
| `--shadow-sm / md / lg` | `0 1px 4px / 0 4px 16px / 0 8px 32px rgba(28,22,14,…)` |
| `--t-fast / base / slow` | `0.14s / 0.22s / 0.38s ease` |
| Font | Inter (Google Fonts, non-blocking) |
| Nav height | `62px` (`--nav-h`) |
| Max width | `1080px` (`--max-w`) |

---

## Core Systems

### Component Injection (nav + footer)

Nav and footer are injected by JS on every page. Never hardcode `<nav>` or `<footer>` in HTML.

- `js/nav.js` → `window.injectNav(activePage, basePath)`
- `js/footer.js` → `window.injectFooter()`
- `js/app.js` → detects current page path, calls both on `DOMContentLoaded`

**basePath convention:**
- Root `index.html` → `basePath = ''`
- `pages/workout/*.html` → `basePath = '../../'`
- `pages/*.html` (future sections) → `basePath = '../'`

**Nav links (current):**
Workout | Calendar | Nutrition *(disabled)* | Sleep *(disabled)* | Habits *(disabled)* | More *(disabled)*

Includes hamburger menu (mobile). Auth chip slot (`#nav-auth`) filled by `auth.js` (Google avatar or "Sign in" button).

**app.js page detection:**
- `/pages/workout` path → `basePath = '../../'`, activePage = `workout` (or `calendar` if `/calendar` in path)
- `/pages/` path → `basePath = '../'`, activePage derived from path segment
- Root → `basePath = ''`, activePage = `home`

### Service Worker & Cache Busting

- SW uses **network-first** for all asset types (HTML, CSS, JS, JSON) with offline cache fallback. Caching error responses is guarded by `if (res.ok)`.
- `cacheKey()` strips `?v=` query params before caching — busting doesn't create duplicate cache entries.
- `bust.py`: run from repo root after any CSS/JS change. Resolves relative paths correctly from subdirectory HTML files.
- Pre-commit hook (`.githooks/pre-commit`): updates `const CACHE = 'app-<hash>'` in `sw.js` + runs `bust.py`. Activate: `git config core.hooksPath .githooks && chmod +x .githooks/pre-commit`.
- SW registered as `../../sw.js` from phase pages, `sw.js` from root pages.

### Firebase Schema

```
users/{uid}/
  calendar/{YYYY-MM-DD}                    → { visited: true, phase: 1 }
  weights/{exName}                         → { sets: [...], updatedAt }
  weight-history/{exName}_{YYYY-MM-DD}     → { exName, date, sets }
  prs/{exName}                             → { weight, reps, date, estimated1rm }
  exercise-history/{exName}                → { 'YYYY-MM-DD': sets[], ... }
```

**localStorage only (intentional):**
- `m-sets|{date}|{exercise}` — set completion dots (ephemeral)
- `m-check|{key}` — phase transition checklist items (device-local is fine)

---

## Completed Sections

- **Workout** ✅ — 3 phase pages + workout landing + gym calendar. UI patterns → `claude/section-patterns.md`. Content spec → `claude/comprehensive_workout_plan.md`.

---

## Active Section: Nutrition

**Status:** Not started  
**Content spec:** `claude/comprehensive_nutrition_plan.md`  
**Pattern reference:** `claude/section-patterns.md` — follow Workout patterns for all UI/UX decisions.

---

## Known Issues (minor)

- `manifest.json` has no `scope` field — defaults correctly to manifest directory. Cosmetic, low priority.
- `goal` field in each `PHASE_CONFIG` (phase HTML files) is no longer rendered anywhere. Clean up in a future pass.

---

## Section Completion Protocol

When a section is fully built and shipped:

1. Delete that section's build logs from this file
2. Move it to "Completed Sections" as a one-liner (link to pattern doc + content spec)
3. Update `claude/section-patterns.md` with any new patterns the section introduced
4. Update the File Structure tree above
5. Set the next section as "Active Section"
