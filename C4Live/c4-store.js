// c4-store.js - keeps the last good C4 Live read on the visitor's PC (IndexedDB). putAll is one transaction, so a
// crash or a full disk leaves the previous copy whole.
(function () {
    'use strict';
    const open = () => new Promise((resolve, reject) => {
        const r = indexedDB.open('c4-live', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('files');
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
    });
    async function getAll() {
        const db = await open();
        try {
            return await new Promise((resolve, reject) => {
                const out = new Map();
                const c = db.transaction('files').objectStore('files').openCursor();
                c.onsuccess = () => { const cur = c.result; if (!cur) return resolve(out); out.set(cur.key, cur.value); cur.continue(); };
                c.onerror = () => reject(c.error);
            });
        } finally { db.close(); }
    }
    async function putAll(files) {
        const db = await open();
        try {
            await new Promise((resolve, reject) => {
                const tx = db.transaction('files', 'readwrite');
                const store = tx.objectStore('files');
                store.clear();
                for (const [k, v] of files) store.put(v, k);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
                tx.onabort = () => reject(tx.error);
            });
        } finally { db.close(); }
    }
    window.C4Store = { getAll, putAll };
})();
