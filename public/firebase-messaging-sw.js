/* Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars and run npm run generate:firebase-sw */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
