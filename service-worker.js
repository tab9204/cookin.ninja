importScripts('./dependencies/idb.js');

self.addEventListener('activate', function(event) {
  event.waitUntil(
    createDB()
  );
});

function createDB() {
  idb.openDB('favorites', 1, {
    upgrade(db){
      db.createObjectStore('recipes', {keyPath: 'id'});
    }
  });
}
