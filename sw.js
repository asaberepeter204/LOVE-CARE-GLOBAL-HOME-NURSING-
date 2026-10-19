
// LOVE CARE GLOBAL - Service Worker - PWA Builder Ready
const CACHE_NAME = 'lovecare-global-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-72x72.png',
  './icon-96x96.png',
  './icon-128x128.png',
  './icon-192.png',
  './icon-512.png',
  './icon-512x512.png',
  './icon-1024.png',
  './icon-transparent-512.png',
  './book-nurse.html',
  './book-nurse-full.html',
  './book-nurse-50-percent.html',
  './my-bookings.html',
  './my-job-offer.html',
  './alerts.html',
  './sos.html',
  './nurse-group-chat.html',
  './nurses-dashboard.html'
];

// Install - Cache files for offline support
self.addEventListener('install', event => {
  console.log('[SW] Install - Caching for offline support');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'reload'}))).catch(err => {
          console.log('[SW] Cache addAll error, trying individual', err);
          // Try cache individually to avoid failing entire install if one file 404
          return Promise.allSettled(urlsToCache.map(url => cache.add(url).catch(e => console.log('[SW] Failed to cache', url))));
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate - Cleaning old caches');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Offline Support + Network First for API, Cache First for assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip Firebase, Paystack, Google APIs - always network
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis') || url.hostname.includes('paystack') || url.hostname.includes('gstatic') || url.hostname.includes('leaflet') || url.hostname.includes('unpkg')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  // For navigation requests - network first, fallback to cache, then index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful navigation
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => {
            return cached || caches.match('./index.html') || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // For other requests - cache first, network fallback
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Return cached and update cache in background
          event.waitUntil(
            fetch(event.request).then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
              }
            }).catch(() => {})
          );
          return response;
        }
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
  );
});

// Background Sync - For offline bookings
self.addEventListener('sync', event => {
  console.log('[SW] Background Sync', event.tag);
  if (event.tag === 'sync-bookings' || event.tag === 'background-sync-bookings') {
    event.waitUntil(syncBookings());
  }
  if (event.tag === 'sync-alerts') {
    event.waitUntil(syncAlerts());
  }
});

async function syncBookings() {
  console.log('[SW] Syncing bookings in background');
  // Try to send any pending bookings stored in IndexedDB
  // For now just log - real implementation would read from IDB
  return Promise.resolve();
}

async function syncAlerts() {
  console.log('[SW] Syncing alerts');
  return Promise.resolve();
}

// Periodic Sync - For periodic booking status checks (nurse accept/reject)
self.addEventListener('periodicsync', event => {
  console.log('[SW] Periodic Sync', event.tag);
  if (event.tag === 'check-bookings' || event.tag === 'booking-status-check') {
    event.waitUntil(checkBookingStatus());
  }
  if (event.tag === 'check-alerts') {
    event.waitUntil(checkAlerts());
  }
});

async function checkBookingStatus() {
  console.log('[SW] Periodic check booking status - nurse accept/reject');
  // This would check Firebase for booking status changes
  // And show notification if nurse accepted/rejected
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({type: 'PERIODIC_CHECK_BOOKINGS'});
  });
}

async function checkAlerts() {
  console.log('[SW] Periodic check alerts');
}

// Push Notifications - When nurse accepts/rejects
self.addEventListener('push', event => {
  console.log('[SW] Push Received', event);
  let data = {title: 'LOVE CARE GLOBAL', body: 'New alert - Nurse accepted your booking!', icon: './icon-512x512.png'};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || 'Nurse accepted your booking - Track live!',
    icon: data.icon || './icon-512x512.png',
    badge: './icon-72x72.png',
    vibrate: [200, 100, 200, 100, 400],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || './my-bookings.html'
    },
    actions: [
      {action: 'track', title: '🗺️ Track Nurse Live', icon: './icon-192.png'},
      {action: 'view', title: '📅 View Booking', icon: './icon-192.png'}
    ],
    requireInteraction: true,
    tag: 'nurse-booking-alert'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '✅ Nurse Accepted!', options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification Click', event);
  event.notification.close();

  if (event.action === 'track') {
    event.waitUntil(
      clients.openWindow('./my-bookings.html')
    );
  } else if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('./my-bookings.html')
    );
  } else {
    // Default - open my-bookings
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(clientList => {
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          if (client.url.includes('my-bookings') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('./my-bookings.html');
        }
      })
    );
  }
});

self.addEventListener('notificationclose', event => {
  console.log('[SW] Notification Closed', event);
});

// Message handling from main thread
self.addEventListener('message', event => {
  console.log('[SW] Message received', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, event.data.options);
  }
});

console.log('[SW] Love Care Global Service Worker Loaded - Offline Support, Push, Background Sync, Periodic Sync Ready');
