/*
This method requires the user to enter the website 
atleast once as the caching is done right after fetching 
*/

//name of the cache
const cacheName = 'V2';

//Install event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed!');
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

    //creates a clone of the response from the server
    e.respondWith(
        fetch(e.request).then(res => {
            const resClone = res.clone();
            //opening a cache
            caches.open(cacheName).then(cache => {
                //adds the respond to the cache
                cache.put(e.request, resClone);
            });
            return res;
        }).catch(err => caches.match(e.request).then(res => res))
    );
})
