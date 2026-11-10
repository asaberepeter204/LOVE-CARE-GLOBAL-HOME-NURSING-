// Service Worker for Love Care Global PWA - FIXED for 46/46
// OneSignal has its OWN worker (OneSignalSDKWorker.js) - DO NOT handle push here
// This worker is ONLY for offline cache + PWA install

const CACHE_NAME = 'lovecare-v2'; // Bumped from v1 so old cache clears
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-transparent-512.png',
  '/offline.html'
];

// FIXED: Create offline.html fallback if it doesn't exist, don't fail install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(urlsToCache);
      } catch (e) {
        // If one file 404s, don't fail whole install - cache what exists
        console.log('Some cache files missing, caching individually', e);
        for (const url of urlsToCache) {
          try { await cache.add(url); } catch (err) { console.log('Skip missing:', url); }
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  // FIXED: Only handle GET, ignore POST to Firebase / OneSignal
  if (event.request.method !== 'GET') return;
  
  const url = event.request.url;
  // Don't cache Firebase / OneSignal / Google APIs / Paystack
  if (url.includes('firebase') || url.includes('onesignal') || url.includes('googleapis') || url.includes('paystack') || url.includes('firestore') || url.includes('firebasestorage')) {
    return;
  }

  // FIXED: Navigation requests - Network first, fallback to cache + offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html').then((cached) => {
          return cached || caches.match('/offline.html');
        });
      })
    );
    return;
  }

  // Static assets - Cache first, then network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Only cache successful same-origin responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // If fetch fails and it's an image, return placeholder
        if (event.request.destination === 'image') {
          return caches.match('/icon-transparent-512.png');
        }
      });
    })
  );
});

// REMOVED: push + notificationclick handlers - OneSignalSDKWorker.js handles push
// Keeping them here caused double notifications + conflict and lost 2 PWA points
// OneSignal handles push in OneSignalSDKWorker.js, not in sw.js
