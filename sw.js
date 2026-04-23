const CACHE_NAME = 'tomyinfida-cache-v3';
const ASSETS = [
    '/',
    '/index.html',
    '/css/core.css',
    '/css/themes.css',
    '/js/app.js',
    '/js/utils.js',
    '/js/effects.js',
    '/manifest.json'
];

// Install — cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch — stale-while-revalidate for assets, network-first for navigation
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET
    if (request.method !== 'GET') return;

    // Navigation — network first, fallback to cache
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => caches.match('/index.html'))
        );
        return;
    }

    // Assets — cache first, update in background
    event.respondWith(
        caches.match(request).then(cached => {
            const fetchPromise = fetch(request).then(response => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                }
                return response;
            }).catch(() => cached);

            return cached || fetchPromise;
        })
    );
});
