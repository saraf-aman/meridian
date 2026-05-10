# Firebase Sync — Feature Plan & Progress

**Status:** In progress  
**Started:** 2026-05-10  
**Goal:** Replace localStorage for all persistent data (weights, PRs, history, gym calendar) with Firebase Firestore so data survives cache clears and syncs across devices (mobile + desktop).

> Read this file alongside `workdone.md` when picking up this feature in a new session.

---

## Firebase Project Details

```js
const firebaseConfig = {
  apiKey: "AIzaSyAbF9mFUEb-wvPdTICOrDe9-pElFh25w4g",
  authDomain: "meridian-801cf.firebaseapp.com",
  projectId: "meridian-801cf",
  storageBucket: "meridian-801cf.firebasestorage.app",
  messagingSenderId: "265549373114",
  appId: "1:265549373114:web:c07257fbf2b3d84ea12c83",
  measurementId: "G-977CV59MM0"
};
```

- **Auth provider:** Google Sign-In (popup)
- **Persistence:** Firebase default = `LOCAL` — auth token stored in IndexedDB by the SDK, survives browser close, cache clears, and app restarts. User never has to sign in again after the first time.
- **Firestore rules:** Only the authenticated user can read/write their own data (`/users/{uid}/**`).

---

## Firestore Data Schema

```
users/
  {uid}/
    calendar/
      {YYYY-MM-DD}         → { visited: true, phase: 1 }

    weights/
      {exerciseName}       → { sets: ['25 lbs', '30 lbs', '30 lbs'], updatedAt: timestamp }

    weight-history/
      {exerciseName}/
        {YYYY-MM-DD}       → { sets: ['25 lbs', '30 lbs', '30 lbs'] }

    prs/
      {exerciseName}       → { weight: 35, reps: 8, date: 'YYYY-MM-DD', estimated1rm: 45.7 }

    sessions/
      {YYYY-MM-DD}         → { phase: 1, dayLabel: 'Monday', exercises: [{name, sets: [{reps, weight}]}] }
```

**What stays in localStorage (not migrated):**
- `m-sets|{date}|{exercise}` — set completion dots (ephemeral, today only, not worth syncing)
- `m-check|{key}` — phase transition checklist items (one-time milestones, device-local is fine)

---

## File Plan

### New files to create
| File | Purpose |
|------|---------|
| `js/firebase-config.js` | Firebase SDK imports + config init (imported by all pages via `type="module"`) |
| `js/auth.js` | Google Sign-In, auth state listener, exposes `getCurrentUser()` |
| `pages/workout/calendar.html` | Gym calendar page |
| `js/calendar.js` | Calendar UI + Firestore read/write for gym visits |
| `js/firestore-sync.js` | Shared sync utilities for weight tracker, PRs, session history |

### Existing files to modify
| File | Change |
|------|--------|
| `nav.js` | Add auth button (sign in when logged out, avatar + name when logged in) |
| `app.js` | Initialize auth on every page load |
| `workout.js` | Stage 3: replace localStorage weight tracker with Firestore |
| `sw.js` | Add `calendar.html` and new JS files to `PRECACHE` array |
| All HTML phase files | Add Firebase SDK `<script type="module">` tags |
| `pages/workout/index.html` | Add Calendar card linking to `calendar.html` |

---

## Stage Plan

### Stage 1 — Firebase Auth ✅ COMPLETE
**Goal:** User signs in with Google once. Auth persists forever. Every page knows who the user is.

**What to build:**
- `js/firebase-config.js` — init Firebase app, export `db` (Firestore) and `auth` instances
- `js/auth.js` — `signInWithGoogle()`, `signOut()`, `onAuthStateChanged` listener, exposes `window.meridianAuth`
- Update `nav.js` — add auth chip to the nav (sign-in button when logged out; user avatar/first name + sign-out on tap when logged in)
- Update `app.js` — load auth on every page
- Update all HTML files — add Firebase SDK module script

**Auth UI in nav:**
- Logged out: small "Sign in" button (teal, 44px tall, sits in nav right side)
- Logged in: circular avatar (Google photo) + first name, tap → sign out confirm

**Key detail:** Do NOT block the UI waiting for auth. Pages load instantly; auth state resolves in the background and the nav updates reactively.

**Status:** ✅ COMPLETE (2026-05-10)

---

### Stage 2 — Gym Calendar ⬜ NOT STARTED
**Goal:** New page at `pages/workout/calendar.html`. Click a day to log a gym visit. Data lives in Firestore.

**What to build:**
- `pages/workout/calendar.html` — monthly calendar view
- `js/calendar.js` — calendar UI + Firestore sync

**Calendar UI:**
- Monthly grid (Mon–Sun headers)
- Prev/Next month navigation
- Days in the future: greyed out, not clickable
- Days in the past + today: clickable to toggle gym visit
- Visited day: filled teal circle with checkmark
- Current day: accent ring
- Show current streak + total visits this month at the top

**Firestore path:** `users/{uid}/calendar/{YYYY-MM-DD}` → `{ visited: true, phase: 1 }`  
**Offline:** If user is offline, write to localStorage as a pending queue; sync to Firestore on reconnect. (Firestore offline persistence handles this automatically if enabled.)

**Add to workout index:** Add a "Gym Calendar" card on `pages/workout/index.html` linking to `calendar.html`.

**Status:** ⬜ NOT STARTED

---

### Stage 3 — Weight Progression to Firestore ⬜ NOT STARTED
**Goal:** Weight logs per exercise sync to Firestore. View progression over time.

**What to build:**
- `js/firestore-sync.js` — `saveWeight(exerciseName, setIndex, value)`, `loadWeights(exerciseName)`, `getWeightHistory(exerciseName)`
- Update `workout.js` — replace `m-weight|...` localStorage calls with Firestore via `firestore-sync.js`
- Keep localStorage as a write-through cache so the UI stays snappy (write to both; read from localStorage first, Firestore in background)

**Firestore paths:**
- Current weights: `users/{uid}/weights/{exerciseName}`
- History snapshot per day: `users/{uid}/weight-history/{exerciseName}/{YYYY-MM-DD}`

**History snapshot logic:** When a weight is saved, if there's no snapshot for today yet, write one. This builds a day-by-day history automatically.

**Status:** ⬜ NOT STARTED

---

### Stage 4 — PR Tracking + Session History ⬜ NOT STARTED
**Goal:** Auto-detect personal records. View session history per exercise.

**What to build:**
- PR detection in `firestore-sync.js`: on each weight save, compare against `users/{uid}/prs/{exerciseName}`. If new weight (for same or fewer reps) exceeds stored best, overwrite + flash "New PR!" in the exercise card.
- Session history: when user marks all sets for an exercise done, write a session log entry to `users/{uid}/sessions/{YYYY-MM-DD}`.
- History UI: a collapsible "History" section inside each exercise card showing the last 5 sessions (date + weights used).

**1RM estimate:** Store `estimated1rm` in the PR doc using Epley formula: `weight × (1 + reps / 30)`. Show it in the PR flash + exercise card header.

**Status:** ⬜ NOT STARTED

---

## Completion Checklist

When all 4 stages are done:
- [ ] Fold summary into `workdone.md` under a new "Firebase Sync" section
- [ ] Update `workdone.md` file structure table with all new files
- [ ] Delete this file (`firebase-sync.md`)
- [ ] Remove `firebase-sync.md` reference from `workdone.md`
