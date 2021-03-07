importScripts('./libraries/idb.min.js');

var cacheName = 'offlineCache-v6';
var contentToCache = [
  'offline.html',
  '/manifest.json',
  '/libraries/idb.min.js',
  '/libraries/mithril.min.js',
  '/assets/WorkSans-VariableFont_wght.ttf',
  '/assets/back.png',
  '/assets/forward.png',
  '/assets/favoritedIcon.png',
  '/assets/notFavoritedIcon.png',
  '/assets/savedNavIcon.png',
  '/assets/loading.gif',
  '/assets/app_icon.jpg',
  '/src/styles.css',
  '/build/offline-bundle.js',
];


self.addEventListener('install', (event) => {
  console.log('Service Worker Installed');
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('Service Worker Caching Files');
      return cache.addAll(contentToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    createDB(),
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if(key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  var url = event.request;
  event.respondWith(
    caches.match(event.request).then(function(response) {//respond with cache first
      return response || fetch(event.request);
    }).catch(function(){
      return caches.match('/offline.html');
    })
  );
});

function createDB() {
  idb.openDB('favorites', 1, {
    upgrade(db){
      db.createObjectStore('recipes', {keyPath: 'id'});
      console.log("database created");
    }
  });
}
