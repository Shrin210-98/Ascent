// // Minimal service worker for PWA installability
const CACHE = "ascent-v1"

self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", (event) => {
  // Pass-through — no offline caching for now
  // This is enough to make the app installable.
})






// self.addEventListener("install", () => {
//   self.skipWaiting()
// })

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((names) =>
//       Promise.all(names.map((name) => caches.delete(name)))
//     ).then(() => self.clients.claim())
//   )
// })

// self.addEventListener("fetch", () => {
//   // No caching — always fetch fresh from network
// })