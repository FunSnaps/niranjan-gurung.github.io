/*This method follows the Install, Activate, and Fetch life cycle*/

// //name of the cache
// const cacheName = 'V1';
// //collection of assets to be cached
// const cacheAssets = [
//   '/{niranjan-gurung.github.io}/game/index.html',
//   '/{niranjan-gurung.github.io}/game/css/main.css',
//   '/{niranjan-gurung.github.io}/game/js/main.js',
//   '/{niranjan-gurung.github.io}/game/images/fish1_Left.png',
//   '/{niranjan-gurung.github.io}/game/images/fish1_Right.png',
//   '/{niranjan-gurung.github.io}/game/images/sprite1.jpg',
//   '/{niranjan-gurung.github.io}/game/images/sprite.jfif',
//   '/{niranjan-gurung.github.io}/game/images/sprite2.jfif',
//   '/{niranjan-gurung.github.io}/game/images/sprite3.jfif',
//   '/{niranjan-gurung.github.io}/game/images/sprite4.jfif',
//   '/{niranjan-gurung.github.io}/game/sound/moveSound.ogg',
//   '/{niranjan-gurung.github.io}/game/sound/wallSound.wav'
// ];

// //Install event
// self.addEventListener('install', (e) => {
//   console.log('Service Worker: Installed!');

//   e.waitUntil(
//     caches.open(cacheName).then(cache => {
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

// //Fetch event
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

// var APP_PREFIX = 'ApplicationName_'     // Identifier for this app (this needs to be consistent across every cache update)
// var VERSION = 'version_01'              // Version of the off-line cache (change this value everytime you want to update cache)
// var CACHE_NAME = APP_PREFIX + VERSION
// var URLS = [
//   'game/index.html',
//   'game/css/main.css',
//   'game/js/main.js',
//   'game/images/fish1_Left.png',
//   'game/images/fish1_Right.png',
//   'game/images/sprite1.jpg',
//   'game/images/sprite.jfif',
//   'game/images/sprite2.jfif',
//   'game/images/sprite3.jfif',
//   'game/images/sprite4.jfif',
//   'game/sound/moveSound.ogg',
//   'game/sound/wallSound.wav'
// ];

// // Respond with cached resources
// self.addEventListener('fetch', function (e) {
//   console.log('fetch request : ' + e.request.url)
//   e.respondWith(
//     caches.match(e.request).then(function (request) {
//       if (request) { // if cache is available, respond with cache
//         console.log('responding with cache : ' + e.request.url)
//         return request
//       } else {       // if there are no cache, try fetching request
//         console.log('file is not cached, fetching : ' + e.request.url)
//         return fetch(e.request)
//       }

//       // You can omit if/else for console.log & put one line below like this too.
//       // return request || fetch(e.request)
//     })
//   )
// })

// // Cache resources
// self.addEventListener('install', function (e) {
//   e.waitUntil(
//     caches.open(CACHE_NAME).then(function (cache) {
//       console.log('installing cache : ' + CACHE_NAME)
//       return cache.addAll(URLS)
//     })
//   )
// })

// // Delete outdated caches
// self.addEventListener('activate', function (e) {
//   e.waitUntil(
//     caches.keys().then(function (keyList) {
//       // `keyList` contains all cache names under your username.github.io
//       // filter out ones that has this app prefix to create white list
//       var cacheWhitelist = keyList.filter(function (key) {
//         return key.indexOf(APP_PREFIX)
//       })
//       // add current cache name to white list
//       cacheWhitelist.push(CACHE_NAME)

//       return Promise.all(keyList.map(function (key, i) {
//         if (cacheWhitelist.indexOf(key) === -1) {
//           console.log('deleting cache : ' + keyList[i] )
//           return caches.delete(keyList[i])
//         }
//       }))
//     })
//   )
// })