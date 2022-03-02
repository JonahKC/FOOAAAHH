// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 8;
const OFFLINE_CACHE_KEY = 'offline'+OFFLINE_VERSION;
const FILES_TO_CACHE = ['/RampartOne-Regular.ttf', '/script.js', '/style.css', '/manifest.json', '/index.html', '/serviceworker.js', '/cache.py', '/pictures/honey1.png', '/pictures/honey.png', '/pictures/airplane.png', '/pictures/bird.png', '/pictures/bird1.png', '/pictures/bird2.png', '/pictures/bird3.png', '/pictures/man.png', '/pictures/airplanescrap2.png', '/pictures/airplanescrap1.png', '/pictures/cloud1.png', '/pictures/cloud2.png', '/pictures/cloud3.png', '/pictures/cloud4.png', '/pictures/cloud.png', '/pictures/background.png', '/pictures/tile.png', '/pictures/embed.png', '/pictures/airplane.gif', '/pictures/airplanescrap.png', '/pictures/oldclouds/cloud2.png', '/pictures/oldclouds/cloud1.png', '/pictures/oldclouds/cloud.png', '/audio/soundtrack.mp3', '/audio/hit.mp3', '/audio/honey.mp3', '/audio/honey1.mp3', '/audio/lets_go.mp3', '/audio/honey2.mp3', '/audio/ouch.mp3', '/audio/splat.mp3', '/game/index.html', '/leaderboard/leaderboard.css', '/leaderboard/index.html', '/lib/ajax.min.js', '/lib/functions.js', '/lib/p5.clickable.js', '/lib/p5.full.js', '/lib/settings.js', '/lib/startup.js', '/lib/variables.js', '/lib/p5.min.js', '/lib/p5.play.js', '/lib/p5.sound.js', '/lib/censor.js', '/lib/leaderboard.js', '/pwa/icon-256x256.png', '/pwa/icon-384x384.png', '/pwa/icon-512x512.png', '/pwa/icon-192x192.png', '/credits/index.html', '/terms/index.html', '/settings/index.html']
self.addEventListener('install', function (event) {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE_KEY);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(FILES_TO_CACHE);
    })(),
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async () => {

      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })(),
  );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {

  e.respondWith((async () => {
    const r = await caches.match(e.request);

    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);

    if (r) { return r; }
    try {
      const response = await fetch(e.request);
      const cache = await caches.open(OFFLINE_CACHE_KEY);
    
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    
      cache.put(e.request, response.clone());
      return response;
    } catch (error) {
      
      console.log(`[Service Worker] Error fetching resource: ${e.request.url}`);
      
      // Send the index.html page if we can't fetch the requested resource.
      if (e.request.url.endsWith('.html')) {
        return caches.match('/index.html');

      // Send an error page if we can't fetch the requested resource.
      } else {
        return new Response(`
          <style>
            * {
              background: #4bc8fa;
              text-align: center;
            }
          </style>
          <h1 style="margin-top:500vh;">Oops! It looks like the page you were looking for wasn't cached :/</h1>
        `, {
          headers: { 'Content-Type': 'text/html' },
        });
      }
    }
  })());
});