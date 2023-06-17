const currentCacheName = "qual-a-cor-v2-1";
const offlineAssets = [
  "./ao-vivo.html",
  "./fotos.html",
  "./images/1024-maskable.png",
  "./images/1024.png",
  "./images/192.png",
  "./images/384.png",
  "./images/512.png",
  "./images/favicon.png",
  "./images/navlogo.svg",
  "./index.html",
  "./matizes.html",
  "./paletas.html",
  "./scripts/about.js",
  "./scripts/hues.js",
  "./scripts/index.js",
  "./scripts/lib/calc.js",
  "./scripts/lib/canvas.js",
  "./scripts/lib/colors.js",
  "./scripts/lib/frame.js",
  "./scripts/lib/interface.js",
  "./scripts/lib/pwa.js",
  "./scripts/lib/setup.js",
  "./scripts/lib/svg.js",
  "./scripts/live.js",
  "./scripts/palettes.js",
  "./scripts/photos.js",
  "./scripts/videos.js",
  "./scripts/vr.js",
  "./sobre.html",
  "./styles/about.css",
  "./styles/button.css",
  "./styles/canvas.css",
  "./styles/file.css",
  "./styles/general.css",
  "./styles/hues.css",
  "./styles/index.css",
  "./styles/lists.css",
  "./styles/live.css",
  "./styles/nav.css",
  "./styles/palettes.css",
  "./styles/photos.css",
  "./styles/select.css",
  "./styles/slider.css",
  "./styles/videos.css",
  "./sw.js",
  "./videos.html",
  "./vr.html",
  "https://fonts.googleapis.com/css2?family=Fira+Code&family=Fira+Sans:ital,wght@0,400;0,700;1,400&display=swap"
];

// Add page content to browser cache

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(currentCacheName).then((cache) => {
      cache.addAll(offlineAssets);
    })
  );
});

// Clear old cache whenever SW is installed and there is no other old version of it running

this.addEventListener("activate", (activateEvent) => {
  activateEvent.waitUntil(
    caches.keys().then((cacheNames) => {
      // get all caches in browser
      cacheNames
        .filter((allCacheNames) => allCacheNames.startsWith("qual-a-cor-")) // get all Qual a Cor? caches
        .filter((ourCacheNames) => ourCacheNames !== currentCacheName) // get only the old caches
        .map((oldCacheNames) => caches.delete(oldCacheNames)); // delete all old caches
    })
  );
});

// Redirect all fetch calls to cache files. If it is not in cache, fetch from server

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
