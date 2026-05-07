# Meridian — Work Done & Next Steps

Last updated: 2026-05-07

This file is the single source of truth for any new chat picking up this project.
Read this file, then read `website_plan.md` for the full architecture spec, then proceed with the next step listed at the bottom of this file.

---

## What This Project Is

A personal health planning website called **Meridian**. It is a pure HTML/CSS/JS site (no build tool, no framework). It covers 10 health modules: Workout, Nutrition, Hydration, Sleep, Habits, Supplements, Cardio, Back Management, Picky Eating, Progress.

Currently only the **Workout** module has content (sourced from `claude/comprehensive_workout_plan.md`). All other modules are stubs.

---

## Current File Structure

```
health/
├── index.html                    ✅ Homepage (complete)
├── pages/                        ❌ Directory does not exist yet — create it
├── css/
│   ├── base.css                  ✅ Design tokens + reset
│   ├── layout.css                ✅ Nav, page shell, footer
│   ├── components.css            ✅ Workout UI components (accordion, timer, etc.) — untouched, ready for workout pages
│   └── home.css                  ✅ Homepage-specific styles
├── js/
│   ├── app.js                    ✅ Injects nav + footer on every page
│   ├── nav.js                    ✅ Nav HTML + injectNav(activePage, basePath)
│   ├── footer.js                 ✅ Footer HTML + injectFooter()
│   └── workout.js                ✅ Full workout interactivity — DO NOT REWRITE
└── claude/
    ├── health_planning_index.md  ✅ Master context: user profile, goals, all 10 module specs
    ├── comprehensive_workout_plan.md  ✅ Full workout content: Phase 1, 2, 3 (source of truth for workout pages)
    ├── website_plan.md           ✅ Full architecture and implementation plan
    └── workdone.md               ✅ This file
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
| Font | Inter (Google Fonts) |
| Nav height | `62px` (var `--nav-h`) |
| Max width | `1080px` (var `--max-w`) |

---

## Component Injection System (critical — read before touching any HTML)

Nav and footer are **not hardcoded** in HTML. They are injected by JavaScript on every page load.

- `js/nav.js` → `window.injectNav(activePage, basePath)`
- `js/footer.js` → `window.injectFooter()`
- `js/app.js` → detects current page, calls both on `DOMContentLoaded`

**basePath convention** (how deep is the page from root):
- `index.html` at root → `basePath = ''`
- `pages/nutrition.html` etc. → `basePath = '../'`
- `pages/workout/phase-1.html` etc. → `basePath = '../../'`

**Every HTML file must:**
1. Have only `<main class="page">` in the body (no `<nav>` or `<footer>` tags)
2. Load scripts at end of body: `nav.js`, `footer.js`, `app.js` (with correct relative paths)

---

## What Has Been Built

### Homepage (`index.html` + `css/home.css`)
- Hero: eyebrow label "Phase 1 · Week 1 of 4" (pulsing dot), h1 "Your health, all in one place.", subtitle, "Begin Phase 1 →" CTA button linking to `pages/workout/phase-1.html`
- "Active Now" section: full-width featured card for Workout (gradient border, accent chip, animated arrow)
- "On the Roadmap" section: 3-col grid of 9 muted cards with colour-tinted icon badges
- Entry animations (staggered fade-up)

### Shared CSS
- `base.css`: all design tokens, reset, typography
- `layout.css`: nav, page shell, footer — **note**: nav background is `rgba(250,248,245,0.92)`, phase-bar is `rgba(250,248,245,0.95)` (hardcoded, not using var)
- `components.css`: complete workout UI — phase panels, day tabs, exercise cards, set tracker, rest timer, back safety panel, transition checklists, reference blocks. All of this is ready and waiting for workout HTML to use it.

### Shared JS
- `workout.js` (260 lines): full interactivity for workout pages — phase tabs, day tabs, accordion expand/collapse, set tracker (localStorage), rest timer (Web Audio API, SVG progress ring), transition checklists (localStorage), back safety toggle, reference block toggles, mini-tabs (warmup variants). **Do not modify or rewrite this file.**

---

## What Has NOT Been Built

### 1. `css/workout.css` — not yet extracted
`components.css` currently contains all workout-specific CSS. The plan calls for extracting it to `workout.css`, but this has not been done. For now, all workout pages should load `components.css` directly. Extract to `workout.css` as a cleanup step once all workout pages are built.

### 2. Workout pages — `pages/workout/` (NEXT STEP)
Content source: `claude/comprehensive_workout_plan.md`

- **`pages/workout/index.html`** — Workout landing page
  - 3 phase cards: Phase 1 (Active), Phase 2 (Upcoming), Phase 3 (Locked)
  - Each card: phase name, week range, key goal, status badge, link to phase page
  - Quick-access links: Back Safety reference, Equipment Setup, Form Library

- **`pages/workout/phase-1.html`** — Foundation Building (Weeks 1–4)
  - Sticky day-tab bar: Mon (Upper Body), Tue (Cardio walk), Wed (Lower Body), Thu (Rest), Fri (Full Body), Sat (Cardio walk), Sun (Rest)
  - Exercise accordions with: sets/reps chips, weight chip, tempo chip, set tracker dots, rest-timer buttons
  - Warm-up mini-tabs (Evening vs Morning routine)
  - Back safety panel (expandable, red-flag symptoms table + green-light list)
  - Phase 1→2 transition checklist
  - Floating rest timer FAB (already in `workout.js` + `components.css`)

- **`pages/workout/phase-2.html`** — Load & Intensity (Weeks 5–10)
  - Same structure as Phase 1
  - New exercises: incline dumbbell press, face pull (cable), cable chest fly
  - Barbell introduction protocol section
  - Walk-to-run cardio progression with interval pills
  - Phase 2→3 transition checklist

- **`pages/workout/phase-3.html`** — Advanced Strength (Weeks 11+)
  - Push/Pull/Legs split
  - Barbell bench press, continuous running protocol
  - Linear progression and volume progression rules

**CSS to load on all workout pages:** `../../css/base.css`, `../../css/layout.css`, `../../css/components.css`
**JS to load:** `../../js/nav.js`, `../../js/footer.js`, `../../js/app.js`, `../../js/workout.js`
**Pass to injectNav:** `activePage = 'workout'`, `basePath = '../../'`

### 3. Stub pages — `pages/` (after workout pages are done)
9 pages each with: nav/footer injection, page header + "In Development" badge, brief content preview (from `claude/health_planning_index.md`), link back to home.

`nutrition.html`, `hydration.html`, `sleep.html`, `habits.html`, `cardio.html`, `back-care.html`, `supplements.html`, `picky-eating.html`, `progress.html`

**CSS/JS paths for these:** `../css/...` and `../js/...`
**Pass to injectNav:** relevant `activePage`, `basePath = '../'`

---

## Important Technical Notes

1. **`workout.js` expects specific HTML structure.** The JS uses class names and `data-` attributes from the original workout page design. When building workout HTML, use the class names already defined in `components.css`: `.phase-panel`, `.day-panel`, `.exercise-card`, `.set-dot`, `.rest-btn`, `.ref-block`, `.mini-tab`, `.checklist-item`, etc. Read `components.css` to see what classes are available before writing workout HTML.

2. **`pages/workout/` directory does not exist.** Create it before writing files there.

3. **`layout.css` still has `.workout-header` and `.phase-bar`/`.phase-btn` styles** — these are used by workout pages, do not remove them.

4. **There is a `frontend-design` skill available** in Claude Code for building polished UI. It has been used in this project before. Invoke it with the `Skill` tool when building new pages that need careful visual design.

5. **All exercise content, form guides, progressions, back safety protocol, warm-up routines, and transition checklists** are in `claude/comprehensive_workout_plan.md`. Read it thoroughly before building workout pages — it is 1,488 lines and very detailed.

---

## Immediate Next Step

**Build the workout section.** Start with `pages/workout/index.html` (the landing page), then `pages/workout/phase-1.html` (the most important page — this is what gets used daily). Phases 2 and 3 can follow.

Read `claude/comprehensive_workout_plan.md` before starting. All content comes from there.
