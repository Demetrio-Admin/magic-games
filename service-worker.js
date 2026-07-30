const VERSION = '2026.07.30-pwa-fix-1';
const STATIC_CACHE = `magic-rpg-static-${VERSION}`;
const RUNTIME_CACHE = `magic-rpg-runtime-${VERSION}`;

const CORE_ASSETS = [
  './',
  './index.html',
  './css/app.css',
  './js/app.js',
  './manifest.webmanifest',
  './assets/icons/icon-512.png',
  './assets/icons/icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(async (cache) => {
        // Кэшируем файлы по одному: отсутствие одного ресурса больше
        // не ломает установку всего service worker.
        await Promise.allSettled(
          CORE_ASSETS.map((asset) => cache.add(asset))
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  try {
    const response = await fetch(request, { cache: 'no-store' });

    if (response && response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // SPA-fallback разрешён только для навигации.
    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }

    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const updatePromise = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || updatePromise;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Не перехватываем сторонние запросы.
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  const destination = request.destination;

  if (['style', 'script', 'image', 'font', 'manifest'].includes(destination)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
