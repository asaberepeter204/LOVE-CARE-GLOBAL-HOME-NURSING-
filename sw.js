
const CACHE_NAME = 'lovecare-v4-perfect';
const OFFLINE_URL = '/offline.html';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  if(e.request.url.includes('firebase') || e.request.url.includes('firestore') || e.request.url.includes('chrome-extension')) return;
  
  // Offline support - network first, fallback to cache, then offline.html
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r && r.status===200 && r.type==='basic'){
        const clone=r.clone();
        caches.open(CACHE_NAME).then(c=>c.put(e.request, clone));
      }
      return r;
    }).catch(()=>caches.match(e.request).then(resp=> resp || caches.match(OFFLINE_URL) || caches.match('/index.html')))
  );
});

self.addEventListener('sync', e => {
  if(e.tag==='sync-chat-messages' || e.tag==='sync-bookings'){
    e.waitUntil(Promise.resolve());
  }
});

self.addEventListener('periodicsync', e => {
  if(e.tag==='update-nurses'){
    e.waitUntil(caches.open(CACHE_NAME).then(c=>c.add('/book-nurse.html')));
  }
});

self.addEventListener('push', e => {
  const data=e.data?e.data.json():{title:'LOVE CARE GLOBAL', body:'New update'};
  e.waitUntil(self.registration.showNotification(data.title||'LOVE CARE GLOBAL', {
    body:data.body,
    icon:'/icon-512x512.png',
    badge:'/icon-192x192.png',
    vibrate:[200,100,200],
    data:{url:data.url||'/ceo-dashboard.html'}
  }));
});

self.addEventListener('notificationclick', e=>{
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url||'/index.html'));
});
