# Meridian — Project State

Last updated: 2026-05-17

> Single source of truth for all Claude sessions. Read this first, every time.

---

## What This Is

A personal health planning website called **Meridian**. Pure HTML/CSS/JS — no build tool, no framework. Covers 10 health modules: Workout, Nutrition, Hydration, Sleep, Habits, Supplements, Cardio, Back Management, Picky Eating, Progress. **Workout** is fully built. **Nutrition** is in progress (Step 2 of 9).

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
│   ├── auth.js                         ✅ Google Sign-In; whitelist (2 emails); meridian-auth-ready event
│   ├── calendar.js                     ✅ Gym calendar UI + Firestore sync; streak + stats
│   ├── firestore-sync.js               ✅ Weight sync + PR detection + exercise history
│   ├── workout.js                      ✅ Full workout interactivity
│   ├── workout-data.js                 ✅ Exercise form library (27 exercises)
│   ├── workout-render.js               ✅ Renders PHASE_CONFIG → DOM
│   ├── nutrition-data.js               ✅ All nutrition content (schedules, meals, health, supplements)
│   ├── nutrition-render.js             ✅ buildAuthWall + buildUnauthorizedWall + page stubs
│   └── nutrition.js                    ✅ NutritionInteract — ref-block collapsible handler
├── pages/nutrition/
│   ├── index.html                      ⚠️  STUB — nav links only. Step 8 adds stat cards + Quick Reference panels.
│   ├── supplements.html                ✅ Supplements page (whey protein + breakfast + fruit habits)
│   ├── lunch.html                      ✅ Office Lunch page (5 option cards + weekly rotation table)
│   ├── dinner.html                     ✅ Dinner Rotation (7 cards + WFH reheating + Bhurji recipe)
│   ├── health.html                     ✅ Health Tracking (A1C panel + protein sources + pre/post + snapshot)
│   └── schedule.html                   ✅ Daily Schedule (Office/WFH tabs, auto-selects by day, critical rows)
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

**Status:** In progress — Step 2 next (`supplements.html`)
**Content spec:** `claude/comprehensive_nutrition_plan.md` (read "Website Implementation Notes" section first)
**Pattern reference:** `claude/section-patterns.md` — follow Workout patterns for all UI/UX decisions.

### Build Log

| Step | Deliverable | Status |
|---|---|---|
| 1 | Foundation — auth.js whitelist, nutrition-data.js, nutrition-render.js, nutrition.js, CSS block, nav link, homepage card | ✅ Done |
| 1b | Homepage restructure — nutrition card in "Active Now" block, lock/auth UX, auth.js sign-out bug fix | ✅ Done |
| 2 | `supplements.html` — product card, tables, no tabs (validates auth + basePath) | ✅ Done |
| 3 | `lunch.html` — 5 lunch option cards + rotation table | ✅ Done |
| 4 | `dinner.html` — 7 dinner cards + reheating table + Bhurji recipe collapsible | ✅ Done |
| 5 | `health.html` — A1C panel + protein snapshot table + pre/post mini-tabs | ✅ Done |
| 6 | `schedule.html` — two-tab strip (Office/WFH) + schedule table with critical row highlights | ✅ Done |
| 7 | `meal-plan.html` — 7-day tab strip, today auto-activates, protein color-coded | ⬜ Not started |
| 8 | `index.html` — stat cards + Quick Reference collapsibles + nav links (nav links stub already exists) | ⬜ Not started |
| 9 | Finish — sw.js PRECACHE (10 entries), bust.py, workdone.md completion protocol | ⬜ Not started |

---

### Step 1 — What Was Built

**`js/auth.js`** — Added email whitelist (`amansaraf28@gmail.com`, `sarafaman1998@gmail.com`). Non-whitelisted users remain signed in (they see their avatar in the nav) but get `isUnauthorized = true` — they are NOT force-signed-out. Added `window.meridianAuth.ready` flag and `meridian-auth-ready` custom event dispatched on every auth state change. All nutrition pages depend on this event to trigger their render.

**`js/nutrition-data.js`** — All static content for all 7 pages in one IIFE (`var ND`). Exports: `GOALS`, `QUICK_REF`, `LUNCH_OPTIONS`, `LUNCH_ROTATION`, `DINNER_ROTATION`, `WFH_REHEATING`, `WFH_FALLBACKS`, `BHURJI_RECIPE`, `SUPPLEMENTS`, `BREAKFAST_OPTIONS`, `FRUIT_HABITS`, `HEALTH`, `SCHEDULE`, `MEAL_PLAN`, `MILK_SOLUTION`, `NAV_LINKS`. Content sourced from `comprehensive_nutrition_plan.md` Sections 1–18.

**`js/nutrition-render.js`** — IIFE (`var NutritionRender`). Fully implemented: `buildAuthWall()` (lock icon + Sign In button, wires click to `window.meridianAuth.signInWithGoogle()`), `buildUnauthorizedWall()`. Page builders (`buildIndex`, `buildSchedule`, `buildMealPlan`, `buildLunch`, `buildDinner`, `buildSupplements`, `buildHealth`) are stubs that will be filled in Steps 2–8.

**`js/nutrition.js`** — IIFE exposing `window.NutritionInteract = { init() }`. Shell only — populated per page step.

**`css/components.css`** — Nutrition CSS block appended. Classes: `.auth-wall` (+ icon, title, desc, btn, note), `.nutrition-header`, `.key-numbers` (+ number, label, value, unit), `.schedule-table` (+ `tr.row-critical`, `.critical-badge`), `.protein-green` / `.protein-amber`, `.lunch-cards` / `.lunch-card` (+ meta, protein, order, note, days), `.type-chip` (gym/rest/cardio variants), `.dinner-cards` / `.dinner-card` (+ header, day, name, chips), `.chip-time` / `.chip-leftover`, `.health-panel` (+ `.a1c-stats`/`.a1c-stat`), `.product-card` (+ rows), `.breakfast-cards` / `.breakfast-card` (+ `.badge-keep` / `.badge-limit`), `.nut-nav-links` / `.nut-nav-link`, `.meal-rows` / `.meal-row` (+ `.critical-row`, time/label/food/protein).

**`js/nav.js`** — Nutrition link enabled (removed `disabled: true`, now links to `pages/nutrition/index.html`).

**`index.html`** — Nutrition card moved out of roadmap grid into the "Active Now" `modules-block` (below Workout) as a `.module-card`. Lock icon (`.nut-lock`, 🔒 emoji, 24px circle, `display:none` by default) positioned top-right. `data-lock-tip` drives hover tooltip. Inline script listens for `meridian-auth-ready`: authorized user → remove `.show-lock`; unauthorized → add `.show-lock` + set tip to "Account not authorised"; signed out → add `.show-lock`. "Phase 1" chip (not "Phase 1 Active").

**`css/home.css`** — Added `.module-card` (green-tinted gradient border card, full-width), `.module-card-inner`, `a.roadmap-card` base + hover styles. Lock system: `.nut-lock { display:none }` by default; `.module-card.show-lock .nut-lock { display:flex }`; `.module-card.show-lock { opacity:0.45; filter:saturate(0.35) }` (clearly subdued); `.module-card.show-lock .featured-action { display:none }` (no action arrow when locked); tooltip via `::after` appears below lock icon at `top:44px; right:8px` with warm surface background (`var(--surface-3)`, `var(--border)` border — no harsh black).

**HTML shell pattern used by every nutrition page:**
```
nutrition-data.js → nutrition-render.js → nav.js → footer.js → app.js → nutrition.js → auth.js (module) → inline auth-render script → SW registration
```
Inline auth-render script on each page:
```javascript
(function () {
  function render() {
    var a = window.meridianAuth;
    if (!a || !a.ready) { window.addEventListener('meridian-auth-ready', render, { once: false }); return; }
    if (a.isUnauthorized) { NutritionRender.buildUnauthorizedWall(); return; }
    if (!a.currentUser)   { NutritionRender.buildAuthWall(); return; }
    NutritionRender.buildXxx(ND.XXX);
    NutritionInteract.init();
  }
  render();
  window.addEventListener('meridian-auth-ready', render);
}());
```

---

### Page → Content Spec Mapping

| Page | Nutrition Plan Sections |
|---|---|
| `index.html` | Section 18 (Quick Reference Card) + Section 1 (Daily Targets as stat cards) |
| `schedule.html` | Section 14 (Fixed Daily Schedule) |
| `meal-plan.html` | Section 4 (7-Day Meal Plan) + Section 5 (Milk Solution rules) |
| `lunch.html` | Section 6 (Office Lunch Rotation) |
| `dinner.html` | Section 7 (Dinner Rotation) + Section 8 (WFH Leftover System) + Section 9 (Bhurji Recipe) |
| `supplements.html` | Section 11 (Whey Protein) + Section 12 (Breakfast Options) + Section 13 (Fruit Habit) |
| `health.html` | Section 2 (A1C Panel) + Section 3 (Protein Sources) + Section 10 (Pre/Post Workout) + Section 16 (Protein Snapshot) |

### Key Architecture Notes

- **Auth gating:** All 7 pages behind Google OAuth. Whitelist: `amansaraf28@gmail.com`, `sarafaman1998@gmail.com`. Non-whitelisted users stay signed in (nav shows their avatar) but `isUnauthorized = true` gates locked content. Implemented in `auth.js` via `onAuthStateChanged` + `meridian-auth-ready` custom event. Auth wall is inline content (not a redirect). Homepage card: `.show-lock` class dims card (`opacity:0.45; filter:saturate(0.35)`) and shows lock icon for non-authorized visitors; authorized users see full-brightness card with no lock.
- **basePath:** `'../../'` for `pages/nutrition/` — same as workout (both are two directory levels deep). SW registered as `'../../sw.js'`. app.js detects `/pages/nutrition` explicitly before the generic `/pages/` fallback.
- **JS pattern:** Data (`nutrition-data.js`) → Render (`nutrition-render.js`) → Interact (`nutrition.js`). `NutritionInteract.init()` is called by auth callback after render, NOT auto-run on DOMContentLoaded.
- **CSS:** Nutrition block appended to `css/components.css`. Reuse `.ref-block`, `.mini-tabs`, `.day-selector` / `.day-panels-wrap` from workout for applicable pages.

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
