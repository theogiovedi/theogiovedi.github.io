const cacheName = "qual-a-cor-v2";
const offlineAssets = [
    "/index.html",
    "/ao-vivo.html",
    "/sobre.html",
    "/fotos.html",
    "/paletas.html",
    "/styles/general.css",
    "/styles/index.css",
    "/styles/live.css",
    "/styles/nav.css",
    "/styles/text.css",
    "/styles/photos.css",
    "/styles/palettes.css",
    "/scripts/calc.js",
    "/scripts/colors.js",
    "/scripts/interface.js",
    "/scripts/live.js",
    "/scripts/main.js",
    "/scripts/svg.js",
    "/scripts/photos.js",
    "/scripts/palettes.js",
    "/images/navlogo.svg",
    "/images/favicon.png",
    "/images/192.png",
    "/images/384.png",
    "/images/512.png",
    "/images/1024.png",
    "/images/1024-maskable.png",
    "/fonts/FiraSans-Bold.ttf",
    "/fonts/FiraSans-Regular.ttf",
    "/fonts/FiraCode-Regular.ttf",
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll(offlineAssets);
        }).catch(() => {
            console.log("Erro: Não foi possível abrir o cache.")
        })
    )
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
});