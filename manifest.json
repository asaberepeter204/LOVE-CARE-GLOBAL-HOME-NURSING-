
const CACHE_NAME = 'lovecare-v3-46';
const OFFLINE_URL = '/offline.html';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.html?source=pwa',
  '/book-nurse.html',
  '/nurses-registration.html',
  '/client-registration.html',
  '/nurse-group-chat.html',
  '/ceo-dashboard.html',
  '/contact.html',
  '/icon-transparent-512.png',
  '/manifest.json',
  OFFLINE_URL
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Skip non-GET and chrome extensions
  if(e.request.method !== 'GET' || e.request.url.startsWith('chrome-extension')) return;
  
  // For API calls (Firebase), network first
  if(e.request.url.includes('firebase') || e.request.url.includes('firestore') || e.request.url.includes('googleapis')){
    e.respondWith(
      fetch(e.request).catch(()=> caches.match(e.request))
    );
    return;
  }
  
  // For pages, network first then cache, then offline
  e.respondWith(
    fetch(e.request).then(r => {
      if(r && r.status === 200 && r.type === 'basic'){
        const clone = r.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return r;
    }).catch(()=>{
      return caches.match(e.request).then(resp=>{
        return resp || caches.match(OFFLINE_URL) || caches.match('/index.html');
      });
    })
  );
});

// Background Sync - for offline chat messages
self.addEventListener('sync', e => {
  if(e.tag === 'sync-chat-messages'){
    e.waitUntil(
      // When back online, sync pending chat messages
      console.log('Background sync: chat messages')
    );
  }
  if(e.tag === 'sync-bookings'){
    e.waitUntil(console.log('Background sync: bookings'));
  }
});

// Periodic Sync - for periodic content update (optional)
self.addEventListener('periodicsync', e => {
  if(e.tag === 'update-nurses'){
    e.waitUntil(
      caches.open(CACHE_NAME).then(cache=> cache.add('/book-nurse.html'))
    );
  }
});

// Push Notifications - already good
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {title:'LOVE CARE GLOBAL', body:'New nurse registration! Tap to view.'};
  e.waitUntil(
    self.registration.showNotification(data.title || 'LOVE CARE GLOBAL', {
      body: data.body || 'New update available',
      icon: '/icon-transparent-512.png',
      badge: '/icon-transparent-512.png',
      vibrate: [200,100,200],
      data: {url: data.url || '/ceo-dashboard.html'}
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data.url || '/index.html')
  );
});
