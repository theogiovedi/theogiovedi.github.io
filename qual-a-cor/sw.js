const cacheName = "qual-a-cor-v2-1";
const offlineAssets = [

  // HTML Pages

  "/index.html",
  "/ao-vivo.html",
  "/sobre.html",
  "/fotos.html",
  "/paletas.html",

  // Stylesheets

  "/styles/general.css",
  "/styles/index.css",
  "/styles/live.css",
  "/styles/nav.css",
  "/styles/about.css",
  "/styles/photos.css",
  "/styles/palettes.css",

  // Page Scripts

  "/scripts/live.js",
  "/scripts/index.js",
  "/scripts/photos.js",
  "/scripts/palettes.js",
  "/scripts/about.js",

  // Project libraries

  "/scripts/lib/calc.js",
  "/scripts/lib/canvas.js",
  "/scripts/lib/colors.js",
  "/scripts/lib/frame.js",
  "/scripts/lib/interface.js",
  "/scripts/lib/setup.js",
  "/scripts/lib/svg.js",

  // Icons and Logos

  "/images/navlogo.svg",
  "/images/favicon.png",
  "/images/192.png",
  "/images/384.png",
  "/images/512.png",
  "/images/1024.png",
  "/images/1024-maskable.png",

  // Fonts

  "/fonts/FiraSans-Bold.ttf",
  "/fonts/FiraSans-Italic.ttf",
  "/fonts/FiraSans-Regular.ttf",
  "/fonts/FiraCode-Regular.ttf"
];

// Add page content to browser cache

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(offlineAssets);
    }).catch(error => console.log(error))
  );
});

// Redirect all fetch calls to 

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  );
});