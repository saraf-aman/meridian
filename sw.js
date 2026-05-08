const CACHE = 'app-0308465d';

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
  'js/app.js',
  'js/footer.js',
  'js/nav.js',
  'js/workout.js',
  'js/workout-data.js',
  'js/workout-render.js',
  'pages/workout/index.html',
  'pages/workout/phase-1.html',
  'pages/workout/phase-2.html',
  'pages/workout/phase-3.html',
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
  self.skipWaiting();
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
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  const url  = new URL(event.request.url);
  const path = url.pathname;
  const key  = cacheKey(event.request.url);

  if (path.endsWith('.html') || path.endsWith('/')) {
    // Network-first for HTML — fresh content online, fallback to cache offline
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(key, res.clone()));
          return res;
        })
        .catch(() => caches.match(key).then(r => r || caches.match(SCOPE)))
    );
  } else if (path.endsWith('.css') || path.endsWith('.js') || path.endsWith('.json')) {
    // Cache-first for CSS/JS/JSON — hash-busting ensures staleness isn't an issue
    event.respondWith(
      caches.match(key).then(cached => {
        if (cached) return cached;
        return fetch(event.request)
          .then(res => {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(key, clone));
            return res;
          })
          .catch(() => new Response('', { status: 408, statusText: 'Offline' }));
      })
    );
  }
});
