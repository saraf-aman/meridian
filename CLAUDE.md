# Meridian — Claude Instructions

Pure vanilla HTML/CSS/JS. No frameworks, no build tools, no npm.

---

## Session startup — always do this first

1. Read `claude/workdone.md` — single source of truth: project map, design system, file structure, Firebase schema, active section status.
2. When starting a **new section**: also read `claude/section-patterns.md` (UI/UX patterns from completed sections to ensure visual/structural consistency) + `claude/comprehensive-<section>-plan.md` (content spec for the section being built).
3. When **finishing a section**: prune that section's build logs from `workdone.md`, move it to the "Completed Sections" registry, update `section-patterns.md` with any new patterns the section introduced, update the file structure tree in `workdone.md`, set the next section as "Active Section".

---

## Non-negotiable rules

- **Never `git commit` or `git push` anything.** The user always handles commits and pushes themselves. Do not suggest, stage, or run any git commit/push commands.

---

## Always apply these standards when writing any code

### Service worker & caching

- `sw.js` uses an explicit `PRECACHE` array. When you add a new page or a new CSS/JS file, add its path to that array.
- The pre-commit hook (`.githooks/pre-commit`) auto-updates `const CACHE = 'app-<hash>'` in `sw.js` and runs `bust.py` on every commit. Do not manually edit the cache name.
- `bust.py` appends `?v=<md5hash>` to every local `<link href>` and `<script src>` in all HTML files. Run it (or remind the user to run it) after any CSS/JS change.
- To activate the hook on a fresh clone: `git config core.hooksPath .githooks && chmod +x .githooks/pre-commit`

### Mobile layout

- Every HTML file must have `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- Use `clamp()` for fluid font sizes (e.g. `font-size: clamp(1rem, 4vw, 1.5rem)`).
- Card/grid layouts: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`.
- Primary responsive breakpoint: `640px`. Secondary: `400px`.
- All interactive elements (buttons, links, nav items) must be at least 44px tall/wide.
- Horizontally scrollable containers: `overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none;`
- All `<img>` tags must have `loading="lazy"`.

### CSS

- All colours must be CSS custom properties defined in `:root` (already set up in `base.css`). Never hardcode hex/rgb values outside `:root`.
- **Dark mode is skipped for now.** Do not add `[data-theme="dark"]` rules or a dark mode toggle.

### PWA manifest

- `manifest.json` must be linked in every HTML `<head>`:
  ```html
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#1a6b72">
  ```

### Google Fonts / external stylesheets

- Never use a render-blocking `<link rel="stylesheet">` for external fonts. Always load them non-blocking:
  ```html
  <link href="https://fonts.googleapis.com/..." rel="stylesheet" media="print" onload="this.media='all'">
  ```

### Service worker registration

- Every HTML file must register the service worker before `</body>`:
  ```html
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  </script>
  ```

---

## Checklist for every new page

1. Add viewport meta, manifest link, theme-color meta, SW registration script.
2. Add its path to `PRECACHE` in `sw.js`.
3. Link only local CSS/JS (bust.py will version them on next commit).
4. Ensure all interactive elements are ≥ 44px.
5. Add `loading="lazy"` to any images.
