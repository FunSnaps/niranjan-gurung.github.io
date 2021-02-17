if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/{https://niranjan-gurung.github.io}/sw_cached_pages.js', {scope: '/{https://niranjan-gurung.github.io}/'})
      .then(reg => console.log('Service Worker: Registered!'))
      .catch(err => console.log(`Service Worker: Error: ${err}`))
  })
}