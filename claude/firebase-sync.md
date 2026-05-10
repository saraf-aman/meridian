# Firebase Sync — Feature Plan & Progress

**Status:** Stages 1–2 complete. Stages 3–4 not started.
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
- **Authorized domains:** `localhost` + the GitHub Pages domain must both be listed in Firebase Console → Authentication → Settings → Authorized domains.

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

## Files Created / Modified (Stages 1–2)

| File | Status | Notes |
|------|--------|-------|
| `js/firebase-config.js` | ✅ Created | Initialises Firebase app; exports `db` (Firestore) and `auth`. Uses `persistentLocalCache` with `memoryLocalCache` fallback for iOS compatibility. |
| `js/auth.js` | ✅ Created | Google Sign-In popup, `onAuthStateChanged` listener, exposes `window.meridianAuth`. Updates `#nav-auth` slot in nav reactively. |
| `js/calendar.js` | ✅ Created | Calendar UI + Firestore sync. Loads all visits once, renders monthly grid, optimistic toggle. |
| `css/calendar.css` | ✅ Created | Calendar entry card + full calendar page styles. |
| `pages/workout/calendar.html` | ✅ Created | Gym calendar page. |
| `js/nav.js` | ✅ Modified | Added `#nav-auth` slot; added Calendar as a nav link (second item, after Workout). |
| `js/app.js` | ✅ Modified | Calendar page sets `activePage = 'calendar'` for correct nav highlight. |
| `sw.js` | ✅ Modified | Added new files to PRECACHE; removed `c.navigate(c.url)` from activate handler (was causing iOS Safari double-load bug). |
| All HTML files | ✅ Modified | Added `<script type="module" src="...js/auth.js">` to every page. |
| `pages/workout/index.html` | ✅ Modified | Added Gym Calendar entry card; loaded `calendar.css`; URL-fix script extended to cover `calendar.html`. |
| `css/layout.css` | ✅ Modified | Auth chip styles (sign-in button, avatar, user name); sign-in button height fixed to 36px to match hamburger. |

---

## Stage Plan

### Stage 1 — Firebase Auth ✅ COMPLETE (2026-05-10)
**Goal:** User signs in with Google once. Auth persists forever. Every page knows who the user is.

- `js/firebase-config.js` — Firebase app init, exports `db` and `auth`
- `js/auth.js` — Google Sign-In, auth state listener, `window.meridianAuth`, updates nav chip reactively
- `nav.js` — `#nav-auth` slot added; Calendar link added to nav
- All HTML files — `<script type="module" src="...js/auth.js">` added
- Auth UI: teal "Sign in" button when logged out; Google avatar + first name when logged in; tap avatar → sign out confirm

---

### Stage 2 — Gym Calendar ✅ COMPLETE (2026-05-10)
**Goal:** New page at `pages/workout/calendar.html`. Click a day to log a gym visit. Data lives in Firestore.

- `pages/workout/calendar.html` — monthly calendar page
- `js/calendar.js` — calendar UI + Firestore sync; optimistic UI updates
- `css/calendar.css` — all calendar styles
- Calendar entry card added to `pages/workout/index.html`
- Calendar link added to nav (accessible from all pages, highlights correctly)

**Calendar UI:**
- Monthly grid (Mon–Sun headers), Prev/Next month navigation (up to 12 months back)
- Future days greyed out and non-interactive
- Visited day: filled teal circle; Today: accent ring; Visited + Today: double ring
- Stats bar: visits this month + current streak

**Firestore path:** `users/{uid}/calendar/{YYYY-MM-DD}` → `{ visited: true, phase: 1 }`  
**Offline:** `persistentLocalCache()` in `firebase-config.js` with `memoryLocalCache` fallback.

**iOS Safari fix:** Removed `c.navigate(c.url)` from sw.js activate handler — was causing double-load failure on normal Safari (didn't occur in private mode because private mode has no prior SW installation).

---

### Stage 3 — Weight Progression to Firestore ✅ COMPLETE (2026-05-10)
**Goal:** Weight logs per exercise sync to Firestore. View progression over time.

**What was built:**
- `js/firestore-sync.js` — ES module; `saveWeights(exName, sets)` writes to Firestore; `syncAllFromFirestore(user)` runs on auth resolve and populates localStorage + DOM with Firestore data on fresh devices. Exposes `window.FirestoreSync` for `workout.js`.
- Updated `workout.js` — `save()` function in `initWeightTracker()` builds the full sets array from localStorage and calls `window.FirestoreSync?.saveWeights()` after each localStorage write.
- Added `<script type="module" src="../../js/firestore-sync.js">` to phase-1, phase-2, phase-3 HTML files.
- Added `'js/firestore-sync.js'` to PRECACHE in `sw.js`.

**Firestore paths used:**
- Current weights: `users/{uid}/weights/{exerciseName}` → `{ sets: [...], updatedAt: timestamp }`
- Daily snapshot: `users/{uid}/weight-history/{exerciseName}_{YYYY-MM-DD}` → `{ exName, date, sets }` (flat structure, no sub-subcollection)

**Sync behaviour:**
- localStorage is always written first (instant UI, no regression)
- Firestore write happens async in the background (fire-and-forget, errors silently swallowed)
- On auth resolve: Firestore data is pulled and always written to localStorage/DOM — Firestore is the source of truth, ensuring changes from any device propagate everywhere

**Status:** ✅ COMPLETE

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
