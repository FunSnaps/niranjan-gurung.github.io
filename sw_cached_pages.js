/*This method follows the Install, Activate, and Fetch life cycle*/

//name of the cache
// const cacheName = 'V1';
// //collection of assets to be cached
// const cacheAssets = [
//   '/{niranjan-gurung.github.io}/game/index.html',
//   // '/game/css/main.css',
//   // '/game/js/main.js',
//   // '/game/images/fish1_Left.png',
//   // '/game/images/fish1_Right.png',
//   // '/game/images/sprite1.jpg',
//   // '/game/images/sprite.jfif',
//   // '/game/images/sprite2.jfif',
//   // '/game/images/sprite3.jfif',
//   // '/game/images/sprite4.jfif',
//   // '/game/sound/moveSound.ogg',
//   // '/game/sound/wallSound.wav'
// ];

// //Install event
// self.addEventListener('install', (e) => {
//   console.log('Service Worker: Installed!');

//   e.waitUntil(
//     caches
//     .open(cacheName)
//     .then(cache => {
//       console.log('Service Wroker: Caching Files');
//       cache.addAll(cacheAssets);
//     })
//       .then(() => self.skipWaiting())
//   );
// });

// //Activate event
// self.addEventListener('activate', (e) => {
//   console.log('Service Worker: Activated!');

//   //Removing unnecessary/unwanted caches
//   e.waitUntil(caches.keys().then(cacheNames => {
//     return Promise.all(cacheNames.map(cache => {
//       if (cache !== cacheName) {
//         console.log('Service Worker: Clearing old cache');
//         return caches.delete(cache);
//       }
//     }))
//   }))
// });

// // Fetch event
// self.addEventListener('fetch', e => {
//   console.log('Service Worker: Fetching');
//   e.respondWith(
//     fetch(e.request).catch(() => caches.match(e.request))
//   );
// })

const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
const OFFLINE_URL = '/{niranjan-gurung.github.io}/game/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }
});