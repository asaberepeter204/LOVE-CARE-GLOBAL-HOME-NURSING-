
const CACHE_NAME = 'lovecare-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/book-nurse.html',
  '/nurses-registration.html',
  '/client-registration.html',
  '/icon-transparent-512.png',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => {
      return resp || fetch(e.request).then(r => {
        if(!r || r.status !== 200 || r.type !== 'basic') return r;
        const clone = r.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return r;
      });
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); }))));
});

// Push notification for CEO
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {title:'LOVE CARE GLOBAL', body:'New nurse registration!'};
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-transparent-512.png',
      badge: '/icon-transparent-512.png',
      vibrate: [200,100,200]
    })
  );
});
