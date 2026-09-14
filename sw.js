const CACHE_NAME = 'kmi-public-v1';
const CORE = [
  './',
  './index.html',
  './about.html',
  './resources.html',
  './edu.html',
  './outreach.html',
  './ministry-areas.html',
  './give.html',
  './connect.html',
  './faq.html',
  './media.html',
  './privacy.html',
  './crypto-donations.html',
  './assets/styles.css',
  './assets/photos.css',
  './assets/app.js',
  './assets/chatbot.js',
  './assets/givebutter.js',
  './assets/logo.jpg?v=clean2'
];

const NETWORK_ONLY_PATHS = [
  '/api/',
  '/webhooks/',
  '/health',
  '/login',
  '/c-panel',
  '/cpanel',
  '/staff',
  '/admin',
  '/crm.html',
  '/plans.html',
  '/timeline.html'
];

function isNetworkOnly(url) {
  return NETWORK_ONLY_PATHS.some((path) => url.pathname.includes(path));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isNetworkOnly(url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});
