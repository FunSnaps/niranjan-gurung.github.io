/*This method follows the Install, Activate, and Fetch life cycle*/

//name of the cache
// const cacheName = 'V1';
// //collection of assets to be cached
// const cacheAssets = [
//   'offline.html',
//   '/css/main.css',
//   '/js/main.js',
//   '/images/fish1_Left.png',
//   '/images/fish1_Right.png',
//   '/images/sprite4.jpg',
//   '/sound/wallSound.wav',
//   '/sound/moveSound.ogg'
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

// const OFFLINE_VERSION = 1;
// const CACHE_NAME = 'offline';
// const OFFLINE_URL = [
//   'offline.html',
//   '/css/main.css',
//   '/js/main.js',
//   '/images/fish1_Left.png',
//   '/images/fish1_Right.png',
//   '/images/sprite4.jpg',
//   '/sound/wallSound.wav',
//   '/sound/moveSound.ogg'
// ];

// self.addEventListener('install', (event) => {
//   event.waitUntil((async () => {
//     const cache = await caches.open(CACHE_NAME);
//     await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
//   })());
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil((async () => {
//     if ('navigationPreload' in self.registration) {
//       await self.registration.navigationPreload.enable();
//     }
//   })());

//   self.clients.claim();
// });

// self.addEventListener('fetch', (event) => {
//   if (event.request.mode === 'navigate') {
//     event.respondWith((async () => {
//       try {
//         const preloadResponse = await event.preloadResponse;
//         if (preloadResponse) {
//           return preloadResponse;
//         }

//         const networkResponse = await fetch(event.request);
//         return networkResponse;
//       } catch (error) {
//         console.log('Fetch failed; returning offline page instead.', error);

//         const cache = await caches.open(CACHE_NAME);
//         const cachedResponse = await cache.match(OFFLINE_URL);
//         return cachedResponse;
//       }
//     })());
//   }
// });

// var cacheVersion = 1;
// var currentCache = {
//   offline: 'offline-cache' + cacheVersion
// };
// const offlineUrl = [
//   'offline.html',
//   '/game/css/main.css',
//   '/game/js/main.js',
//   '/game/images/fish1_Left.png',
//   '/game/images/fish1_Right.png',
//   '/game/images/sprite4.jpg',
//   '/game/sound/wallSound.wav',
//   '/game/sound/moveSound.ogg'
// ];

// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(currentCache.offline).then(function(cache) {
//       return cache.addAll(offlineUrl);
//     })
//   );
// });

// self.addEventListener('fetch', event => {
//   // request.mode = navigate isn't supported in all browsers
//   // so include a check for Accept: text/html header.
//   if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
//       event.respondWith(
//         fetch(event.request.url)
//         .catch(error => {
//           // Return the offline page
//           return caches.match(offlineUrl);
//         })
//     );
//   }
//   else {
//     // Respond with everything else if we can
//     event.respondWith(caches
//       .match(event.request)
//       .then((response) => {
//         return response || fetch(event.request);
//       })
//     );
//   }
// });

const offlineUrl = [
  'offline.html',
  '/css/main.css',
  '/js/main.js',
  '/images/fish1_Left.png',
  '/images/fish1_Right.png',
  '/images/sprite4.jpg',
  '/sound/moveSound.ogg',
  '/sound/wallSound.wav'
];

self.addEventListener('install', (event) => {
  event.waitUntil(async function() {
    const cache = await caches.open('static-v1');
    await cache.addAll(offlineUrl);
  }());
});

self.addEventListener('activate', event => {
  event.waitUntil(async function() {
    // Feature-detect
    if (self.registration.navigationPreload) {
      // Enable navigation preloads!
      await self.registration.navigationPreload.enable();
    }
  }());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Always bypass for range requests, due to browser bugs
  if (request.headers.has('range')) return;
  event.respondWith(async function() {
    // Try to get from the cache:
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
      const response = await event.preloadResponse;
      if (response) return response;

      // Otherwise, get from the network
      return await fetch(request);
    } catch (err) {
      // If this was a navigation, show the offline page:
      if (request.mode === 'navigate') {
        return caches.match('offline.html');
      }

      // Otherwise throw
      throw err;
    }
  }());
});