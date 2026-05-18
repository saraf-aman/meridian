const CACHE = 'app-0895488c';

// self.registration.scope resolves to the correct base regardless of
// whether the site is deployed at the root or a sub-path (e.g. /meridian/).
const SCOPE = self.registration.scope; // e.g. 'https://saraf-aman.github.io/meridian/'

// Paths are relative to SCOPE — no leading slash needed.
const PRECACHE = [
  '',
  'index.html',
  'manifest.json',
  'css/base.css',
  'css/layout.css',
  'css/home.css',
  'css/components.css',
  'css/calendar.css',
  'js/app.js',
  'js/auth.js',
  'js/calendar.js',
  'js/firebase-config.js',
  'js/firestore-sync.js',
  'js/footer.js',
  'js/nav.js',
  'js/workout.js',
  'js/workout-data.js',
  'js/workout-render.js',
  'pages/workout/calendar.html',
  'pages/workout/index.html',
  'pages/workout/phase-1.html',
  'pages/workout/phase-2.html',
  'pages/workout/phase-3.html',
  'js/nutrition-data.js',
  'js/nutrition-render.js',
  'js/nutrition.js',
  'pages/nutrition/index.html',
  'pages/nutrition/supplements.html',
  'pages/nutrition/lunch.html',
  'pages/nutrition/dinner.html',
  'pages/nutrition/health.html',
  'pages/nutrition/schedule.html',
  'pages/nutrition/meal-plan.html',
];

function cacheKey(url) {
  try {
    const u = new URL(url);
    u.search = '';
    return u.toString();
  } catch {
    return url.split('?')[0];
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.all(PRECACHE.map(path =>
        cache.add(SCOPE + path).catch(() => {})
      ))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      const stale = keys.filter(k => k !== CACHE);
      return Promise.all(stale.map(k => caches.delete(k)));
    })
  );
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  const url  = new URL(event.request.url);
  const path = url.pathname;
  const key  = cacheKey(event.request.url);

  if (path.endsWith('.html') || path.endsWith('/')) {
    // Network-first for HTML — fresh content online, cached version offline.
    // Fallback chain always resolves to a valid Response (never undefined),
    // which would otherwise crash iOS Safari instead of showing an offline page.
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(key, res.clone()));
          return res;
        })
        .catch(() =>
          caches.match(key)
            .then(r => r || caches.match(SCOPE))
            .then(r => r || Response.error())
        )
    );
  } else if (path.endsWith('.css') || path.endsWith('.js') || path.endsWith('.json')) {
    // Network-first for CSS/JS/JSON — ensures updates appear on next soft reload.
    // GitHub Pages HTTP-caches sw.js, so the old SW may stay active for minutes after
    // a deploy; cache-first would serve stale assets during that window.
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(key, res.clone()));
          return res;
        })
        .catch(() => caches.match(key).then(r => r || new Response('', { status: 408, statusText: 'Offline' })))
    );
  }
});
