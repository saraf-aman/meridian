# Meridian — Section UI Patterns

> Read this when starting any new section. Update this when any section ships.
> Goal: new sections look and behave like completed ones without reading source files.

---

## Workout Section (completed 2026-05)

### Architecture: Data → Render → Interact

Three separate JS files per section, loaded in order:

1. **Data file** (`workout-data.js`) — exports a global object (`WD.EX`) with all exercise content. No DOM access.
2. **Render file** (`workout-render.js`) — reads `WD.EX` + the inline `PHASE_CONFIG` from the HTML, builds the entire DOM via `innerHTML` on `#page-root`. Single entry point: `WorkoutRender.buildPhase(cfg)`.
3. **Interact file** (`workout.js`) — runs on `DOMContentLoaded`, binds all event listeners to the already-rendered DOM. Never touches raw HTML.

This separation means: content changes touch only the HTML config object; UI changes touch only the render file; behaviour changes touch only the interact file.

---

### Page Shell (HTML)

Each section page is a thin shell — content is fully injected by the render script:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page · Meridian</title>
  <!-- non-blocking Google Fonts -->
  <link href="https://fonts.googleapis.com/..." rel="stylesheet" media="print" onload="this.media='all'">
  <!-- local CSS with ?v= hashes (managed by bust.py) -->
  <link rel="stylesheet" href="../../css/base.css?v=...">
  <link rel="stylesheet" href="../../css/layout.css?v=...">
  <link rel="stylesheet" href="../../css/components.css?v=...">
  <link rel="manifest" href="../../manifest.json">
  <meta name="theme-color" content="#1a6b72">
</head>
<body>

<main class="page" id="page-root"></main>

<script>
  var PHASE_CONFIG = { /* inline config object with all section data */ };
</script>
<script src="../../js/section-data.js?v=..."></script>
<script src="../../js/section-render.js?v=..."></script>
<script>SectionRender.build(PHASE_CONFIG);</script>
<script src="../../js/nav.js?v=..."></script>
<script src="../../js/footer.js?v=..."></script>
<script src="../../js/app.js?v=..."></script>
<script type="module" src="../../js/auth.js?v=..."></script>
<script src="../../js/section-interact.js?v=..."></script>
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('../../sw.js').catch(function () {});
    });
  }
</script>
</body>
</html>
```

`<main>` is empty in HTML. The render script fills it entirely on load.

---

### Sticky Sub-Navigation (Tab Strip)

Switches between sub-views (days, meals, categories, etc.):

```html
<div class="phase-bar">                          <!-- sticky below main nav -->
  <div class="phase-bar-inner">                  <!-- horizontal overflow scroll -->
    <div class="day-selector" data-panel="p1">
      <button class="day-btn active" data-day="mon">Mon<small>Upper</small></button>
      <button class="day-btn"        data-day="tue">Tue<small>Cardio</small></button>
    </div>
  </div>
</div>

<!-- Panels: only the .active one is shown -->
<div class="day-panels-wrap" data-panel="p1">
  <div class="day-panel active" data-day="mon">...</div>
  <div class="day-panel"        data-day="tue">...</div>
</div>
```

- `position: sticky; top: var(--nav-h)` — sticks immediately below the main nav
- Horizontal overflow hidden (scrollbar hidden via CSS), touch-scrollable
- JS swaps `.active` class on both buttons and panels on click
- Auto-scroll: on load, the active day button is centred in the strip without scrolling the page

---

### Item Cards (collapsible)

Primary content unit. Full anatomy:

```html
<div class="exercise-card">
  <div class="exercise-card-header">              <!-- click to expand/collapse -->
    <div class="ex-num">1</div>
    <div class="ex-title">
      <h4>Exercise Name</h4>
      <div class="ex-muscles">Primary · Secondary</div>
    </div>
    <div class="ex-right">
      <div class="stat-chips">
        <span class="sc sr">3 × 12</span>         <!-- sets × reps, always shown -->
        <span class="sc cont">Controlled</span>   <!-- tempo: "sc cont" class if Slow/Controlled -->
        <span class="sc wt">20 lbs</span>         <!-- weight, only if specified -->
      </div>
      <div class="set-tracker">
        <button class="set-dot" aria-label="Set 1"></button>  <!-- one per set -->
      </div>
      <button class="rest-btn" data-duration="90">⏱ 90s</button>
      <div class="chevron"><!-- SVG, rotates 180° when open --></div>
    </div>
  </div>
  <div class="exercise-card-body">               <!-- collapsed by default -->
    <div class="card-content">
      <!-- "Your weights" section (Firestore-backed) -->
      <div class="card-section set-weights" data-ex-name="..." data-reps="12">
        <h5>Your weights</h5>
        <div class="weight-row">
          <span class="weight-tag" data-set="0">Set 1: <span class="wt-val">—</span></span>
        </div>
      </div>
      <!-- Steps + mistakes in two columns when both present -->
      <div class="card-cols">
        <div class="card-section"><h5>How to do it</h5><ol>...</ol></div>
        <div class="card-section"><h5>Common Mistakes</h5><ul>...</ul></div>
      </div>
      <!-- Optional back note -->
      <div class="back-note"><strong>Back note: </strong>...</div>
    </div>
  </div>
</div>
```

- Body collapse: `max-height` transition (0 → scrollHeight px → 0). JS adds an `.open` class.
- `.set-dot` click toggles `.done` class; state saved to localStorage key `m-sets|{date}|{exercise}`.
- `.rest-btn` opens the timer FAB pre-set to `data-duration` seconds.
- `.wt-val` spans are populated from Firestore on auth resolve.

---

### Collapsible Reference Blocks

Supplementary content (safety info, guides, checklists). Same open/close mechanic as item cards:

```html
<div class="ref-block" id="unique-anchor">       <!-- id enables #anchor deep links -->
  <div class="ref-header">
    <h4>Block Title</h4>
    <div class="ref-header-right">
      <span class="chip chip-default">5–10 min</span>
      <div class="chevron"><!-- SVG --></div>
    </div>
  </div>
  <div class="ref-body">
    <div class="ref-content">
      <!-- content -->
    </div>
  </div>
</div>
```

The `id` is used by quick-access links on the section landing page (`href="phase-1.html#back-safety"`).

---

### Mini-tabs Within a Panel

Switches between sub-views inside a reference block or card body:

```html
<div class="mini-tabs" data-group="warmup">
  <button class="mini-tab active" data-tab="evening">Evening</button>
  <button class="mini-tab"        data-tab="morning">Morning</button>
</div>
<div class="mini-panel active" data-group="warmup" data-tab="evening">...</div>
<div class="mini-panel"        data-group="warmup" data-tab="morning">...</div>
```

`data-group` scopes the tab set — multiple independent groups can coexist on one page without conflict.

---

### Timer FAB

Floating action button, bottom-right, visible on all section phase pages:

```html
<button class="timer-fab" id="timer-fab" aria-label="Rest timer"><!-- clock SVG --></button>
<div class="timer-widget" id="timer-widget">
  <div class="ring-wrap">
    <svg viewBox="0 0 108 108">
      <circle class="ring-track" cx="54" cy="54" r="45"/>
      <circle class="ring-arc"   cx="54" cy="54" r="45"/>   <!-- stroke-dashoffset drives countdown -->
    </svg>
    <div class="timer-digits">1:30</div>
  </div>
  <div class="timer-presets">
    <button class="t-preset"        data-duration="60">60s</button>
    <button class="t-preset active" data-duration="90">90s</button>
    <button class="t-preset"        data-duration="120">2 min</button>
  </div>
  <div class="timer-btns">
    <button class="t-btn" id="t-start-stop">Start</button>
    <button class="t-btn" id="t-reset">Reset</button>
  </div>
</div>
```

---

### Firebase Conventions

```
users/{uid}/{collection}/{docId}
```

- All user data under `users/{uid}/`
- Collection name = data type (e.g. `weights`, `prs`, `exercise-history`, `calendar`)
- Doc ID = the item key (exercise name, date, etc.)
- **Always optimistic UI**: update DOM first, then write to Firestore asynchronously
- **On auth resolve**: read Firestore as source of truth and sync to DOM (overrides any stale localStorage)

### PR Detection (workout-specific, reuse pattern for similar features)

- Epley 1RM: `weight × (1 + reps / 30)`
- Compared against `users/{uid}/prs/{exName}` on every weight save
- Only fire for clean integer reps — skip "each side", "Max", "sec" values
- On new PR: show `.pr-flash` animated green banner (CSS keyframe animation, auto-hides)

---

### What Was Rejected (and why)

- **Phase nav pills** (Phase 1 / Phase 2 / Phase 3 breadcrumb at top of each phase page) — removed; user found them redundant with the nav and they pushed content down
- **Phase overview card** (weekly schedule table) — removed; pushed workout content too far down, user wanted exercises immediately visible on load
- **`goal` field in PHASE_CONFIG** — present in data but renders nowhere; future cleanup candidate

---

## Nutrition Section (completed 2026-05)

### Auth-Gated Page Pattern

All nutrition pages are behind Google OAuth. Every page uses this inline script after the JS includes:

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

`NutritionInteract.init()` is called from the auth callback after render — **never** auto-run on `DOMContentLoaded`. This ensures interact bindings only fire once the DOM is actually built.

Script load order: `nutrition-data.js → nutrition-render.js → nav.js → footer.js → app.js → nutrition.js → auth.js (type="module") → inline auth-render script → SW registration`

---

### Homepage Card with Auth Lock

For sections that are auth-gated, the homepage module card uses a `.show-lock` class system:

- Default: card full opacity, lock icon hidden (`display:none`)
- Signed out or unauthorized: `.show-lock` added → `opacity:0.45; filter:saturate(0.35)`, lock icon appears, action arrow hidden
- Authorized: no `.show-lock` → full brightness card

The inline `meridian-auth-ready` listener drives this state — see `index.html` for the implementation pattern.

---

### Stat Cards (Daily Targets)

Used on section landing pages to show key numbers at a glance:

```html
<div class="key-numbers">
  <div class="key-number">
    <div class="kn-label">Protein</div>
    <div class="kn-value">95–110g</div>
    <div class="kn-unit">per day</div>
  </div>
  <!-- repeat for each metric -->
</div>
```

Cards flex-wrap so 4 fits on desktop, 2×2 on tablet, stacks on mobile.

---

### Schedule Table with Critical Rows

Used whenever a table has one or more "never skip" rows:

```html
<table class="schedule-table">
  <thead><tr><th>Time</th><th>Action</th><th>Notes</th></tr></thead>
  <tbody>
    <tr class="row-critical">
      <td>~8:30pm <span class="critical-badge">Critical</span></td>
      <td>400ml milk + 1 scoop whey</td>
      <td>Before shower. Before sitting.</td>
    </tr>
  </tbody>
</table>
```

`.row-critical td` gets teal-dim background. `.critical-badge` is a small solid teal pill on the time cell.

---

### Dinner Cards

Each card: day abbreviation + type chip + dinner name + chips row + notes line.

```html
<div class="dinner-cards">
  <div class="dinner-card">
    <div class="dinner-card-header">
      <div class="dinner-day">TUE</div>
      <div class="dinner-card-main">
        <div class="dinner-card-name">Mix veg + crumbled paneer + 2 roti</div>
        <div class="dinner-chips">
          <span class="type-chip type-chip--cardio">Cardio</span>
          <span class="chip-time">⏱ 25 min</span>
          <span class="chip-leftover">→ covers Wed lunch</span>
        </div>
      </div>
    </div>
    <div class="dinner-card-notes">One dish — paneer absorbs spices. Cook double.</div>
  </div>
</div>
```

`.chip-leftover` is green-tinted. `.chip-time` is neutral surface. Only show leftover chip if the day has leftover coverage.

---

### Health Panel (Sensitive Data)

Red-tinted card for personal health data. Visually distinct from normal content:

```html
<div class="health-panel">
  <h3>A1C &amp; Blood Sugar — Private</h3>
  <div class="a1c-stats">
    <div class="a1c-stat">
      <div class="a1c-stat-label">Current</div>
      <div class="a1c-stat-value">5.6–5.9</div>
    </div>
  </div>
  <!-- rules list, editable date input, etc. -->
</div>
```

`.health-panel` uses `var(--red-dim)` background + `rgba(184,50,50,0.15)` border.

---

### Auto-Day Tab Selection

Both `schedule.html` (Office/WFH) and `meal-plan.html` (7-day strip) auto-select the relevant tab based on today's day. Pattern:

```javascript
// Office = Mon/Tue/Wed (days 1–3)
var officeToday = [1, 2, 3].indexOf(new Date().getDay()) !== -1;

// 7-day strip — map getDay() (0=Sun) to data keys
var TODAY_KEY = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
```

Use this to set `active` class on the correct tab button and panel at render time. No JS needed — it's baked in at build.

---

### Day-Selector (7-day strip)

Reused from Workout section. For nutrition pages, scope with `data-panel` attribute and bind via `NutritionInteract.bindDaySelectors()` (already in `init()`):

```html
<div class="day-selector" data-panel="mealplan">
  <button class="day-btn active" data-day="sun">Sun<small>Rest</small></button>
  <!-- ... -->
</div>
<div class="day-panels-wrap" data-panel="mealplan">
  <div class="day-panel active" data-day="sun">...</div>
  <!-- ... -->
</div>
```

---

### Mini-Tabs (2–3 options)

For small in-content tab sets (Office/WFH, Gym/Cardio/Rest). Bound via `NutritionInteract.bindMiniTabs()` (already in `init()`). Scoped by `data-group`:

```html
<div class="mini-tabs" data-group="schedule">
  <button class="mini-tab active" data-tab="office">Office Days</button>
  <button class="mini-tab"        data-tab="wfh">WFH / Home</button>
</div>
<div class="mini-panel active" data-group="schedule" data-tab="office">...</div>
<div class="mini-panel"        data-group="schedule" data-tab="wfh">...</div>
```

---

### localStorage for Editable Personal Data

For fields the user should be able to update without a database (e.g., "Last blood test" date on health.html):

```javascript
var input = document.getElementById('a1c-last-tested');
var stored = localStorage.getItem('m-a1c-last-tested');
if (stored) input.value = stored;
input.addEventListener('change', function () {
  localStorage.setItem('m-a1c-last-tested', input.value);
});
```

Key naming convention: `m-<section>-<field>` (prefix `m-` matches existing set-tracker convention).

---

### What Was Rejected in Nutrition (and why)

- **Tabs for Office/WFH on schedule.html** as sticky `phase-bar` — used mini-tabs instead; the schedule table is compact enough that a sticky bar would be overkill
- **Separate "Protein Snapshot" page** — merged into `health.html` as a table section; not enough content to justify its own page
- **`_basePath` prefix on nav link hrefs in `buildIndex`** — removed; `pages/nutrition/index.html` is in the same directory as the other pages, so hrefs are just `schedule.html` etc. (no prefix needed)
