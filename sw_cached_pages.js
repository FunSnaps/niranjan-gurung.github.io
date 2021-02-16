/*This method follows the Install, Activate, and Fetch life cycle*/

//name of the cache
const cacheName = 'V1';
//collection of assets to be cached
const cacheAssets = [
    'index.html',
    '/css/main.css',
    '/js/main.js',
    '/images/fish1_Left.png',
    '/images/fish1_Right.png',
    '/images/sprite1.jpg',
    '/images/sprite.jfif',
    '/images/sprite2.jfif',
    '/images/sprite3.jfif',
    '/images/sprite4.jfif',
    '/sound/moveSound.ogg',
    '/sound/wallSound.wav'
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
