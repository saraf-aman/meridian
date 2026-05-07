const CACHE = 'app-327cf5fb';

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
    (async () => {
      try {
        const res = await fetch('/');
        const html = await res.text();
        const urls = new Set([cacheKey(self.location.origin + '/')]);

        for (const m of html.matchAll(/(?:href|src)=["']([^"']+\.(?:html|css|js)[^"']*)["']/g)) {
          const raw = m[1].split('?')[0];
          if (!raw.startsWith('http')) {
            urls.add(self.location.origin + (raw.startsWith('/') ? raw : '/' + raw));
          }
        }

        const cache = await caches.open(CACHE);
        await Promise.all([...urls].map(u => cache.add(u).catch(() => {})));
      } catch {}
    })()
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

  if (path.endsWith('.html') || path === '/' || path.endsWith('/')) {
    // Network-first for HTML — fresh content online, fallback to cache offline
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(key, clone));
          return res;
        })
        .catch(() => caches.match(key))
    );
  } else if (path.endsWith('.css') || path.endsWith('.js')) {
    // Cache-first for CSS/JS — hash-busting ensures staleness isn't an issue
    event.respondWith(
      caches.match(key).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(key, clone));
          return res;
        });
      })
    );
  }
  // Everything else: network only
});
