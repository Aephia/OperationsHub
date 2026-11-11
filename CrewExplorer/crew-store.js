// crew-store.js - keeps the last loaded roster on the visitor's own device (IndexedDB), so reopening the page shows
// it at once. Nothing here leaves the browser. One record, written in one transaction: a failed save leaves the
// previous roster whole.
(function () {
    'use strict';
    const open = () => new Promise((resolve, reject) => {
        const r = indexedDB.open('crew-explorer', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('roster');
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
    });
    async function run(mode, fn) {
        const db = await open();
        try {
            return await new Promise((resolve, reject) => {
                const tx = db.transaction('roster', mode);
                const req = fn(tx.objectStore('roster'));
                tx.oncomplete = () => resolve(req ? req.result : undefined);
                tx.onerror = () => reject(tx.error);
                tx.onabort = () => reject(tx.error);
            });
        } finally { db.close(); }
    }
    const get = () => run('readonly', s => s.get('last'));
    const put = rec => run('readwrite', s => s.put(rec, 'last'));
    const clear = () => run('readwrite', s => s.delete('last'));
    window.CrewStore = { get, put, clear };
})();
