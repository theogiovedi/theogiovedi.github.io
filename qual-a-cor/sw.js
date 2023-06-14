const currentCacheName = "qual-a-cor-v2-1";
const offlineAssets = [

  // HTML Pages

  "./index.html",
  "./ao-vivo.html",
  "./sobre.html",
  "./fotos.html",
  "./paletas.html",

  // Stylesheets

  "./styles/general.css",
  "./styles/index.css",
  "./styles/live.css",
  "./styles/nav.css",
  "./styles/about.css",
  "./styles/photos.css",
  "./styles/palettes.css",

  // Page Scripts

  "./scripts/live.js",
  "./scripts/index.js",
  "./scripts/photos.js",
  "./scripts/palettes.js",
  "./scripts/about.js",

  // Project libraries

  "./scripts/lib/calc.js",
  "./scripts/lib/canvas.js",
  "./scripts/lib/colors.js",
  "./scripts/lib/frame.js",
  "./scripts/lib/interface.js",
  "./scripts/lib/setup.js",
  "./scripts/lib/svg.js",

  // App Icons and Logos

  "./images/navlogo.svg",
  "./images/favicon.png",
  "./images/192.png",
  "./images/384.png",
  "./images/512.png",
  "./images/1024.png",
  "./images/1024-maskable.png",

  // Fonts and Icons

  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css",
  "https://fonts.googleapis.com/css2?family=Fira+Code&family=Fira+Sans:ital,wght@0,400;0,700;1,400&display=swap",

  // TensorFlow and COCO-SSD

  "https://unpkg.com/@tensorflow/tfjs@4.7.0/dist/tf.min.js",
  "https://unpkg.com/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js",
  "https://storage.googleapis.com/tfjs-models/savedmodel/ssd_mobilenet_v2/model.json"
];

// Add page content to browser cache

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(currentCacheName).then(cache => {
      cache.addAll(offlineAssets)
    })
  );
});

// Clear old cache whenever SW is installed and there is no other old version of it running

this.addEventListener('activate', activateEvent => {
  activateEvent.waitUntil(
    caches.keys().then(cacheNames => { // get all caches in browser
      cacheNames
        .filter(allCacheNames => (allCacheNames.startsWith('qual-a-cor-'))) // get all Qual a Cor? caches
        .filter(ourCacheNames => (ourCacheNames !== currentCacheName)) // get only the old caches
        .map(oldCacheNames => caches.delete(oldCacheNames)) // delete all old caches
    })
  );
});


// Redirect all fetch calls to cache files. If it is not in cache, fetch from server

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  );
});