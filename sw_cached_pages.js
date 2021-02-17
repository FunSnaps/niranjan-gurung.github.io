/*This method follows the Install, Activate, and Fetch life cycle*/

//name of the cache
const cacheName = 'V1';
//collection of assets to be cached
const cacheAssets = [
  '/{https://niranjan-gurung.github.io}/game/index.html',
  '/{https://niranjan-gurung.github.io}/game/css/main.css',
  '/{https://niranjan-gurung.github.io}/game/js/main.js',
  '/{https://niranjan-gurung.github.io}/game/images/fish1_Left.png',
  '/{https://niranjan-gurung.github.io}/game/images/fish1_Right.png',
  '/{https://niranjan-gurung.github.io}/game/images/sprite1.jpg',
  '/{https://niranjan-gurung.github.io}/game/images/sprite.jfif',
  '/{https://niranjan-gurung.github.io}/game/images/sprite2.jfif',
  '/{https://niranjan-gurung.github.io}/game/images/sprite3.jfif',
  '/{https://niranjan-gurung.github.io}/game/images/sprite4.jfif',
  '/{https://niranjan-gurung.github.io}/game/sound/moveSound.ogg',
  '/{https://niranjan-gurung.github.io}/game/sound/wallSound.wav'
];

//Install event
self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed!');

  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Service Wroker: Caching Files');
      cache.addAll(cacheAssets);
    })
      .then(() => self.skipWaiting())
  );
});

//Activate event
self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated!');

  //Removing unnecessary/unwanted caches
  e.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cache => {
      if (cache !== cacheName) {
        console.log('Service Worker: Clearing old cache');
        return caches.delete(cache);
      }
    }))
  }))
});

//Fetch event
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
})
