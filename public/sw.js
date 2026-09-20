// Minimal service worker for PWA installability
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