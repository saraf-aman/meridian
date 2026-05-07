# Replicating Travel Site Features on Another Website

This document describes every reusable feature built into this travel site and provides a ready-to-use prompt for an AI tool to implement them on a different (non-travel) static website.

---

## Features Overview

### 1. Cache-busting (`bust.py`)

A Python script that computes an 8-character MD5 hash of each `.css` and `.js` file and rewrites every HTML file to append `?v=<hash>` as a query parameter to every `<link href="...">` and `<script src="...">` that references a local asset. If `?v=oldHash` already exists, it is replaced with the new hash. The script is idempotent — safe to run multiple times.

**Example output in HTML:**
```html
<link rel="stylesheet" href="css/main.css?v=8b39bc24">
<script src="js/app.js?v=2d9d6915" defer></script>
```

---

### 2. Service Worker Auto-versioning (`.githooks/pre-commit`)

A git pre-commit hook that:
1. Hashes all `.html`, `.css`, and `.js` files (excluding `.git/` and `sw.js` itself) by concatenating them and running `shasum`, taking the first 8 characters.
2. Updates `const CACHE = 'app-<HASH>'` in `sw.js` automatically.
3. Runs `bust.py` and stages all modified HTML files and `sw.js`.

This means every commit automatically invalidates the service worker cache and updates all asset query params — zero manual steps.

**Wire it up with:**
```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit
```

---

### 3. Offline Availability — Service Worker (`sw.js`)

Full offline support via a service worker with three fetch strategies:

| Asset type | Strategy | Reason |
|---|---|---|
| HTML files (same-origin) | Network-first, fall back to cache | Users get fresh content online; older version offline |
| CSS/JS files (same-origin) | Cache-first | Fast loads; hash busting ensures staleness isn't an issue |
| Everything else | Network only | No cache bloat for unknown resources |

A `cacheKey()` helper strips `?v=` query params before using a URL as a cache key, so hash-busting doesn't store multiple copies of the same file.

On install, the service worker crawls the homepage, discovers all linked `.html`, `.css`, `.js` files, and pre-caches them all (deduplicated). On activate, it deletes all old caches whose name doesn't match the current `CACHE` constant.

---

### 4. PWA Manifest (`manifest.json`)

Enables "Add to Home Screen" on mobile and a native-app-like experience:

```json
{
  "name": "Your App Name",
  "short_name": "App",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}
```

Linked in every HTML `<head>`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#000000">
```

---

### 5. Mobile-Friendly Layout

| Technique | Implementation |
|---|---|
| Viewport meta | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| Fluid typography | `font-size: clamp(18px, 4vw, 32px)` |
| Responsive grid | `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` |
| Primary breakpoint | `@media (max-width: 720px)` — stack layouts, reduce padding |
| Secondary breakpoint | `@media (max-width: 600px)` — small phones |
| Touch targets | All interactive elements minimum 44px tall/wide |
| Horizontal scroll | `overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none;` |
| Lazy images | `loading="lazy"` on all `<img>` tags |

---

### 6. Dark Mode (`js/darkmode.js`)

- Toggle button in navigation switches `data-theme="dark"` on `<html>`
- All colors defined as CSS custom properties with both light and dark values:
  ```css
  :root          { --bg: #ffffff; --text: #111111; }
  [data-theme="dark"] { --bg: #111111; --text: #f0f0f0; }
  ```
- Choice persisted in `localStorage`
- **Anti-flash script** placed as the very first `<script>` in `<head>` (before any stylesheets) to prevent a white flash on dark-mode page loads:
  ```html
  <script>
    if (localStorage.getItem('theme') === 'dark')
      document.documentElement.setAttribute('data-theme', 'dark');
  </script>
  ```

---

## Prompt for Another AI Tool

Copy and paste this prompt verbatim into another AI tool to replicate all of the above on a different static website.

---

```
I want to add the following features to a static HTML/CSS/JS website
(no build tools, no frameworks). Implement all of them:

---

## 1. Cache-busting script (bust.py)

Create a Python script called `bust.py` that:
- Recursively finds all .css and .js files in the project (skip .git, .idea,
  node_modules, vendor)
- Computes an 8-character MD5 hash of each file's contents
- Rewrites every .html file to append ?v=<hash> as a query parameter to every
  <link href="..."> and <script src="..."> that references a local asset
- If ?v=oldHash already exists, replace it with the new hash
- Is idempotent (safe to run multiple times)

Example output in HTML:
  <link rel="stylesheet" href="css/main.css?v=8b39bc24">
  <script src="js/app.js?v=2d9d6915" defer></script>

---

## 2. Git pre-commit hook (.githooks/pre-commit)

Create a shell script at `.githooks/pre-commit` that:
- Hashes all .html, .css, and .js files (excluding .git/ and sw.js itself)
  by concatenating them and running `shasum`, taking the first 8 characters
- Updates the CACHE constant in sw.js:
    const CACHE = 'app-<HASH>';
- Stages sw.js with `git add sw.js`
- Also runs `python3 bust.py` and stages all modified HTML files

Then add instructions for wiring it up:
  git config core.hooksPath .githooks
  chmod +x .githooks/pre-commit

---

## 3. Service worker (sw.js)

Create a service worker with:
- A CACHE constant: const CACHE = 'app-00000000'; (the hook will update the hash)
- A cacheKey() helper that strips query params (?v=...) from URLs so
  hash-busting doesn't fragment the cache
- On install: crawl the homepage, discover all linked .html, .css, .js files,
  and pre-cache them all (deduplicated)
- On activate: delete all old caches whose name doesn't match CACHE
- Fetch strategies:
    - HTML files (same-origin): network-first, fall back to cache
    - CSS/JS files (same-origin): cache-first
    - Everything else: network only (no caching)
- Register the service worker in every HTML file:
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  (Adjust the path if the site is hosted in a subdirectory)

---

## 4. PWA manifest (manifest.json)

Create a manifest.json with placeholders for:
- name, short_name, start_url
- display: "standalone"
- background_color, theme_color

Link it in every HTML <head>:
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#XXXXXX">

---

## 5. Mobile-friendly layout

In every HTML file, ensure:
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

In CSS:
- Use CSS custom properties for all colors (supports dark mode later)
- Use clamp() for responsive font sizes, e.g.: font-size: clamp(18px, 4vw, 32px)
- Use CSS Grid with auto-fill/minmax for card grids, e.g.:
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
- Primary responsive breakpoint at 720px (stack layouts, reduce padding)
- Secondary breakpoint at 600px (small phones)
- All interactive elements (buttons, links) must be at least 44px tall/wide
- Horizontally scrollable containers should use:
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
- Add loading="lazy" to all <img> tags

---

## 6. Dark mode (darkmode.js)

Create js/darkmode.js that:
- Adds a toggle button to the nav (sun/moon icon or "Light / Dark" text)
- Toggles a data-theme="dark" attribute on <html>
- Persists the choice in localStorage with a key specific to the app

Add an anti-flash inline script in the <head> of every HTML file
(before any stylesheets) that reads localStorage and sets data-theme
before the page renders:
  <script>
    if (localStorage.getItem('theme') === 'dark')
      document.documentElement.setAttribute('data-theme', 'dark');
  </script>

Define all colors as CSS custom properties with both light and dark values:
  :root { --bg: #ffffff; --text: #111111; }
  [data-theme="dark"] { --bg: #111111; --text: #f0f0f0; }

---

## Wiring everything together

- bust.py and the git hook must be coordinated: the hook runs bust.py,
  then updates sw.js cache version, then stages everything
- The service worker's cacheKey() must strip ?v= params so the cache
  doesn't store multiple copies of the same file
- manifest.json must be linked in HTML before the service worker registration
- The dark mode anti-flash script must be the very first <script> in <head>

Do not add any npm dependencies, build tools, frameworks, or transpilation.
Pure vanilla HTML, CSS, and JavaScript only.
```

---