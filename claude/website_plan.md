# Meridian Health Website — Implementation Plan

> **Historical** — This was the original planning doc. Actual implementation diverged (workout.css never extracted, Firebase/calendar additions not reflected, stub pages not yet built). See `workdone.md` for current project state.

## Context
A personal health planning website ("Meridian") with a dark premium aesthetic. Currently: homepage with 10 module cards (only Workout is active) and a full CSS/JS design system. The homepage feels flat and visually undifferentiated. Architecture needs componentisation so nav/footer aren't duplicated across all pages. This plan covers the full website build: architecture restructuring, homepage redesign, and all section pages.

---

## 1. File Architecture

### Target Structure
```
health/
├── index.html                         # Homepage (redesigned)
├── pages/
│   ├── workout/
│   │   ├── index.html                 # Workout landing — phase overview + selector
│   │   ├── phase-1.html               # Phase 1 (Weeks 1–4): Foundation Building
│   │   ├── phase-2.html               # Phase 2 (Weeks 5–10): Load and Intensity
│   │   └── phase-3.html               # Phase 3 (Weeks 11+): Advanced Strength
│   ├── nutrition.html                 # Stub
│   ├── hydration.html                 # Stub
│   ├── sleep.html                     # Stub
│   ├── habits.html                    # Stub
│   ├── cardio.html                    # Stub
│   ├── back-care.html                 # Stub
│   ├── supplements.html               # Stub
│   ├── picky-eating.html              # Stub
│   └── progress.html                  # Stub
├── css/
│   ├── base.css                       # Design tokens, reset, typography (keep as-is)
│   ├── layout.css                     # Nav, page shell, footer (keep, minor tweaks)
│   ├── components.css                 # Reusable UI components (trim workout-specific out)
│   ├── home.css                       # Homepage-specific styles (new)
│   └── workout.css                    # Workout page-specific styles (extracted from components.css)
├── js/
│   ├── app.js                         # Boot: calls nav/footer injection, highlights active link
│   ├── nav.js                         # Nav HTML template + injectNav(activePage) function
│   ├── footer.js                      # Footer HTML template + injectFooter() function
│   └── workout.js                     # Workout interactivity (existing, largely unchanged)
└── claude/
    ├── health_planning_index.md
    ├── comprehensive_workout_plan.md
    └── website_plan.md                # This file
```

### Component Injection Strategy (no build tool required)
- `nav.js` exports `injectNav(activePage)` — builds nav HTML string, inserts before `<main>`, marks active link
- `footer.js` exports `injectFooter()` — builds footer HTML string, appends to body
- `app.js` calls both on `DOMContentLoaded`
- Each HTML file: `<body>` contains only `<main>` + script tags; nav/footer are injected at runtime
- Eliminates copy-pasting nav/footer across all 14 HTML files

### Why Phase-per-Page (not phase tabs on one page)
Each phase spans 4–8 weeks of daily reference use. Separate pages mean:
- Bookmark the current phase directly
- Each file stays focused and small
- Phase-specific JS/CSS can be added without affecting others
- Easy to visually mark a phase as completed in nav/homepage

---

## 2. Homepage Redesign

### What's Wrong Now
- Hero is barebones: h1 + one subtitle line, no visual depth
- Module cards are uniform — active and coming-soon look nearly identical
- Coming-soon at `opacity: 0.45` looks abandoned rather than "on the roadmap"
- Card icons are raw 1.5rem emoji with no container or colour treatment
- No visual hierarchy or sense of journey/progress

### Redesign: Hero
- Subtle radial gradient mesh behind text (accent-colour, very low opacity)
- Eyebrow label above h1: e.g. "Phase 1 · Week 1 of 4"
- Primary CTA button linking directly to `pages/workout/phase-1.html`
- Copy stays the same; visual frame is elevated

### Redesign: Module Grid — Featured Row layout
**Top: "Active Now" row**
- One wide/prominent card for Workout (full width or 2-col spanning)
- Large icon badge in colour-tinted rounded square (accent-dim background)
- Phase status pill ("Phase 1 Active")
- Gradient accent border + subtle glow
- "Begin session →" call-to-action

**Below: "On the Roadmap" section label + 3-col grid**
- Remaining 9 sections in uniform smaller cards
- Muted styling (not opacity fade): dimmer text, dark border, no hover glow
- Small "coming soon" indicator in card corner
- Each card: icon badge (colour-tinted per section) + name + one-line description

### Icon Colour Coding
| Section       | Background token   |
|---------------|--------------------|
| Workout       | `accent-dim`       |
| Nutrition     | `green-dim`        |
| Sleep         | `amber-dim`        |
| Cardio        | `orange-dim`       |
| Hydration     | accent-blue dim    |
| Supplements   | `green-dim`        |
| Habits        | `orange-dim`       |
| Progress      | `accent-dim`       |
| Back Care     | `red-dim`          |
| Picky Eating  | `green-dim`        |

---

## 3. Workout Pages

### `pages/workout/index.html` — Workout Landing
- Overview of all 3 phases: name, week range, goal, status (Active / Upcoming / Locked)
- Phase cards linking to `phase-1.html`, `phase-2.html`, `phase-3.html`
- Quick-access links: back safety reference, equipment setup guide, form library

### `pages/workout/phase-1.html` — Foundation Building (Weeks 1–4)
Source: `comprehensive_workout_plan.md` Phase 1 section
- Page header: phase name, week range, key goal
- Sticky day-tab bar: Mon (Upper Body), Tue (Cardio), Wed (Lower Body), Thu (Rest), Fri (Full Body), Sat (Cardio), Sun (Rest)
- Exercise accordions per session: stat chips (sets/reps, weight, tempo), set tracker dots, rest-timer buttons
- Warm-up mini-tabs (evening vs morning routines)
- Back safety panel (expandable red-flag table + green-light list)
- Transition checklist to Phase 2
- Floating rest timer FAB
- All interactivity via `workout.js`

### `pages/workout/phase-2.html` — Load & Intensity (Weeks 5–10)
- Same structure as Phase 1
- New exercises: incline dumbbell press, face pull (cable), cable chest fly
- Barbell introduction protocol section (squat + deadlift form guides, pre-requisite checks)
- Walk-to-run cardio progression with interval pills
- Transition checklist to Phase 3

### `pages/workout/phase-3.html` — Advanced Strength (Weeks 11+)
- Push/Pull/Legs split structure
- Barbell bench press, continuous running protocol
- Linear progression rules
- Volume progression strategy

**All phase pages:** relative paths `../../css/base.css`, `../../js/nav.js`, etc.

---

## 4. Stub Pages (9 sections)

Each stub gets:
- Nav/footer via JS injection
- Page header: section icon + name + one-line description + "In Development" badge
- Short content preview (what this section will contain, pulled from `health_planning_index.md`)
- Breadcrumb back to home
- Consistent layout shell (same as other pages)

Stubs: `nutrition.html`, `hydration.html`, `sleep.html`, `habits.html`, `cardio.html`, `back-care.html`, `supplements.html`, `picky-eating.html`, `progress.html`

---

## 5. CSS Split

| File             | Contains                                                      |
|------------------|---------------------------------------------------------------|
| `base.css`       | Design tokens, reset, typography — unchanged                  |
| `layout.css`     | Nav, page shell, footer — minor tweaks for injection approach |
| `components.css` | Shared components only (cards, tabs, accordion basics)        |
| `home.css`       | New: featured card, hero gradient, roadmap grid               |
| `workout.css`    | Extracted: exercise cards, set tracker, timer, checklists, back safety panel |

---

## 6. Implementation Order

1. `js/nav.js` + `js/footer.js` — component injection system
2. `js/app.js` — update to call inject functions
3. `index.html` — strip nav/footer HTML, add `css/home.css` link
4. Homepage redesign — `css/home.css` + `index.html` markup (`frontend-design` skill)
5. `css/workout.css` — extract from `components.css`
6. `pages/workout/index.html` — workout landing page
7. `pages/workout/phase-1.html` — full Phase 1 content
8. `pages/workout/phase-2.html` — full Phase 2 content
9. `pages/workout/phase-3.html` — full Phase 3 content
10. Stub pages — 9 section stubs with consistent shell

---

## 7. Verification Checklist

- [ ] `index.html` in browser: hero looks sharp, active Workout card is featured, roadmap grid is styled (not faded)
- [ ] Click Workout card → `pages/workout/index.html` loads correctly
- [ ] Click Phase 1 → full exercise content with accordions, set tracker, rest timer
- [ ] Phase tabs, Day tabs, accordion expand/collapse, set tracker dots all work
- [ ] Rest timer: presets work, completion sound plays, click-outside closes widget
- [ ] Set tracker state persists on page reload (localStorage)
- [ ] Transition checklist state persists on page reload
- [ ] Nav highlights the correct active link on each page
- [ ] Mobile at 375px: nav correct, cards stack to 1-col, day tabs scroll horizontally
- [ ] No 404s on CSS/JS paths from any subdirectory depth
- [ ] All 9 stub pages load without errors
