// Tom service worker: prototypen (vaktlogg.html) prøver å registrere sw.js ved siden av seg.
// Her trengs ingen hurtiglagring – filen finnes bare så registreringen ikke feiler.
self.addEventListener('install', () => self.skipWaiting())
